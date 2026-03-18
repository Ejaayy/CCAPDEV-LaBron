const User = require("../model/User");

exports.register = async (req, res) => {
    try {
        const { email, password, firstName, lastName, role } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: "User already exists" });

        const newUser = new User({
            email,
            passwordHash: password,
            firstName,
            lastName,
            role
        });

        await newUser.save();
        res.status(201).json({ message: "User registered successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });

        if (user && user.passwordHash === password) {
            req.session.userId = user._id;
            req.session.role = user.role;

            req.session.save((err) => {
                if (err) return res.status(500).json({ message: "Session failed" });

                return res.status(200).json({
                    message: "Login successful",
                    role: user.role,
                    userId: user._id,
                    user: { firstName: user.firstName, lastName: user.lastName }
                });
            });
        } else {
            res.status(401).json({ message: "Invalid email or password" });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.logout = (req, res) => {
    req.session.destroy((err) => {
        if (err) return res.status(500).json({ message: "Could not log out" });
        res.clearCookie('connect.sid');
        return res.json({ message: "Logged out successfully" });
    });
};

exports.getMe = async (req, res) => {
    try {
        if (!req.session.userId) {
            return res.status(401).json({ message: "Not logged in" });
        }
        const user = await User.findById(req.session.userId).select("-passwordHash");
        res.json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};