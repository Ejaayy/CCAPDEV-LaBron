const User = require("../model/User");
const bcrypt = require("bcryptjs"); // password hashing
const crypto = require('crypto'); // forgot password
const emailService = require('../services/email.service');

exports.register = async (req, res) => {
    try {
        const { email, password, firstName, lastName, role, idNumber } = req.body;

        //backend validation
        if (!email || !password || !firstName || !lastName || !idNumber) {
            return res.status(400).json({ message: "All fields are required. Please fill out the entire form." });
        }
        const emailRegex = /^[a-zA-Z0-9._-]+@dlsu\.edu\.ph$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: "You must use a valid @dlsu.edu.ph email address." });
        }
        if (password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters long." });
        }
        const idRegex = /^\d{8}$/;
        if (!idRegex.test(idNumber)) {
            return res.status(400).json({ message: "ID Number must be exactly 8 digits." });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: "User already exists" });

        // Generate salt and hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            email,
            passwordHash: hashedPassword,
            firstName,
            lastName,
            role,
            idNumber,
            profilePicturePath: `/uploads/profiles/${idNumber}.jpg`
        });

        await newUser.save();
        res.status(201).json({ message: "User registered successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.login = async (req, res) => {
    const { email, password, rememberMe } = req.body;
    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        const isMatch = await bcrypt.compare(password, user.passwordHash);

        if (isMatch) {
            req.session.userId = user._id;
            req.session.role = user.role;

            if (rememberMe) {
                // 3 weeks time
                req.session.cookie.maxAge = 1000 * 60 * 60 * 24 * 21;
            } else {
                // turns cookie into a session cookie (clears on browser close)
                req.session.cookie.expires = false;
            }

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

exports.forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(200).json({ message: "If that email exists, a reset link has been sent." });
        }

        const resetToken = crypto.randomBytes(20).toString('hex');

        user.resetPasswordToken = resetToken;
        user.resetPasswordExpires = Date.now() + 3600000;
        await user.save();

        try {
            await emailService.sendPasswordResetEmail(user.email, resetToken);
            res.status(200).json({ message: "Reset link sent to email." });
        } catch (emailError) {
            console.error("Email sending failed:", emailError);

            user.resetPasswordToken = undefined;
            user.resetPasswordExpires = undefined;
            await user.save();

            return res.status(500).json({ message: "Error sending email. Please try again later." });
        }

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.resetPassword = async (req, res) => {
    try {
        const { token, newPassword } = req.body;

        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ message: "Password reset token is invalid or has expired." });
        }

        const salt = await bcrypt.genSalt(10);
        user.passwordHash = await bcrypt.hash(newPassword, salt);

        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();

        res.status(200).json({ message: "Password has been successfully updated." });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};