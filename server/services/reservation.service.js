const Reservation = require('../model/reservation.model');

exports.create = async (reservationData) => {
    const reservation = new Reservation(reservationData);
    return await reservation.save();
};