const express = require('express');
const router = express.Router();
const studyPlanController = require('../controllers/studyPlanController');

router.get('/:userId', studyPlanController.getStudyPlans);
router.post('/', studyPlanController.createStudyPlan);
router.put('/:id', studyPlanController.updateStudyPlan);
router.delete('/:id', studyPlanController.deleteStudyPlan);

module.exports = router;
