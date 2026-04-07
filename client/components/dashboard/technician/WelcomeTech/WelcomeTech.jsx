import styles from "./WelcomeTech.module.css";
import Link from 'next/link';

import useAuth from "@/hooks/useAuth";
import { API_BASE_URL } from "@/constants/api";

const WelcomeTech = ({upcomingCount = 0, availableRooms = 0, availableSlots = 0}) => {

    const { user } = useAuth();
    const fullImageUrl = user?.profilePicturePath
        ? `${API_BASE_URL.replace("/api", "")}${user.profilePicturePath}`
        : `${API_BASE_URL.replace("/api", "")}/uploads/profiles/default.png`;

    return(
        <div className={styles.welcomeWrapper}>
            <Link href="/account" className={styles.profileContainer}>
                <div className={styles.profileCircle}>
                    <img
                        src={fullImageUrl}
                        alt={user ? `${user.firstName}'s Profile` : "Profile"}
                        className={styles.profilePicture}
                        onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "https://cdn-icons-png.flaticon.com/512/149/149071.png";
                        }}
                    />
                </div>
                <span className={styles.profileHint}>View Profile</span>
            </Link>
            <div className={styles.analyticsContainer}>
                <div className={styles.messageContainer}>
                    <span className={styles.big}>
                        Heya {user ? `${user.firstName}` : "User"},
                    </span>
                    <span className={styles.bigger}>Welcome Back!</span>
                </div>
            </div>
        </div>
    );
};

export default WelcomeTech;