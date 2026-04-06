import { useState } from "react";
import styles from "./AddSlotForm.module.css";

function getCurrentManilaDateTime() {
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Manila",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  const parts = formatter.formatToParts(new Date());
  const get = (type) => parts.find((part) => part.type === type)?.value;

  return {
    currentDate: `${get("year")}-${get("month")}-${get("day")}`,
    currentMinutes: Number(get("hour")) * 60 + Number(get("minute")),
  };
}

function timeToMinutes(value) {
  const [hours, minutes] = value.split(":").map(Number);
  return hours * 60 + minutes;
}

export default function AddSlotForm({ onAddSlot, disabled, date }) {
  const [startTime, setStartTime] = useState("");
  const [error, setError] = useState("");

  const computedEndTime = startTime
    ? (() => {
        const [hours, minutes] = startTime.split(":").map(Number);
        const totalMinutes = hours * 60 + minutes + 30;
        const endHours = Math.floor(totalMinutes / 60) % 24;
        const endMinutes = totalMinutes % 60;
        return `${String(endHours).padStart(2, "0")}:${String(endMinutes).padStart(2, "0")}`;
      })()
    : "";

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!startTime || !computedEndTime) return;

    const { currentDate, currentMinutes } = getCurrentManilaDateTime();

    if (date && date < currentDate) {
      setError("You cannot add a time slot to a past date.");
      return;
    }

    if (date === currentDate && timeToMinutes(startTime) < currentMinutes) {
      setError("You cannot add a time slot earlier than the current time for today.");
      return;
    }

    setError("");

    onAddSlot({
      startTime: startTime.trim(),
      endTime: computedEndTime,
    });

    setStartTime("");
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.inputGroup}>
        <label className={styles.label}>Start time</label>
        <input
          type="time"
          value={startTime}
          onChange={(e) => {
            setStartTime(e.target.value);
            if (error) {
              setError("");
            }
          }}
          className={styles.input}
          disabled={disabled}
          step="1800"
        />
      </div>

      <div className={styles.inputGroup}>
        <label className={styles.label}>End time</label>
        <input
          type="time"
          value={computedEndTime}
          className={styles.input}
          disabled
        />
      </div>

      <p className={styles.hint}>Each slot is exactly 30 minutes. Start times must be on :00 or :30.</p>
      {error && <p className={styles.hint} style={{ color: "#f87171" }}>{error}</p>}

      <button type="submit" className={styles.submitBtn} disabled={disabled}>
        Add Time Slot
      </button>
    </form>
  );
}
