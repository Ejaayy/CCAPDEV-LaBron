import { useState, useEffect } from 'react';
import styles from './SeatSelector.module.css';

export default function SeatSelector({ onSelect, selectedSlotId, labData }) {

  const currentSeats = labData?.seats || [];

  const [occupiedSeats, setOccupiedSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);

  // Fetch current occupancy for this slot
  useEffect(() => {
    const fetchOccupancy = async () => {
      if (!selectedSlotId) return;
      try {
        const response = await fetch(`http://localhost:3001/api/slots/${selectedSlotId}/occupancy`);
        const data = await response.json();
        setOccupiedSeats(data); // format: ["A1", "B3"]
      } catch (error) {
        console.error("Failed to fetch seat occupancy:", error);
      }
    };
    fetchOccupancy();
  }, [selectedSlotId]);

  const handleSeatClick = (seatId) => {
    if (!currentSeats.includes(seatId) || occupiedSeats.includes(seatId)) return;

    const nextSeats = selectedSeats.includes(seatId)
      ? selectedSeats.filter(id => id !== seatId)
      : [...selectedSeats, seatId];

    setSelectedSeats(nextSeats);
    onSelect(nextSeats); 
  };

  // Render seats in rows of 3 (or whatever you want)
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

  return (
    <div className={styles.seatSelectionContainer}>
      <div className={styles.mapSection}>
        <div className={styles.legend}>
          <div className={styles.legendItem}><span className={styles.boxGray}></span> Available</div>
          <div className={styles.legendItem}><span className={styles.boxDarkBlue}></span> Reserved</div>
          <div className={styles.legendItem}><span className={styles.boxLightBlue}></span> Selecting</div>
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
                  const isReserved = occupiedSeats.includes(seatId);
                  const isSelected = selectedSeats.includes(seatId);

                  return (
                    <div
                      key={seatId}
                      className={`${styles.seatBox} ${
                        isReserved ? styles.seatReserved :
                        isSelected ? styles.seatSelecting : styles.seatAvailable
                      }`}
                      onClick={() => handleSeatClick(seatId)}
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
          <div className={styles.summaryRow}>
            <span>Seats:</span>
            <span className={styles.highlightText}>
              {selectedSeats.length > 0 ? selectedSeats.join(', ') : 'None'}
            </span>
          </div>
          <div className={styles.summaryRow}>
            <span>Total:</span>
            <span>{selectedSeats.length}</span>
          </div>
          <hr className={styles.subDivider} />
          <button 
            className={styles.clearButton}
            onClick={() => { setSelectedSeats([]); onSelect([]); }}
            disabled={selectedSeats.length === 0}
          >
            Clear Selection
          </button>
        </div>
      </div>
    </div>
  );
}