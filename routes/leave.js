const express = require('express');
const router  = express.Router();
const db      = require('../db/database');

function getLeaveData() {
  return {
    employees:    db.prepare('SELECT * FROM employees WHERE status=? ORDER BY name').all('Active'),
    leaveTaken:   db.prepare("SELECT COUNT(*) as c FROM leave_requests WHERE status='Approved'").get().c,
    leavePending: db.prepare("SELECT COUNT(*) as c FROM leave_requests WHERE status='Pending'").get().c,
  };
}

// GET /leave/status
router.get('/status', (req, res) => {
  const leaves = db.prepare('SELECT * FROM leave_requests ORDER BY created_at DESC').all();
  const { employees, leaveTaken, leavePending } = getLeaveData();
  res.render('leave-status', {
    title: 'Leave Status', activeMenu: 'leave', activePage: 'leave-status',
    leaves, employees, leaveTaken, leavePending,
  });
});

// GET /leave/request
router.get('/request', (req, res) => {
  const pendingLeaves = db.prepare("SELECT * FROM leave_requests WHERE status='Pending' ORDER BY created_at DESC").all();
  const { employees } = getLeaveData();
  res.render('leave-request', {
    title: 'Leave Request', activeMenu: 'leave', activePage: 'leave-request',
    pendingLeaves, employees,
  });
});

// GET /leave/calendar
router.get('/calendar', (req, res) => {
  const now   = new Date();
  const year  = parseInt(req.query.year  || now.getFullYear());
  const month = parseInt(req.query.month || now.getMonth() + 1);

  const monthNames = ['January','February','March','April','May','June',
                      'July','August','September','October','November','December'];

  // Build calendar days
  const firstDay  = new Date(year, month - 1, 1).getDay(); // 0=Sun
  const daysInMonth = new Date(year, month, 0).getDate();
  const prevDays  = new Date(year, month - 1, 0).getDate();

  // Get all leaves for this month
  const pad  = n => String(n).padStart(2, '0');
  const monthStr = `${year}-${pad(month)}`;
  const allLeaves = db.prepare(
    "SELECT * FROM leave_requests WHERE start_date LIKE ? OR end_date LIKE ?"
  ).all(`${monthStr}%`, `${monthStr}%`);

  const leaveByDay = {};
  allLeaves.forEach(l => {
    const d = parseInt(l.start_date.split('-')[2]);
    if (!leaveByDay[d]) leaveByDay[d] = [];
    leaveByDay[d].push(l);
  });

  const calDays = [];
  // Prev month filler
  for (let i = firstDay - 1; i >= 0; i--) {
    calDays.push({ date: prevDays - i, otherMonth: true, isToday: false, hasLeave: false });
  }
  // This month
  const todayStr = now.toISOString().split('T')[0];
  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr  = `${year}-${pad(month)}-${pad(d)}`;
    const leaves   = leaveByDay[d] || [];
    calDays.push({
      date:       d,
      otherMonth: false,
      isToday:    dateStr === todayStr,
      hasLeave:   leaves.length > 0,
      leaveCount: leaves.length,
      leaveInfo:  leaves.map(l => `${l.employee_name}: ${l.leave_type}`).join(', '),
    });
  }
  // Next month filler to fill last row
  let rem = 7 - (calDays.length % 7);
  if (rem < 7) for (let i = 1; i <= rem; i++) calDays.push({ date: i, otherMonth: true, isToday: false, hasLeave: false });

  const prevMonth = month === 1  ? 12 : month - 1;
  const prevYear  = month === 1  ? year - 1 : year;
  const nextMonth = month === 12 ? 1  : month + 1;
  const nextYear  = month === 12 ? year + 1 : year;

  const monthLeaves = db.prepare(
    "SELECT * FROM leave_requests WHERE start_date LIKE ? ORDER BY start_date"
  ).all(`${monthStr}%`);

  res.render('leave-calendar', {
    title: 'Leave Calendar', activeMenu: 'leave', activePage: 'leave-calendar',
    year, month, monthName: monthNames[month - 1],
    calDays, monthLeaves,
    prevYear, prevMonth, nextYear, nextMonth,
  });
});

// GET /leave/summary
router.get('/summary', (req, res) => {
  const rows = db.prepare(`
    SELECT lr.employee_name,
           e.department,
           SUM(CASE WHEN lr.status='Approved' THEN 1 ELSE 0 END) as approved,
           SUM(CASE WHEN lr.status='Pending'  THEN 1 ELSE 0 END) as pending,
           SUM(CASE WHEN lr.status='Rejected' THEN 1 ELSE 0 END) as rejected
    FROM leave_requests lr
    LEFT JOIN employees e ON e.id = lr.employee_id
    GROUP BY lr.employee_name
    ORDER BY lr.employee_name
  `).all();
  res.render('leave-summary', {
    title: 'Leave Summary', activeMenu: 'leave', activePage: 'leave-summary',
    summary: rows,
  });
});

// POST /leave — Create
router.post('/', (req, res) => {
  const { employee_id, leave_type, start_date, end_date, days, reason } = req.body;
  const emp = db.prepare('SELECT name FROM employees WHERE id=?').get(employee_id);
  db.prepare(
    'INSERT INTO leave_requests (employee_id, employee_name, leave_type, start_date, end_date, days, reason) VALUES (?,?,?,?,?,?,?)'
  ).run(employee_id, emp ? emp.name : '', leave_type, start_date, end_date, days || 1, reason);
  res.redirect('/leave/status?success=Leave+request+submitted');
});

// POST /leave/:id/approve
router.post('/:id/approve', (req, res) => {
  db.prepare("UPDATE leave_requests SET status='Approved' WHERE id=?").run(req.params.id);
  res.redirect('/leave/request?success=Leave+approved');
});

// POST /leave/:id/reject
router.post('/:id/reject', (req, res) => {
  db.prepare("UPDATE leave_requests SET status='Rejected' WHERE id=?").run(req.params.id);
  res.redirect('/leave/request?success=Leave+rejected');
});

// DELETE /leave/:id
router.delete('/:id', (req, res) => {
  db.prepare('DELETE FROM leave_requests WHERE id=?').run(req.params.id);
  res.redirect('/leave/status?success=Leave+deleted');
});

module.exports = router;
