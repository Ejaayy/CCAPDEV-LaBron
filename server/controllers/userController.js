const userService = require('../services/user.service');
const User = require('../model/User');
const Reservation = require('../model/reservation.model');

const fetchStudents = async (req, res) => {
    try {
        const students = await userService.getStudents();
        res.status(200).json(students);
    } catch (error) {
        console.error("Error fetching students:", error);
        res.status(500).json({ message: "Failed to fetch students" });
    }
};

const getUserById = async (req, res) => {
    try {
        // Find user by ID
        const user = await User.findById(req.params.id).select('-passwordHash');

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json(user);
    } catch (error) {
        console.error("Error fetching user by ID:", error);
        res.status(500).json({ message: "Server error fetching user" });
    }
};

const updateProfile = async (req, res) => {
    try {
        const userId = req.session.userId;
        if (!userId) return res.status(401).json({ message: "Not logged in" });

        const { firstName, lastName, description } = req.body;

        if (!firstName || !lastName) {
            return res.status(400).json({ message: "First and Last name cannot be empty." });
        }

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { firstName, lastName, description },
            { new: true, runValidators: true }
        ).select('-passwordHash');

        res.status(200).json({ message: "Profile updated!", user: updatedUser });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteAccount = async (req, res) => {
    try {
        const userId = req.session.userId;
        if (!userId) return res.status(401).json({ message: "Not logged in" });

        await Reservation.updateMany(
            { reservedFor: userId, status: "active" },
            { status: "cancelled" }
        );

        await User.findByIdAndDelete(userId);

        req.session.destroy((err) => {
            if (err) return res.status(500).json({ message: "Could not log out" });
            res.clearCookie('connect.sid');
            return res.status(200).json({ message: "Account deleted." });
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    fetchStudents,
    getUserById,
    updateProfile,
    deleteAccount,
};