import { useState, useEffect } from "react";
import Slot from "../Slot/Slot";
import AddSlotForm from "../AddSlotForm/AddSlotForm";
import styles from "./RoomSlotsPanel.module.css";

const API_BASE = "http://localhost:3001/api";

async function safeJson(res) {
  const text = await res.text();
  const ct = res.headers.get("content-type") || "";
  if (!ct.includes("application/json")) return null;
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

export default function RoomSlotsPanel({
  lab,
  slots,
  selectedSlot,
  date,
  onSlotClick,
  onAddSlot,
}) {
  const [occupancies, setOccupancies] = useState({});

  useEffect(() => {
    if (!slots?.length) {
      setOccupancies({});
      return;
    }
    const fetchAll = async () => {
      const results = await Promise.all(
        slots.map(async (s) => {
          try {
            const res = await fetch(`${API_BASE}/slots/${s._id}/occupancy`);
            const data = await safeJson(res);
            const count = data
              ? Array.isArray(data)
                ? data.length
                : data.occupiedSeats?.length ?? 0
              : 0;
            return [s._id, count];
          } catch {
            return [s._id, 0];
          }
        })
      );
      setOccupancies(Object.fromEntries(results));
    };
    fetchAll();
  }, [slots]);

  const getStatus = (slot, occupied) => {
    if (!slot.isAvailable) return "blocked";
    const cap = lab?.seatCount || 0;
    if (cap === 0) return "available";
    const ratio = occupied / cap;
    if (ratio >= 1) return "full";
    if (ratio >= 0.75) return "almost-full";
    return "available";
  };

  if (!lab) return null;

  const labLabel = lab.location ? `${lab.location} - ${lab.name}` : lab.name;

  return (
    <div className={styles.panel}>
      <h3>Time Slots</h3>
      <div className={styles.roomLabel}>{labLabel}</div>
      <div className={styles.dateHint}>
        {date ? `For date: ${date}` : "Select a date to add slots"}
      </div>

      <div className={styles.slotsGrid}>
        {slots.length === 0 ? (
          <p className={styles.emptyState}>No time slots yet. Add one below.</p>
        ) : (
          slots.map((slot) => {
            const occupied = occupancies[slot._id] ?? 0;
            const capacity = lab.seatCount || 0;
            const status = getStatus(slot, occupied);
            const capacityStr = `${occupied}/${capacity}`;
            const timeStr = `${slot.startTime || ""} - ${slot.endTime || ""}`.trim();

            return (
              <Slot
                key={slot._id}
                time={timeStr}
                status={status}
                isBlocked={!slot.isAvailable}
                capacity={capacityStr}
                onClick={() => onSlotClick(slot)}
              />
            );
          })
        )}
      </div>

      <AddSlotForm
        onAddSlot={onAddSlot}
        disabled={!date}
      />
    </div>
  );
}
