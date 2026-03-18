import { useEffect, useState } from "react";
import HomeNavbar from "@/components/layout/HomeNavbar/HomeNavbar";
import styles from "../components/layout/HomeNavbar/HomeNavbar.module.css";
import CustomCalendar from "@/components/home/CustomCalendar";
import WeeklyStats from "@/components/home/WeeklyStats"; 
import WelcomeUser from "@/components/home/WelcomeUser";
import UpcomingReservations from "@/components/home/UpcomingReservations";
import SelectStudents from "@/components/home/SelectStudents";
import AuthWrapper from "@/components/layout/AuthWrapper";

export default function Home(){
     const [myReservations, setMyReservations] = useState([]);
     const [reservationsState, setReservationsState] = useState([]);
     const [userStats, setUserStats] = useState([]);
     const [availableStats, setAvailableStats] = useState({rooms: 0, slots: 0});

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

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const [reservationsResponse, statsResponse, availableStatsResponse] = await Promise.all([
                    fetch('http://localhost:3001/api/reservations/my-reservations', {
                        method: 'GET',
                        credentials: 'include',
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    }),
                    fetch('http://localhost:3001/api/reservations/my-stats', {
                        method: 'GET',
                        credentials: 'include',
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    }),
                    fetch('http://localhost:3001/api/reservations/available-stats', {
                        method: 'GET',
                        credentials: 'include',
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    })
                ]);

                if (reservationsResponse.status === 401 || statsResponse.status === 401) {
                    console.warn("User is not logged in. Cannot fetch dashboard data.");
                    setMyReservations([]);
                    setReservationsState([]);
                    setUserStats([]);
                    return;
                }

                if (!reservationsResponse.ok) {
                    throw new Error("Failed to fetch reservations");;
                }

                if (!statsResponse.ok) {
                    throw new Error("Failed to fetch user stats");;
                }

                const reservationObjects = await reservationsResponse.json();
                reservationObjects.sort((a, b) => {
                    const getTimestamp = (dateStr, timeStr) => {
                        if (!dateStr || !timeStr || timeStr === "N/A") return Infinity; 
                        const startTime = timeStr.split(' - ')[0]; 
                        return new Date(`${dateStr} ${startTime}`).getTime();
                    };

                    return getTimestamp(a.rawDate, a.reservationTime) - getTimestamp(b.rawDate, b.reservationTime);
                });
                setReservationsState(reservationObjects);

                const rawDates = reservationObjects.map(res => res.rawDate).filter(date => date !== null);
                const uniqueDates = Array.from(new Set(rawDates));
                setMyReservations(uniqueDates);

                const stats = await statsResponse.json();
                setUserStats(stats);

                if (availableStatsResponse.ok) {
                    const availableStatsData = await availableStatsResponse.json();
                    setAvailableStats({rooms: availableStatsData.roomsAvailable, slots: availableStatsData.slotsAvailable});
                } else {
                    console.warn("Failed to fetch availability stats");
                }

            } catch (error) {
                console.error("Failed to load dashboard data:", error);
                setMyReservations([]);
                setReservationsState([]);
                setUserStats([]);
                setAvailableStats({rooms: 0, slots: 0});
            }
        };

        fetchDashboardData();
    }, []);

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
                        <WelcomeUser 
                            upcomingCount={reservationsState.length}
                            availableRooms={availableStats.rooms} 
                            availableSlots={availableStats.slots}
                        />
                    </div>

                    <div className={styles['right-container']}>
                        <h4 style={{ margin: "0 0 10px 0", fontSize: '0.95rem' }}>Upcoming Reservations</h4>
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