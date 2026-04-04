import { useEffect, useMemo, useState, useCallback } from "react";
import { useRouter } from "next/router";

import HomeNavbar from "@/components/layout/HomeNavbar/HomeNavbar";
import ReservationCard from "@/components/reservations-management/ReservationCard/ReservationCard";
import SeatSelector from "@/components/reservation/SeatSelector/SeatSelector";
import useAuth from "@/hooks/useAuth";
import { useMyReservations } from "@/hooks/useReservations";
import styles from "./MyReservations.module.css";
import modalStyles from "../../styles/Editseatsmodal.module.css";


// Helpers
function sortReservationsByStart(reservations) {
  return [...reservations].sort((a, b) => {
    const getTimestamp = (dateStr, timeStr) => {
      if (!dateStr || !timeStr || timeStr === "N/A") return Infinity;
      const startTime = timeStr.split(" - ")[0];
      return new Date(`${dateStr} ${startTime}`).getTime();
    };
    return getTimestamp(a.rawDate, a.reservationTime) - getTimestamp(b.rawDate, b.reservationTime);
  });
}

// Mini-stepper component
const EDIT_STEPS = [
  { id: 1, label: "Select Seats" },
  { id: 2, label: "Confirm Changes" },
];

function EditStepper({ currentStep }) {
  return (
    <div className={modalStyles.stepper}>
      {EDIT_STEPS.map((step, index) => {
        const isActive = currentStep >= step.id;
        const isLast = index === EDIT_STEPS.length - 1;
        return (
          <div key={step.id} className={modalStyles.stepWrapper}>
            <div className={`${modalStyles.stepDot} ${isActive ? modalStyles.stepDotActive : ""}`}>
              {step.id}
            </div>
            <span className={`${modalStyles.stepLabel} ${isActive ? modalStyles.stepLabelActive : ""}`}>
              {step.label}
            </span>
            {!isLast && (
              <div
                className={`${modalStyles.stepLine} ${
                  currentStep > step.id ? modalStyles.stepLineActive : ""
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

// EditSeatsModal

function EditSeatsModal({ reservation, onClose, onConfirm }) {
  // Convert seat numbers to array
  const lockedSeats = reservation?.seatNumber 
    ? reservation.seatNumber.split(',').map(seat => seat.trim()) 
    : [];

  const [modalStep, setModalStep] = useState(1);
  const [pendingSeats, setPendingSeats] = useState([...lockedSeats]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const newlyAdded = pendingSeats.filter((id) => !lockedSeats.includes(id));


  const handleConfirm = async () => {
    if (newlyAdded.length === 0) return;
    setIsSubmitting(true);
    try {
      await onConfirm(pendingSeats);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Close on Escape
  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div className={modalStyles.backdrop} onClick={handleBackdropClick}>
      <div
        className={modalStyles.modal}
        role="dialog"
        aria-modal="true"
        aria-labelledby="edit-modal-title"
      >
        {/* Header */}
        <div className={modalStyles.header}>
          <div>
            <h2 id="edit-modal-title" className={modalStyles.title}>Edit Reservation</h2>
            <p className={modalStyles.subtitle}>
              {reservation?.laboratory} &middot; {reservation?.reservationTime} &middot; {reservation?.rawDate}
            </p>
          </div>
          <button className={modalStyles.closeBtn} onClick={onClose} aria-label="Close">
            &#x2715;
          </button>
        </div>

        {/* Mini-stepper Component */}
        <EditStepper currentStep={modalStep} />

        {/* Step 1: Seat Selector */}
        {modalStep === 1 && (
          <>
            <p className={modalStyles.rule}>
              You can only <strong>add</strong> seats to your existing reservation.
              Seats you already reserved <em>(shown in purple)</em> cannot be removed.
            </p>
            <div className={modalStyles.selectorWrapper}>
              <SeatSelector
                selectedSlotId={reservation?.slotId}
                labData={{
                  name: reservation?.laboratory,
                  seats: reservation?.availableSeats,
                }}
                lockedSeats={lockedSeats}
                selectedSeats={pendingSeats} // Passed down for controlled component sync
                onSelect={setPendingSeats}
              />
            </div>
          </>
        )}

        {/* Step 2: Confirmation summary  */}
        {modalStep === 2 && (
          <div className={modalStyles.summaryWrapper}>
            <h3 className={modalStyles.summaryTitle}>Reservation Update Summary</h3>

            <div className={modalStyles.summaryCard}>
              <div className={modalStyles.summaryRow}>
                <span className={modalStyles.summaryLabel}>Laboratory:</span>
                <span className={modalStyles.summaryValue}>{reservation?.laboratory ?? "N/A"}</span>
              </div>
              <div className={modalStyles.summaryRow}>
                <span className={modalStyles.summaryLabel}>Date:</span>
                <span className={modalStyles.summaryValue}>{reservation?.rawDate ?? "N/A"}</span>
              </div>
              <div className={modalStyles.summaryRow}>
                <span className={modalStyles.summaryLabel}>Time Slot:</span>
                <span className={modalStyles.summaryValue}>{reservation?.reservationTime ?? "N/A"}</span>
              </div>

              <hr className={modalStyles.subDivider} />

              <div className={modalStyles.summaryRow}>
                <span className={modalStyles.summaryLabel}>Current seats:</span>
                <span className={`${modalStyles.summaryValue} ${modalStyles.lockedText}`}>
                  {lockedSeats.length > 0 ? lockedSeats.join(", ") : "None"}
                </span>
              </div>
              <div className={modalStyles.summaryRow}>
                <span className={modalStyles.summaryLabel}>Adding:</span>
                <span className={`${modalStyles.summaryValue} ${modalStyles.addingText}`}>
                  {newlyAdded.length > 0 ? newlyAdded.join(", ") : "None"}
                </span>
              </div>
              <div className={modalStyles.summaryRow}>
                <span className={modalStyles.summaryLabel}>Total after update:</span>
                <span className={modalStyles.summaryValue}>{pendingSeats.length}</span>
              </div>
            </div>

            {newlyAdded.length === 0 && (
              <p className={modalStyles.noChangeWarning}>
                No new seats selected. Go back to add seats before confirming.
              </p>
            )}
          </div>
        )}

        {/* Footer: Back / Continue / Confirm  */}
        <hr className={modalStyles.footerDivider} />
        <div className={modalStyles.footer}>
          <button
            className={modalStyles.backBtn}
            onClick={() => {
              if (modalStep > 1) {
                setModalStep(modalStep - 1);
              } else {
                onClose();
              }
            }}
            disabled={isSubmitting}
          >
            {modalStep === 1 ? "Cancel" : "Back"}
          </button>

          <button
            className={modalStyles.continueBtn}
            disabled={isSubmitting}
            onClick={() => {
              if (modalStep === 1) {
                if (newlyAdded.length === 0) {
                  alert("Please select at least one new seat to add.");
                  return;
                }
                setModalStep(2);
                return;
              }
              handleConfirm();
            }}
          >
            {modalStep === 1 ? "Continue" : isSubmitting ? "Saving…" : "Confirm"}
          </button>
        </div>
      </div>
    </div>
  );
}

// MyReservations page

export default function MyReservations() {
  const router = useRouter();
  const { user, loading: userLoading } = useAuth();
  const { reservations, loading, refetch } = useMyReservations();

  const isAutoSelect = router.query.autoSelect === "true";
  const [editingReservation, setEditingReservation] = useState(null);

  useEffect(() => {
    if (!userLoading && !user) {
      router.push("/auth/login");
      return;
    }
    if (!userLoading && user?.role !== "student") {
      router.push(
        user?.role === "technician" ? "/edit-reservations/manage-reservations" : "/home"
      );
    }
  }, [userLoading, user, router]);

  const sortedReservations = useMemo(() => sortReservationsByStart(reservations), [reservations]);

  const displayReservations =
    isAutoSelect && sortedReservations.length > 0
      ? [sortedReservations[0]]
      : sortedReservations;

  const handleEdit = useCallback((reservation) => setEditingReservation(reservation), []);
  const handleModalClose = useCallback(() => setEditingReservation(null), []);

  const handleModalConfirm = useCallback(
    async (newSeats) => {
      try {
        const id = editingReservation.id || editingReservation._id;
        const response = await fetch(`http://localhost:3001/api/reservations/${id}/seats`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ seats: newSeats }),
        });

        if (!response.ok) {
          throw new Error("Failed to update reservation");
        }

        setEditingReservation(null);
        if (typeof refetch === "function") refetch();
      } catch (err) {
        console.error("Failed to update seats:", err);
        alert("Could not update seats. Please try again.");
      }
    },
    [editingReservation, refetch]
  );

  if (userLoading || loading) {
    return <div className={styles.pageWrapper}>Loading...</div>;
  }

  if (!user || user.role !== "student") {
    return null;
  }

  return (
    <div className={styles.pageWrapper}>
      <HomeNavbar />

      <div className={styles.pageTitle}>My Reservations</div>

      <div className={styles.content}>
        {isAutoSelect && displayReservations.length > 0 && (
          <h2 className={styles.manageLatestTitle}>Managing Latest Reservation</h2>
        )}

        <div className={styles.reservationList}>
          {displayReservations.length > 0 ? (
            displayReservations.map((reservation, index) => (
              <div
                key={reservation.id || reservation._id || index}
                className={isAutoSelect && index === 0 ? styles.highlightedCard : ""}
              >
                <ReservationCard
                  reservation={reservation}
                  onEdit={() => handleEdit(reservation)}
                />
              </div>
            ))
          ) : (
            <p style={{ color: "#1F2234" }}>You have no upcoming reservations.</p>
          )}
        </div>
      </div>

      {editingReservation && (
        <EditSeatsModal
          reservation={editingReservation}
          onClose={handleModalClose}
          onConfirm={handleModalConfirm}
        />
      )}
    </div>
  );
}