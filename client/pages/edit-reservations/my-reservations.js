import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import HomeNavbar from "@/components/layout/HomeNavbar/HomeNavbar";
import ReservationCard from "@/components/edit-reservations/ReservationCard/ReservationCard";
import styles from "./MyReservations.module.css";

export default function MyReservations() {
  const router = useRouter();
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);

  const editReservation = (id) => {
    router.push(`/reserve?edit=${id}`);
  };

  useEffect(() => {
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
          // redirect
          router.push('/auth/login');
        }
      } catch (error) {
        console.error("Failed to load reservations:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReservations();
  }, [router]);

  if (loading) return <div className={styles.pageWrapper}>Loading...</div>;

  return (
    <div className={styles.pageWrapper}>
      <HomeNavbar />
      <div className={styles.content}>
        <div className={styles.reservationList}>
       
          {reservations.length > 0 ? (
            reservations.map((res) => (
              <ReservationCard
                key={res.id} 
                reservation={res}
                onEdit={() => editReservation(res._id)}
              />
            ))
          ) : (
            <p className={styles.noData}>You have no upcoming reservations.</p>
          )}
        </div>
      </div>
    </div>
  );
}