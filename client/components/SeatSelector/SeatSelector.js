import { useState, useEffect } from 'react';
import styles from './SeatSelector.module.css';

export default function SeatSelector({ onSelect, selectedSlotId, labData }) {

  // Constant seat capacity for css
  const ALL_SEATS = [
  'A1', 'A2', 'A3', 'B1', 'B2', 'B3', 'C1', 'C2', 'C3',
  'A4', 'A5', 'A6', 'B4', 'B5', 'B6', 'C4', 'C5', 'C6',
  'A7', 'A8', 'A9', 'B7', 'B8', 'B9', 'C7', 'C8', 'C9', 
  'A10', 'A11', 'A12', 'B10', 'B11', 'B12', 'C10', 'C11', 'C12', 
  'A13', 'A14', 'A15', 'B13', 'B14', 'B15', 'C13', 'C14', 'C15', 
];
  
  const currentSeats = labData?.seats || [];
  
  const [occupiedSeats, setOccupiedSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);

  // Fetch current occupancy
  useEffect(() => {
      const fetchOccupancy = async () => {
          if (!selectedSlotId) return;
          try {
            const response = await fetch(`http://localhost:3001/api/slots/${selectedSlotId}/occupancy`);
            const data = await response.json();
            setOccupiedSeats(data); //format: ["A1", "B3"]
          } catch (error) {
            console.error("Failed to fetch seat occupancy:", error);
          }
      };
      fetchOccupancy();
  }, [selectedSlotId]);

  const handleSeatClick = (seatId, existsInLab) => {
    // Block if the seat isnt in lab definition
    // Block if the seat is already occupied
    if (!existsInLab || occupiedSeats.includes(seatId)) return;

    const nextSeats = selectedSeats.includes(seatId)
      ? selectedSeats.filter((id) => id !== seatId)
      : [...selectedSeats, seatId];

    setSelectedSeats(nextSeats);
    onSelect(nextSeats); 
  };

  const renderTables = () => {
    const tableGroups = [];
    for (let i = 0; i < ALL_SEATS.length; i += 3) {
      tableGroups.push({
        id: `T${Math.floor(i / 3) + 1}`,
        seats: ALL_SEATS.slice(i, i + 3)
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
                  const existsInLab = labData?.seats?.includes(seatId);
                  const isReserved = occupiedSeats.includes(seatId);
                  const isSelected = selectedSeats.includes(seatId);

                  return (
                    <div
                      key={seatId}
                      className={`${styles.seatBox} ${
                        !existsInLab ? styles.seatReserved : 
                        isReserved ? styles.seatReserved : 
                        isSelected ? styles.seatSelecting : styles.seatAvailable
                      }`}
                      onClick={() => handleSeatClick(seatId, existsInLab)}
                    >
                      {/* Only show seat name if seat exists in specified lab*/}
                      {existsInLab ? seatId : ""}
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