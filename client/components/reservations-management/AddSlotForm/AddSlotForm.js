import { useState } from "react";
import styles from "./AddSlotForm.module.css";

export default function AddSlotForm({ onAddSlot, disabled }) {
  const [startTime, setStartTime] = useState("");

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
          onChange={(e) => setStartTime(e.target.value)}
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

      <button type="submit" className={styles.submitBtn} disabled={disabled}>
        Add Time Slot
      </button>
    </form>
  );
}
