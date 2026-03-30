/**
 * IBayad — Pure-JS JSON file database
 * No native dependencies, no compilation required.
 * Exposes the same prepare().all() / .get() / .run() API used throughout routes,
 * plus exec() for DDL (no-op since schema is in initTables()).
 */
const fs   = require('fs');
const path = require('path');

const DATA_FILE = path.join(__dirname, '..', 'ibayad-data.json');

// ── In-memory store ────────────────────────────────────────────────────────────
let store = {
  employees:     [],
  announcements: [],
  leave_requests:[],
  attendance:    [],
  departments:   [],
  roles:         [],
  shifts:        [],
  holidays:      [],
};

if (fs.existsSync(DATA_FILE)) {
  try { store = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8')); }
  catch (e) { /* corrupt file, use defaults */ }
}

function save() {
  fs.writeFileSync(DATA_FILE, JSON.stringify(store, null, 2));
}

// ── ID helpers ─────────────────────────────────────────────────────────────────
function nextId(table) {
  const rows = store[table];
  return rows.length === 0 ? 1 : Math.max(...rows.map(r => r.id || 0)) + 1;
}

// ── Simple SQL interpreter ─────────────────────────────────────────────────────
// Handles the exact SQL patterns used in routes – nothing more.
//
// Supported:
//   SELECT * FROM t [WHERE col=? ...] [ORDER BY col [DESC]] [LIMIT n]
//   SELECT COUNT(*) as c FROM t [WHERE col=?]
//   SELECT cols FROM t LEFT JOIN t2 ON ... GROUP BY col   (summary queries)
//   INSERT INTO t (cols) VALUES (?,...)
//   UPDATE t SET col=?,... WHERE id=?
//   DELETE FROM t WHERE id=?

function parseWhere(whereClause, params) {
  if (!whereClause) return () => true;
  // Split by AND / OR (simple – no nesting)
  const conditions = whereClause.split(/\bAND\b/i).map(s => s.trim());
  const tests = conditions.map(cond => {
    // col=?  |  col='val'  |  col LIKE ?
    const mEq   = cond.match(/^([\w.]+)\s*=\s*\?$/i);
    const mLike = cond.match(/^([\w.]+)\s+LIKE\s+\?$/i);
    const mLit  = cond.match(/^([\w.]+)\s*=\s*'([^']*)'$/i);
    if (mEq) {
      const col = mEq[1].includes('.') ? mEq[1].split('.')[1] : mEq[1];
      const val = params.shift();
      return row => String(row[col] ?? '') === String(val ?? '');
    }
    if (mLike) {
      const col = mLike[1].includes('.') ? mLike[1].split('.')[1] : mLike[1];
      const pattern = String(params.shift()).replace(/%/g, '');
      return row => String(row[col] ?? '').includes(pattern);
    }
    if (mLit) {
      const col = mLit[1].includes('.') ? mLit[1].split('.')[1] : mLit[1];
      const val = mLit[2];
      return row => String(row[col] ?? '') === String(val);
    }
    return () => true; // unknown – pass
  });
  return row => tests.every(t => t(row));
}

