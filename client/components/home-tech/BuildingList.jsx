import React, { use } from 'react';
import { useRouter } from 'next/router';
import styles from '@/components/home-tech/BuildingList.module.css';

const BuildingList = ({ buildings = [] }) => {
    const router = useRouter();

    const handleBuildingClick = (buildingName) => {
        router.push({
            pathname: '/edit-reservations/manage-reservations',
            query: { building: buildingName }
        });
    };

    return (
        <div className={styles['res-scroll-container']}>
            {buildings.map((building) => (
                <div key={building.name} className={styles['res-card']} onClick={() => handleBuildingClick(building.name)}>
                    
                    <div className={styles['res-icon-section']}>
                        <span className={styles['res-calendar-icon']}>🏢</span>
                    </div>

                    <div className={styles['res-info-group']}>
                        <div className={styles['res-title']}>
                            {building.name}
                        </div>
                        <div className={styles['res-meta-header']}>
                            {building.labsCount} {building.labsCount === 1 ? 'Laboratory' : 'Laboratories'}
                        </div>
                    </div>

                </div>
            ))}

            {buildings.length === 0 && (
                <p className={styles['empty-state']}>No buildings found.</p>
            )}
        </div>
    );
};

export default BuildingList;