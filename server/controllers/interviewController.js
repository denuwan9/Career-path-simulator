const Interview = require('../models/Interview');

exports.getInterviews = async (req, res) => {
    try {
        const interviews = await Interview.find({ user: req.params.userId }).sort({ date: 1 });
        res.json(interviews);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.createInterview = async (req, res) => {
    try {
        const interview = new Interview(req.body);
        await interview.save();
        res.status(201).json(interview);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.updateInterview = async (req, res) => {
    try {
        const interview = await Interview.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(interview);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.deleteInterview = async (req, res) => {
    try {
        await Interview.findByIdAndDelete(req.params.id);
        res.json({ message: 'Interview deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
