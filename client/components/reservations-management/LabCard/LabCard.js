import styles from "./LabCard.module.css";

export default function LabCard({ lab, isSelected, onClick }) {
  const displayLabel = lab.location
    ? `${lab.location} - ${lab.name}`
    : lab.name;

  return (
    <div
      className={`${styles.labCard} ${isSelected ? styles.selected : ""}`}
      onClick={onClick}
    >
      <div className={styles.labLabel}>{displayLabel}</div>
      <div className={styles.capacity}>Capacity: {lab.seatCount || 0}</div>
    </div>
  );
}
