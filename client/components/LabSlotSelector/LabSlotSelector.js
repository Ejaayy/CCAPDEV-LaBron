import styles from './LabSlotSelector.module.css';
import { FaMicroscope, FaChevronDown, FaSearch } from 'react-icons/fa';
import { useState } from 'react';

export default function LabSlotSelector({ slots, onSelect, selectedSlotId }) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredSlots = (slots || []).filter((slot) => {
    const labName = slot.lab?.name || '';
    const labLocation = slot.lab?.location || '';
    return (
      labName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      labLocation.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });


  if (!slots || !Array.isArray(slots) || slots.length === 0){
    return <div className={styles.noSlots}>No available slots for this date.</div>;
  }

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

      {filteredSlots.length === 0 ? (
        <div className={styles.noResults}>
          No labs found matching &quot;{searchQuery}&quot;
        </div>
      ) : (
        filteredSlots.map((slot) => (

          <div 
            key={slot._id} 
            className={`${styles.labRow} ${selectedSlotId === slot._id ? styles.selectedRow : ''}`} 
            onClick={() => onSelect(slot)}
          >
            {/* Lab Info Column */}
            <div className={styles.labInfo}>
              <div className={styles.labName}>
           
                <span>Lab {slot.lab?.name || 'N/A'}</span>
              </div>
     
            </div>

            {/* Duration Column */}
            <div className={styles.duration}>{slot.startTime} - {slot.endTime}</div>

            {/* Reference ID Column (Location + Name) */}
            <div className={styles.labId}>
                {slot.lab?.location}
            </div>
    
            <div className={styles.bookingAction}>
              <div className={styles.seatInfo}>
                <span className={styles.seatPrice}>Free Admission</span>
                <span className={`${styles.seatsLeft} ${slot.lab?.seatCount < 5 ? styles.urgent : ''}`}>
                  {slot.lab?.seatCount || 0} seats total
                </span>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}