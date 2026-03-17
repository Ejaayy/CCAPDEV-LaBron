require("dotenv").config();
const mongoose = require("mongoose");

const User = require("../model/User.js");
const Lab = require("../model/Lab.js");
const Slot = require("../model/slot.model.js");
const Reservation = require("../model/reservation.model.js");

async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Successfully connected to MongoDB:", mongoose.connection.name);
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error.message);
    process.exit(1);
  }
}

module.exports = connectDB;