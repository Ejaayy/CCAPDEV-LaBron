const path = require("path");

require("dotenv").config({ path: path.resolve(__dirname, "../.env") });
const mongoose = require("mongoose");

const User = require("../model/User.js");
const Lab = require("../model/Lab.js");
const Slot = require("../model/slot.model.js");
const Reservation = require("../model/reservation.model.js");

async function connectDB() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Successfully connected to MongoDB");
    } catch (error) {
        console.error("Failed to connect to MongoDB:", error.message);
        process.exit(1);
    }
}

async function seedDB() {
    try {
        await connectDB();

        console.log("Clearing old data...");
        await User.deleteMany({});
        await Lab.deleteMany({});
        await Slot.deleteMany({});
        await Reservation.deleteMany({});

        console.log("Creating users...");
        const users = await User.insertMany([
            { 
                email: "aliceGuo@dlsu.edu.ph",
                passwordHash: "hashedpassword123",
                role: "student",
                firstName: "Alice",
                lastName: "Guo",
                profilePicturePath: "/images/alice.png"
            },
            {
                email: "bongGo@dlsu.edu.ph",
                passwordHash: "hashedpassword123",
                role: "student",
                firstName: "Bong",
                lastName: "Go",
                profilePicturePath: "/images/bong.png"
            },
            {
                email: "sarahDuterte@dlsu.edu.ph",
                passwordHash: "hashedpassword123",
                role: "student",
                firstName: "Sarah",
                lastName: "Duterte",
                profilePicturePath: "/images/sarah.png"
            },
            {
                email: "batoDelaRosa@dlsu.edu.ph",
                passwordHash: "hashedpassword123",
                role: "student",
                firstName: "Bato",
                lastName: "Dela Rosa",
                profilePicturePath: "/images/bato.png"
            },
            {
                email: "robinHoodPadilla@dlsu.edu.ph",
                passwordHash: "hashedpassword123",
                role: "student",
                firstName: "Robin",
                lastName: "Hood",
                profilePicturePath: "/images/robin.png"
            },
        ]);
            
        console.log("Creating labs...");
        const labs = await Lab.insertMany([
            {
                name: "Yuchengco Computer Lab Y403",
                location: "Yuchengco Building 4th Floor",
                seatCount: 30,
                seats: [
                    "A1", "A2", "A3", "B1", "B2", "B3", "C1", "C2", "C3",
                    "A4", "A5", "A6", "B4", "B5", "B6", "C4", "C5", "C6",
                    "A7", "A8", "A9", "B7", "B8", "B9", "C7", "C8", "C9",
                    "A10", "A11", "A12"
                ]
            },
            {
                name: "Gokongwei Computer Lab G203",
                location: "Gokongwei Building 2nd Floor",
                seatCount: 30,
                seats: [
                    "A1", "A2", "A3", "B1", "B2", "B3", "C1", "C2", "C3",
                    "A4", "A5", "A6", "B4", "B5", "B6", "C4", "C5", "C6",
                    "A7", "A8", "A9", "B7", "B8", "B9", "C7", "C8", "C9",
                    "A10", "A11", "A12"
                ]
            },
            {
                name: "Velasco Computer Lab V305",
                location: "Velasco Building 3rd Floor",
                seatCount: 30,
                seats: [
                    "A1", "A2", "A3", "B1", "B2", "B3", "C1", "C2", "C3",
                    "A4", "A5", "A6", "B4", "B5", "B6", "C4", "C5", "C6",
                    "A7", "A8", "A9", "B7", "B8", "B9", "C7", "C8", "C9",
                    "A10", "A11", "A12"
                ]
            },
            {
                name: "Br. Andrew Computer Lab A1903",
                location: "Br. Andrew Building 19th Floor",
                seatCount: 30,
                seats: [
                    "A1", "A2", "A3", "B1", "B2", "B3", "C1", "C2", "C3",
                    "A4", "A5", "A6", "B4", "B5", "B6", "C4", "C5", "C6",
                    "A7", "A8", "A9", "B7", "B8", "B9", "C7", "C8", "C9",
                    "A10", "A11", "A12"
                ]
            },
            {
                name: "Gokongwei Computer Lab G303",
                location: "Gokongwei Building 3rd Floor",
                seatCount: 30,
                seats: [
                    "A1", "A2", "A3", "B1", "B2", "B3", "C1", "C2", "C3",
                    "A4", "A5", "A6", "B4", "B5", "B6", "C4", "C5", "C6",
                    "A7", "A8", "A9", "B7", "B8", "B9", "C7", "C8", "C9",
                    "A10", "A11", "A12"
                ]
            },
        ]);

        console.log("Creating slots...");
        const slots = await Slot.insertMany([
        {
            lab: labs[0]._id,
            date: "2026-03-20",
            startTime: "09:00",
            endTime: "11:00",
            isAvailable: true,
        },
        {
            lab: labs[1]._id,
            date: "2026-03-21",
            startTime: "13:00",
            endTime: "15:00",
            isAvailable: true,
        },
        {
            lab: labs[2]._id,
            date: "2026-03-22",
            startTime: "10:00",
            endTime: "12:00",
            isAvailable: true,
        },
        {
            lab: labs[0]._id,
            date: "2026-03-23",
            startTime: "08:00",
            endTime: "10:00",
            isAvailable: true,
        },
        {
            lab: labs[1]._id,
            date: "2026-03-24",
            startTime: "14:00",
            endTime: "16:00",
            isAvailable: true,
        },
        ]);

        console.log("Creating reservations...");
        await Reservation.insertMany([
        {
            reservedBy: users[0]._id,
            reservedFor: users[0]._id,
            slots: [
            {
                slot: slots[0]._id,
                seat: "A1",
            },
            ],
            isAnonymous: false,
            status: "active",
        },
        {
            reservedBy: users[1]._id,
            reservedFor: users[1]._id,
            slots: [
            {
                slot: slots[1]._id,
                seat: "B2",
            },
            ],
            isAnonymous: false,
            status: "active",
        },
        {
            reservedBy: users[4]._id,
            reservedFor: users[2]._id,
            slots: [
            {
                slot: slots[2]._id,
                seat: "C1",
            },
            ],
            isAnonymous: true,
            status: "active",
        },
        {
            reservedBy: users[3]._id,
            reservedFor: users[3]._id,
            slots: [
            {
                slot: slots[3]._id,
                seat: "A2",
            },
            ],
            isAnonymous: false,
            status: "completed",
        },
        {
            reservedBy: users[4]._id,
            reservedFor: users[1]._id,
            slots: [
            {
                slot: slots[4]._id,
                seat: "B1",
            },
            ],
            isAnonymous: false,
            status: "cancelled",
        },
        ]);

    console.log("Seeding completed successfully.");
    process.exit(0);
    } catch (error) {
        console.error("Seeding failed:", error.message);
        process.exit(1);
    }
}

module.exports = connectDB();

if (require.main === module) {
    seedDB();
};