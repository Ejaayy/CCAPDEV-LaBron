import { useState } from "react";
import styles from "@/styles/Calendar.module.css";

const CustomCalendar = ({ reservedDates = [] }) => {
    const today = new Date();   
    
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());

    // Get the exact number of days in the currently selected month/year
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    
    // Get the day of the week the 1st of the month 
    const startDayOffSet = new Date(currentYear, currentMonth, 1).getDay();

    const calendarSlots = [];

    for (let i = 0; i < startDayOffSet; i++) {
        calendarSlots.push({ day: null, fullDate: null });
    }


    for (let d = 1; d <= daysInMonth; d++) {
        const formattedMonth = (currentMonth + 1).toString().padStart(2, '0');
        const formattedDate = `${currentYear}-${formattedMonth}-${d.toString().padStart(2, '0')}`;
        calendarSlots.push({ day: d, fullDate: formattedDate });
    }

     // Navigation Handlers
    const handlePrevMonth = () => {
        if (currentMonth === 0) {
            setCurrentMonth(11);
            setCurrentYear(prev => prev - 1);
        } else {
            setCurrentMonth(prev => prev - 1);
        }
    };

    const handleNextMonth = () => {
        if (currentMonth === 11) {
            setCurrentMonth(0); 
            setCurrentYear(prev => prev + 1);
        } else {
            setCurrentMonth(prev => prev + 1);
        }
    };

   
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    // Generates years from 1900 to 2100 
    const years = Array.from({ length: 201 }, (_, i) => 1900 + i); 

    return (
        <div className={styles.calendarCard}>
            <div className={styles.header}>
                <button className={styles.navBtn} onClick={handlePrevMonth}>&lt;</button>
                <div className={styles.selectGroup}>
                    <select 
                        value={currentMonth} 
                        onChange={(e) => setCurrentMonth(Number(e.target.value))}
                    >
                        {monthNames.map((m, index) => (
                            <option key={index} value={index}>{m}</option>
                        ))}
                    </select>
                    <select 
                        value={currentYear} 
                        onChange={(e) => setCurrentYear(Number(e.target.value))}
                    >
                        {years.map(y => (
                            <option key={y} value={y}>{y}</option>
                        ))}
                    </select>
                </div>
                <button className={styles.navBtn} onClick={handleNextMonth}>&gt;</button>
            </div>

            <div className={styles.grid}>
                {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(dw => (
                    <div key={dw} className={styles.weekday}>{dw}</div>
                ))}

                {calendarSlots.map((slot, index) => {
                    const isReserved = Array.isArray(reservedDates) && reservedDates.includes(slot.fullDate);

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