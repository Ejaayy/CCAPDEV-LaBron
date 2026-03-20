const userService = require('../services/user.service');
const User = require('../model/User');

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

module.exports = {
    fetchStudents,
    getUserById
};