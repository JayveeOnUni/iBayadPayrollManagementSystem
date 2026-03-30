const express = require('express');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const path = require('path');

// Initialize DB (creates + seeds on first run)
require('./db/database');

const app = express();
const PORT = process.env.PORT || 3000;

// ─── View engine ───────────────────────────────────────────────────────────────
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// ─── Middleware ────────────────────────────────────────────────────────────────
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(methodOverride('_method'));

// ─── Flash-like middleware (query-string messages) ─────────────────────────────
app.use((req, res, next) => {
  res.locals.success = req.query.success || null;
  res.locals.error   = req.query.error   || null;
  next();
});

// ─── Routes ────────────────────────────────────────────────────────────────────
app.use('/',               require('./routes/index'));
app.use('/employees',      require('./routes/employees'));
app.use('/leave',          require('./routes/leave'));
app.use('/attendance',     require('./routes/attendance'));
app.use('/administration', require('./routes/administration'));
app.use('/settings',       require('./routes/settings'));

// ─── 404 ───────────────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).render('404', { title: '404 Not Found', activeMenu: '', activePage: '' });
});

app.listen(PORT, () => {
  console.log(`\n  IBayad HR System running at http://localhost:${PORT}\n`);
});
