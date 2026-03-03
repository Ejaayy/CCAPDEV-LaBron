import { useState } from "react";
import styles from "@/styles/Calendar.module.css";

const CustomCalendar = ({ reservedDates = [] }) => {
    const daysInMonth = 28;
    const startDayOffSet = 0;

    const month = "02";
    const year = "2026";

    const calendarSlots = [];

    for (let i = 0; i < startDayOffSet; i++) {
        calendarSlots.push({ day: null, fullDate: null});
    }

    for (let d = 1; d <= daysInMonth; d++){
        const formattedDate = `${year}-${month}-${d.toString().padStart(2, '0')}`;
        calendarSlots.push({ day: d, fullDate: formattedDate});
    }

    return (
        <div className={styles.calendarCard}>
            <div className={styles.header}>
                <button className={styles.navBtn}>&lt;</button>
                <div className={styles.selectGroup}>
                    <select value="Feb" readOnly><option>Feb</option></select>
                    <select value="2026" readOnly><option>2026</option></select>
                </div>
                <button className={styles.navBtn}>&gt;</button>
            </div>

            <div className={styles.grid}>
                {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(dw => (
                    <div key={dw} className={styles.weekday}>{dw}</div>
                ))}

                {calendarSlots.map((slot, index) => {
                    const isReserved = reservedDates.includes(slot.fullDate);

                    return (
                        <div
                            key={index}
                            className={`
                                ${styles.day}
                                ${!slot.day ? styles.empty : ''}
                                ${isReserved ? styles.reserved : ''}
                            `}
                        >
                            {slot.day}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default CustomCalendar;