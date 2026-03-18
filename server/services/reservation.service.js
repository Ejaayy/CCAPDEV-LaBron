const Reservation = require('../model/reservation.model');
const User = require('../model/User');

exports.createReservation = async (reservationData) => {
    const reservation = new Reservation(reservationData);
    return await reservation.save();
};

exports.getReservedDates = async () => {
    const reservations = await Reservation.find({status: "active" }).populate("slots.slot", "date");

    const dateSet = new Set();

    reservations.forEach((reservation) => {
        reservation.slots.forEach((slotEntry) => {
            if (slotEntry.slot && slotEntry.slot.date) {
                dateSet.add(slotEntry.slot.date);
            }
        });
    });

    return Array.from(dateSet);
};

exports.getUserReservedDates = async (userId) => {
    const reservations = await Reservation.find({status: "active", reservedFor: userId}).populate("slots.slot", "date");
    const dateSet = new Set();

    reservations.forEach((reservation) => {
        reservation.slots.forEach((slotEntry) => {
            if (slotEntry.slot && slotEntry.slot.date) {
                dateSet.add(slotEntry.slot.date);
            }
        });
    });

    return Array.from(dateSet);
};