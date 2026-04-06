const Slot = require("../model/slot.model");
const Reservation = require("../model/reservation.model");
const {
    validateThirtyMinuteSlot,
    parseTimeToMinutes,
    canCancelNoShow,
    getCurrentManilaDateTimeParts,
    getNoShowDeadline,
    getSlotEndDateTime,
} = require("../utils/slotRules");

exports.getSlotsByDate = async (requestedDate, includeBlocked = false) => {
    const { currentDate, currentMinutes } = getCurrentManilaDateTimeParts();
    
   
    const query = { date: requestedDate };
    if (!includeBlocked) query.isAvailable = true;

    // Time Filter (Today + 10 min grace)
    if (requestedDate === todayStr) {
        const graceTime = new Date(now.getTime() - 10 * 60000);
        const currentTime = `${String(graceTime.getHours()).padStart(2, '0')}:${String(graceTime.getMinutes()).padStart(2, '0')}`;
        query.startTime = { $gte: currentTime };
    }

    const slots = await Slot.find(query).populate("lab");

    //   Get counts for all slots at once
    return await Promise.all(slots.map(async (slot) => {
        const activeReservations = await Reservation.find({
            "slots.slot": slot._id,
            status: "active"
        });

        const occupiedSeats = activeReservations.flatMap(res => res.slots.map(s => s.seat));
        const capacity = slot.lab?.seatCount || 0;

        return {
            ...slot.toObject(),
            occupiedCount: occupiedSeats.length,
            capacity: capacity,
            isFull: occupiedSeats.length >= capacity && capacity > 0
        };
    }));
    if (requestedDate === currentDate) {
        // 10 minute grace period
        const graceMinutes = Math.max(currentMinutes - 10, 0);
        const hours = String(Math.floor(graceMinutes / 60)).padStart(2, '0');
        const minutes = String(graceMinutes % 60).padStart(2, '0');
        const currentTimeWithGrace = `${hours}:${minutes}`;

        // Only find slots where startTime is greater than or equal to our grace time
        query.startTime = { $gte: currentTimeWithGrace };
    }

    return await Slot.find(query).populate("lab");
};
exports.createSlot = async (slotData) => {
    const { lab, date, startTime, endTime } = slotData;
    const { startMinutes, endMinutes } = validateThirtyMinuteSlot(startTime, endTime);
    const { currentDate, currentMinutes } = getCurrentManilaDateTimeParts();

    if (date < currentDate) {
        throw new Error("Cannot add a time slot to a past date.");
    }

    if (date === currentDate && startMinutes < currentMinutes) {
        throw new Error("Cannot add a time slot earlier than the current time for today.");
    }

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
    const { currentDate, currentMinutes } = getCurrentManilaDateTimeParts();

    // Calculate grace time 
    const graceMinutes = Math.max(currentMinutes - 10, 0);
    const currentTimeWithGrace = `${String(Math.floor(graceMinutes / 60)).padStart(2, '0')}:${String(graceMinutes % 60).padStart(2, '0')}`;

    for (let i = 0; i < daysCount; i++) {
        const date = new Date(startDate);
        date.setDate(date.getDate() + i);
        const isoDate = date.toISOString().split("T")[0];

        const query = {
            date: isoDate,
            isAvailable: true,
        };

        // If the date is today, only count upcoming slots
        if (isoDate === currentDate) {
            query.startTime = { $gte: currentTimeWithGrace };
        } 
        // If the date is in the past, force count to 0 
        else if (isoDate < currentDate) {
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
    .populate("reservedFor", "firstName lastName profilePicturePath") 
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
            profilePicturePath: reservation.reservedFor?.profilePicturePath || null,
            seats,
            seatNumber: seats.join(", "),
            status: reservation.status,
            isAnonymous: reservation.isAnonymous
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
