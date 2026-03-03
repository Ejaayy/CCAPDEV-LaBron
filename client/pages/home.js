import { useState } from "react";
import HomeNavbar from "@/components/layout/HomeNavbar/HomeNavbar";
import styles from "../components/layout/HomeNavbar/HomeNavbar.module.css";
import SelectStudent from "@/components/home/SelectStudents";
import CustomCalendar from "@/components/home/CustomCalendar";
import Announcements from "@/components/home/Announcements";
import WelcomeUser from "@/components/home/WelcomeUser";
import UpcomingReservations from "@/components/home/UpcomingReservations";
import SelectStudents from "@/components/home/SelectStudents";

export default function Home(){
    const myReservations = ["2026-02-06", "2026-02-07", "2026-02-09", "2026-02-14"];
    const reservationData = [
        {
            id: 1,
            laboratory: "Yuchengco Computer Lab Y403",
            seatNumber: "A-12",
            reservationDate: "Feb 02, 2026",
            reservationTime: "09:00 AM - 11:00 AM",
            requestDateTime: "January 25, 2026 02:15 PM"
        },
        {
            id: 2,
            laboratory: "Gokongwei Computer Lab G403",
            seatNumber: "C-05",
            reservationDate: "Feb 07, 2026",
            reservationTime: "01:30 PM - 03:30 PM",
            requestDateTime: "January 26, 2026 02:15 PM"
        },
        {
            id: 3,
            laboratory: "Br. Andrew Computer Lab A1901",
            seatNumber: "PC-42",
            reservationDate: "Feb 09, 2026",
            reservationTime: "10:00 AM - 12:00 PM",
            requestDateTime: "January 27, 2026 02:15 PM"
        },
        {
            id: 4,
            laboratory: "Velaso Computer Lab V501",
            seatNumber: "BR-42",
            reservationDate: "Feb 14, 2026",
            reservationTime: "10:00 AM - 12:00 PM",
            requestDateTime: "January 28, 2026 02:15 PM"
        }
    ];

    const [reservationsState, setReservationsState] = useState(reservationData);

    const handleCheck = (id) => {
        setReservationsState(prev =>
            prev.map(res =>
                res.id === id ? {...res, isChecked: !res.isChecked} : res
            )
        );
    };

    return(
        <div className={styles.homePage}>
            <HomeNavbar/>

            <div className={styles['main-panel']}>
                <div>
                    <div className={styles['left-container-CustomCalendar']}>
                        <CustomCalendar reservedDates={myReservations} />
                    </div>

                    <div className={styles['left-container-Announcements']}>
                        <Announcements />
                    </div>
                </div>

                <div>
                    <div className={styles['right-container']}>
                        <WelcomeUser />
                    </div>

                    <div className={styles['right-container']}>
                        <h4 style={{ margin: 0, fontSize: '0.95rem' }}>Current Reservations</h4>
                        <UpcomingReservations reservations={reservationsState} handleCheck={handleCheck}/>
                    </div>

                    <div className={styles['right-container']}>
                        <SelectStudents />
                    </div>
                </div>
            </div>
        </div>
    )
}