import styles from "./Panel.module.css";

export default function Panel({ selectedSlot, onOpenStudentSelector, removeStudent, onBack, user}) {
  const { room, slot } = selectedSlot;
  console.log("Panel user:", user);
  return (
    <div className={styles.panel}>
      <button onClick={onBack}>Back</button>
      <h2>{room.name}</h2>
      <p>{slot.time}</p>

      
        <button 
          onClick={onOpenStudentSelector} 
          className={styles.addStudentBtn}
        >
          + Add Student to Slot
        </button>
      

      <div className={styles.studentList}>
        {slot.students && slot.students.map((student) => (
          <div key={student.seat} className={styles.studentRow}>
            <span>{student.name} - Seat: {student.seat}</span>
            
              <button onClick={() => removeStudent(student._id, student.reservationId)}>
                Remove
              </button>
            
          </div>
        ))}
      </div>
    </div>
  );
}