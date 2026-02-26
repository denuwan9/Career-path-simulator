const mongoose = require('mongoose');

const InterviewSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    company: { type: String, required: true },
    position: { type: String, required: true },
    date: { type: Date, required: true },
    type: { type: String, enum: ['Phone', 'Video', 'On-site'], default: 'Video' },
    notes: { type: String },
    status: { type: String, enum: ['Scheduled', 'Completed', 'Cancelled'], default: 'Scheduled' }
}, { timestamps: true });

module.exports = mongoose.model('Interview', InterviewSchema);
