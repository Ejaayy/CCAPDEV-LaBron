const Slot = require("../model/slot.model");
const Reservation = require("../model/reservation.model");
const {
    validateThirtyMinuteSlot,
    parseTimeToMinutes,
    canCancelNoShow,
    getNoShowDeadline,
} = require("../utils/slotRules");


exports.getSlotsByDate = async (requestedDate, includeBlocked = false) => {
    const query = { date: requestedDate };
    if (!includeBlocked) {
        query.isAvailable = true;
    }
    return await Slot.find(query).populate('lab');
};

exports.createSlot = async (slotData) => {
    const { lab, date, startTime, endTime } = slotData;
    const { startMinutes, endMinutes } = validateThirtyMinuteSlot(startTime, endTime);

    const existingSlots = await Slot.find({ lab, date });

    const hasOverlap = existingSlots.some((existingSlot) => {
        const existingStart = parseTimeToMinutes(existingSlot.startTime);
        const existingEnd = parseTimeToMinutes(existingSlot.endTime);
        return startMinutes < existingEnd && endMinutes > existingStart;
    });

    if (hasOverlap) {
        throw new Error("This slot overlaps with an existing slot for the selected room.");
    }

    const slot = new Slot(slotData);
    await slot.save();
    return await Slot.findById(slot._id).populate("lab");
};

exports.getWeeklyCount = async (startDate, daysCount = 7) => {
    const results = [];
    
    for (let i = 0; i < daysCount; i++) {
        const date = new Date(startDate);
        date.setDate(date.getDate() + i);
        const isoDate = date.toISOString().split('T')[0];

        // count items in db with specific date
        const count = await Slot.countDocuments({ 
            date: isoDate, 
            isAvailable: true 
        });

        results.push({
            date: isoDate,
            count: count
        });
    }
    return results;
};

exports.getReservedSeatsForSlot = async (slotId) => {
    const reservations = await Reservation.find({
        "slots.slot": slotId,
        status: "active",
    });

    const reservedSeats = reservations.flatMap((res) =>
        res.slots
            .filter((s) => s.slot.toString() === slotId.toString())
            .map((s) => s.seat)
    );

    return reservedSeats;
};

exports.getSlotReservationDetails = async (slotId) => {
    const slot = await Slot.findById(slotId);
    if (!slot) {
        throw new Error("Slot not found");
    }

    const reservations = await Reservation.find({
        "slots.slot": slotId,
        status: "active",
    })
        .populate("reservedFor", "firstName lastName")
        .populate("reservedBy", "firstName lastName");

    const occupiedSeats = [];
    const reservationDetails = [];

    reservations.forEach((res) => {
        res.slots
            .filter((s) => s.slot.toString() === slotId.toString())
            .forEach((s) => {
                occupiedSeats.push(s.seat);
                const userName = res.reservedFor
                    ? res.isAnonymous
                        ? "Anonymous"
                        : `${res.reservedFor.firstName || ""} ${res.reservedFor.lastName || ""}`.trim()
                    : "Unknown";

                // ✅ Now includes IDs
                reservationDetails.push({ 
                    reservationId: res._id,
                    studentId: res.reservedFor?._id,
                    name: userName, 
                    seat: s.seat 
                });
            });
    });

    return {
        occupiedSeats,
        reservations: reservationDetails,
        canCancelNoShow: canCancelNoShow(slot),
        noShowWindowEndsAt: getNoShowDeadline(slot).toISOString(),
    };
};

exports.updateSlotAvailability = async (slotId, isAvailable) => {
    const slot = await Slot.findByIdAndUpdate(
        slotId,
        { isAvailable },
        { new: true }
    ).populate('lab');
    return slot;
};
