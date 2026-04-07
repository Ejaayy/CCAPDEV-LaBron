import styles from "./LabCard.module.css";

export default function LabCard({ lab, isSelected, onClick, onEdit, onDelete }) {
  const displayLabel = lab.location
    ? `${lab.location} - ${lab.name}`
    : lab.name;

  return (
    <div
      className={`${styles.labCard} ${isSelected ? styles.selected : ""}`}
      onClick={onClick}
    >
      <div className={styles.headerRow}>
        <div className={styles.labLabel}>{displayLabel}</div>
        <div className={styles.actions}>
          <button
            type="button"
            className={styles.editBtn}
            onClick={(e) => {
              e.stopPropagation();
              onEdit?.(lab);
            }}
          >
            Edit
          </button>
          <button
            type="button"
            className={styles.deleteBtn}
            onClick={(e) => {
              e.stopPropagation();
              onDelete?.(lab);
            }}
          >
            Delete
          </button>
        </div>
      </div>
      <div className={styles.capacity}>Capacity: {lab.seatCount || 0}</div>
    </div>
  );
}
