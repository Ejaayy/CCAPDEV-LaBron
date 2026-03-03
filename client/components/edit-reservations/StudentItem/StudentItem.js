import styles from "./StudentItem.module.css";

export default function StudentItem({ name }) {
  return <div className={styles.student}>{name}</div>;
}
