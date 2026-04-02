import Slot from "../Slot/Slot";
import styles from "./RoomCard.module.css";

export default function RoomCard({ room, onSlotClick }) {
  return (
    <div className={styles.roomCard}>
      <div className={styles.roomHeader}>
        <div className={styles.roomName}>{room.name}</div>
        <div className={styles.capacity}>Capacity: {room.capacity}</div>
      </div>
      <div className={styles.slots}>
        {room.slots.map((slot, i) => (
          <Slot
            key={i}
            time={slot.time}
            status={slot.status}
            isBlocked={slot.isBlocked}
            onClick={() => onSlotClick(room, slot)}
          />
        ))}
      </div>
    </div>
  );
}
