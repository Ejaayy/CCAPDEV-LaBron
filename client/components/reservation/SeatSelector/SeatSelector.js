import { useState, useEffect } from 'react';
import styles from './SeatSelector.module.css';

/**
 Prop explanation:

 lockedSeats {string[]}  Seats the current user already owns.
 *                       Pre-loaded into selection; cannot be deselected.
 *                       Rendered with purple styling.
 *                       Defaults to [] so existing usages in reserve.js are unaffected.
 */
export default function SeatSelector({ onSelect, selectedSlotId, labData, lockedSeats = [] }) {

  const currentSeats = labData?.seats || [];

  const [occupiedSeats, setOccupiedSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState(() => [...lockedSeats]);

  // refresh when seats changes
  useEffect(() => {
    setSelectedSeats([...lockedSeats]);
  }, [lockedSeats.join(',')]);

  useEffect(() => {
    const fetchOccupancy = async () => {
      if (!selectedSlotId) return;
      try {
        const response = await fetch(`http://localhost:3001/api/slots/${selectedSlotId}/occupancy`);
        const data = await response.json();
        setOccupiedSeats(data); // ["A1", "B3", ...]
      } catch (error) {
        console.error("Failed to fetch seat occupancy:", error);
      }
    };
    fetchOccupancy();
  }, [selectedSlotId]);

  const handleSeatClick = (seatId) => {
    // Must be a valid seat in this lab
    if (!currentSeats.includes(seatId)) return;

    // Cannot remove already-reserved (locked) seats
    if (lockedSeats.includes(seatId)) return;

    // Cannot take a seat occupied by someone else
    if (occupiedSeats.includes(seatId) && !lockedSeats.includes(seatId)) return;

    const nextSeats = selectedSeats.includes(seatId)
      ? selectedSeats.filter(id => id !== seatId)
      : [...selectedSeats, seatId];

    setSelectedSeats(nextSeats);
    onSelect(nextSeats);
  };

  const renderTables = () => {
    const seatsPerRow = 3;
    const tableGroups = [];

    for (let i = 0; i < currentSeats.length; i += seatsPerRow) {
      tableGroups.push({
        id: `T${Math.floor(i / seatsPerRow) + 1}`,
        seats: currentSeats.slice(i, i + seatsPerRow),
      });
    }

    return tableGroups;
  };

  const newlySelected = selectedSeats.filter(id => !lockedSeats.includes(id));

  return (
    <div className={styles.seatSelectionContainer}>
      <div className={styles.mapSection}>

        <div className={styles.legend}>
          <div className={styles.legendItem}><span className={styles.boxGray}></span> Available</div>
          <div className={styles.legendItem}><span className={styles.boxDarkBlue}></span> Reserved</div>
          <div className={styles.legendItem}><span className={styles.boxLightBlue}></span> Selecting</div>
          {/* "Already selected" indicator only shows up on edit*/}
          {lockedSeats.length > 0 && (
            <div className={styles.legendItem}><span className={styles.boxYours}></span> Already selected </div>
          )}
        </div>

        <div className={styles.workbenchGrid}>
          <div className={styles.tableSurface}>Front Board</div>

          {renderTables().map((table) => (
            <div key={table.id} className={styles.tableBlock}>
              <div className={styles.tableSurface}>
                <span className={styles.tableLabel}>{table.id}</span>
              </div>

              <div className={styles.seatsRow}>
                {table.seats.map((seatId) => {
                  const isLocked   = lockedSeats.includes(seatId);
                  const isReserved = !isLocked && occupiedSeats.includes(seatId);
                  const isSelected = !isLocked && selectedSeats.includes(seatId);

                  return (
                    <div
                      key={seatId}
                      className={`${styles.seatBox} ${
                        isLocked   ? styles.seatYours     :
                        isReserved ? styles.seatReserved  :
                        isSelected ? styles.seatSelecting :
                                     styles.seatAvailable
                      }`}
                      onClick={() => handleSeatClick(seatId)}
                      title={isLocked ? 'Already reserved by you — cannot remove' : undefined}
                    >
                      {seatId}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.summarySidebar}>
        <h3>Reservation Summary</h3>
        <div className={styles.summaryContent}>
          <div className={styles.summaryRow}>
            <span>Lab Room:</span>
            <span>{labData?.name}</span>
          </div>

          {lockedSeats.length > 0 && (
            <div className={styles.summaryRow}>
              <span>Current seats:</span>
              <span className={styles.lockedText}>{lockedSeats.join(', ')}</span>
            </div>
          )}

          <div className={styles.summaryRow}>
            <span>{lockedSeats.length > 0 ? 'Adding:' : 'Seats:'}</span>
            <span className={styles.highlightText}>
              {newlySelected.length > 0 ? newlySelected.join(', ') : 'None'}
            </span>
          </div>

          <div className={styles.summaryRow}>
            <span>{lockedSeats.length > 0 ? 'Total after update:' : 'Total:'}</span>
            <span>{selectedSeats.length}</span>
          </div>

          <hr className={styles.subDivider} />

          <button
            className={styles.clearButton}
            onClick={() => {
              setSelectedSeats([...lockedSeats]);
              onSelect([...lockedSeats]);
            }}
            disabled={newlySelected.length === 0}
          >
            {lockedSeats.length > 0 ? 'Clear New Selection' : 'Clear Selection'}
          </button>
        </div>
      </div>
    </div>
  );
}