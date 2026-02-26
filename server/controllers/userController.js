const User = require('../models/User');

// Create or Update User Profile
exports.createOrUpdateProfile = async (req, res) => {
    try {
        const { email, name, ...otherData } = req.body;

        let user = await User.findOne({ email });

        if (user) {
            // Update existing user
            user = await User.findOneAndUpdate(
                { email },
                { $set: { name, ...otherData } },
                { new: true }
            );
            return res.json(user);
        }

        // Create new user
        user = new User({
            email,
            name,
            ...otherData
        });

        await user.save();
        res.status(201).json(user);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// Get User Profile by Email
exports.getProfile = async (req, res) => {
    try {
        const { email } = req.params;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(user);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};
