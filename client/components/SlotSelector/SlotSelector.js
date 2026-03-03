import styles from './SlotSelector.module.css';
import { FaMicroscope, FaChevronDown, FaSearch } from 'react-icons/fa';
import { useState } from 'react';

const LABS = [
  { id: '301', seats: 15, status: 'Available' },
  { id: '401', seats: 15, status: 'Available' },
  { id: '402', seats: 4, status: 'Limited' },
  { id: '505', seats: 20, status: 'Available' },
  { id: '501', seats: 0, status: 'Full' },
];

export default function LabSlotSelector() {
  const [searchQuery, setSearchQuery] = useState('');
  
  const startTime = "07:30 AM";
  const endTime = "09:00 AM"; 

  // Filter labs based on search query
  const filteredLabs = LABS.filter((lab) => 
    lab.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    `lab ${lab.id}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
    `gk-${lab.id}`.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className={styles.slotContainer}>
      {/* Search Bar */}
      <div className={styles.labSearchContainer}>
        <FaSearch className={styles.searchIcon} />
        <input
          type="text"
          placeholder="Search lab by name or ID (e.g., 301, GK-401)..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className={styles.labSearchInput}
        />
      </div>

      {filteredLabs.length === 0 ? (
        <div className={styles.noResults}>
          No labs found matching &quot;{searchQuery}&quot;
        </div>
      ) : (
        filteredLabs.map((lab) => (
          <div key={lab.id} className={styles.labRow}>
            {/* Lab Info Column */}
            <div className={styles.labInfo}>
              <div className={styles.labName}>
               
                <span>Lab {lab.id}</span>
              </div>
              <span className={styles.timeRange}>{startTime} - {endTime}</span>
            </div>

            {/* Duration Column */}
            <div className={styles.duration}>90m</div>

            {/* Reference ID (Like flight number) */}
            <div className={styles.labId}>GK-{lab.id}</div>

            {/* Pricing/Seats Column */}
            <div className={styles.bookingAction}>
              <div className={styles.seatInfo}>
                <span className={styles.seatPrice}>Free Admission</span>
                <span className={`${styles.seatsLeft} ${lab.seats < 5 ? styles.urgent : ''}`}>
                  {lab.seats} seats left at this time
                </span>
              </div>
              <FaChevronDown className={styles.expandIcon} />
            </div>
          </div>
        ))
      )}
    </div>
  );
}