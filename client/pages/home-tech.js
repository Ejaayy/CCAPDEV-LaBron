import { useMemo } from "react";

// Layout + styling
import HomeNavbar from "@/components/layout/HomeNavbar/HomeNavbar";
import styles from "../components/layout/HomeNavbar/HomeNavbar.module.css";

// Technician dashboard components
import WelcomeTech from "@/components/dashboard/technician/WelcomeTech/WelcomeTech";
import BuildingList from "@/components/dashboard/technician/BuildingList/BuildingList";

// Shared components
import SelectStudents from "@/components/dashboard/student/SelectStudents";
import AuthWrapper from "@/components/layout/AuthWrapper";

// Custom hooks
import useLabs from "@/hooks/useLabs";
import useAuth from "@/hooks/useAuth";


/*
  Helper function: groupBuildings

  Purpose:
    - Groups labs by building name
    - Counts how many labs are in each building
    - Returns a sorted array of building objects: { name, labsCount }
*/
function groupBuildings(labs) {
  const buildingMap = {};

  labs.forEach((lab) => {
    if (lab.location && lab.location.includes(" Building")) {
      const prefix = lab.location.split(" Building")[0];
      const buildingName = `${prefix} Building`;
      buildingMap[buildingName] = (buildingMap[buildingName] || 0) + 1;
    } else if (lab.location) {
      buildingMap[lab.location] = (buildingMap[lab.location] || 0) + 1;
    }
  });

  return Object.keys(buildingMap)
    .map((name) => ({
      name,
      labsCount: buildingMap[name],
    }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

// Main component: HomeTech dashboard for technicians

export default function HomeTech() {
  const { labs, loading } = useLabs(); //fetch list of labs
  const { user } = useAuth(); //get current logged in technician

  const buildings = useMemo(() => groupBuildings(labs), [labs]);

  return (
    <AuthWrapper>
      <div className={styles.homePage}>
        <HomeNavbar />

        <div className={styles["main-panel-tech"]}>
          <div className={styles["right-column"]}>
            <div className={styles["right-container"]}>
              <WelcomeTech />
            </div>

            {/* Buildings list section*/}

            <div className={styles["right-container"]}>
              <h4 className={styles["section-title"]}>List of Buildings</h4>

              {loading ? (
                <p className={styles["empty-state"]}>Loading buildings...</p>
              ) : (
                <BuildingList buildings={buildings} />
              )}
            </div>

            <div className={styles["right-container"]}>
              <SelectStudents currentUserId={user?._id} />
            </div>
          </div>
        </div>
      </div>
    </AuthWrapper>
  );
}
