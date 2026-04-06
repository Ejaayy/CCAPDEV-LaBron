import styles from './LabSlotSelector.module.css';
import { FaSearch } from 'react-icons/fa';
import { useState, useEffect } from 'react';
import { getSlotOccupancy } from "@/lib/slots";

export default function LabSlotSelector({ slots, onSelect, selectedSlotId }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [occupancies, setOccupancies] = useState({});

  // Fetch current occupancy for the list of slots
  useEffect(() => {
    if (!slots?.length) return;

    const fetchAll = async () => {
      const results = await Promise.all(
        slots.map(async (s) => {
          try {
            const data = await getSlotOccupancy(s._id);
            const count = data
              ? Array.isArray(data)
                ? data.length
                : data.occupiedSeats?.length ?? 0
              : 0;
            return [s._id, count];
          } catch {
            return [s._id, 0];
          }
        })
      );
      setOccupancies(Object.fromEntries(results));
    };

    fetchAll();
  }, [slots]);

  const getMinutes = (timeString) => {
    if (!timeString) return 0;
    const [hours, minutes] = timeString.split(':').map(Number);
    return hours * 60 + minutes;
  };

  const filteredSlots = (slots || []).filter((slot) => {
    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];
    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    // 1. Time Filtering
    if (slot.date < todayStr) return false;
    if (slot.date === todayStr) {
      const slotStartMinutes = getMinutes(slot.startTime);
      if (slotStartMinutes < currentMinutes - 15) return false;
    }

    // 2. Hide if Full
    const occupied = occupancies[slot._id] ?? 0;
    const capacity = slot.lab?.seatCount || 0;
    if (capacity > 0 && occupied >= capacity) return false;

    // 3. Search Filtering
    const query = searchQuery.toLowerCase();
    const name = (slot.lab?.name || '').toLowerCase();
    const loc = (slot.lab?.location || '').toLowerCase();
    return name.includes(query) || loc.includes(query);
  });

  if (!slots || slots.length === 0) {
    return <div className={styles.noSlots}>No available slots for this date.</div>;
  }

  return (
    <div className={styles.slotContainer}>
      <div className={styles.labSearchContainer}>
        <FaSearch className={styles.searchIcon} />
        <input
          type="text"
          placeholder="Search lab by name or location..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className={styles.labSearchInput}
        />
      </div>

      {filteredSlots.length === 0 ? (
        <div className={styles.noResults}>
          {searchQuery ? `No labs match "${searchQuery}"` : "No upcoming available slots."}
        </div>
      ) : (
        filteredSlots.map((slot) => {
          const occupied = occupancies[slot._id] ?? 0;
          const capacity = slot.lab?.seatCount || 0;

          return (
            <div 
              key={slot._id} 
              className={`${styles.labRow} ${selectedSlotId === slot._id ? styles.selectedRow : ''}`} 
              onClick={() => onSelect(slot)}
            >
              <div className={styles.labInfo}>
                <div className={styles.labName}>
                  <span>Lab {slot.lab?.name || 'N/A'}</span>
                </div>
              </div>

              <div className={styles.duration}>{slot.startTime} - {slot.endTime}</div>

              <div className={styles.labId}>{slot.lab?.location}</div>
      
              <div className={styles.bookingAction}>
                <div className={styles.seatInfo}>
                  <span className={styles.seatPrice}>Free Admission</span>
                  {/* Dynamic Capacity Indicator */}
                  <span className={styles.seatsLeft}>
                    {occupied} / {capacity} seats reserved
                  </span>
                </div>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}