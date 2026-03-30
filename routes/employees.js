const express = require('express');
const router  = express.Router();
const db      = require('../db/database');

// GET /employees — All employees
router.get('/', (req, res) => {
  const employees = db.prepare('SELECT * FROM employees ORDER BY name').all();
  res.render('employees-all', {
    title: 'All Employees', activeMenu: 'employees', activePage: 'employees-all',
    employees,
  });
});

// GET /employees/appointment
router.get('/appointment', (req, res) => {
  const employees = db.prepare('SELECT * FROM employees ORDER BY start_date DESC').all();
  res.render('employees-appointment', {
    title: 'Appointment', activeMenu: 'employees', activePage: 'employees-appointment',
    employees,
  });
});

// POST /employees — Create
router.post('/', (req, res) => {
  const { name, email, department, position, status, start_date } = req.body;
  try {
    db.prepare(
      'INSERT INTO employees (name, email, department, position, status, start_date) VALUES (?,?,?,?,?,?)'
    ).run(name, email, department, position, status || 'Active', start_date);
    res.redirect('/employees?success=Employee+added+successfully');
  } catch (err) {
    res.redirect('/employees?error=' + encodeURIComponent(err.message));
  }
});

// PUT /employees/:id — Update
router.put('/:id', (req, res) => {
  const { name, email, department, position, status, start_date } = req.body;
  db.prepare(
    'UPDATE employees SET name=?, email=?, department=?, position=?, status=?, start_date=? WHERE id=?'
  ).run(name, email, department, position, status, start_date, req.params.id);
  res.redirect('/employees?success=Employee+updated');
});

// DELETE /employees/:id
router.delete('/:id', (req, res) => {
  db.prepare('DELETE FROM employees WHERE id=?').run(req.params.id);
  res.redirect('/employees?success=Employee+deleted');
});

module.exports = router;
