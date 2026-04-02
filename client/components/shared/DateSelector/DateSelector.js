import styles from './DateSelector.module.css';

export default function DateSelector({ dates, selectedDate, onDateSelect }) {
  return (
    <div className={styles.dateSelectorContainer}>
      
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
              <span className={styles.labCount} >
                {item.labs} {item.labs === 1 ? 'slot' : 'slots'}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}