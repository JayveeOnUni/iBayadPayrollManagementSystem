const express = require('express');
const router  = express.Router();
const db      = require('../db/database');

// Redirect /administration → /administration/announcement
router.get('/', (req, res) => res.redirect('/administration/announcement'));

// ── ROLES ──────────────────────────────────────────────────────────────────────
router.get('/roles', (req, res) => {
  res.render('administration-roles', {
    title: 'Roles', activeMenu: 'administration', activePage: 'admin-roles',
    roles: db.prepare('SELECT * FROM roles ORDER BY name').all(),
  });
});
router.post('/roles', (req, res) => {
  db.prepare('INSERT INTO roles (name, permissions) VALUES (?,?)').run(req.body.name, req.body.permissions);
  res.redirect('/administration/roles?success=Role+added');
});
router.put('/roles/:id', (req, res) => {
  db.prepare('UPDATE roles SET name=?, permissions=? WHERE id=?').run(req.body.name, req.body.permissions, req.params.id);
  res.redirect('/administration/roles?success=Role+updated');
});
router.delete('/roles/:id', (req, res) => {
  db.prepare('DELETE FROM roles WHERE id=?').run(req.params.id);
  res.redirect('/administration/roles?success=Role+deleted');
});

// ── SHIFT ──────────────────────────────────────────────────────────────────────
router.get('/shift', (req, res) => {
  res.render('administration-shift', {
    title: 'Shift', activeMenu: 'administration', activePage: 'admin-shift',
    shifts: db.prepare('SELECT * FROM shifts ORDER BY name').all(),
  });
});
router.post('/shift', (req, res) => {
  const { name, time_in, time_out, break_duration } = req.body;
  db.prepare('INSERT INTO shifts (name, time_in, time_out, break_duration) VALUES (?,?,?,?)').run(name, time_in, time_out, break_duration || 60);
  res.redirect('/administration/shift?success=Shift+added');
});
router.put('/shift/:id', (req, res) => {
  const { name, time_in, time_out, break_duration } = req.body;
  db.prepare('UPDATE shifts SET name=?, time_in=?, time_out=?, break_duration=? WHERE id=?').run(name, time_in, time_out, break_duration, req.params.id);
  res.redirect('/administration/shift?success=Shift+updated');
});
router.delete('/shift/:id', (req, res) => {
  db.prepare('DELETE FROM shifts WHERE id=?').run(req.params.id);
  res.redirect('/administration/shift?success=Shift+deleted');
});

// ── DEPARTMENT ─────────────────────────────────────────────────────────────────
router.get('/department', (req, res) => {
  res.render('administration-department', {
    title: 'Department', activeMenu: 'administration', activePage: 'admin-department',
    departments: db.prepare('SELECT * FROM departments ORDER BY name').all(),
  });
});
router.post('/department', (req, res) => {
  db.prepare('INSERT INTO departments (name, head) VALUES (?,?)').run(req.body.name, req.body.head);
  res.redirect('/administration/department?success=Department+added');
});
router.put('/department/:id', (req, res) => {
  db.prepare('UPDATE departments SET name=?, head=? WHERE id=?').run(req.body.name, req.body.head, req.params.id);
  res.redirect('/administration/department?success=Department+updated');
});
router.delete('/department/:id', (req, res) => {
  db.prepare('DELETE FROM departments WHERE id=?').run(req.params.id);
  res.redirect('/administration/department?success=Department+deleted');
});

// ── HOLIDAY ────────────────────────────────────────────────────────────────────
router.get('/holiday', (req, res) => {
  res.render('administration-holiday', {
    title: 'Holiday', activeMenu: 'administration', activePage: 'admin-holiday',
    holidays: db.prepare('SELECT * FROM holidays ORDER BY date').all(),
  });
});
router.post('/holiday', (req, res) => {
  db.prepare('INSERT INTO holidays (name, date, type) VALUES (?,?,?)').run(req.body.name, req.body.date, req.body.type || 'Regular');
  res.redirect('/administration/holiday?success=Holiday+added');
});
router.put('/holiday/:id', (req, res) => {
  db.prepare('UPDATE holidays SET name=?, date=?, type=? WHERE id=?').run(req.body.name, req.body.date, req.body.type, req.params.id);
  res.redirect('/administration/holiday?success=Holiday+updated');
});
router.delete('/holiday/:id', (req, res) => {
  db.prepare('DELETE FROM holidays WHERE id=?').run(req.params.id);
  res.redirect('/administration/holiday?success=Holiday+deleted');
});

// ── ANNOUNCEMENT ───────────────────────────────────────────────────────────────
router.get('/announcement', (req, res) => {
  res.render('administration-announcement', {
    title: 'Announcement', activeMenu: 'administration', activePage: 'admin-announcement',
    announcements: db.prepare('SELECT * FROM announcements ORDER BY id DESC').all(),
  });
});
router.post('/announcement', (req, res) => {
  const { title, description, start_date, end_date } = req.body;
  db.prepare('INSERT INTO announcements (title, description, start_date, end_date) VALUES (?,?,?,?)').run(title, description, start_date, end_date);
  res.redirect('/administration/announcement?success=Announcement+added');
});
router.put('/announcement/:id', (req, res) => {
  const { title, description, start_date, end_date } = req.body;
  db.prepare('UPDATE announcements SET title=?, description=?, start_date=?, end_date=? WHERE id=?').run(title, description, start_date, end_date, req.params.id);
  res.redirect('/administration/announcement?success=Announcement+updated');
});
router.delete('/announcement/:id', (req, res) => {
  db.prepare('DELETE FROM announcements WHERE id=?').run(req.params.id);
  res.redirect('/administration/announcement?success=Announcement+deleted');
});

module.exports = router;