function execSelect(sql, params) {
  const pCopy = [...params];

  // ── COUNT(*) ────────────────────────────────────────────────────────────────
  const countM = sql.match(/SELECT\s+COUNT\(\*\)\s+as\s+(\w+)\s+FROM\s+(\w+)(?:\s+WHERE\s+([\s\S]+?))?(?:\s+ORDER BY|\s+LIMIT|$)/i);
  if (countM) {
    const [, alias, table, whereStr] = countM;
    const rows   = store[table] || [];
    const filter = parseWhere(whereStr, pCopy);
    return [{ [alias]: rows.filter(filter).length }];
  }

  // ── GROUP BY (summary) ──────────────────────────────────────────────────────
  if (/GROUP BY/i.test(sql)) {
    const fromM  = sql.match(/FROM\s+(\w+)\s+(?:\w+)?/i);
    const table  = fromM ? fromM[1] : null;
    if (!table) return [];

    // JOIN with employees for department
    const joinM = sql.match(/LEFT JOIN\s+(\w+)\s+(\w+)\s+ON\s+\S+\.id\s*=\s*\S+\.employee_id/i);
    const joinTable = joinM ? joinM[1] : null;

    const groupByM = sql.match(/GROUP BY\s+([\w.]+)/i);
    const groupCol = groupByM ? (groupByM[1].includes('.') ? groupByM[1].split('.')[1] : groupByM[1]) : 'id';

    const rows = store[table] || [];
    const groups = {};
    rows.forEach(row => {
      const key = row[groupCol] || row.employee_name || row.id;
      if (!groups[key]) groups[key] = [];
      groups[key].push(row);
    });

    return Object.entries(groups).map(([key, grpRows]) => {
      const first = grpRows[0];
      let dept = first.department;
      if (!dept && joinTable) {
        const emp = (store.employees || []).find(e => e.id === first.employee_id);
        dept = emp ? emp.department : null;
      }
      const result = {
        employee_name: first.employee_name || key,
        department:    dept || null,
      };
      // SUM(CASE WHEN status='X') aggregates
      const statuses = ['Approved','Present','Absent','Late','Pending','Rejected'];
      statuses.forEach(s => {
        const lcS = s.toLowerCase();
        result[lcS] = grpRows.filter(r => r.status === s).length;
      });
      result.total = grpRows.length;
      return result;
    }).sort((a,b) => (a.employee_name||'').localeCompare(b.employee_name||''));
  }

  // ── SELECT * / SELECT cols ──────────────────────────────────────────────────
  const selM = sql.match(/SELECT\s+([\s\S]+?)\s+FROM\s+(\w+)(?:\s+(?:\w+))?(?:\s+WHERE\s+([\s\S]+?))?(?:\s+ORDER BY\s+([\w., ]+?)(?:\s+(DESC|ASC))?)?(?:\s+LIMIT\s+(\d+))?(?:\s*;)?\s*$/i);
  if (!selM) return [];

  const [, , table, whereStr, orderCol, orderDir, limitStr] = selM;
  let rows = store[table] || [];

  if (whereStr && !/GROUP BY/i.test(whereStr)) {
    const cleanWhere = whereStr.replace(/ORDER BY[\s\S]*/i, '').trim();
    if (cleanWhere) rows = rows.filter(parseWhere(cleanWhere, pCopy));
  }

  if (orderCol) {
    const col = orderCol.trim().replace(/[\s,].*$/, '');
    rows = [...rows].sort((a,b) => {
      const va = a[col] ?? '', vb = b[col] ?? '';
      const cmp = String(va).localeCompare(String(vb));
      return orderDir && orderDir.toUpperCase() === 'DESC' ? -cmp : cmp;
    });
  }

  if (limitStr) rows = rows.slice(0, parseInt(limitStr));
  return rows;
}

function execInsert(sql, params) {
  const m = sql.match(/INSERT INTO\s+(\w+)\s*\(([^)]+)\)\s*VALUES\s*\(([^)]+)\)/i);
  if (!m) return;
  const table = m[1];
  const cols  = m[2].split(',').map(c => c.trim());
  const vals  = m[3].split(',').map(() => params.shift());
  const row   = { id: nextId(table) };
  cols.forEach((c, i) => {
    row[c] = vals[i] === undefined ? null : vals[i];
  });
  if (!row.created_at && cols.includes('created_at') === false) {
    // Auto-set created_at for relevant tables
    if (['leave_requests','announcements','employees'].includes(table)) {
      row.created_at = new Date().toISOString().replace('T', ' ').substring(0,19);
    }
  }
  store[table].push(row);
  save();
}

function execUpdate(sql, params) {
  const m = sql.match(/UPDATE\s+(\w+)\s+SET\s+([\s\S]+?)\s+WHERE\s+([\w.]+)\s*=\s*\?/i);
  if (!m) return;
  const table  = m[1];
  const setStr = m[2];
  const idCol  = m[3].includes('.') ? m[3].split('.')[1] : m[3];
  const id     = params.pop(); // last param is the id

  const setPairs = setStr.split(',').map(p => {
    const [c] = p.split('=').map(s => s.trim());
    return c;
  });
  const setVals = params.splice(0, setPairs.length);

  const idx = store[table].findIndex(r => String(r[idCol]) === String(id));
  if (idx >= 0) {
    setPairs.forEach((col, i) => { store[table][idx][col] = setVals[i]; });
    save();
  }
}

