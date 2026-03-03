import { useState } from "react";
import { useRouter } from "next/router";
import HomeNavbar from "@/components/layout/HomeNavbar/HomeNavbar";
import ReservationCard from "@/components/edit-reservations/ReservationCard/ReservationCard";
import styles from "./MyReservations.module.css";

export default function MyReservations() {
  const router = useRouter();
  
  const [reservations, setReservations] = useState([
    {
      room: "Room A",
      status: "Confirmed",
      date: "2026-02-15",
      time: "0730–0900",
      seatNumber: "A-12",
      participants: ["Juan Dela Cruz", "Maria Santos"],
      capacity: 30,
    },
    {
      room: "Room B",
      status: "Removed",
      date: "2026-02-16",
      time: "9300–1100",
      seatNumber: "B-05",
      participants: ["Alex Lim"],
      capacity: 20,
    },
    {
      room: "Room C",
      status: "Confirmed",
      date: "2026-02-17",
      time: "1130–1300",
      seatNumber: "C-18",
      participants: [],
      capacity: 25,
    },
    {
      room: "Room D",
      status: "Confirmed",
      date: "2026-02-18",
      time: "1330–1500",
      seatNumber: "D-03",
      participants: ["Ana Garcia", "Pedro Reyes"],
      capacity: 25,
    },
    {
      room: "Room E",
      status: "Confirmed",
      date: "2026-02-19",
      time: "1530–1700",
      seatNumber: "E-22",
      participants: ["Sofia Cruz"],
      capacity: 35,
    },
  ]);

  const editReservation = (index) => {
    // Navigate to reserve page to edit the reservation
    router.push('/reserve');
  };

  return (
    <div className={styles.pageWrapper}>
      <HomeNavbar />

      <div className={styles.content}>
        <h1 className={styles.pageTitle}>My Reservations</h1>

        <div className={styles.reservationList}>
          {reservations.map((res, i) => (
            <ReservationCard
              key={i}
              reservation={res}
              onEdit={() => editReservation(i)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
