import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import HomeNavbar from "@/components/layout/HomeNavbar/HomeNavbar";
import styles from "../components/layout/HomeNavbar/HomeNavbar.module.css";
import CustomCalendar from "@/components/home/CustomCalendar";
import WeeklyStats from "@/components/home/WeeklyStats"; 
import WelcomeUser from "@/components/home/WelcomeUser";
import UpcomingReservations from "@/components/home/UpcomingReservations";
import SelectStudents from "@/components/home/SelectStudents";
import AuthWrapper from "@/components/layout/AuthWrapper";

export default function Home(){
     const [currentUser, setCurrentUser] = useState(null);
     const [myReservations, setMyReservations] = useState([]);
     const [reservationsState, setReservationsState] = useState([]);
     const [userStats, setUserStats] = useState([]);
     const [availableStats, setAvailableStats] = useState({rooms: 0, slots: 0});
     const router = useRouter();

    // Data for the two quick actions requested
    const quickActions = [
        {
            id: 'book',
            label: 'Reserve Next Available Slot',
            icon: '/next_available_seat.png',
            onClick: () => {router.push('/reserve?autoSelect=true')}
        },
        {
            id: 'edit',
            label: 'Manage Latest Reservation',
            icon: '/manage_latest.png',
            onClick: () => {router.push('/edit-reservations/my-reservations?autoSelect=true')}
        }
    ];

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const [userResponse, reservationsResponse, statsResponse, availableStatsResponse] = await Promise.all([
                    fetch('http://localhost:3001/api/auth/me', {
                        method: 'GET',
                        credentials: 'include',
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    }), 
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
                if (userResponse.ok) {
                    const userData = await userResponse.json();
                    setCurrentUser(userData);
                }
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
                setCurrentUser(null);
                setMyReservations([]);
                setReservationsState([]);
                setUserStats([]);
                setAvailableStats({rooms: 0, slots: 0});
            }
        };

        fetchDashboardData();
    }, []);

    return(
        <AuthWrapper>
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
                        <UpcomingReservations reservations={reservationsState} />
                    </div>

                    <div className={styles['right-container']}>
                        <SelectStudents currentUserId={currentUser?._id} />
                    </div>
                </div>
            </div>
        </div>
        </AuthWrapper>
    )
}