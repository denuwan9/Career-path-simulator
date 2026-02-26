const express = require('express');
const router = express.Router();
const { chatAdvisor, generateStudyPlan } = require('../controllers/aiController');
const multer = require('multer');

// Configure multer for PDF uploads (memory storage)
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

router.post('/chat', chatAdvisor);
router.post('/generate-plan', upload.single('file'), generateStudyPlan);

module.exports = router;
