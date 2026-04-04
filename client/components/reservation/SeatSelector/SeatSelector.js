import { useEffect, useState } from "react";
import styles from "./SeatSelector.module.css";

/**
 * lockedSeats: seats already owned by the reservation being edited.
 * initialSelectedSeats: starting selection for edit mode.
 * allowLockedSeatRemoval: whether those owned seats can be deselected.
 */
export default function SeatSelector({
  onSelect,
  selectedSlotId,
  labData,
  lockedSeats = [],
  initialSelectedSeats = lockedSeats,
  allowLockedSeatRemoval = false,
}) {
  const currentSeats = labData?.seats || [];

  const [occupiedSeats, setOccupiedSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState(() => [...initialSelectedSeats]);

  useEffect(() => {
    setSelectedSeats([...initialSelectedSeats]);
  }, [initialSelectedSeats.join(",")]);

  useEffect(() => {
    const fetchOccupancy = async () => {
      if (!selectedSlotId) return;

      try {
        const response = await fetch(`http://localhost:3001/api/slots/${selectedSlotId}/occupancy`);
        const data = await response.json();
        setOccupiedSeats(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Failed to fetch seat occupancy:", error);
      }
    };

    fetchOccupancy();
  }, [selectedSlotId]);

  const handleSeatClick = (seatId) => {
    if (!currentSeats.includes(seatId)) return;

    const isOwnedSeat = lockedSeats.includes(seatId);

    if (isOwnedSeat && !allowLockedSeatRemoval) return;
    if (occupiedSeats.includes(seatId) && !isOwnedSeat) return;

    const nextSeats = selectedSeats.includes(seatId)
      ? selectedSeats.filter((id) => id !== seatId)
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

  const isEditMode = lockedSeats.length > 0;
  const addedSeats = selectedSeats.filter((id) => !lockedSeats.includes(id));
  const removedSeats = lockedSeats.filter((id) => !selectedSeats.includes(id));
  const hasEditChanges = addedSeats.length > 0 || removedSeats.length > 0;

  return (
    <div className={styles.seatSelectionContainer}>
      <div className={styles.mapSection}>
        <div className={styles.legend}>
          <div className={styles.legendItem}><span className={styles.boxGray}></span> Available</div>
          <div className={styles.legendItem}><span className={styles.boxDarkBlue}></span> Reserved</div>
          <div className={styles.legendItem}><span className={styles.boxLightBlue}></span> Selecting</div>
          {isEditMode && (
            <div className={styles.legendItem}><span className={styles.boxYours}></span> Current reservation</div>
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
                  const isOwnedSeat = lockedSeats.includes(seatId);
                  const isReserved = occupiedSeats.includes(seatId) && !isOwnedSeat;
                  const isSelected = selectedSeats.includes(seatId);

                  return (
                    <div
                      key={seatId}
                      className={`${styles.seatBox} ${
                        isOwnedSeat && isSelected
                          ? styles.seatYours
                          : isReserved
                            ? styles.seatReserved
                            : isSelected
                              ? styles.seatSelecting
                              : styles.seatAvailable
                      }`}
                      onClick={() => handleSeatClick(seatId)}
                      title={
                        isOwnedSeat
                          ? allowLockedSeatRemoval
                            ? "Currently part of this reservation. Click to keep or remove it."
                            : "Already reserved by you and cannot be removed here."
                          : undefined
                      }
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

          {isEditMode && (
            <div className={styles.summaryRow}>
              <span>Current seats:</span>
              <span className={styles.lockedText}>{lockedSeats.join(", ")}</span>
            </div>
          )}

          <div className={styles.summaryRow}>
            <span>{isEditMode ? "Selected now:" : "Seats:"}</span>
            <span className={styles.highlightText}>
              {selectedSeats.length > 0 ? selectedSeats.join(", ") : "None"}
            </span>
          </div>

          {isEditMode && (
            <>
              <div className={styles.summaryRow}>
                <span>Adding:</span>
                <span className={styles.highlightText}>
                  {addedSeats.length > 0 ? addedSeats.join(", ") : "None"}
                </span>
              </div>

              <div className={styles.summaryRow}>
                <span>Removing:</span>
                <span className={styles.highlightText}>
                  {removedSeats.length > 0 ? removedSeats.join(", ") : "None"}
                </span>
              </div>
            </>
          )}

          <div className={styles.summaryRow}>
            <span>{isEditMode ? "Total after update:" : "Total:"}</span>
            <span>{selectedSeats.length}</span>
          </div>

          <hr className={styles.subDivider} />

          <button
            className={styles.clearButton}
            onClick={() => {
              const resetSeats = isEditMode ? [...lockedSeats] : [];
              setSelectedSeats(resetSeats);
              onSelect(resetSeats);
            }}
            disabled={isEditMode ? !hasEditChanges : selectedSeats.length === 0}
          >
            {isEditMode ? "Reset to Current Seats" : "Clear Selection"}
          </button>
        </div>
      </div>
    </div>
  );
}
