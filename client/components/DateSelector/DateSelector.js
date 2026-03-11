import styles from './DateSelector.module.css';

const DATES = [
  { day: 'Sun', date: '08 Feb', labs: 0 },
  { day: 'Mon', date: '09 Feb', labs: 0 },
  { day: 'Tue', date: '10 Feb', labs: 0 },
  { day: 'Wed', date: '11 Feb', labs: 5 },
  { day: 'Thu', date: '12 Feb', labs: 8 },
  { day: 'Fri', date: '13 Feb', labs: 5 },
  { day: 'Sat', date: '14 Feb', labs: 10 },
];

export default function DateSelector({ dates, selectedDate, onDateSelect }) {
  return (
    <div className={styles.dateSelectorContainer}>
      <button className={styles.navArrow}>&lt;</button>
      
      <div className={styles.dateGrid}>
        {dates.map((item, index) => {
          const isSelected = item.isoDate === selectedDate;
          const isAvailable = item.isAvailable;

          return (
            <div 
              key={item.isoDate} 
              className={`${styles.dateCard} ${isSelected ? styles.activeDate : ''}`}
              onClick={()=> isAvailable && onDateSelect(item.isoDate)}
            >
              <span className={styles.dateLabel}>{item.displayDay} {item.displayDate}</span>
              <span className={styles.labCount}>
                {isAvailable ? `${item.labs} Labs Available` : 'Not Available'}
              </span>
            </div>
          );
        })}
      </div>

      <button className={styles.navArrow}>&gt;</button>
    </div>
  );
}