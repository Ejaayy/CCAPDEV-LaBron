import styles from "./ReservationCard.module.css";

export default function ReservationCard({ reservation, onEdit }) {
  
  const statusStyles = {
    active: styles.confirmed,
    ongoing: styles.ongoing,
    cancelled: styles.failed,
    completed: styles.completed,
  };

  const { 
    laboratory, 
    status, 
    rawDate,          
    requestDateTime,   
    reservationTime, 
    seatNumber       
  } = reservation;

  const isEditable = status === "active";

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
          <span className={styles.label}>Requested On:</span> {requestDateTime}
        </div>
        <div className={styles.infoRow}>
          <span className={styles.label}>Reservation Date:</span> {rawDate}
        </div>
        <div className={styles.infoRow}>
          <span className={styles.label}>Time:</span> {reservationTime}
        </div>
        <div className={styles.infoRow}>
          <span className={styles.label}>Seat Number:</span> {seatNumber}
        </div>
      </div>


      <div className={styles.cardFooter}>
        {isEditable && (
          <button className={styles.editBtn} onClick={onEdit}>
            Edit Reservation
          </button>
        )}
      </div>
    </div>
  );
}