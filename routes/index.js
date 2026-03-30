const express = require('express');
const router  = express.Router();
const db      = require('../db/database');

router.get('/', (req, res) => {
  const announcements  = db.prepare('SELECT * FROM announcements ORDER BY id DESC LIMIT 5').all();
  const approvedLeaves = db.prepare("SELECT COUNT(*) as c FROM leave_requests WHERE status='Approved'").get().c;
  const pendingLeaves  = db.prepare("SELECT COUNT(*) as c FROM leave_requests WHERE status='Pending'").get().c;
  const totalEmployees = db.prepare("SELECT COUNT(*) as c FROM employees WHERE status='Active'").get().c;
  const today          = new Date().toISOString().split('T')[0];
  const presentToday   = db.prepare("SELECT COUNT(*) as c FROM attendance WHERE date=? AND status='Present'").get(today).c;

  // Mock birthday list (employees whose start_date month matches current month for demo)
  const month = String(new Date().getMonth() + 1).padStart(2, '0');
  const birthdays = db.prepare(
    "SELECT * FROM employees WHERE substr(start_date,6,2)=? LIMIT 3"
  ).all(month);

  res.render('dashboard', {
    title:          'Dashboard',
    activeMenu:     'dashboard',
    activePage:     'dashboard',
    announcements,
    leaveAllowance: 15,
    leaveTaken:     approvedLeaves,
    leaveAvailable: 15 - approvedLeaves,
    leavePending:   pendingLeaves,
    totalEmployees,
    presentToday,
    birthdays,
  });
});

router.get('/job-desk', (req, res) => {
  res.render('job-desk', { title: 'Job Desk', activeMenu: 'job-desk', activePage: 'job-desk' });
});

// Stub routes for job-desk sub-pages
['allowance','slip','contacts'].forEach(page => {
  router.get(`/job-desk/${page}`, (req, res) => res.redirect('/job-desk'));
});

module.exports = router;
