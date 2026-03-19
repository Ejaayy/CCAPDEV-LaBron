import { useState } from "react";
import styles from '@/styles/Upcoming.module.css';

const UpcomingReservations = ({ reservations = []}) => {
    const displayReservations = reservations || [];

    const formatReservationDate = (dateString) => {
        if (!dateString) return "N/A";
        const [year, month, day] = dateString.split('-');
        const date = new Date(year, month - 1, day);
        return date.toLocaleDateString('en-US', { month: 'long', day: '2-digit', year: 'numeric' });
    };

    return (
        <div className={styles['res-scroll-container']}>
            {displayReservations.map((res, index) => (
                <div key={res.id || index} className={styles['res-card']}>
                    <div className={styles['res-icon-section']}>
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
                        <div className={styles['res-date-text']}>{formatReservationDate(res.rawDate)}</div>
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