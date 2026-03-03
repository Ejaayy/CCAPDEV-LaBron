import { useState } from "react";
import styles from '@/styles/Announcements.module.css';

const Announcements = () => {
    return (
        <div className={styles.announcementsWrapper}>
            <div className={styles.labelContainer}>
                <span className={styles.containerName}>ANNOUNCEMENTS</span>
            </div>

            <div className={styles.menuContainer}>
            <hr className={styles.separator} />

            <div className={styles.menuItem}>
                <span className={styles.icon}>★</span>
                <div className={styles.contentStack}>
                <div className={styles.labelRow}>
                    <span className={styles.label}>GK201 is already full</span>
                    <span className={styles.shortcut}>⇧A</span>
                </div>
                <p className={styles.description}>Description text goes here</p>
                </div>
            </div>

            <div className={styles.menuItem}>
                <span className={styles.icon}>★</span>
                <div className={styles.contentStack}>
                <div className={styles.labelRow}>
                    <span className={styles.label}>Room gets hotter by 1°C</span>
                    <span className={styles.shortcut}>⇧A</span>
                </div>
                <p className={styles.description}>Description text goes here</p>
                </div>
            </div>

            <hr className={styles.separator} />

            <div className={styles.menuItem}>
                <span className={styles.icon}>★</span>
                <div className={styles.contentStack}>
                <div className={styles.labelRow}>
                    <span className={styles.label}>Your reservation was cancelled by Mr. Dolot</span>
                    <span className={styles.shortcut}>⇧A</span>
                </div>
                <p className={styles.description}>Description text goes here</p>
                </div>
            </div>

            <div className={styles.menuItem}>
                <span className={styles.icon}>★</span>
                <div className={styles.contentStack}>
                <div className={styles.labelRow}>
                    <span className={styles.label}>You have an upcoming reservation today</span>
                    <span className={styles.shortcut}>⇧A</span>
                </div>
                <p className={styles.description}>Description text goes here</p>
                </div>
            </div>
            </div>
        </div>
    );
};

export default Announcements;