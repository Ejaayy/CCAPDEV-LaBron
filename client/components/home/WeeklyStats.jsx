import React from 'react';
import styles from '@/styles/WeeklyStats.module.css';
import { FiClock, FiUsers, FiEdit2, FiCheckSquare } from 'react-icons/fi'; // Using react-icons

const StatsAndActions = ({ stats = [], actions = [] }) => {
    return (
        <div className={styles['container-card']}>
            <h3 className={styles['section-title']}>ACTIVITY OVERVIEW</h3>
            
            <div className={styles['stats-grid']}>
                {stats.map((stat, index) => (
                    <div key={stat.id || index} className={styles['stat-card']}>
                        <div className={styles['stat-icon-wrapper']}>
                            {stat.icon}
                        </div>
                        
                        <div className={styles['stat-info']}>
                            <div className={stat.id === 2 ? styles['header-horizontal'] : styles['header-vertical']}>
                                <span className={styles['stat-value']}>{stat.value}</span>
                                {stat.label && (
                                    <span className={styles['stat-label']}>{stat.label}</span>
                                )}
                            </div>
                            
                            {stat.subtext && (
                                <span className={styles['stat-subtext']}>{stat.subtext}</span>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            <hr className={styles['section-divider']} />

            <h3 className={styles['section-title']}>QUICK ACTIONS</h3>
            
            <div className={styles['actions-grid']}>
                {actions.map((action, index) => (
                    <button key={action.id || index} className={styles['action-button']}>
                        <div className={styles['action-icon-wrapper']}>
                            {typeof action.icon === 'string' && action.icon.startsWith('/') ? (
                                <img
                                    src={action.icon}
                                    alt={action.label}
                                    className={styles['action-icon-image']}
                                />
                            ) : (action.icon)}
                        </div>
                        <span className={styles['action-label']}>{action.label}</span>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default StatsAndActions;