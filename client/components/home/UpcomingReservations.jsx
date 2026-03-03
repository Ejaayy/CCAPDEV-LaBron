import { useState } from "react";
import styles from '@/styles/Upcoming.module.css';

const UpcomingReservations = ({ reservations = [], handleCheck }) => {
    const displayReservations = reservations || [];

    return (
        <div className={styles['res-scroll-container']}>
            {displayReservations.map((res, index) => (
                <div key={res.id || index} className={styles['res-card']}>
                    <div className={styles['res-icon-section']}>
                        <input
                            type="checkbox"
                            className={styles['res-checkbox-icon']}
                            checked={res.isChecked || false} 
                            onChange={() => handleCheck(res.id)} 
                        />
                    <span className={styles['res-calendar-icon']}>📅</span>
                    </div>

                    <div className={styles['res-info-group']}>
                        <div className={styles['res-meta-header']}>
                            [{res.laboratory}] - REQUESTED ON {res.requestDateTime}
                        </div>
                        <div className={styles['res-title']}>
                            {res.laboratory} - Seat {res.seatNumber}
                        </div>
                    </div>

                    <div className={styles['res-time-section']}>
                        <div className={styles['res-date-text']}>{res.reservationDate}</div>
                        <div className={styles['res-time-text']}>{res.reservationTime}</div>
                    </div>
                </div>
            ))}
            {reservations.length === 0 && (
                <p className={styles['empty-state']}>No upcoming reservations.</p>
            )}
        </div>
    );
};

export default UpcomingReservations;