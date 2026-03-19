const User = require('../model/User');

const getStudents = async () => {
    return await User.find({role: "student"}).select("-passwordHash");
};

module.exports = {
    getStudents
};