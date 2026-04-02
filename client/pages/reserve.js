import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";

import ReserveStyles from "@/styles/ReservePage.module.css";
import HomeNavbar from "@/components/layout/HomeNavbar/HomeNavbar";
import BookingStepper from "@/components/shared/Stepper/Stepper";
import DateSelector from "@/components/shared/DateSelector/DateSelector";
import LabSlotSelector from "@/components/reservation/LabSlotSelector/LabSlotSelector";
import SeatSelector from "@/components/reservation/SeatSelector/SeatSelector";
import SuccessView from "@/components/shared/SuccessView/SuccessView";

import useAuth from "@/hooks/useAuth";
import { useWeeklyOverview, useSlotsByDate } from "@/hooks/useSlots";
import { createReservation } from "@/lib/reservations";

function getNextSevenDays() {
  const days = [];
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  for (let i = 0; i < 7; i++) {
    const d = new Date();
    d.setDate(d.getDate() + i);

    days.push({
      displayDay: dayNames[d.getDay()],
      displayDate: `${d.getDate().toString().padStart(2, "0")} ${monthNames[d.getMonth()]}`,
      isoDate: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`,
      isAvailable: true,
      labs: 0,
    });
  }

  return days;
}

export default function ReservePage() {
  const router = useRouter();
  const { autoSelect } = router.query;

  const { user, loading: userLoading } = useAuth();
  const { overview } = useWeeklyOverview();

  const baseDates = useMemo(() => getNextSevenDays(), []);
  const defaultDate = baseDates[0].isoDate;

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [countdown, setCountdown] = useState(10);
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedLabSlot, setSelectedLabSlot] = useState(null);
  const [reserveAnonymously, setReserveAnonymously] = useState(false);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [manualSelectedDate, setManualSelectedDate] = useState(null);

  const queryDates = useMemo(() => {
    return baseDates.map((dateObj) => {
      const match = overview.find((item) => item.date === dateObj.isoDate);

      return {
        ...dateObj,
        labs: match ? match.count : 0,
        isAvailable: match ? match.count > 0 : false,
      };
    });
  }, [baseDates, overview]);

  const autoSelectedDate = useMemo(() => {
    if (!router.isReady || autoSelect !== "true" || !overview.length) {
      return null;
    }

    const upcomingDays = baseDates.map((day) => day.isoDate);
    const targetDayObject = overview.find(
      (item) => item.count > 0 && upcomingDays.includes(item.date)
    );

    return targetDayObject?.date || defaultDate;
  }, [router.isReady, autoSelect, overview, baseDates, defaultDate]);

  const effectiveSelectedDate = manualSelectedDate ?? autoSelectedDate ?? defaultDate;

  const { slots: availableSlots } = useSlotsByDate(effectiveSelectedDate);

  const autoSelectedLabSlot = useMemo(() => {
    if (autoSelect !== "true" || !availableSlots.length) {
      return null;
    }

    return availableSlots.find((slot) => slot.isAvailable !== false) || availableSlots[0];
  }, [autoSelect, availableSlots]);

  const effectiveSelectedLabSlot = selectedLabSlot ?? autoSelectedLabSlot;

  const effectiveCurrentStep = useMemo(() => {
    if (currentStep === 1 && autoSelect === "true" && effectiveSelectedLabSlot) {
      return 2;
    }

    return currentStep;
  }, [currentStep, autoSelect, effectiveSelectedLabSlot]);

  const totalSteps = 3;

  useEffect(() => {
    if (!userLoading && !user) {
      router.push("/auth/login");
    }
  }, [userLoading, user, router]);

  useEffect(() => {
    if (isSubmitted && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }

    if (isSubmitted && countdown === 0) {
      router.push("/home");
    }
  }, [isSubmitted, countdown, router]);

  useEffect(() => {
    if (autoSelect === "true" && effectiveSelectedLabSlot && router.isReady) {
      router.replace("/reserve", undefined, { shallow: true });
    }
  }, [autoSelect, effectiveSelectedLabSlot, router]);

  async function handleSubmitReservation() {
    const reservationData = {
      reservedBy: user?._id,
      reservedFor: user?._id,
      isAnonymous: reserveAnonymously,
      slots: selectedSeats.map((seatId) => ({
        slot: effectiveSelectedLabSlot._id,
        seat: seatId,
      })),
    };

    try {
      await createReservation(reservationData);
      setIsSubmitted(true);
    } catch (err) {
      console.error("Connection failed:", err);
      alert(err.message || "Could not connect to the server.");
    }
  }

  return (
    <div style={{ position: "relative", backgroundColor: "#070B20", display: "flex", flexDirection: "column" }}>
      <HomeNavbar />

      <BookingStepper currentStep={effectiveCurrentStep} />

      <div className={ReserveStyles["main-panel"]}>
        {!isSubmitted ? (
          <div className={ReserveStyles["selection-panel"]}>
            {effectiveCurrentStep === 1 && (
              <div>
                <h1>Select your Laboratory booking date</h1>

                <DateSelector
                  dates={queryDates}
                  selectedDate={effectiveSelectedDate}
                  onDateSelect={(newDate) => {
                    setManualSelectedDate(newDate);
                    setSelectedLabSlot(null);
                    setSelectedSeats([]);
                    setCurrentStep(1);
                  }}
                />

                <LabSlotSelector
                  slots={availableSlots}
                  onSelect={setSelectedLabSlot}
                  selectedSlotId={effectiveSelectedLabSlot?._id}
                />
              </div>
            )}

            {effectiveCurrentStep === 2 && (
              <SeatSelector
                onSelect={setSelectedSeats}
                selectedSlotId={effectiveSelectedLabSlot?._id}
                labData={effectiveSelectedLabSlot?.lab}
              />
            )}

            {effectiveCurrentStep === 3 && (
              <div className={ReserveStyles.summaryContainer}>
                <h1>Reservation Summary</h1>

                <div className={ReserveStyles.summaryCard}>
                  <div className={ReserveStyles.summaryRow}>
                    <span className={ReserveStyles.summaryLabel}>Laboratory:</span>
                    <span className={ReserveStyles.summaryValue}>
                      {effectiveSelectedLabSlot?.lab?.name || "Not Selected"}
                    </span>
                  </div>

                  <div className={ReserveStyles.summaryRow}>
                    <span className={ReserveStyles.summaryLabel}>Date:</span>
                    <span className={ReserveStyles.summaryValue}>{effectiveSelectedDate}</span>
                  </div>

                  <div className={ReserveStyles.summaryRow}>
                    <span className={ReserveStyles.summaryLabel}>Time Slot:</span>
                    <span className={ReserveStyles.summaryValue}>
                      {effectiveSelectedLabSlot?.startTime}-{effectiveSelectedLabSlot?.endTime}
                    </span>
                  </div>

                  <div className={ReserveStyles.summaryRow}>
                    <span className={ReserveStyles.summaryLabel}>Seat Number:</span>
                    <span className={ReserveStyles.summaryValue}>
                      {selectedSeats.length > 0 ? selectedSeats.join(", ") : "None selected"}
                    </span>
                  </div>
                </div>

                <div className={ReserveStyles.anonymousCheckbox}>
                  <label className={ReserveStyles.checkboxLabel}>
                    <input
                      type="checkbox"
                      checked={reserveAnonymously}
                      onChange={(e) => setReserveAnonymously(e.target.checked)}
                      className={ReserveStyles.checkbox}
                    />
                    <span className={ReserveStyles.checkmark}></span>
                    Reserve Anonymously
                  </label>

                  <p className={ReserveStyles.anonymousHint}>
                    Your name will not be visible to other students in this reservation.
                  </p>
                </div>
              </div>
            )}

            <hr className={ReserveStyles.divider} />

            <div className={ReserveStyles["footer-button-panel"]}>
              <div
                className={ReserveStyles["back-button"]}
                onClick={() => {
                  if (effectiveCurrentStep > 1) {
                    setCurrentStep(effectiveCurrentStep - 1);
                  } else {
                    router.push("/home");
                  }
                }}
              >
                Back
              </div>

              <div
                className={ReserveStyles["continue-button"]}
                onClick={() => {
                  if (effectiveCurrentStep === 1 && !effectiveSelectedLabSlot) {
                    alert("Please select a laboratory first");
                    return;
                  }

                  if (effectiveCurrentStep === 2 && selectedSeats.length === 0) {
                    alert("Please select at least one seat");
                    return;
                  }

                  if (effectiveCurrentStep < totalSteps) {
                    setCurrentStep(effectiveCurrentStep + 1);
                    return;
                  }

                  handleSubmitReservation();
                }}
              >
                Continue
              </div>
            </div>
          </div>
        ) : (
          <SuccessView
            labName={effectiveSelectedLabSlot?.lab?.name}
            date={effectiveSelectedDate}
            seats={selectedSeats}
            countdown={countdown}
          />
        )}
      </div>
    </div>
  );
}
