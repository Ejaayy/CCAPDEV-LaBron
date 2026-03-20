import { useEffect, useState } from "react";
import HomeNavbar from "@/components/layout/HomeNavbar/HomeNavbar";
import styles from "../components/layout/HomeNavbar/HomeNavbar.module.css";
import WelcomeTech from "@/components/home-tech/WelcomeTech";
import BuildingList from "@/components/home-tech/BuildingList";
import SelectStudents from "@/components/home/SelectStudents";

export default function Home(){
    const [buildings, setBuildings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBuildings = async () => {
            try {
                const response = await fetch('http://localhost:3001/api/labs', {
                    method: 'GET',
                    credentials: 'include',
                    headers: { 'Content-Type': 'application/json' }
                });

                if (response.ok) {
                    const labs = await response.json();
                    
                    const buildingMap = {};

                    labs.forEach(lab => {
                        if (lab.location && lab.location.includes(" Building")) {
                            const prefix = lab.location.split(" Building")[0];
                            
                            const buildingName = `${prefix} Building`;

                            if (!buildingMap[buildingName]) {
                                buildingMap[buildingName] = 1;
                            } else {
                                buildingMap[buildingName]++;
                            }
                        } else if (lab.location) {
                            const buildingName = lab.location;
                            if (!buildingMap[buildingName]) {
                                buildingMap[buildingName] = 1;
                            } else {
                                buildingMap[buildingName]++;
                            }
                        }
                    });

                    const formattedBuildings = Object.keys(buildingMap).map(name => ({
                        name: name,
                        labsCount: buildingMap[name]
                    }));

                    formattedBuildings.sort((a, b) => a.name.localeCompare(b.name));

                    setBuildings(formattedBuildings);
                }
            } catch (error) {
                console.error("Failed to fetch buildings:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchBuildings();
    }, []);

    return(
        <div className={styles.homePage}>
            <HomeNavbar/>

            <div className={styles['main-panel-tech']}>
                <div className={styles['right-column']}>
                    <div className={styles['right-container']}>
                        <WelcomeTech />
                    </div>

                    <div className={styles['right-container']}>
                        <h4 className={styles['section-title']}>
                            List of Buildings
                        </h4>
                        
                        {loading ? (
                            <p className={styles['empty-state']}>Loading buildings...</p>
                        ) : (
                            <BuildingList buildings={buildings} />
                        )}
                    </div>

                    <div className={styles['right-container']}>
                        <SelectStudents />
                    </div>
                </div>
            </div>
        </div>
    )
}