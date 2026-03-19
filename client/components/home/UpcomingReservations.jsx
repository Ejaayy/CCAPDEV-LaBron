import { useState } from "react";
import styles from '@/styles/Upcoming.module.css';

const UpcomingReservations = ({ reservations = []}) => {
    const [selectedReservation, setSelectedReservation] = useState(null);

    const displayReservations = reservations || [];

    const formatReservationDate = (dateString) => {
        if (!dateString) return "N/A";
        const [year, month, day] = dateString.split('-');
        const date = new Date(year, month - 1, day);
        return date.toLocaleDateString('en-US', { month: 'long', day: '2-digit', year: 'numeric' });
    };

    const formatSeats = (seats) => {
        if (Array.isArray(seats)) {
            return seats.join(', ');
        }
        return seats || "N/A";
    };

    const handleOpenModal = (reservation) => {
        setSelectedReservation(reservation);
    };

    const handleCloseModal = () => {
        setSelectedReservation(null);
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
                        <div 
                            className={`${styles['res-title']} ${styles['clickable-title']}`}
                            onClick={() => handleOpenModal(res)}
                        >
                            {res.laboratory} - Seat {formatSeats(res.seatNumber)}
                        </div>
                    </div>

                    <div className={styles['res-time-section']}>
                        <div className={styles['res-date-text']}>{formatReservationDate(res.rawDate)}</div>
                        <div className={styles['res-time-text']}>{res.reservationTime}</div>
                    </div>
                </div>
            ))}

            {displayReservations.length === 0 && (
                <p className={styles['empty-state']}>No upcoming reservations.</p>
            )}

            {selectedReservation && (
                <div className={styles['modal-overlay']} onClick={handleCloseModal}>
                    <div className={styles['modal-content']} onClick={(e) => e.stopPropagation()}>
                        <button className={styles['modal-close-btn']} onClick={handleCloseModal}>
                            &times;
                        </button>
                        
                        <h3 className={styles['modal-header']}>Reservation Details</h3>
                        
                        <div className={styles['modal-body']}>
                            <p><strong>Laboratory:</strong> {selectedReservation.laboratory}</p>
                            <p><strong>Seat Number/s:</strong> {formatSeats(selectedReservation.seatNumber)}</p>
                            <p><strong>Date:</strong> {formatReservationDate(selectedReservation.rawDate)}</p>
                            <p><strong>Time:</strong> {selectedReservation.reservationTime}</p>
                            <p><strong>Requested On:</strong> {selectedReservation.requestDateTime}</p>
                            
                            {selectedReservation.status && <p><strong>Status:</strong> {selectedReservation.status}</p>}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UpcomingReservations;