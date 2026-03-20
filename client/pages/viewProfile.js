import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import Head from 'next/head';
import HomeNavbar from '@/components/layout/HomeNavbar/HomeNavbar';
import AccountStyles from "@/styles/AccountPage.module.css";

export default function ViewProfile() {
    const router = useRouter();
    const { userId } = router.query;

    const [userData, setUserData] = useState(null);
    const [reservations, setReservations] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Wait for the Next.js router to grab the ID from the URL
        if (!router.isReady) return;

        if (!userId) {
            setError("No user ID provided.");
            setIsLoading(false);
            return;
        }

        const fetchPublicProfile = async () => {
            try {
                // Fetch the specific user's info AND their public reservations simultaneously
                const [userRes, reservationsRes] = await Promise.all([
                    fetch(`http://localhost:3001/api/users/${userId}`, {
                        method: 'GET',
                        credentials: 'include',
                        headers: { 'Content-Type': 'application/json' }
                    }),
                    fetch(`http://localhost:3001/api/reservations/user/${userId}`, {
                        method: 'GET',
                        credentials: 'include',
                        headers: { 'Content-Type': 'application/json' }
                    })
                ]);

                if (userRes.ok) {
                    const data = await userRes.json();
                    setUserData(data);
                } else {
                    throw new Error("User not found");
                }

                if (reservationsRes.ok) {
                    const resData = await reservationsRes.json();
                    setReservations(resData);
                }
            } catch (err) {
                console.error("Failed to fetch public profile:", err);
                setError(err.message || "Failed to load profile.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchPublicProfile();
    }, [router.isReady, userId]);

    // 1. Loading State
    if (isLoading) {
        return (
            <div style={{ backgroundColor: "#070B20", minHeight: "100vh", color: "white" }}>
                <HomeNavbar />
                <div style={{ padding: "50px", textAlign: "center" }}>
                    <h2>Loading profile...</h2>
                </div>
            </div>
        );
    }

    // 2. Error State (e.g., user doesn't exist)
    if (error || !userData) {
        return (
            <div style={{ backgroundColor: "#070B20", minHeight: "100vh", color: "white" }}>
                <HomeNavbar />
                <div style={{ padding: "50px", textAlign: "center" }}>
                    <h2>Oops!</h2>
                    <p>{error || "We couldn't find this student's profile."}</p>
                    <button onClick={() => router.push('/home')} style={{ padding: "10px 20px", marginTop: "20px", cursor: "pointer" }}>
                        Go Back Home
                    </button>
                </div>
            </div>
        );
    }

    // 3. Main Profile View
    return (
        <div style={{ backgroundColor: "#070B20", minHeight: "100vh", paddingBottom: "50px" }}>
            <Head>
                <title>{userData.firstName}&#39;s Profile | LabKoTo</title>
            </Head>

            <HomeNavbar />

            {/* --- Profile Header Section --- */}
            <div style={{ maxWidth: "800px", margin: "40px auto", padding: "0 20px", color: "white" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "20px", borderBottom: "1px solid #2A2F4A", paddingBottom: "30px", marginBottom: "30px" }}>

                    {/* Avatar */}
                    <div style={{
                        width: "100px",
                        height: "100px",
                        borderRadius: "50%",
                        backgroundColor: "#1E233A",
                        overflow: "hidden",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        border: "2px solid #00E5FF"
                    }}>
                        {userData.profilePicturePath ? (
                            <img
                                src={`http://localhost:3001${userData.profilePicturePath}`}
                                alt={`${userData.firstName}'s avatar`}
                                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                            />
                        ) : (
                            <span style={{ fontSize: "40px" }}>👤</span>
                        )}
                    </div>

                    {/* User Info */}
                    <div>
                        <h1 style={{ margin: "0 0 10px 0", fontSize: "2rem" }}>
                            {userData.firstName} {userData.lastName}
                        </h1>
                        <p style={{ margin: 0, color: "#8B95A5", fontSize: "1.1rem" }}>
                            Student ID: {userData.idNumber || "N/A"}
                        </p>
                    </div>
                </div>

                {/* --- Public Reservations Section --- */}
                <div>
                    <h2 style={{ fontSize: "1.5rem", marginBottom: "20px" }}>Public Reservations</h2>

                    {reservations.length > 0 ? (
                        <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                            {reservations.map((res, index) => (
                                <div key={res.id || index} style={{
                                    backgroundColor: "#15192B",
                                    padding: "20px",
                                    borderRadius: "10px",
                                    borderLeft: `4px solid ${res.status === 'active' ? '#00E5FF' : '#FF4C4C'}`,
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center"
                                }}>
                                    <div>
                                        <h3 style={{ margin: "0 0 5px 0", fontSize: "1.2rem", color: "#FFF" }}>
                                            {res.laboratory}
                                        </h3>
                                        <p style={{ margin: 0, color: "#8B95A5" }}>
                                            {res.rawDate} • {res.reservationTime}
                                        </p>
                                    </div>
                                    <div style={{ textAlign: "right" }}>
                                        <p style={{ margin: "0 0 5px 0", fontWeight: "bold", fontSize: "1.1rem" }}>
                                            Seat {res.seatNumber}
                                        </p>
                                        <span style={{
                                            fontSize: "0.8rem",
                                            padding: "3px 8px",
                                            borderRadius: "12px",
                                            backgroundColor: res.status === 'active' ? 'rgba(0, 229, 255, 0.1)' : 'rgba(255, 76, 76, 0.1)',
                                            color: res.status === 'active' ? '#00E5FF' : '#FF4C4C',
                                            textTransform: "uppercase",
                                            fontWeight: "bold"
                                        }}>
                                            {res.status}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div style={{
                            backgroundColor: "#15192B",
                            padding: "40px",
                            borderRadius: "10px",
                            textAlign: "center",
                            color: "#8B95A5"
                        }}>
                            <p>This student currently has no public reservations.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}