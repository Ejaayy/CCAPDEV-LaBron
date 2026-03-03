const mongoose = require("mongoose");

const userSchema = new mongoose.Schema( 
    {
        email: { 
            type: String, 
            required: true, 
            unique: true 
        },                                  //DLSU email address
        passwordHash: { 
            type: String, 
            required: true
        },                                 //password hash for authentication
        role: { 
            type: String, 
            enum: ["student", "technician"], 
            required: true 
        },                                //user role to determine access level

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
    },                              //path to the user's profile picture, default is empty string
    {timestamps: true }
);

module.exports = mongoose.model("User", userSchema);