import { useState } from "react";
import HomeNavbar from "@/components/layout/HomeNavbar/HomeNavbar";
import styles from "../components/layout/HomeNavbar/HomeNavbar.module.css";
import CustomCalendar from "@/components/home/CustomCalendar";
import WeeklyStats from "@/components/home/WeeklyStats"; // Updated to handle both stats and actions
import WelcomeUser from "@/components/home/WelcomeUser";
import UpcomingReservations from "@/components/home/UpcomingReservations";
import SelectStudents from "@/components/home/SelectStudents";

export default function Home(){
    const myReservations = ["2026-02-06", "2026-02-07", "2026-02-09", "2026-02-14"];
    
    // Data updated to match the screenshot provided
    const userStats = [
        { 
            id: 0, 
            label: 'Before your latest reservation',
            value: '15 Minutes',
            icon: '🔔',
            isAlert: true // We can use this to apply specific alert styling
        },
        {
            id: 1,
            label: 'Hours (Lab Time)',
            value: '14 Hours',
            icon: '🕒',
        },
        {
            id: 2,
            label: '(Unique Labs Used)',
            value: '3',
            subtext: 'V501, Y403, Br. Andrew',
            icon: '🖥️',
        }
    ];

    // Data for the two quick actions requested
    const quickActions = [
        {
            id: 'book',
            label: 'Book Next Available Seat',
            icon: '/next_available_seat.png',
        },
        {
            id: 'edit',
            label: 'Manage Latest Reservation',
            icon: '/manage_latest.png'
        }
    ];

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
                {/* Left Column */}
                <div className={styles['left-column']}>
                    <div className={styles['left-container-CustomCalendar']}>
                        <CustomCalendar reservedDates={myReservations} />
                    </div>

                    <div className={styles['left-container-WeeklyStats']}>
                        <WeeklyStats 
                            stats={userStats} 
                            actions={quickActions} 
                        />
                    </div>
                </div>

                <div className={styles['right-column']}>
                    <div className={styles['right-container']}>
                        <WelcomeUser />
                    </div>

                    <div className={styles['right-container']}>
                        <h4 style={{ margin: "0 0 10px 0", fontSize: '0.95rem' }}>Current Reservations</h4>
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