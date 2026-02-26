const express = require('express');
const router = express.Router();
const interviewController = require('../controllers/interviewController');
const slotController = require('../controllers/slotController');

// IMPORTANT: Slot routes must come BEFORE the generic /:userId route
// to prevent /slots from being matched as a userId parameter

// New slot routes for career day scheduling
// Admin routes
router.post('/slots', slotController.createSlot);
router.put('/slots/:id', slotController.updateSlot);
router.delete('/slots/:id', slotController.deleteSlot);

// Student routes
router.get('/slots', slotController.getAllSlots);
router.get('/slots/:id', slotController.getSlot);
router.post('/slots/book', slotController.bookSlot);
router.post('/slots/cancel', slotController.cancelBooking);
router.get('/slots/student/:userId', slotController.getStudentBookings);

// Original interview routes (keep for backward compatibility)
// These use parameterized paths, so they must come AFTER specific routes
router.get('/:userId', interviewController.getInterviews);
router.post('/', interviewController.createInterview);
router.put('/:id', interviewController.updateInterview);
router.delete('/:id', interviewController.deleteInterview);

module.exports = router;
