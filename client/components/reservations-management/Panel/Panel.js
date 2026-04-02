import styles from "./Panel.module.css";

export default function Panel({ selectedSlot, onOpenStudentSelector, removeStudent, onBack }) {
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
          <div key={student.seat} className={styles.studentRow}>
            <span>{student.name} - Seat: {student.seat}</span>
            
              <button
                className={styles.removeBtn}
                onClick={() => removeStudent(student.studentId, student.reservationId)}
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
        ))}
      </div>
    </div>
  );
}
