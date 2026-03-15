import { useState } from "react";
import styles from "./AddSlotForm.module.css";

export default function AddSlotForm({ onAddSlot, disabled }) {
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!startTime || !endTime) return;
    onAddSlot(startTime.trim(), endTime.trim());
    setStartTime("");
    setEndTime("");
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.inputGroup}>
        <label className={styles.label}>Start time</label>
        <input
          type="text"
          placeholder="e.g. 09:00"
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
          className={styles.input}
          disabled={disabled}
        />
      </div>
      <div className={styles.inputGroup}>
        <label className={styles.label}>End time</label>
        <input
          type="text"
          placeholder="e.g. 11:00"
          value={endTime}
          onChange={(e) => setEndTime(e.target.value)}
          className={styles.input}
          disabled={disabled}
        />
      </div>
      <button type="submit" className={styles.submitBtn} disabled={disabled}>
        Add Time Slot
      </button>
    </form>
  );
}
