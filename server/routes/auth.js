const router = require('express').Router();
const passport = require('passport');

// Auth start routes
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/facebook', passport.authenticate('facebook', { scope: ['email'] }));
router.get('/github', passport.authenticate('github', { scope: ['user:email'] }));

// Callbacks
router.get('/google/callback', passport.authenticate('google', {
  successRedirect: `${process.env.FRONTEND_URL}/Home`,
  failureRedirect: `${process.env.FRONTEND_URL}/login`,
}));

router.get('/facebook/callback', passport.authenticate('facebook', {
  successRedirect: `${process.env.FRONTEND_URL}/Home`,
  failureRedirect: `${process.env.FRONTEND_URL}/login`,
}));

router.get('/github/callback', passport.authenticate('github', {
  successRedirect: `${process.env.FRONTEND_URL}/Home`,
  failureRedirect: `${process.env.FRONTEND_URL}/login`,
}));

// Get current user
router.get('/me', (req, res) => {
  res.json(req.user || null);
});

// Logout
router.get('/logout', (req, res) => {
  req.logout(() => {
    res.redirect(`${process.env.FRONTEND_URL}/login`);
  });
});

module.exports = router;
