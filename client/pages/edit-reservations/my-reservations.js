import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import HomeNavbar from "@/components/layout/HomeNavbar/HomeNavbar";
import ReservationCard from "@/components/edit-reservations/ReservationCard/ReservationCard";
import styles from "./MyReservations.module.css";

export default function MyReservations() {
  const router = useRouter();
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);

  const isAutoSelect = router.query.autoSelect === 'true';

  const editReservation = (id) => {
    router.push(`/reserve?edit=${id}`);
  };

  useEffect(() => {
    if (!router.isReady) return;

    const fetchReservations = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/reservations/my-reservations', {
          method: 'GET',
          credentials: 'include', 
          headers: { 'Content-Type': 'application/json' }
        });

        if (response.ok) {
          const data = await response.json();
          setReservations(data);
        } else if (response.status === 401) {
          router.push('/auth/login');
        }
      } catch (error) {
        console.error("Failed to load reservations:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReservations();
  }, [router.isReady]); 

  if (loading) return <div className={styles.pageWrapper}>Loading...</div>;

  const sortedReservations = [...reservations].sort((a, b) => {
    const getTimestamp = (dateStr, timeStr) => {
        if (!dateStr || !timeStr || timeStr === "N/A") return Infinity; 
        const startTime = timeStr.split(' - ')[0]; 
        return new Date(`${dateStr} ${startTime}`).getTime();
    };
    return getTimestamp(a.rawDate, a.reservationTime) - getTimestamp(b.rawDate, b.reservationTime);
  });

  const displayReservations = isAutoSelect && sortedReservations.length > 0 
    ? [sortedReservations[0]] 
    : sortedReservations;

  return (
    <div className={styles.pageWrapper}>
      <HomeNavbar />
      <div className={styles.content}>
        
        {isAutoSelect && displayReservations.length > 0 && (
            <h2 className={styles.manageLatestTitle}>Managing Latest Reservation</h2>
        )}

        <div className={styles.reservationList}>
          {displayReservations.length > 0 ? (
            displayReservations.map((res, index) => (
              <div 
                key={res.id || res._id} 
                className={isAutoSelect && index === 0 ? styles.highlightedCard : ''}
              >
                <ReservationCard
                  reservation={res}
                  onEdit={() => editReservation(res._id)}
                />
              </div>
            ))
          ) : (
            <p className={styles.noData}>You have no upcoming reservations.</p>
          )}
        </div>
      </div>
    </div>
  );
}