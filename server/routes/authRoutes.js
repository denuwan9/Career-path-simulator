const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

console.error('Auth Routes Loaded');
router.get('/test', (req, res) => res.send('Auth Test OK'));
router.post('/register', (req, res, next) => {
    console.error('Register route hit');
    next();
}, authController.register);
router.post('/login', authController.login);

module.exports = router;
