import styles from './Stepper.module.css';
import { FaMicroscope, FaUser, FaPlus, FaCreditCard, FaCheckCircle } from 'react-icons/fa';

const STEPS = [
  { id: 1, label: 'View and Select Lab', icon: <FaMicroscope /> },
  { id: 2, label: 'Select Seat', icon: <FaUser /> },
  { id: 3, label: 'Confirmation', icon: <FaCheckCircle /> },
];

export default function BookingStepper({ currentStep = 2 }) {
  return (
    <div className={styles.stepperContainer}>
      {STEPS.map((step, index) => {
        const isActive = currentStep >= step.id;
        const isLast = index === STEPS.length - 1;

        return (
          <div key={step.id} className={styles.stepWrapper}>
            <div className={`${styles.stepIcon} ${isActive ? styles.activeIcon : ''}`}>
              {step.icon}
            </div>
            <span className={`${styles.stepLabel} ${isActive ? styles.activeLabel : ''}`}>
              {step.label}
            </span>
            {!isLast && <div className={styles.stepLine} />}
          </div>
        );
      })}
    </div>
  );
}