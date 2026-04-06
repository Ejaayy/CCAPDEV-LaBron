import { useMemo, useState } from "react";
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

function minutesToTimeLabel(totalMinutes) {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
}

function roundUpToNextHalfHour(totalMinutes) {
  return Math.ceil(totalMinutes / 30) * 30;
}

export default function AddSlotForm({ onAddSlot, disabled, date }) {
  const [startTime, setStartTime] = useState("");
  const [error, setError] = useState("");

  const { currentDate, currentMinutes } = getCurrentManilaDateTime();

  const timeOptions = useMemo(() => {
    let earliestMinutes = 0;
    const latestStartMinutes = 23 * 60 + 30;

    if (date === currentDate) {
      earliestMinutes = roundUpToNextHalfHour(currentMinutes);
    }

    const options = [];
    for (let minutes = earliestMinutes; minutes <= latestStartMinutes; minutes += 30) {
      options.push(minutesToTimeLabel(minutes));
    }
    return options;
  }, [date, currentDate, currentMinutes]);

  const computedEndTime = startTime
    ? minutesToTimeLabel(
        (Number(startTime.slice(0, 2)) * 60 + Number(startTime.slice(3, 5)) + 30) % (24 * 60)
      )
    : "";

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!startTime || !computedEndTime) return;

    if (date && date < currentDate) {
      setError("You cannot add a time slot to a past date.");
      return;
    }

    if (date === currentDate && !timeOptions.includes(startTime)) {
      setError("Please select a future 30-minute start time for today.");
      return;
    }

    try {
      setError("");
      await onAddSlot({
        startTime,
        endTime: computedEndTime,
      });
      setStartTime("");
    } catch (err) {
      setError(err.message || "Failed to add time slot.");
    }
  };

  const noTimeOptions = date === currentDate && timeOptions.length === 0;

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.inputGroup}>
        <label className={styles.label}>Start time</label>
        <select
          value={startTime}
          onChange={(e) => {
            setStartTime(e.target.value);
            if (error) setError("");
          }}
          className={styles.input}
          disabled={disabled || noTimeOptions}
        >
          <option value="">Select a time</option>
          {timeOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>

      <div className={styles.inputGroup}>
        <label className={styles.label}>End time</label>
        <input
          type="text"
          value={computedEndTime}
          className={styles.input}
          disabled
          placeholder="Auto-generated"
        />
      </div>

      <p className={styles.hint}>
        Each slot is exactly 30 minutes. Start times are limited to :00 and :30 only.
      </p>
      {noTimeOptions && (
        <p className={styles.hint} style={{ color: "#f87171" }}>
          There are no valid 30-minute slots left for today.
        </p>
      )}
      {error && (
        <p className={styles.hint} style={{ color: "#f87171" }}>
          {error}
        </p>
      )}

      <button type="submit" className={styles.submitBtn} disabled={disabled || noTimeOptions}>
        Add Time Slot
      </button>
    </form>
  );
}
