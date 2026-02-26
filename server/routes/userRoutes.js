const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.post('/profile', userController.createOrUpdateProfile);
router.get('/profile/:email', userController.getProfile);

module.exports = router;
