import styles from "./TopBar.module.css";
import { FaSearch, FaCalendarAlt } from "react-icons/fa";

export default function TopBar({ date, setDate, search, setSearch }) {
  return (
    <div className={styles.topBar}>
      <div className={styles.topBarTitle}>
        <h2>Manage Reservations</h2>
        <p>View and manage all room reservations</p>
      </div>
      
      <div className={styles.topBarFilters}>
        <div className={styles.filterGroup}>
          <FaCalendarAlt className={styles.filterIcon} />
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className={styles.dateInput}
          />
        </div>
        
        <div className={styles.filterGroup}>
          <FaSearch className={styles.filterIcon} />
          <input
            type="text"
            placeholder="Search room or student…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={styles.searchInput}
          />
        </div>
      </div>
    </div>
  );
}
