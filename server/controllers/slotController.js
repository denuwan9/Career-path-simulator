const InterviewSlot = require('../models/InterviewSlot');
const User = require('../models/User');

// Admin: Create a new interview slot
exports.createSlot = async (req, res) => {
    try {
        const slot = new InterviewSlot({
            ...req.body,
            createdBy: req.body.adminId // In production, get from auth middleware
        });
        await slot.save();
        res.status(201).json(slot);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Get all slots (with optional filters)
exports.getAllSlots = async (req, res) => {
    try {
        const { date, company, available } = req.query;
        let query = {};

        if (date) {
            const startOfDay = new Date(date);
            startOfDay.setHours(0, 0, 0, 0);
            const endOfDay = new Date(date);
            endOfDay.setHours(23, 59, 59, 999);
            query.date = { $gte: startOfDay, $lte: endOfDay };
        }

        if (company) {
            query.company = new RegExp(company, 'i');
        }

        const slots = await InterviewSlot.find(query)
            .populate('bookedStudents.user', 'name email')
            .sort({ date: 1, startTime: 1 });

        // Filter by availability if requested
        let filteredSlots = slots;
        if (available === 'true') {
            filteredSlots = slots.filter(slot => !slot.isFull);
        }

        res.json(filteredSlots);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get a specific slot
exports.getSlot = async (req, res) => {
    try {
        const slot = await InterviewSlot.findById(req.params.id)
            .populate('bookedStudents.user', 'name email');
        if (!slot) {
            return res.status(404).json({ message: 'Slot not found' });
        }
        res.json(slot);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Student: Book a slot
exports.bookSlot = async (req, res) => {
    try {
        const { slotId, userId } = req.body;

        // Find the slot
        const slot = await InterviewSlot.findById(slotId);
        if (!slot) {
            return res.status(404).json({ message: 'Slot not found' });
        }

        // Check if slot is full
        if (slot.isFull) {
            return res.status(400).json({ message: 'This slot is already full' });
        }

        // Check if student already booked this slot
        const alreadyBooked = slot.bookedStudents.some(
            booking => booking.user.toString() === userId
        );
        if (alreadyBooked) {
            return res.status(400).json({ message: 'You have already booked this slot' });
        }

        // Get all slots to check student's total bookings
        const allSlots = await InterviewSlot.find({
            'bookedStudents.user': userId
        });

        // Rule 1: Check if student has reached max bookings (2)
        if (allSlots.length >= 2) {
            return res.status(400).json({
                message: 'You have already booked the maximum of 2 interview slots'
            });
        }

        // Rule 2: Check for time conflicts
        const slotDateTime = new Date(slot.date);
        const [slotHour, slotMinute] = slot.startTime.split(':');
        slotDateTime.setHours(parseInt(slotHour), parseInt(slotMinute));

        for (const existingSlot of allSlots) {
            const existingDateTime = new Date(existingSlot.date);
            const [existingHour, existingMinute] = existingSlot.startTime.split(':');
            existingDateTime.setHours(parseInt(existingHour), parseInt(existingMinute));

            // Check if same date
            if (slot.date.toDateString() === existingSlot.date.toDateString()) {
                // Check if times overlap
                const slotEnd = new Date(slotDateTime.getTime() + slot.duration * 60000);
                const existingEnd = new Date(existingDateTime.getTime() + existingSlot.duration * 60000);

                if (
                    (slotDateTime >= existingDateTime && slotDateTime < existingEnd) ||
                    (slotEnd > existingDateTime && slotEnd <= existingEnd) ||
                    (slotDateTime <= existingDateTime && slotEnd >= existingEnd)
                ) {
                    return res.status(400).json({
                        message: 'You already have an interview scheduled at this time'
                    });
                }
            }
        }

        // Rule 3: Check if booking at same company
        const sameCompanyBooking = allSlots.find(
            existingSlot => existingSlot.company.toLowerCase() === slot.company.toLowerCase()
        );
        if (sameCompanyBooking) {
            return res.status(400).json({
                message: 'You already have an interview slot booked with this company'
            });
        }

        // All validations passed, book the slot
        slot.bookedStudents.push({ user: userId });

        // Update status if now full
        if (slot.bookedStudents.length >= slot.maxCapacity) {
            slot.status = 'Full';
        }

        await slot.save();

        const populatedSlot = await InterviewSlot.findById(slot._id)
            .populate('bookedStudents.user', 'name email');

        res.json({
            message: 'Slot booked successfully',
            slot: populatedSlot
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Student: Cancel a booking
exports.cancelBooking = async (req, res) => {
    try {
        const { slotId, userId } = req.body;

        const slot = await InterviewSlot.findById(slotId);
        if (!slot) {
            return res.status(404).json({ message: 'Slot not found' });
        }

        // Find and remove the booking
        const bookingIndex = slot.bookedStudents.findIndex(
            booking => booking.user.toString() === userId
        );

        if (bookingIndex === -1) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        slot.bookedStudents.splice(bookingIndex, 1);

        // Update status if no longer full
        if (slot.status === 'Full' && slot.bookedStudents.length < slot.maxCapacity) {
            slot.status = 'Active';
        }

        await slot.save();

        res.json({ message: 'Booking cancelled successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get student's bookings
exports.getStudentBookings = async (req, res) => {
    try {
        const { userId } = req.params;

        const slots = await InterviewSlot.find({
            'bookedStudents.user': userId
        }).sort({ date: 1, startTime: 1 });

        res.json(slots);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Admin: Update slot
exports.updateSlot = async (req, res) => {
    try {
        const slot = await InterviewSlot.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        ).populate('bookedStudents.user', 'name email');

        if (!slot) {
            return res.status(404).json({ message: 'Slot not found' });
        }

        res.json(slot);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Admin: Delete slot
exports.deleteSlot = async (req, res) => {
    try {
        const slot = await InterviewSlot.findById(req.params.id);

        if (!slot) {
            return res.status(404).json({ message: 'Slot not found' });
        }

        // Check if there are bookings
        if (slot.bookedStudents.length > 0) {
            return res.status(400).json({
                message: 'Cannot delete slot with existing bookings. Please cancel all bookings first.'
            });
        }

        await InterviewSlot.findByIdAndDelete(req.params.id);
        res.json({ message: 'Slot deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
