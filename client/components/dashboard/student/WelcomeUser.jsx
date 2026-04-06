import styles from '@/styles/WelcomeUser.module.css';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { API_BASE_URL } from "@/constants/api";
import AccountStyles from "@/styles/AccountPage.module.css";

const WelcomeUser = ({upcomingCount = 0, availableRooms = 0, availableSlots = 0}) => {
    const [user, setUser] = useState(null);
    const imagePath = user?.profilePicturePath || '/uploads/profiles/default.png';
    const fullImageUrl = `${API_BASE_URL.replace("/api", "")}${imagePath}`;

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/auth/me`, {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include'
                });

                if (response.ok) {
                    const data = await response.json();
                    setUser(data);
                }
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        };

        fetchUserData();
    }, []);

    return(
        <div className={styles.welcomeWrapper}>
            <Link href="/account" className={styles.profileContainer}>
                <div className={styles.profileCircle}>
                    <img
                        src={fullImageUrl}
                        alt={`${user?.firstName}'s profile`}
                        className={styles.profilePicture}
                        onError={(e) => {
                            e.target.src = "https://cdn-icons-png.flaticon.com/512/149/149071.png";
                        }}
                    />
                </div>
                <span className={styles.profileHint}>View Profile</span>
            </Link>
            <div className={styles.analyticsContainer}>
                <div className={styles.messageContainer}>
                    <span className={styles.big}>
                        Heya {user ? `${user.lastName}` : "User"},
                    </span>
                    <span className={styles.bigger}>Welcome Back!</span>
                </div>

                <div className={styles.analyticsItem}>
                    <img src="/room.png" alt="Rooms" className={styles.analyticsIcon} />
                    <span className={styles.analyticsLabel}>Rooms Available:</span>
                    <span className={styles.analyticsValue}>{availableRooms}</span>
                </div>

                <div className={styles.analyticsItem}>
                    <img src="/seat.png" alt="Slots" className={styles.analyticsIcon} />
                    <span className={styles.analyticsLabel}>Slots Available:</span>
                    <span className={styles.analyticsValue}>{availableSlots}</span>
                </div>

                <div className={styles.analyticsItem}>
                    <img src="/upcoming.png" alt="Upcoming Reservations" className={styles.analyticsIcon} />
                    <span className={styles.analyticsLabel}>Upcoming Reservations:</span>
                    <span className={styles.analyticsValue}>{upcomingCount}</span>
                </div>
            </div>
        </div>
    );
};

export default WelcomeUser;
