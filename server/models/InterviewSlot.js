const mongoose = require('mongoose');

const InterviewSlotSchema = new mongoose.Schema({
    company: { type: String, required: true },
    position: { type: String, required: true },
    location: { type: String, required: true },
    date: { type: Date, required: true },
    startTime: { type: String, required: true }, // Format: "HH:MM"
    endTime: { type: String, required: true },
    duration: { type: Number, default: 30 }, // in minutes
    maxCapacity: { type: Number, default: 1 },
    description: { type: String },
    bookedStudents: [{
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        bookedAt: { type: Date, default: Date.now }
    }],
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    status: { type: String, enum: ['Active', 'Full', 'Cancelled'], default: 'Active' }
}, { timestamps: true });

// Virtual to check if slot is full
InterviewSlotSchema.virtual('isFull').get(function () {
    return this.bookedStudents.length >= this.maxCapacity;
});

// Virtual to get available spots
InterviewSlotSchema.virtual('availableSpots').get(function () {
    return this.maxCapacity - this.bookedStudents.length;
});

// Ensure virtuals are included in JSON
InterviewSlotSchema.set('toJSON', { virtuals: true });
InterviewSlotSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('InterviewSlot', InterviewSlotSchema);
