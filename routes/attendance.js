const express = require('express');
const router  = express.Router();
const db      = require('../db/database');

// GET /attendance/daily-log
router.get('/daily-log', (req, res) => {
  const filterDate = req.query.date || null;
  const query = filterDate
    ? 'SELECT * FROM attendance WHERE date=? ORDER BY employee_name'
    : 'SELECT * FROM attendance ORDER BY date DESC, employee_name';
  const attendance = filterDate
    ? db.prepare(query).all(filterDate)
    : db.prepare(query).all();

  const stats = {
    present: db.prepare("SELECT COUNT(*) as c FROM attendance WHERE status='Present'").get().c,
    absent:  db.prepare("SELECT COUNT(*) as c FROM attendance WHERE status='Absent'").get().c,
    late:    db.prepare("SELECT COUNT(*) as c FROM attendance WHERE status='Late'").get().c,
    total:   db.prepare('SELECT COUNT(*) as c FROM attendance').get().c,
  };
  const employees = db.prepare("SELECT * FROM employees WHERE status='Active' ORDER BY name").all();

  res.render('attendance-daily', {
    title: 'Daily Log', activeMenu: 'attendance', activePage: 'attendance-daily',
    attendance, stats, employees, filterDate,
  });
});

// GET /attendance/request
router.get('/request', (req, res) => {
  const employees = db.prepare("SELECT * FROM employees WHERE status='Active' ORDER BY name").all();
  res.render('attendance-request', {
    title: 'Attendance Request', activeMenu: 'attendance', activePage: 'attendance-request',
    employees,
  });
});

// GET /attendance/details
router.get('/details', (req, res) => {
  const employees = db.prepare("SELECT * FROM employees WHERE status='Active' ORDER BY name").all();
  const allAtt    = db.prepare('SELECT * FROM attendance').all();

  // Build a map: empId -> { day -> record }
  const empAttMap = {};
  allAtt.forEach(a => {
    if (!empAttMap[a.employee_id]) empAttMap[a.employee_id] = {};
    const day = parseInt(a.date.split('-')[2]);
    empAttMap[a.employee_id][day] = a;
  });

  res.render('attendance-details', {
    title: 'Attendance Details', activeMenu: 'attendance', activePage: 'attendance-details',
    employees, empAttMap,
  });
});

// GET /attendance/summary
router.get('/summary', (req, res) => {
  const rows = db.prepare(`
    SELECT a.employee_name, e.department,
           SUM(CASE WHEN a.status='Present' THEN 1 ELSE 0 END) as present,
           SUM(CASE WHEN a.status='Absent'  THEN 1 ELSE 0 END) as absent,
           SUM(CASE WHEN a.status='Late'    THEN 1 ELSE 0 END) as late,
           COUNT(*) as total
    FROM attendance a
    LEFT JOIN employees e ON e.id = a.employee_id
    GROUP BY a.employee_name
    ORDER BY a.employee_name
  `).all();

  res.render('attendance-summary', {
    title: 'Attendance Summary', activeMenu: 'attendance', activePage: 'attendance-summary',
    summary: rows,
  });
});

// POST /attendance — Create record
router.post('/', (req, res) => {
  const { employee_id, date, time_in, time_out, status, notes } = req.body;
  const emp = db.prepare('SELECT name FROM employees WHERE id=?').get(employee_id);
  db.prepare(
    'INSERT INTO attendance (employee_id, employee_name, date, time_in, time_out, status, notes) VALUES (?,?,?,?,?,?,?)'
  ).run(employee_id, emp ? emp.name : '', date, time_in || null, time_out || null, status || 'Present', notes || null);
  res.redirect('/attendance/daily-log?success=Attendance+recorded');
});

// DELETE /attendance/:id
router.delete('/:id', (req, res) => {
  db.prepare('DELETE FROM attendance WHERE id=?').run(req.params.id);
  res.redirect('/attendance/daily-log?success=Record+deleted');
});

module.exports = router;
