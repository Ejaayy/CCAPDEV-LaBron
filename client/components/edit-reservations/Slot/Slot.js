import styles from "./Slot.module.css";

export default function Slot({ time, status, isBlocked, onClick }) {
  let className = styles.slot;

  if (isBlocked || status === "blocked") {
    className += ` ${styles.blocked}`;
  } else if (status === "available") {
    className += ` ${styles.available}`;
  } else if (status === "almost-full") {
    className += ` ${styles.almostFull}`;
  } else {
    className += ` ${styles.full}`;
  }

  return (
    <div className={className} onClick={onClick}>
      {isBlocked || status === "blocked" ? " " : ""}{time}
    </div>
  );
}
