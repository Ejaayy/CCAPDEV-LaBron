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

export default function DateSelector({ selectedIndex = 3 }) {
  return (
    <div className={styles.dateSelectorContainer}>
      <button className={styles.navArrow}>&lt;</button>
      
      <div className={styles.dateGrid}>
        {DATES.map((item, index) => {
          const isSelected = index === selectedIndex;
          const isAvailable = item.labs > 0;

          return (
            <div 
              key={index} 
              className={`${styles.dateCard} ${isSelected ? styles.activeDate : ''}`}
            >
              <span className={styles.dateLabel}>{item.day} {item.date}</span>
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