function execDelete(sql, params) {
  const m = sql.match(/DELETE FROM\s+(\w+)\s+WHERE\s+([\w.]+)\s*=\s*\?/i);
  if (!m) return;
  const table = m[1];
  const col   = m[2].includes('.') ? m[2].split('.')[1] : m[2];
  const val   = params[0];
  store[table] = store[table].filter(r => String(r[col]) !== String(val));
  save();
}

// ── Prepared statement ─────────────────────────────────────────────────────────
class Stmt {
  constructor(sql) { this.sql = sql.trim(); }

  all(...args) {
    if (/^\s*SELECT/i.test(this.sql)) return execSelect(this.sql, [...args]);
    return [];
  }

  get(...args) {
    return this.all(...args)[0];
  }

  run(...args) {
    const sql = this.sql;
    if (/^\s*INSERT/i.test(sql)) execInsert(sql, [...args]);
    else if (/^\s*UPDATE/i.test(sql)) execUpdate(sql, [...args]);
    else if (/^\s*DELETE/i.test(sql)) execDelete(sql, [...args]);
  }
}

// ── Public API ─────────────────────────────────────────────────────────────────
const db = {
  prepare: (sql) => new Stmt(sql),
  exec:    ()    => {},   // DDL no-op (schema is in store init)
  pragma:  ()    => {},
};

