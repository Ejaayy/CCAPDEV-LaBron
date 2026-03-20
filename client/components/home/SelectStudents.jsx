import { useEffect, useState } from "react";
import styles from '@/styles/SelectStudents.module.css';
import Link from 'next/link';

const SelectStudent = ({ currentUserId }) => {
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/users/students', {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json'
          }
        });
        if (response.ok) {
          const data = await response.json();
          console.log("Fetched students:", data);
          setStudents(data);
        } else {
          console.error("Failed to fetch students:", response.status);
        }
      } catch (error) {
        console.error("Error fetching students:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchStudents();
  }, []);

  const filteredStudents = students.filter(student => {
    if(student._id === currentUserId) return false; 

    const fullName = `${student.firstName} ${student.lastName}`.toLowerCase();
    return fullName.includes(searchTerm.toLowerCase());
  });

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>Select Student</h2>
        <div className={styles.searchBar}>
          <span role="img" aria-hidden="true">🔍</span>
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
                         {student.profilePicturePath ? (
                             <img 
                                src={`http://localhost:3001${student.profilePicturePath}`} 
                                alt={`${student.firstName}'s avatar`} 
                                /* FIX: Changed style= to className= */
                                className={styles.avatarImage} 
                             />
                         ) : (
                             <div className={styles.userIcon}></div>
                         )}
                      </div>
                      <p className={styles.studentName}>{student.firstName} {student.lastName}</p>
                      <Link href={`/viewProfile?userId=${student._id}`} className={styles.viewProfileLink}>
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