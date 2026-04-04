import { useEffect, useMemo } from "react";
import { useRouter } from "next/router";

import HomeNavbar from "@/components/layout/HomeNavbar/HomeNavbar";
import ReservationCard from "@/components/reservations-management/ReservationCard/ReservationCard";
import useAuth from "@/hooks/useAuth";
import { useMyReservations } from "@/hooks/useReservations";
import styles from "./MyReservations.module.css";

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

export default function MyReservations() {
  const router = useRouter();
  const { user, loading: userLoading } = useAuth();
  const { reservations, loading } = useMyReservations();

  const isAutoSelect = router.query.autoSelect === "true";

  useEffect(() => {
    if (!userLoading && !user) {
      router.push("/auth/login");
      return;
    }

    if (!userLoading && user?.role !== "student") {
      router.push(user?.role === "technician" ? "/edit-reservations/manage-reservations" : "/home");
    }
  }, [userLoading, user, router]);

  const sortedReservations = useMemo(() => {
    return sortReservationsByStart(reservations);
  }, [reservations]);

  const displayReservations =
    isAutoSelect && sortedReservations.length > 0
      ? [sortedReservations[0]]
      : sortedReservations;

  function editReservation(id) {
    router.push(`/reserve?edit=${id}`);
  }

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
                  onEdit={() => editReservation(reservation.id || reservation._id)}
                />
              </div>
            ))
          ) : (
            <p style={{ color: "#1F2234" }}>You have no upcoming reservations.</p>
          )}
        </div>
      </div>
    </div>
  );
}
