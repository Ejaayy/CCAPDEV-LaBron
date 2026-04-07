import { useEffect, useState } from "react";
import Link from "next/link";
import { API_BASE_URL } from "@/constants/api";
import styles from "./SeatSelector.module.css";

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
  const [reservations, setReservations] = useState([]); 
  const [selectedSeats, setSelectedSeats] = useState(() => [...initialSelectedSeats]);
  const [hoveredSeat, setHoveredSeat] = useState(null);

  const [prevInitialStr, setPrevInitialStr] = useState(initialSelectedSeats.join(","));

  const currentInitialStr = initialSelectedSeats.join(",");
  if (currentInitialStr !== prevInitialStr) {
    setPrevInitialStr(currentInitialStr);
    setSelectedSeats([...initialSelectedSeats]);
  }

  useEffect(() => {
    const fetchOccupancy = async () => {
      if (!selectedSlotId) return;
      try {
        const response = await fetch(`${API_BASE_URL}/slots/${selectedSlotId}/occupancy?details=true`);
        const data = await response.json();
        setOccupiedSeats(data.occupiedSeats || []);
        setReservations(data.reservations || []);
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

  const getTooltipContent = (seatId) => {
    const res = reservations.find((r) => r.seats && r.seats.includes(seatId));
    if (!res) return null;

    if (res.isAnonymous) {
      return <div className={styles.anonymousTooltip}>Reserved Anonymously</div>;
    }

    const avatarSrc = res.profilePicturePath
      ? `${API_BASE_URL.replace("/api", "")}${res.profilePicturePath}`
      : `${API_BASE_URL.replace("/api", "")}/uploads/profiles/default.png`;

    return (
      <div className={styles.studentTooltipCard}>
        <div className={styles.avatarPlaceholder}>
          <img
            src={avatarSrc}
            alt="avatar"
            className={styles.avatarImage}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "https://cdn-icons-png.flaticon.com/512/149/149071.png";
            }}
          />
        </div>
        <p className={styles.studentName}>{res.name}</p>
        <Link
          href={`/viewProfile?userId=${res.studentId}`}
          className={styles.viewProfileLink}
        >
          View Profile
        </Link>
      </div>
    );
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
  const hasEditChanges = selectedSeats.length !== initialSelectedSeats.length || 
                         selectedSeats.some(s => !initialSelectedSeats.includes(s));

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
                        isOwnedSeat && isSelected ? styles.seatYours :
                        isReserved ? styles.seatReserved :
                        isSelected ? styles.seatSelecting : styles.seatAvailable
                      }`}
                      onClick={() => handleSeatClick(seatId)}
                      onMouseEnter={() => isReserved && setHoveredSeat(seatId)}
                      onMouseLeave={() => setHoveredSeat(null)}
                    >
                      {seatId}
                      {isReserved && hoveredSeat === seatId && (
                        <div className={styles.tooltip}>
                          {getTooltipContent(seatId)}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.summarySidebar}>
        <h3>Summary</h3>
        <div className={styles.summaryContent}>
          <div className={styles.summaryRow}>
            <span>Lab:</span>
            <span>{labData?.name}</span>
          </div>
          <div className={styles.summaryRow}>
            <span>Seats:</span>
            <span className={styles.highlightText}>
              {selectedSeats.length > 0 ? selectedSeats.join(", ") : "None"}
            </span>
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
            {isEditMode ? "Reset" : "Clear"}
          </button>
        </div>
      </div>
    </div>
  );
}