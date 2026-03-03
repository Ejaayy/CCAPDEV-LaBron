import { useState } from "react";
import styles from "./Panel.module.css";
import { FaPen } from 'react-icons/fa';

export default function Panel({ selectedSlot, addStudent, removeStudent, onToggleBlock, onEditStudent }) {
  const [studentName, setStudentName] = useState("");
  const [studentSeat, setStudentSeat] = useState("");
  const [editingStudent, setEditingStudent] = useState(null);
  const [editName, setEditName] = useState("");
  const [editSeat, setEditSeat] = useState("");

  if (!selectedSlot)
    return <div className={styles.panel}>Select a slot</div>;

  const handleAdd = () => {
    if (!studentName) return;
    addStudent({ name: studentName, seat: studentSeat || "Unassigned" });
    setStudentName("");
    setStudentSeat("");
  };

  const handleEditClick = (student, index) => {
    setEditingStudent(index);
    setEditName(typeof student === 'string' ? student : student.name);
    setEditSeat(typeof student === 'string' ? '' : student.seat || '');
  };

  const handleSaveEdit = (index) => {
    if (onEditStudent) {
      onEditStudent(index, { name: editName, seat: editSeat });
    }
    setEditingStudent(null);
    setEditName("");
    setEditSeat("");
  };

  const handleCancelEdit = () => {
    setEditingStudent(null);
    setEditName("");
    setEditSeat("");
  };

  const isBlocked = selectedSlot.slot.isBlocked || selectedSlot.slot.status === 'blocked';

  // Helper to get student display name
  const getStudentName = (student) => typeof student === 'string' ? student : student.name;
  const getStudentSeat = (student) => typeof student === 'string' ? 'N/A' : (student.seat || 'N/A');

  return (
    <div className={styles.panel}>
      <h3>Selected Slot</h3>

      <div className={styles.panelSection}>
        <div className={styles.panelLabel}>Room</div>
        {selectedSlot.room.name}
      </div>

      <div className={styles.panelSection}>
        <div className={styles.panelLabel}>Time</div>
        {selectedSlot.slot.time}
      </div>

      <div className={styles.panelSection}>
        <div className={styles.panelLabel}>Status</div>
        <span className={isBlocked ? styles.blockedStatus : styles.openStatus}>
          {isBlocked ? 'Blocked' : 'Open'}
        </span>
      </div>

      {/* Block/Unblock Button */}
      <div className={styles.panelSection}>
        <button 
          className={isBlocked ? styles.unblockBtn : styles.blockBtn} 
          onClick={onToggleBlock}
        >
          {isBlocked ? 'Unblock Slot' : 'Block Slot'}
        </button>
        <p className={styles.blockHint}>
          {isBlocked 
            ? 'This slot is closed for reservations. Click to re-open.' 
            : 'Block this slot to prevent new reservations.'}
        </p>
      </div>

      {!isBlocked && (
        <>
          <div className={styles.panelSection}>
            <div className={styles.panelLabel}>Students Reserved</div>
            {selectedSlot.slot.students.map((student, i) => (
              <div key={i} className={styles.studentItem}>
                {editingStudent === i ? (
                  <div className={styles.editStudentForm}>
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      placeholder="Student name"
                      className={styles.editInput}
                    />
                    <input
                      type="text"
                      value={editSeat}
                      onChange={(e) => setEditSeat(e.target.value)}
                      placeholder="Seat number"
                      className={styles.editInput}
                    />
                    <div className={styles.editBtnGroup}>
                      <button className={styles.saveBtn} onClick={() => handleSaveEdit(i)}>✔️</button>
                      <button className={styles.cancelBtn} onClick={handleCancelEdit}>✖️</button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className={styles.studentInfo}>
                      <span className={styles.studentNameText}>{getStudentName(student)}</span>
                      <span className={styles.studentSeatText}>Seat: {getStudentSeat(student)}</span>
                    </div>
                    <div className={styles.studentActions}>
                      <button
                        className={styles.editStudentBtn}
                        onClick={() => handleEditClick(student, i)}
                        title="Edit student"
                      >
                        <FaPen/>
                      </button>
                      <button
                        className={styles.removeBtn}
                        onClick={() => removeStudent(typeof student === 'string' ? student : student.name)}
                        title="Remove student"
                      >
                        X
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>

          <div className={styles.panelSection}>
            <input
              type="text"
              placeholder="Student name"
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
              className={styles.addStudentInput}
            />
            <input
              type="text"
              placeholder="Seat number (optional)"
              value={studentSeat}
              onChange={(e) => setStudentSeat(e.target.value)}
              className={styles.addStudentInput}
              style={{ marginTop: '8px' }}
            />
            <button className={styles.addBtn} onClick={handleAdd}>
              Add Student
            </button>
          </div>
        </>
      )}
    </div>
  );
}
