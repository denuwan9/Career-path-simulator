const mongoose = require('mongoose');

const StudyPlanSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    subject: { type: String, required: true },
    examDate: { type: Date, required: true },
    topics: [{
        name: String,
        completed: { type: Boolean, default: false }
    }],
    dailyGoals: [{
        date: Date,
        tasks: [String],
        completed: { type: Boolean, default: false }
    }]
}, { timestamps: true });

module.exports = mongoose.model('StudyPlan', StudyPlanSchema);
