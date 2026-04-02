import styles from "./Panel.module.css";

export default function Panel({ selectedSlot, onOpenStudentSelector, removeStudent, onBack }) {
  const { room, slot } = selectedSlot;

  const noShowDeadlineLabel = slot.noShowWindowEndsAt
    ? new Date(slot.noShowWindowEndsAt).toLocaleTimeString("en-PH", {
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
        Technicians can mark students as no-show only within 10 minutes after the slot starts.
        {noShowDeadlineLabel ? ` Window ends at ${noShowDeadlineLabel}.` : ""}
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
                    : "No-show cancellation is only allowed in the first 10 minutes of the slot"
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