// ── Seed if empty ──────────────────────────────────────────────────────────────
if (store.employees.length === 0) {
  const emp = (n,e,d,p,s,sd) => store.employees.push({
    id: nextId('employees'), name:n, email:e, department:d, position:p, status:s, start_date:sd,
    created_at: new Date().toISOString().replace('T',' ').substring(0,19)
  });
  emp('Jayvee Santos',   'jayvee@ibayad.com',  'Engineering', 'Software Developer', 'Active',   '2022-01-15');
  emp('Maria Cruz',      'maria@ibayad.com',   'Design',      'UI/UX Designer',     'Active',   '2021-06-01');
  emp('Jose Reyes',      'jose@ibayad.com',    'QA',          'Software Tester',    'Active',   '2022-03-10');
  emp('Ana Dela Cruz',   'ana@ibayad.com',     'Security',    'Ethical Hacker',     'Active',   '2021-09-15');
  emp('Pedro Lim',       'pedro@ibayad.com',   'Engineering', 'Scrum Master',       'Active',   '2020-11-01');
  emp('Rosa Garcia',     'rosa@ibayad.com',    'HR',          'HR Manager',         'Active',   '2019-05-20');
  emp('Miguel Torres',   'miguel@ibayad.com',  'Engineering', 'Backend Developer',  'Inactive', '2021-02-14');
  emp('Lucia Fernandez', 'lucia@ibayad.com',   'Finance',     'Accountant',         'Active',   '2022-07-01');

  const ann = (t,d,s,e) => store.announcements.push({
    id: nextId('announcements'), title:t, description:d, start_date:s, end_date:e, created_by:'Admin',
    created_at: new Date().toISOString().replace('T',' ').substring(0,19)
  });
  ann('Scrum Master',       'Corrected item alignment',             'Dec 4, 2024 21:42',  'Dec 7, 2024 23:26');
  ann('Software Tester',    'Embedded analytic scripts',            'Dec 30, 2024 05:18', 'Feb 2, 2025 19:28');
  ann('Software Developer', 'High resolution imagery option',       'Dec 30, 2024 07:52', 'Dec 4, 2024 21:42');
  ann('UI/UX Designer',     'Enhanced UX for cart quantity updates', 'Dec 7, 2024 23:26',  'Feb 2, 2025 19:28');
  ann('Ethical Hacker',     'Cart history fixes',                   'Mar 20, 2024 23:14', 'Dec 4, 2024 21:42');

  const leave = (eid,en,lt,sd,ed,dy,rs,st) => store.leave_requests.push({
    id: nextId('leave_requests'), employee_id:eid, employee_name:en, leave_type:lt,
    start_date:sd, end_date:ed, days:dy, reason:rs, status:st,
    created_at: new Date().toISOString().replace('T',' ').substring(0,19)
  });
  leave(1,'Jayvee Santos',  'Sick Leave',      '2025-01-10','2025-01-12',3,'Fever and flu',       'Approved');
  leave(2,'Maria Cruz',     'Vacation Leave',  '2025-02-14','2025-02-16',3,'Personal vacation',   'Pending');
  leave(3,'Jose Reyes',     'Emergency Leave', '2025-01-20','2025-01-20',1,'Family emergency',    'Approved');
  leave(4,'Ana Dela Cruz',  'Sick Leave',      '2025-03-05','2025-03-06',2,'Medical appointment', 'Rejected');
  leave(5,'Pedro Lim',      'Vacation Leave',  '2025-04-01','2025-04-05',5,'Anniversary trip',    'Pending');
  leave(6,'Rosa Garcia',    'Sick Leave',      '2025-03-15','2025-03-15',1,'Doctor visit',        'Approved');

  const att = (eid,en,dt,ti,to,st) => store.attendance.push({
    id: nextId('attendance'), employee_id:eid, employee_name:en, date:dt, time_in:ti||null, time_out:to||null, status:st
  });
  att(1,'Jayvee Santos', '2025-03-25','08:45','17:30','Present');
  att(2,'Maria Cruz',    '2025-03-25','09:00','18:00','Present');
  att(3,'Jose Reyes',    '2025-03-25','08:30','17:00','Present');
  att(4,'Ana Dela Cruz', '2025-03-25',null,null,'Absent');
  att(5,'Pedro Lim',     '2025-03-25','09:15','18:15','Late');
  att(6,'Rosa Garcia',   '2025-03-25','08:00','17:00','Present');
  att(1,'Jayvee Santos', '2025-03-26','08:45','17:30','Present');
  att(2,'Maria Cruz',    '2025-03-26','08:55','18:00','Present');
  att(3,'Jose Reyes',    '2025-03-26','09:30','17:00','Late');
  att(5,'Pedro Lim',     '2025-03-26','08:50','18:00','Present');

  [['Engineering','Jayvee Santos',3],['Design','Maria Cruz',2],['QA','Jose Reyes',1],
   ['Security','Ana Dela Cruz',1],['HR','Rosa Garcia',2],['Finance','Lucia Fernandez',1]
  ].forEach(([n,h,c]) => store.departments.push({ id:nextId('departments'), name:n, head:h, employee_count:c }));

  [['Admin','Full Access',2],['HR Manager','Employees, Leave, Attendance',1],
   ['Manager','Team management, Reports',3],['Employee','Self-service only',10]
  ].forEach(([n,p,c]) => store.roles.push({ id:nextId('roles'), name:n, permissions:p, user_count:c }));

  [['Morning Shift','08:00','17:00',60],['Mid Shift','12:00','21:00',60],
   ['Night Shift','21:00','06:00',60],['Flexible','07:00','16:00',60]
  ].forEach(([n,ti,to,b]) => store.shifts.push({ id:nextId('shifts'), name:n, time_in:ti, time_out:to, break_duration:b }));

  [["New Year's Day",'2025-01-01','Regular'],['EDSA Revolution Day','2025-02-25','Special'],
   ['Araw ng Kagitingan','2025-04-09','Regular'],['Labor Day','2025-05-01','Regular'],
   ['Independence Day','2025-06-12','Regular'],['National Heroes Day','2025-08-25','Regular'],
   ['Bonifacio Day','2025-11-30','Regular'],['Christmas Day','2025-12-25','Regular'],
   ['Rizal Day','2025-12-30','Regular']
  ].forEach(([n,d,t]) => store.holidays.push({ id:nextId('holidays'), name:n, date:d, type:t }));

  save();
  console.log('  IBayad database seeded.');
}

module.exports = db;
