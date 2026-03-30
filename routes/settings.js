const express = require('express');
const router  = express.Router();

const TABS = {
  'general':    'settings-general',
  'leave':      'settings-leave',
  'attendance': 'settings-attendance',
  'payroll':    'settings-payroll',
};

router.get('/', (req, res) => res.redirect('/settings/general'));

Object.keys(TABS).forEach(tab => {
  router.get(`/${tab}`, (req, res) => {
    res.render('settings', {
      title:      tab.charAt(0).toUpperCase() + tab.slice(1) + ' Settings',
      activeMenu: 'settings',
      activePage: TABS[tab],
      activeTab:  TABS[tab],
      tab,
    });
  });

  router.post(`/${tab}`, (req, res) => {
    // In a real app, persist settings to DB or config file
    res.redirect(`/settings/${tab}?success=Settings+saved`);
  });
});

module.exports = router;
