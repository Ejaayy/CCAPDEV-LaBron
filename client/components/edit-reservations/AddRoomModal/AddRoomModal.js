import { useState } from "react";
import styles from "./AddRoomModal.module.css";

export default function AddRoomModal({ isOpen, onClose, onAddRoom }) {
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [seatCount, setSeatCount] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const count = parseInt(seatCount, 10);
    if (!name || !count || count < 1) return;
    onAddRoom({ name, location: location || "", seatCount: count });
    setName("");
    setLocation("");
    setSeatCount("");
    onClose();
  };

  const handleClose = () => {
    setName("");
    setLocation("");
    setSeatCount("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={handleClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h3>Add New Room</h3>
          <button className={styles.closeBtn} onClick={handleClose}>
            ×
          </button>
        </div>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <label className={styles.label}>Room name *</label>
            <input
              type="text"
              placeholder="e.g. G302B"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={styles.input}
              required
            />
          </div>
          <div className={styles.inputGroup}>
            <label className={styles.label}>Location</label>
            <input
              type="text"
              placeholder="e.g. Gokongwei, Yuchengco"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className={styles.input}
            />
          </div>
          <div className={styles.inputGroup}>
            <label className={styles.label}>Seat count *</label>
            <input
              type="number"
              min="1"
              placeholder="e.g. 30"
              value={seatCount}
              onChange={(e) => setSeatCount(e.target.value)}
              className={styles.input}
              required
            />
          </div>
          <div className={styles.actions}>
            <button type="button" className={styles.cancelBtn} onClick={handleClose}>
              Cancel
            </button>
            <button type="submit" className={styles.submitBtn}>
              Add Room
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
