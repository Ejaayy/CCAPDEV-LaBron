import styles from "@/styles/SelectStudents.module.css";

//Next.js components/hooks for navigation
import Link from "next/link";
import { useRouter } from "next/router";

// React hook for managing local state
import { useState } from "react";

import { useStudents } from "@/hooks/useUsers"; // Custom hook to fetch all students from backend
import { API_BASE_URL } from "@/constants/api"; // API base URL constant

/*
  SelectStudent Component

  Purpose:
    - Display a searchable list of students (excluding the current user)
    - Allow adding a student to a slot (if showAddButton is true and not on the home page)
    - Provide a link to view each student's profile

  Props:
    - currentUserId: ID of the logged-in user (to exclude from the list)
    - onSelectStudent: callback function when user selects a student
    - showAddButton: whether to show the "Add to Slot" button
*/
const SelectStudent = ({ currentUserId, onSelectStudent, showAddButton = true }) => {
  const router = useRouter();
  const isHomePage = router.pathname === "/home" || router.pathname === "/home-tech";

  const [searchTerm, setSearchTerm] = useState("");
  const { students, loading } = useStudents();

  
  //Filter students based on search input
  const filteredStudents = students.filter((student) => {
    if (student._id === currentUserId) return false;

    const fullName = `${student.firstName} ${student.lastName}`.toLowerCase();
    return fullName.includes(searchTerm.toLowerCase());
  });

return (
    <div className={`${styles.container} ${isHomePage ? styles.containerLight : ""}`}>
      <div className={styles.header}>
        <h2 className={styles.title}>Select Student</h2>
        <div className={styles.searchBar}>
          <input
            type="text"
            placeholder="Search students..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
        </div>
      </div>

      {loading ? (
        <p className={styles.loadingStudent}>Loading students...</p>
      ) : (
        <div className={styles.carouselWrapper}>
          <button className={styles.arrowBtn}>&#10094;</button>

          <div className={styles.studentList}>
            {filteredStudents.length > 0 ? (
              filteredStudents.map((student) => (
                <div key={student._id} className={styles.studentCard}>
                  <div className={styles.avatarPlaceholder}>
                    <img
                      src={
                        student.profilePicturePath
                          ? `${API_BASE_URL.replace("/api", "")}${student.profilePicturePath}`
                          : `${API_BASE_URL.replace("/api", "")}/uploads/profiles/default.png`
                      }
                      alt={`${student.firstName}'s avatar`}
                      className={styles.avatarImage}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://cdn-icons-png.flaticon.com/512/149/149071.png";
                      }}
                    />
                  </div>

                  <p className={styles.studentName}>
                    {student.firstName} {student.lastName}
                  </p>

                  {showAddButton && !isHomePage && (
                    <button
                      onClick={() => onSelectStudent(student)}
                      className={styles.addButton}
                    >
                      + Add to Slot
                    </button>
                  )}

                  <Link
                    href={`/viewProfile?userId=${student._id}`}
                    className={styles.viewProfileLink}
                  >
                    View Profile
                  </Link>
                </div>
              ))
            ) : (
              <p className={styles.noResults}>No other students found.</p>
            )}
          </div>

          <button className={styles.arrowBtn}>&#10095;</button>
        </div>
      )}
    </div>
  );
};

export default SelectStudent;