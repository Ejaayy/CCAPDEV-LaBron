const mongoose = require("mongoose");

const userSchema = new mongoose.Schema( 
    {
        email: { 
            type: String, 
            required: true, 
            unique: true 
        },
        passwordHash: { 
            type: String, 
            required: true
        },
        role: { 
            type: String, 
            enum: ["student", "technician"],
            default: "student",
            required: true 
        },

        firstName: { 
            type: String, 
            required: true 
        }, 
        lastName: { 
            type: String, 
            required: true 
        },

        profilePicturePath: { 
            type: String, 
            default: "" 
        }
    },
    {timestamps: true }
);

module.exports = mongoose.model("User", userSchema);