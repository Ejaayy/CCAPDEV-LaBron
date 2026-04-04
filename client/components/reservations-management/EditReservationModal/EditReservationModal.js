import { useEffect, useState } from "react";

import SeatSelector from "@/components/reservation/SeatSelector/SeatSelector";
import modalStyles from "@/styles/Editseatsmodal.module.css";

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

export default function EditReservationModal({ reservation, onClose, onConfirm }) {
  const currentSeats = reservation?.seatNumber
    ? reservation.seatNumber.split(",").map((seat) => seat.trim()).filter(Boolean)
    : [];

  const [modalStep, setModalStep] = useState(1);
  const [pendingSeats, setPendingSeats] = useState(() => [...currentSeats]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const addedSeats = pendingSeats.filter((seatId) => !currentSeats.includes(seatId));
  const removedSeats = currentSeats.filter((seatId) => !pendingSeats.includes(seatId));
  const hasChanges = addedSeats.length > 0 || removedSeats.length > 0;

  useEffect(() => {
    const handler = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  useEffect(() => {
    setModalStep(1);
    setPendingSeats([...currentSeats]);
  }, [reservation?.reservationId, reservation?.id, reservation?.seatNumber]);

  const handleBackdropClick = (event) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  const handleConfirm = async () => {
    if (!hasChanges || pendingSeats.length === 0) return;

    setIsSubmitting(true);
    try {
      await onConfirm(pendingSeats);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={modalStyles.backdrop} onClick={handleBackdropClick}>
      <div
        className={modalStyles.modal}
        role="dialog"
        aria-modal="true"
        aria-labelledby="edit-modal-title"
      >
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

        <EditStepper currentStep={modalStep} />

        {modalStep === 1 && (
          <>
            <p className={modalStyles.rule}>
              You can fully edit this reservation here. Keep seats, remove seats, switch to
              different seats, or add more seats. Seats in purple are the reservation's
              current seats and can be clicked to remove them.
            </p>
            <div className={modalStyles.selectorWrapper}>
              <SeatSelector
                selectedSlotId={reservation?.slotId}
                labData={{
                  name: reservation?.laboratory,
                  seats: reservation?.availableSeats,
                }}
                lockedSeats={currentSeats}
                initialSelectedSeats={currentSeats}
                allowLockedSeatRemoval
                onSelect={setPendingSeats}
              />
            </div>
          </>
        )}

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
                  {currentSeats.length > 0 ? currentSeats.join(", ") : "None"}
                </span>
              </div>
              <div className={modalStyles.summaryRow}>
                <span className={modalStyles.summaryLabel}>Selected now:</span>
                <span className={`${modalStyles.summaryValue} ${modalStyles.addingText}`}>
                  {pendingSeats.length > 0 ? pendingSeats.join(", ") : "None"}
                </span>
              </div>
              <div className={modalStyles.summaryRow}>
                <span className={modalStyles.summaryLabel}>Adding:</span>
                <span className={`${modalStyles.summaryValue} ${modalStyles.addingText}`}>
                  {addedSeats.length > 0 ? addedSeats.join(", ") : "None"}
                </span>
              </div>
              <div className={modalStyles.summaryRow}>
                <span className={modalStyles.summaryLabel}>Removing:</span>
                <span className={`${modalStyles.summaryValue} ${modalStyles.addingText}`}>
                  {removedSeats.length > 0 ? removedSeats.join(", ") : "None"}
                </span>
              </div>
              <div className={modalStyles.summaryRow}>
                <span className={modalStyles.summaryLabel}>Total after update:</span>
                <span className={modalStyles.summaryValue}>{pendingSeats.length}</span>
              </div>
            </div>

            {!hasChanges && (
              <p className={modalStyles.noChangeWarning}>
                No seat changes selected. Go back and update the reservation first.
              </p>
            )}
          </div>
        )}

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
                if (pendingSeats.length === 0) {
                  alert("Please keep at least one seat in the reservation.");
                  return;
                }

                if (!hasChanges) {
                  alert("Please make a seat change before continuing.");
                  return;
                }

                setModalStep(2);
                return;
              }

              handleConfirm();
            }}
          >
            {modalStep === 1 ? "Continue" : isSubmitting ? "Saving..." : "Confirm"}
          </button>
        </div>
      </div>
    </div>
  );
}
