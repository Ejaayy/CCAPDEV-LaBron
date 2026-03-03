import { useState } from "react";
import styles from '@/styles/SelectStudents.module.css';
import Link from 'next/link';

const students = [
  { id: 1, name: "Waba Laba D. DubDub" },
  { id: 2, name: "Waba Laba D. DubDub" },
  { id: 3, name: "Waba Laba D. DubDub" },
  { id: 4, name: "Waba Laba D. DubDub" },
  { id: 5, name: "Waba Laba D. DubDub" },
];

const SelectStudent = () => {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>Select Student</h2>
        <div className={styles.searchBar}>
          <span role="img" aria-hidden="true">🔍</span>
          <span>Search student...</span>
        </div>
      </div>

      <div className={styles.carouselWrapper}>
        <button className={styles.arrowBtn}>&#10094;</button>
        
        <div className={styles.studentList}>
          {students.map((student) => (
            <div key={student.id} className={styles.studentCard}>
              <div className={styles.avatarPlaceholder}>
                 <div className={styles.userIcon}></div>
              </div>
              <p className={styles.studentName}>{student.name}</p>
              <Link href="/account" className={styles.viewProfileLink}>
                View Profile
              </Link>
            </div>
          ))}
        </div>

        <button className={styles.arrowBtn}>&#10095;</button>
      </div>
    </div>
  );
};

export default SelectStudent;