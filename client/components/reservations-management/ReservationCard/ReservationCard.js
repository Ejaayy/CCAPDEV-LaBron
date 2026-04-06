import styles from "./ReservationCard.module.css";

export default function ReservationCard({ reservation, onEdit }) {
  
  const statusStyles = {
  active: styles.confirmed,
  ongoing: styles.ongoing,
  cancelled: styles.failed,
  completed: styles.completed,
  Confirmed: styles.confirmed 
  };

  const { 
    laboratory, 
    status, 
    rawDate,          
    requestDateTime,   
    reservationTime, 
    seatNumber       
  } = reservation;

  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <div className={styles.roomName}>{laboratory || "Laboratory"}</div>
        <div className={`${styles.status} ${statusStyles[status] || styles.failed}`}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </div>
      </div>

      <div className={styles.cardBody}>
        <div className={styles.infoRow}>
          <span className={styles.label}>Requested On:</span> {requestDateTime || "N/A"}
        </div>
        <div className={styles.infoRow}>
          <span className={styles.label}>Reservation Date:</span> {rawDate || "N/A"}
        </div>
        <div className={styles.infoRow}>
          <span className={styles.label}>Time:</span> {reservationTime || "N/A"}
        </div>
        <div className={styles.infoRow}>
          <span className={styles.label}>Seat Number:</span> {seatNumber || "N/A"}
        </div>
      </div>

      <div className={styles.cardFooter}>
        <button className={styles.editBtn} onClick={onEdit}>
          Edit Reservation
        </button>
      </div>
    </div>
  );
}