const mongoose = require('mongoose');

const JobSchema = new mongoose.Schema({
    title: { type: String, required: true },
    company: { type: String, required: true },
    location: { type: String, required: true },
    type: { type: String, enum: ['Full-time', 'Part-time', 'Internship'], required: true },
    description: { type: String, required: true },
    requirements: [{ type: String }],
    postedDate: { type: Date, default: Date.now },
    applicationLink: { type: String, required: false }, // Made optional for student posts

    // Student Post Specific Fields
    isStudentPost: { type: Boolean, default: false },
    studentName: { type: String },
    studentEmail: { type: String },
    studentProfile: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    skills: [{ type: String }],
    experience: { type: String },
    education: { type: String },
    socialLinks: {
        linkedin: String,
        portfolio: String,
        github: String
    }
}, { timestamps: true });

module.exports = mongoose.model('Job', JobSchema);
