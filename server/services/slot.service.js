const Slot = require("../model/slot.model");
const Reservation = require("../model/reservation.model");
const {
    validateThirtyMinuteSlot,
    parseTimeToMinutes,
    getNormalizedEndMinutes,
    canCancelNoShow,
    getCurrentManilaDateTimeParts,
    getNoShowDeadline,
    getSlotEndDateTime,
} = require("../utils/slotRules");

function getCurrentTimeWithGrace() {
    const { currentMinutes } = getCurrentManilaDateTimeParts();
    const graceMinutes = Math.max(currentMinutes - 10, 0);
    const hours = String(Math.floor(graceMinutes / 60)).padStart(2, "0");
    const minutes = String(graceMinutes % 60).padStart(2, "0");
    return `${hours}:${minutes}`;
}

exports.getSlotsByDate = async (requestedDate, includeBlocked = false) => {
    const { currentDate } = getCurrentManilaDateTimeParts();

    const query = { date: requestedDate };
    if (!includeBlocked) {
        query.isAvailable = true;
    }

    if (requestedDate === currentDate) {
        query.startTime = { $gte: getCurrentTimeWithGrace() };
    }

    const slots = await Slot.find(query).populate("lab");

    return await Promise.all(
        slots.map(async (slot) => {
            const activeReservations = await Reservation.find({
                "slots.slot": slot._id,
                status: "active",
            });

            const occupiedSeats = activeReservations.flatMap((reservation) =>
                reservation.slots
                    .filter((slotEntry) => slotEntry.slot.toString() === slot._id.toString())
                    .map((slotEntry) => slotEntry.seat)
            );

            const capacity = slot.lab?.seatCount || 0;

            return {
                ...slot.toObject(),
                occupiedCount: occupiedSeats.length,
                capacity,
                isFull: occupiedSeats.length >= capacity && capacity > 0,
            };
        })
    );
};

exports.createSlot = async (slotData) => {
    const { lab, date, startTime, endTime } = slotData;
    const { startMinutes, normalizedEndMinutes } = validateThirtyMinuteSlot(startTime, endTime);
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
        const existingEnd = getNormalizedEndMinutes(
            existingStart,
            parseTimeToMinutes(existingSlot.endTime)
        );
        return startMinutes < existingEnd && normalizedEndMinutes > existingStart;
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
    const { currentDate } = getCurrentManilaDateTimeParts();
    const currentTimeWithGrace = getCurrentTimeWithGrace();

    for (let i = 0; i < daysCount; i++) {
        const date = new Date(startDate);
        date.setDate(date.getDate() + i);
        const isoDate = date.toISOString().split("T")[0];

        const query = {
            date: isoDate,
            isAvailable: true,
        };

        if (isoDate === currentDate) {
            query.startTime = { $gte: currentTimeWithGrace };
        } else if (isoDate < currentDate) {
            results.push({ date: isoDate, count: 0 });
            continue;
        }

        const count = await Slot.countDocuments(query);
        results.push({ date: isoDate, count });
    }

    return results;
};

exports.getReservedSeatsForSlot = async (slotId) => {
    const reservations = await Reservation.find({
        "slots.slot": slotId,
        status: "active",
    });

    return reservations.flatMap((reservation) =>
        reservation.slots
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
        status: { $in: ["active", "cancelled"] },
    })
        .populate("reservedFor", "firstName lastName")
        .populate("reservedBy", "firstName lastName");

    const occupiedSeats = [];
    const reservationDetails = reservations.map((reservation) => {
        const seats = reservation.slots
            .filter((slotEntry) => slotEntry.slot.toString() === slotId.toString())
            .map((slotEntry) => slotEntry.seat);

        if (reservation.status === "active") {
            occupiedSeats.push(...seats);
        }

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
            status: reservation.status,
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
    return await Slot.findByIdAndUpdate(
        slotId,
        { isAvailable },
        { new: true }
    ).populate("lab");
};
