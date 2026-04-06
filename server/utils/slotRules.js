const SLOT_INTERVAL_MINUTES = 30;
const NO_SHOW_GRACE_MINUTES = 10;
const TIME_PATTERN = /^([01]\d|2[0-3]):(00|30)$/;
const MANILA_TIME_ZONE = "Asia/Manila";

function parseTimeToMinutes(time) {
    if (!TIME_PATTERN.test(time)) {
        throw new Error("Slot times must use 30-minute intervals in HH:MM format.");
    }

    const [hour, minute] = time.split(":").map(Number);
    return hour * 60 + minute;
}

function getNormalizedEndMinutes(startMinutes, endMinutes) {
    return endMinutes <= startMinutes ? endMinutes + 24 * 60 : endMinutes;
}

function validateThirtyMinuteSlot(startTime, endTime) {
    const startMinutes = parseTimeToMinutes(startTime);
    const endMinutes = parseTimeToMinutes(endTime);
    const normalizedEndMinutes = getNormalizedEndMinutes(startMinutes, endMinutes);

    if (normalizedEndMinutes - startMinutes !== SLOT_INTERVAL_MINUTES) {
        throw new Error("Slots must be exactly 30 minutes long.");
    }

    return { startMinutes, endMinutes, normalizedEndMinutes };
}

function buildSlotDateTime(slotDate, slotTime) {
    return new Date(`${slotDate}T${slotTime}:00+08:00`);
}

function getCurrentManilaDateTimeParts(now = new Date()) {
    const formatter = new Intl.DateTimeFormat("en-CA", {
        timeZone: MANILA_TIME_ZONE,
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
    });

    const parts = formatter.formatToParts(now);
    const get = (type) => parts.find((part) => part.type === type)?.value;

    return {
        currentDate: `${get("year")}-${get("month")}-${get("day")}`,
        currentTime: `${get("hour")}:${get("minute")}`,
        currentMinutes: Number(get("hour")) * 60 + Number(get("minute")),
    };
}

function getNoShowDeadline(slot) {
    const slotStart = buildSlotDateTime(slot.date, slot.startTime);
    return new Date(slotStart.getTime() + NO_SHOW_GRACE_MINUTES * 60 * 1000);
}

function getSlotEndDateTime(slot) {
    const slotStart = buildSlotDateTime(slot.date, slot.startTime);
    const slotEnd = buildSlotDateTime(slot.date, slot.endTime);

    if (slotEnd <= slotStart) {
        return new Date(slotEnd.getTime() + 24 * 60 * 60 * 1000);
    }

    return slotEnd;
}

function canCancelNoShow(slot, now = new Date()) {
    const deadline = getNoShowDeadline(slot);
    const slotEnd = getSlotEndDateTime(slot);
    return now >= deadline && now < slotEnd;
}

module.exports = {
    SLOT_INTERVAL_MINUTES,
    NO_SHOW_GRACE_MINUTES,
    MANILA_TIME_ZONE,
    validateThirtyMinuteSlot,
    parseTimeToMinutes,
    getNormalizedEndMinutes,
    buildSlotDateTime,
    getCurrentManilaDateTimeParts,
    getNoShowDeadline,
    getSlotEndDateTime,
    canCancelNoShow,
};
