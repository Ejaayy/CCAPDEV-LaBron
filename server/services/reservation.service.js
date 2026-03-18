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

const formatTime12h = (time24) => {
    if (!time24) return "N/A";
    const [hour, minute] = time24.split(':');
    const h = parseInt(hour, 10);
    const ampm = h >= 12 ? 'PM' : 'AM';
    const h12 = h % 12 || 12;
    return `${h12.toString().padStart(2, '0')}:${minute} ${ampm}`;
};

exports.getUserReservations = async (userId) => {
    const reservations = await Reservation.find({ status: { $in: ["active", "completed"] }, reservedFor: userId }).populate(
        {path: 'slots.slot',
        populate: {
            path: 'lab',
            model: 'Lab'
        }
    });

    return reservations.map(res => {
        const firstSlotEntry = res.slots[0]; 
        const slotInfo = firstSlotEntry ? firstSlotEntry.slot : null;
        const labInfo = slotInfo ? slotInfo.lab : null;

        const combinedSeats = res.slots.map(s => s.seat).join(", ");

        const reqDate = new Date(res.createdAt);
        const reqDateFormatted = reqDate.toLocaleString('en-US', {
            month: 'long', day: '2-digit', year: 'numeric',
            hour: '2-digit', minute: '2-digit', hour12: true
        }).replace(' at ', ' '); 

        let resDateFormatted = "N/A";
        if (slotInfo && slotInfo.date) {
            const [year, month, day] = slotInfo.date.split('-');
            const d = new Date(year, month - 1, day);
            resDateFormatted = d.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
        }

        return {
            id: res._id.toString(), 
            laboratory: labInfo ? labInfo.name : "Unknown Lab",
            seatNumber: combinedSeats || "N/A", 
            reservationTime: slotInfo ? `${formatTime12h(slotInfo.startTime)} - ${formatTime12h(slotInfo.endTime)}` : "N/A",
            requestDateTime: reqDateFormatted,
            rawDate: slotInfo ? slotInfo.date : null 
        };
    });
};

exports.getUserStats = async (userId) => {
    const reservations = await Reservation.find({ status: "completed" , reservedFor: userId }).populate({
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
            const [startHour, startMinute] = slotInfo.startTime.split(':').map(Number);
            const [endHour, endMinute] = slotInfo.endTime.split(':').map(Number);
            totalMinutes += ((endHour * 60 + endMinute) - (startHour * 60 + startMinute));

            if (labInfo) {
                uniqueLabs.add(labInfo.name);
            }

            const reservationDateTime = new Date(`${slotInfo.date}T${slotInfo.startTime}:00`);
            if (reservationDateTime > now) {
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