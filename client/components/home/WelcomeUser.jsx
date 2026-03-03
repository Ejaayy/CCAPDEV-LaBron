import styles from '@/styles/WelcomeUser.module.css';
import Link from 'next/link';

const WelcomeUser = () => {
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
                    <span className={styles.big}>Hi Mr. Paingan,</span>
                    <span className={styles.bigger}>Welcome Back!</span>
                </div>

                <div className={styles.analyticsItem}>
                    <img src="/room.png" alt="Rooms" className={styles.analyticsIcon} />
                    <span className={styles.analyticsLabel}>Rooms Available:</span>
                    <span className={styles.analyticsValue}>8</span>
                </div>

                <div className={styles.analyticsItem}>
                    <img src="/seat.png" alt="Seats" className={styles.analyticsIcon} />
                    <span className={styles.analyticsLabel}>Seats Available:</span>
                    <span className={styles.analyticsValue}>12</span>
                </div>

                <div className={styles.analyticsItem}>
                    <img src="/upcoming.png" alt="Upcoming Reservations" className={styles.analyticsIcon} />
                    <span className={styles.analyticsLabel}>Upcoming Reservations:</span>
                    <span className={styles.analyticsValue}>4</span>
                </div>
            </div>
        </div>
    );
};

export default WelcomeUser;
