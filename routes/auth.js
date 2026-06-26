//Map Out Endpoint Routes
//to hook your URLs to your controller functions.

const express = require('express');
const router = express.Router();
const passport = require('passport');
const authController = require('../controllers/authController');

// Define connection pathways mapping to specific controller callbacks
router.get('/login', authController.getLogin);
router.post('/login', passport.authenticate('local', { successRedirect: '/', failureRedirect: '/auth/login' }));
router.get('/register', authController.getRegister);
router.post('/register', authController.postRegister);
router.post('/logout', authController.postLogout);

module.exports = router;
