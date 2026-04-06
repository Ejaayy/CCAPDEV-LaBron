import { useState } from "react";
import styles from "./AddRoomModal.module.css";

const MAX_SEAT_COUNT = 45;
const LOCATION_PATTERN = /^[A-Za-z][A-Za-z\s'-]* Building \d+(st|nd|rd|th) Floor$/;
const ROOM_CODE_PATTERN = /^[A-Z]\d{3}[A-Z]?$/;

function normalizeText(value) {
  return value.trim().replace(/\s+/g, " ");
}

function getBuildingNameFromLocation(location) {
  const match = location.match(/^(.*) Building \d+(st|nd|rd|th) Floor$/);
  return match ? match[1].trim() : "";
}

function validateRoomForm({ name, location, seatCount }) {
  const normalizedName = normalizeText(name);
  const normalizedLocation = normalizeText(location);
  const numericSeatCount = Number(seatCount);

  if (!normalizedName || !normalizedLocation || !numericSeatCount) {
    return "Room name, location, and seat count are required.";
  }

  if (!LOCATION_PATTERN.test(normalizedLocation)) {
    return 'Location must follow "Building Name Building 5th Floor" format.';
  }

  const buildingName = getBuildingNameFromLocation(normalizedLocation);
  const expectedPrefix = `${buildingName} Computer Lab `;

  if (!normalizedName.startsWith(expectedPrefix)) {
    return `Room name must start with "${expectedPrefix}"`;
  }

  const roomCode = normalizedName.slice(expectedPrefix.length).trim();
  if (!ROOM_CODE_PATTERN.test(roomCode)) {
    return 'Room code must follow DLSU-style format like "G304" or "Y302C".';
  }

  if (!Number.isInteger(numericSeatCount) || numericSeatCount < 1) {
    return "Seat count must be a whole number greater than 0.";
  }

  if (numericSeatCount > MAX_SEAT_COUNT) {
    return `Seat count cannot be more than ${MAX_SEAT_COUNT}.`;
  }

  return null;
}

export default function AddRoomModal({ isOpen, onClose, onAddRoom }) {
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [seatCount, setSeatCount] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    const validationError = validateRoomForm({ name, location, seatCount });
    if (validationError) {
      setError(validationError);
      return;
    }

    const count = parseInt(seatCount, 10);
    const normalizedName = normalizeText(name);
    const normalizedLocation = normalizeText(location);

    try {
      setIsSubmitting(true);
      setError("");
      await onAddRoom({
        name: normalizedName,
        location: normalizedLocation,
        seatCount: count,
      });
      setName("");
      setLocation("");
      setSeatCount("");
      onClose();
    } catch (err) {
      setError(err.message || "Failed to add room.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (isSubmitting) return;
    setName("");
    setLocation("");
    setSeatCount("");
    setError("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={handleClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h3>Add New Room</h3>
          <button className={styles.closeBtn} onClick={handleClose}>
            &times;
          </button>
        </div>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <label className={styles.label}>Room name *</label>
            <input
              type="text"
              placeholder="e.g. Gokongwei Computer Lab G304"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={styles.input}
              disabled={isSubmitting}
              required
            />
            <span className={styles.helperText}>
              Format: Building Name + Computer Lab + room code. Example: Gokongwei Computer Lab G304
            </span>
          </div>
          <div className={styles.inputGroup}>
            <label className={styles.label}>Location *</label>
            <input
              type="text"
              placeholder="e.g. Gokongwei Building 5th Floor"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className={styles.input}
              disabled={isSubmitting}
              required
            />
            <span className={styles.helperText}>
              Format: Building Name + Building + floor. Example: Gokongwei Building 5th Floor
            </span>
          </div>
          <div className={styles.inputGroup}>
            <label className={styles.label}>Seat count *</label>
            <input
              type="number"
              min="1"
              max={MAX_SEAT_COUNT}
              placeholder="e.g. 30"
              value={seatCount}
              onChange={(e) => setSeatCount(e.target.value)}
              className={styles.input}
              disabled={isSubmitting}
              required
            />
            <span className={styles.helperText}>Maximum: {MAX_SEAT_COUNT}</span>
          </div>
          {error && <div className={styles.errorText}>{error}</div>}
          <div className={styles.actions}>
            <button type="button" className={styles.cancelBtn} onClick={handleClose} disabled={isSubmitting}>
              Cancel
            </button>
            <button type="submit" className={styles.submitBtn} disabled={isSubmitting}>
              {isSubmitting ? "Adding..." : "Add Room"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
