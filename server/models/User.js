const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profileImage: { type: String }, // URL or base64
    contactNumber: { type: String },
    address: { type: String },
    age: { type: Number },
    dateOfBirth: { type: Date },
    gender: { type: String, enum: ['Male', 'Female', 'Other', 'Prefer not to say'] },
    height: { type: Number }, // in cm
    weight: { type: Number }, // in kg
    careerField: { type: String },
    bio: { type: String },
    skills: [{
        name: String,
        level: { type: Number, default: 80 } // 0-100 for progress bar
    }],
    softSkills: [{ type: String }],
    languages: [{
        name: String,
        proficiency: { type: String, enum: ['Basic', 'Fluent', 'Native'] }
    }],
    education: [{
        institution: String,
        degree: String,
        year: String,
        gpa: String,
        description: String
    }],
    hasExperience: { type: Boolean, default: false },
    experience: [{
        company: String,
        role: String,
        duration: String,
        description: String,
        logo: String // URL for company logo
    }],
    projects: [{
        title: String,
        description: String,
        tags: [{ type: String }], // Tech stack
        image: String, // Thumbnail URL
        githubLink: String,
        demoLink: String
    }],
    socialLinks: {
        linkedin: String,
        github: String,
        portfolio: String,
        website: String,
        twitter: String
    }
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
