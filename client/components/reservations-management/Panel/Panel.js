import styles from "./Panel.module.css";

export default function Panel({
  selectedSlot,
  onOpenStudentSelector,
  onEditReservation,
  removeStudent,
  onBack,
}) {
  const { room, slot } = selectedSlot;

  const noShowEligibleLabel = slot.noShowEligibleAt
    ? new Date(slot.noShowEligibleAt).toLocaleTimeString("en-PH", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      })
    : null;

  const noShowCutoffLabel = slot.noShowCutoffAt
    ? new Date(slot.noShowCutoffAt).toLocaleTimeString("en-PH", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      })
    : null;

  return (
    <div className={styles.panel}>
      <button className={styles.backBtn} onClick={onBack}>Back</button>
      <h2>{room.name}</h2>
      <p>{slot.time}</p>

      
        <button 
          onClick={onOpenStudentSelector} 
          className={styles.addStudentBtn}
        >
          + Add Student to Slot
        </button>
      
      <p className={styles.noShowHint}>
        Students have a 10-minute grace period to show up. Technicians can mark a reservation as no-show only after that grace period and before the slot ends.
        {noShowEligibleLabel ? ` Grace period ends at ${noShowEligibleLabel}.` : ""}
        {noShowCutoffLabel ? ` Cutoff is ${noShowCutoffLabel}.` : ""}
      </p>

      <div className={styles.studentList}>
        {slot.students && slot.students.map((student) => (
          <div key={student.reservationId} className={styles.studentRow}>
            <div className={styles.studentInfo}>
              <span className={styles.studentNameText}>{student.name}</span>
              <span className={styles.studentSeatText}>
                Seat{student.seats?.length > 1 ? "s" : ""}: {student.seatNumber}
              </span>
            </div>

            <div className={styles.studentActions}>
              <button
                className={styles.editStudentBtn}
                onClick={() => onEditReservation(student)}
              >
                Edit
              </button>
              <button
                className={styles.removeBtn}
                onClick={() => removeStudent(student.reservationId)}
                disabled={!slot.canCancelNoShow}
                title={
                  slot.canCancelNoShow
                    ? "Cancel entire reservation as no-show"
                    : "No-show cancellation is only allowed after the 10-minute grace period and before the slot ends"
                }
              >
                Mark No-Show
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
