import { useState } from 'react';
import styles from './SeatSelector.module.css';

const TABLES = [
  { id: 'T1', seats: ['A1', 'A2', 'A3'], reserved: ['A1', 'A2'] },
  { id: 'T2', seats: ['B1', 'B2', 'B3'], reserved: ['B3'] },
  { id: 'T3', seats: ['C1', 'C2', 'C3'], reserved: ['C3'] },
  { id: 'T4', seats: ['A1', 'A2', 'A3'], reserved: ['A3'] },
  { id: 'T5', seats: ['B1', 'B2', 'B3'], reserved: ['B2'] },
  { id: 'T6', seats: ['C1', 'C2', 'C3'], reserved: [] },
  { id: 'T7', seats: ['A1', 'A2', 'A3'], reserved: ['A1'] },
  { id: 'T8', seats: ['B1', 'B2', 'B3'], reserved: [] },
  { id: 'T9', seats: ['C1', 'C2', 'C3'], reserved: [] },
  { id: 'T10', seats: ['A1', 'A2', 'A3'], reserved: [] },
  { id: 'T11', seats: ['B1', 'B2', 'B3'], reserved: [] },
  { id: 'T12', seats: ['C1', 'C2', 'C3'], reserved: [] },
  { id: 'T13', seats: ['A1', 'A2', 'A3'], reserved: [] },
  { id: 'T14', seats: ['B1', 'B2', 'B3'], reserved: [] },
  { id: 'T15', seats: ['C1', 'C2', 'C3'], reserved: [] },
];

export default function SeatSelector() {
  const [selectedSeats, setSelectedSeats] = useState([]);

  const handleSeatClick = (tableId, seatId, isReserved) => {
    if (isReserved) return;

    const uniqueId = `${tableId}${seatId}`;

    setSelectedSeats((prev) =>
      prev.includes(uniqueId)
        ? prev.filter((id) => id !== uniqueId)
        : [...prev, uniqueId]
    );
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
            <div className={styles.tableSurface}>Board</div>
          {TABLES.map((table) => (
            <div key={table.id} className={styles.tableBlock}>
              
            
              <div className={styles.tableSurface}>
                <span className={styles.tableLabel}>{table.id}</span>
              </div>

         
              <div className={styles.seatsRow}>
                {table.seats.map((seat) => {
                  const isReserved = table.reserved.includes(seat);
                  const uniqueSeatId = `${table.id}${seat}`;
                  const isSelected = selectedSeats.includes(uniqueSeatId);

                  return (
                    <div
                      key={uniqueSeatId}
                      className={`${styles.seatBox} ${
                        isReserved ? styles.seatReserved : 
                        isSelected ? styles.seatSelecting : styles.seatAvailable
                      }`}
                      onClick={() => handleSeatClick(table.id, seat, isReserved)}
                    >
                      {seat}
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
            <span>401</span>
          </div>
          <div className={styles.summaryRow}>
            <span>Seats:</span>
            <span className={styles.highlightText}>
              {selectedSeats.length > 0 
                ? selectedSeats.map(id => id.replace('T', 'Table ')).join(', ') 
                : 'None'}
            </span>
          </div>
          <div className={styles.summaryRow}>
            <span>Total Count:</span>
            <span>{selectedSeats.length}</span>
          </div>
          <hr className={styles.subDivider} />
          <button 
            className={styles.clearButton}
            onClick={() => setSelectedSeats([])}
            disabled={selectedSeats.length === 0}
          >
            Clear Selection
          </button>
        </div>
      </div>
    </div>
  );
}