import styles from "./WelcomeTech.module.css";
import Link from 'next/link';

import useAuth from "@/hooks/useAuth";

const WelcomeTech = ({upcomingCount = 0, availableRooms = 0, availableSlots = 0}) => {

    const { user } = useAuth();

    return(
        <div className={styles.welcomeWrapper}>
            <Link href="/account" className={styles.profileContainer}>
                <div className={styles.profileCircle}>
                    <img src="profilePic.jpg" alt="Profile" className={styles.profilePicture} />
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