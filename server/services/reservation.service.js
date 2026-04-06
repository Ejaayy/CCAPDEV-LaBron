const Reservation = require('../model/reservation.model');
const Lab = require('../model/Lab');
const Slot = require('../model/slot.model');
const { canCancelNoShow, getNoShowDeadline, getSlotEndDateTime } = require("../utils/slotRules");

exports.createReservation = async (reservationData) => {
    // backend validation
    if (!reservationData.slots || reservationData.slots.length === 0) {
        throw new Error("You must select at least one seat to reserve.");
    }

    const requestedSlotId = reservationData.slots[0].slot;
    const requestedSeats = reservationData.slots.map(s => s.seat);

    // double booking prevention
    const seatCollision = await Reservation.findOne({
        status: "active",
        slots: {
            $elemMatch: {
                slot: requestedSlotId,
                seat: { $in: requestedSeats }
            }
        }
    });

    if (seatCollision) {
        // check which seat is taken
        const takenSeats = seatCollision.slots
            .filter(s => s.slot.toString() === requestedSlotId.toString() && requestedSeats.includes(s.seat))
            .map(s => s.seat);

        throw new Error(`Reservation failed. Seat(s) ${takenSeats.join(", ")} were just taken by someone else!`);
    }

    // prevents user from booking the same timeslot twice
    const userCollision = await Reservation.findOne({
        status: "active",
        reservedFor: reservationData.reservedFor,
        "slots.slot": requestedSlotId
    });

    if (userCollision) {
        throw new Error("You already have an active reservation during this time slot.");
    }

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

const formatTime12h = (time24) => {
    if (!time24) return "N/A";
    const [hour, minute] = time24.split(':');
    const h = parseInt(hour, 10);
    const ampm = h >= 12 ? 'PM' : 'AM';
    const h12 = h % 12 || 12;
    return `${h12.toString().padStart(2, '0')}:${minute} ${ampm}`;
};

const resolveReservationStatus = (currentStatus, date, startTime, endTime) => {
    // If a technician cancelled it, status is permanent
    if (currentStatus === "cancelled") return "cancelled";

    const now = new Date();
    const start = new Date(`${date}T${startTime}:00`);
    const end = new Date(`${date}T${endTime}:00`);

    if (now >= end) return "completed";
    if (now >= start) return "ongoing";
    
    return "active";
};

exports.getUserReservations = async (userId) => {
    
    const reservations = await Reservation.find({ 
        reservedFor: userId 
    }).populate({
        path: 'slots.slot',
        populate: { path: 'lab', model: 'Lab' }
    });

    const formattedReservations = await Promise.all(reservations.map(async (res) => {
        const slotInfo = res.slots[0]?.slot;
        const labInfo = slotInfo?.lab;

        if (!slotInfo) return null;

        const newStatus = resolveReservationStatus(
            res.status, 
            slotInfo.date, 
            slotInfo.startTime, 
            slotInfo.endTime
        );

        if (newStatus !== res.status) {
            await Reservation.updateOne({ _id: res._id }, { status: newStatus });
        }

        const combinedSeats = res.slots.map(s => s.seat).join(", ");
        const reqDate = new Date(res.createdAt);
        const reqDateFormatted = reqDate.toLocaleString('en-US', {
            month: 'long', day: '2-digit', year: 'numeric',
            hour: '2-digit', minute: '2-digit', hour12: true
        }).replace(' at ', ' ');

        const [year, month, day] = slotInfo.date.split('-');
        const d = new Date(year, month - 1, day);
        const resDateFormatted = d.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
        
        const sortTimestamp = new Date(`${slotInfo.date}T${slotInfo.startTime}:00`).getTime();

        return {
            id: res._id.toString(), 
            status: newStatus,
            laboratory: labInfo ? labInfo.name : "Unknown Lab",
            seatNumber: combinedSeats || "N/A", 
            reservationTime: `${formatTime12h(slotInfo.startTime)} - ${formatTime12h(slotInfo.endTime)}`,
            requestDateTime: reqDateFormatted,
            rawDate: slotInfo.date,
            resDate: resDateFormatted,
            _sortTimestamp: sortTimestamp,
            slotId: slotInfo._id.toString(),
            availableSeats: labInfo?.seats || [],
        };  
    }));

    return formattedReservations
        .filter(res => res !== null)
        .sort((a, b) => a._sortTimestamp - b._sortTimestamp);
};

exports.getUserStats = async (userId) => {
    // FIXED: Fetch BOTH active and completed reservations
    const reservations = await Reservation.find({ 
        status: { $in: ["active", "completed"] }, 
        reservedFor: userId 
    }).populate({
        path: 'slots.slot',
        populate: {
            path: 'lab',
            model: 'Lab'
        }
    });

    let totalMinutes = 0;
    const uniqueLabs = new Set();
    let nextReservationTime = null;
    const now = new Date();

    reservations.forEach(res => {
        const slotEntry = res.slots[0];
        const slotInfo = slotEntry ? slotEntry.slot : null;
        const labInfo = slotInfo ? slotInfo.lab : null;

        if (slotInfo && slotInfo.date && slotInfo.startTime && slotInfo.endTime) {
            const reservationDateTime = new Date(`${slotInfo.date}T${slotInfo.startTime}:00`);

            if (res.status === "completed") {
                const [startHour, startMinute] = slotInfo.startTime.split(':').map(Number);
                const [endHour, endMinute] = slotInfo.endTime.split(':').map(Number);
                totalMinutes += ((endHour * 60 + endMinute) - (startHour * 60 + startMinute));

                if (labInfo) {
                    uniqueLabs.add(labInfo.name);
                }
            }

            if (res.status === "active" && reservationDateTime > now) {
                if (!nextReservationTime || reservationDateTime < nextReservationTime) {
                    nextReservationTime = reservationDateTime;
                }
            }
        }
    });

    let labTimeString = "No Lab Hours Yet";

    if (totalMinutes > 0) {
        const labHours = Math.floor(totalMinutes / 60);
        const labMinutes = totalMinutes % 60;
        labTimeString = "";

        if (labHours > 0) labTimeString += `${labHours} Hour${labHours !== 1 ? 's' : ''}`;
        if (labMinutes > 0 || labHours === 0) {
            if (labHours > 0) labTimeString += " "; 
            labTimeString += `${labMinutes} Minute${labMinutes !== 1 ? 's' : ''}`;
        }
    }

    let nextReservationString = "No upcoming reservations";
    let nextReservationLabel = "";

    if (nextReservationTime) {
        const diffMs = nextReservationTime - now;
        const totalDiffMinutes = Math.floor(diffMs / 60000);

        nextReservationLabel = "Before your latest reservation";

        if (totalDiffMinutes <= 0) {
            nextReservationString = "Your next reservation is starting soon!";
        } else {
            const diffDays = Math.floor(totalDiffMinutes / 1440);
            const diffHours = Math.floor((totalDiffMinutes % 1440) / 60);
            const diffMins = totalDiffMinutes % 60;
           
            if (diffDays > 0) {
                nextReservationString = `${diffDays} Day${diffDays !== 1 ? 's' : ''}`;
                if (diffHours > 0) {
                    nextReservationString += ` ${diffHours} Hour${diffHours !== 1 ? 's' : ''}`;
                }
            } else if (diffHours > 0) {
                nextReservationString = `${diffHours} Hour${diffHours !== 1 ? 's' : ''}`;
                if (diffMins > 0) {
                    nextReservationString += ` ${diffMins} Minute${diffMins !== 1 ? 's' : ''}`;
                }
            } else {
                nextReservationString = `${diffMins} Minute${diffMins !== 1 ? 's' : ''}`;
            }
        }
    }

    const labArray = Array.from(uniqueLabs).map(name => {
        const parts = name.split(' ');
        return parts[parts.length - 1]; 
    });
    
    const subtext = labArray.length > 0 
        ? labArray.slice(0, 3).join(', ') + (labArray.length > 3 ? '...' : '') 
        : 'None';

    return [
        { 
            id: 0, 
            label: nextReservationLabel, 
            value: nextReservationString, 
            icon: '🔔', 
            isAlert: nextReservationTime !== null 
        },
        { 
            id: 1, 
            label: 'Total Lab Time', 
            value: labTimeString.trim(), 
            icon: '🕒' 
        },
        { 
            id: 2, 
            label: 'Unique Labs Used', 
            value: uniqueLabs.size.toString(), 
            subtext: subtext, 
            icon: '🖥️' 
        }
    ];
};

exports.getAvailabilityStats = async () => {
    const now = new Date();
    const currentDate = now.toLocaleDateString('en-CA', { timeZone: 'Asia/Manila' });
    const currentTime = now.toLocaleTimeString('en-GB', { timeZone: 'Asia/Manila', hour: '2-digit', minute: '2-digit' });

    const availableSlots = await Slot.find({
        isAvailable: true,
        $or: [
            { date: { $gt: currentDate } },
            { date: currentDate, endTime: { $gt: currentTime } }
        ]
    }).populate('lab');

    const availableRoomsSet = new Set();

    availableSlots.forEach(slot => {
        if (slot.lab) {
            availableRoomsSet.add(slot.lab._id.toString());
        }
    });

    const roomsAvailable = availableRoomsSet.size;

    /*
      Get the unique lab IDs that have at least one available slot,
      then fetch their total seat counts.
    */
    const uniqueLabIds = Array.from(availableRoomsSet);
    const labs = await Lab.find({ _id: { $in: uniqueLabIds } });

    const totalSeats = labs.reduce((sum, lab) => {
        const seatCount = Array.isArray(lab.seats) ? lab.seats.length : (lab.seats || 0);
        return sum + seatCount;
    }, 0);

    /*
      Count how many seats are already taken by active reservations
      whose slots are within the available slots we found.
    */
    const availableSlotIds = availableSlots.map(slot => slot._id);

    const activeReservations = await Reservation.find({
        status: "active",
        "slots.slot": { $in: availableSlotIds }
    });

    const takenSeatsCount = activeReservations.reduce((sum, reservation) => {
        return sum + reservation.slots.length;
    }, 0);

    const seatsAvailable = Math.max(0, totalSeats - takenSeatsCount);

    return { roomsAvailable, slotsAvailable: seatsAvailable };
};

exports.cancelNoShowReservation = async (reservationId, actor) => {
    if (!actor?.userId || actor.role !== "technician") {
        throw new Error("Only technicians can remove no-show reservations.");
    }

    const reservation = await Reservation.findById(reservationId).populate("slots.slot");

    if (!reservation) {
        throw new Error("Reservation not found");
    }

    if (reservation.status !== "active") {
        throw new Error("Only active reservations can be cancelled.");
    }

    const firstSlot = reservation.slots?.[0]?.slot;
    if (!firstSlot) {
        throw new Error("Reservation slot information is missing.");
    }

    if (!canCancelNoShow(firstSlot)) {
        const graceEndsAt = getNoShowDeadline(firstSlot);
        const slotEndsAt = getSlotEndDateTime(firstSlot);
        throw new Error(
            `No-show cancellation is only allowed after the first 10 minutes of the slot and before it ends. Grace period ends at ${graceEndsAt.toLocaleTimeString("en-PH", {
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
                timeZone: "Asia/Manila",
            })}, and the slot ends at ${slotEndsAt.toLocaleTimeString("en-PH", {
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
                timeZone: "Asia/Manila",
            })}.`
        );
    }

    reservation.status = "cancelled";
    await reservation.save();
    return reservation;
};

exports.updateReservationStatus = async (reservationId, nextStatus, actor) => {
    if (!actor?.userId || actor.role !== "technician") {
        throw new Error("Only technicians can update reservation statuses.");
    }

    if (!["active", "cancelled"].includes(nextStatus)) {
        throw new Error("Status must be either active or cancelled.");
    }

    const reservation = await Reservation.findById(reservationId).populate("slots.slot");

    if (!reservation) {
        throw new Error("Reservation not found");
    }

    if (reservation.status === "completed") {
        throw new Error("Completed reservations cannot be changed.");
    }

    if (reservation.status === nextStatus) {
        return reservation;
    }

    if (nextStatus === "active") {
        const requestedSlotId = reservation.slots?.[0]?.slot?._id || reservation.slots?.[0]?.slot;
        const requestedSeats = reservation.slots.map((slotEntry) => slotEntry.seat);

        const seatCollision = await Reservation.findOne({
            _id: { $ne: reservation._id },
            status: "active",
            slots: {
                $elemMatch: {
                    slot: requestedSlotId,
                    seat: { $in: requestedSeats },
                }
            }
        });

        if (seatCollision) {
            const takenSeats = seatCollision.slots
                .filter((slotEntry) =>
                    slotEntry.slot.toString() === requestedSlotId.toString() &&
                    requestedSeats.includes(slotEntry.seat)
                )
                .map((slotEntry) => slotEntry.seat);

            throw new Error(`Cannot uncancel reservation. Seat(s) ${takenSeats.join(", ")} are already taken.`);
        }
    }

    reservation.status = nextStatus;
    await reservation.save();
    return reservation;
};

exports.addSeats = async (reservationId, newSeatArray) => {
    const reservation = await Reservation.findById(reservationId);
    
    if (!reservation) {
        throw new Error("Reservation not found");
    }

    if (!Array.isArray(newSeatArray) || newSeatArray.length === 0) {
        throw new Error("Reservations must keep at least one seat.");
    }

    // Grab the Slot ID from the existing reservation
    const existingSlotId = reservation.slots[0].slot;

    // Convert the array of strings ["A1", "A2"] to mongoose format
    const updatedSlots = newSeatArray.map(seatLabel => ({
        slot: existingSlotId,
        seat: seatLabel
    }));

    // Overwrite list
    reservation.slots = updatedSlots;
    
    return await reservation.save();
};
