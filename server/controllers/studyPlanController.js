const StudyPlan = require('../models/StudyPlan');

exports.getStudyPlans = async (req, res) => {
    try {
        const plans = await StudyPlan.find({ user: req.params.userId });
        res.json(plans);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.createStudyPlan = async (req, res) => {
    try {
        const plan = new StudyPlan(req.body);
        await plan.save();
        res.status(201).json(plan);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.updateStudyPlan = async (req, res) => {
    try {
        const plan = await StudyPlan.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(plan);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.deleteStudyPlan = async (req, res) => {
    try {
        await StudyPlan.findByIdAndDelete(req.params.id);
        res.json({ message: 'Study Plan deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
