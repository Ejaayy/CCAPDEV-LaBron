const SLOT_INTERVAL_MINUTES = 30;
const NO_SHOW_GRACE_MINUTES = 10;
const TIME_PATTERN = /^([01]\d|2[0-3]):(00|30)$/;

function parseTimeToMinutes(time) {
    if (!TIME_PATTERN.test(time)) {
        throw new Error("Slot times must use 30-minute intervals in HH:MM format.");
    }

    const [hour, minute] = time.split(":").map(Number);
    return hour * 60 + minute;
}

function validateThirtyMinuteSlot(startTime, endTime) {
    const startMinutes = parseTimeToMinutes(startTime);
    const endMinutes = parseTimeToMinutes(endTime);

    if (endMinutes - startMinutes !== SLOT_INTERVAL_MINUTES) {
        throw new Error("Slots must be exactly 30 minutes long.");
    }

    return { startMinutes, endMinutes };
}

function buildSlotDateTime(slotDate, slotTime) {
    return new Date(`${slotDate}T${slotTime}:00+08:00`);
}

function getNoShowDeadline(slot) {
    const slotStart = buildSlotDateTime(slot.date, slot.startTime);
    return new Date(slotStart.getTime() + NO_SHOW_GRACE_MINUTES * 60 * 1000);
}

function canCancelNoShow(slot, now = new Date()) {
    const slotStart = buildSlotDateTime(slot.date, slot.startTime);
    const deadline = getNoShowDeadline(slot);
    return now >= slotStart && now <= deadline;
}

module.exports = {
    SLOT_INTERVAL_MINUTES,
    NO_SHOW_GRACE_MINUTES,
    validateThirtyMinuteSlot,
    parseTimeToMinutes,
    buildSlotDateTime,
    getNoShowDeadline,
    canCancelNoShow,
};
