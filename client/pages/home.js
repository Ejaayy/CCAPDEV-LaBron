import { useMemo } from "react";
import { useRouter } from "next/router";

// Layout + UI components that build the dashboard page
import HomeNavbar from "@/components/layout/HomeNavbar/HomeNavbar";
import styles from "../components/layout/HomeNavbar/HomeNavbar.module.css";


import CustomCalendar from "@/components/dashboard/student/CustomCalendar";
import WeeklyStats from "@/components/dashboard/student/WeeklyStats";
import WelcomeUser from "@/components/dashboard/student/WelcomeUser";
import UpcomingReservations from "@/components/dashboard/student/UpcomingReservations";
import SelectStudents from "@/components/dashboard/student/SelectStudents";

// Wrapper that ensures only logged-in users can access this page
import AuthWrapper from "@/components/layout/AuthWrapper";

// Custom hooks that fetch data related to the logged-in user
import useAuth from "@/hooks/useAuth";
import {
  useMyReservations,
  useMyStats,
  useAvailabilityStats,
} from "@/hooks/useReservations";

/*
  Sort reservations by their starting time.
  We convert each reservation's date + start time into a timestamp
  so we can sort them chronologically (earliest first).
*/
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

/*
  Extract all unique reservation dates.
  Used to highlight reserved days in the calendar.
*/
function getReservedDates(reservations) {
  const rawDates = reservations
    .map((reservation) => reservation.rawDate)
    .filter((date) => date !== null);

  return Array.from(new Set(rawDates));
}

export default function Home() {

  const router = useRouter(); //allows redirecting user to other pages

  //Custom hooks fetch backend data:
  const { user } = useAuth(); //currently logged in user
  const { reservations } = useMyReservations(); //user's booked reservations
  const { stats } = useMyStats(); //summary info for dashboard
  const { availability } = useAvailabilityStats(); //number of available rooms/slots

   /*
    Quick action buttons shown in WeeklyStats component.
    Each button redirects the user to a page.
  */
  const quickActions = [
    {
      id: "book",
      label: "Reserve Next Available Slot",
      icon: "/next_available_seat.png",
      onClick: () => {
        router.push("/reserve?autoSelect=true");
      },
    },
    {
      id: "edit",
      label: "Manage Latest Reservation",
      icon: "/manage_latest.png",
      onClick: () => {
        router.push("/edit-reservations/my-reservations?autoSelect=true");
      },
    },
  ];

  /*
    useMemo caches computed values so they are not recalculated
    unless reservations change.

    sortedReservations -> reservations ordered by date/time
    reservedDates -> list of unique dates for calendar highlighting
  */
  const sortedReservations = useMemo(() => {
    return sortReservationsByStart(reservations);
  }, [reservations]);

  const reservedDates = useMemo(() => {
    return getReservedDates(sortedReservations);
  }, [sortedReservations]);

  return (
    <AuthWrapper>
      <div className={styles.homePage}>
        <HomeNavbar />

        <div className={styles["main-panel"]}>
          <div className={styles["left-column"]}>
            <div className={styles["left-container-CustomCalendar"]}>
              <CustomCalendar reservedDates={reservedDates} />
            </div>

            <div className={styles["left-container-WeeklyStats"]}>
              <WeeklyStats stats={stats} actions={quickActions} />
            </div>
          </div>

          <div className={styles["right-column"]}>
            <div className={styles["right-container"]}>
              <WelcomeUser
                upcomingCount={sortedReservations.length}
                availableRooms={availability.roomsAvailable}
                availableSlots={availability.slotsAvailable}
              />
            </div>

            <div className={styles["right-container"]}>
              <h4 style={{ margin: "0 0 10px 0", fontSize: "0.95rem" }}>
                Upcoming Reservations
              </h4>
              <UpcomingReservations reservations={sortedReservations} />
            </div>

            <div className={styles["right-container"]}>
              <SelectStudents currentUserId={user?._id} showAddButton={false} />
            </div>
          </div>
        </div>
      </div>
    </AuthWrapper>
  );
}