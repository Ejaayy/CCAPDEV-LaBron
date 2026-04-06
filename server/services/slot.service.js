const Slot = require("../model/slot.model");
const Reservation = require("../model/reservation.model");
const {
    validateThirtyMinuteSlot,
    parseTimeToMinutes,
    canCancelNoShow,
    getNoShowDeadline,
    getSlotEndDateTime,
} = require("../utils/slotRules");

exports.getSlotsByDate = async (requestedDate, includeBlocked = false) => {
    const now = new Date();
    const todayStr = now.toISOString().split("T")[0];
    
    const query = { date: requestedDate };
    if (!includeBlocked) {
        query.isAvailable = true;
    }

    if (requestedDate === todayStr) {
        // 10 minute grace period
        const graceTime = new Date(now.getTime() - 10 * 60000);
        const hours = String(graceTime.getHours()).padStart(2, '0');
        const minutes = String(graceTime.getMinutes()).padStart(2, '0');
        const currentTimeWithGrace = `${hours}:${minutes}`;

        // Only find slots where startTime is greater than or equal to our grace time
        query.startTime = { $gte: currentTimeWithGrace };
    }

    return await Slot.find(query).populate("lab");
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
    const now = new Date();
    const todayStr = now.toISOString().split("T")[0];

    // Calculate grace time 
    const graceTime = new Date(now.getTime() - 10 * 60000);
    const currentTimeWithGrace = `${String(graceTime.getHours()).padStart(2, '0')}:${String(graceTime.getMinutes()).padStart(2, '0')}`;

    for (let i = 0; i < daysCount; i++) {
        const date = new Date(startDate);
        date.setDate(date.getDate() + i);
        const isoDate = date.toISOString().split("T")[0];

        const query = {
            date: isoDate,
            isAvailable: true,
        };

        // If the date is today, only count upcoming slots
        if (isoDate === todayStr) {
            query.startTime = { $gte: currentTimeWithGrace };
        } 
        // If the date is in the past, force count to 0 
        else if (isoDate < todayStr) {
            results.push({ date: isoDate, count: 0 });
            continue;
        }

        const count = await Slot.countDocuments(query);

        results.push({
            date: isoDate,
            count,
        });
    }
    return results;
};

exports.getReservedSeatsForSlot = async (slotId) => {
    const reservations = await Reservation.find({
        "slots.slot": slotId,
        status: "active",
    });

    return reservations.flatMap((res) =>
        res.slots
            .filter((slotEntry) => slotEntry.slot.toString() === slotId.toString())
            .map((slotEntry) => slotEntry.seat)
    );
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
    const reservationDetails = reservations.map((reservation) => {
        const seats = reservation.slots
            .filter((slotEntry) => slotEntry.slot.toString() === slotId.toString())
            .map((slotEntry) => slotEntry.seat);

        occupiedSeats.push(...seats);

        const userName = reservation.reservedFor
            ? reservation.isAnonymous
                ? "Anonymous"
                : `${reservation.reservedFor.firstName || ""} ${reservation.reservedFor.lastName || ""}`.trim()
            : "Unknown";

        return {
            reservationId: reservation._id.toString(),
            studentId: reservation.reservedFor?._id?.toString() || null,
            name: userName,
            seats,
            seatNumber: seats.join(", "),
        };
    });

    return {
        occupiedSeats,
        reservations: reservationDetails,
        canCancelNoShow: canCancelNoShow(slot),
        noShowEligibleAt: getNoShowDeadline(slot).toISOString(),
        noShowCutoffAt: getSlotEndDateTime(slot).toISOString(),
    };
};

exports.updateSlotAvailability = async (slotId, isAvailable) => {
    const slot = await Slot.findByIdAndUpdate(
        slotId,
        { isAvailable },
        { new: true }
    ).populate("lab");
    return slot;
};
