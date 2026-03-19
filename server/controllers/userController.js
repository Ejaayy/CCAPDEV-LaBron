const userService = require('../services/user.service');

const fetchStudents = async (req, res) => {
    try {
        const students = await userService.getStudents();
        res.status(200).json(students);
    } catch (error) {
        console.error("Error fetching students:", error);
        res.status(500).json({ message: "Failed to fetch students" });
    }
};


module.exports = {
    fetchStudents
};