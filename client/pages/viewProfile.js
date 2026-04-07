import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState, useMemo } from "react";

import HomeNavbar from "@/components/layout/HomeNavbar/HomeNavbar";
import AuthWrapper from "@/components/layout/AuthWrapper";
import AccountStyles from "@/styles/AccountPage.module.css";
import UpcomingStyles from "@/styles/Upcoming.module.css";
import { API_BASE_URL } from "@/constants/api";
import useAuth from "@/hooks/useAuth";
import { useUser } from "@/hooks/useUsers";
import { getPublicReservationsByUser, updateReservationStatus } from "@/lib/reservations";

function getRealStatus(reservation) {
    if (reservation.status === "cancelled") return "Cancelled";
    if (reservation.status === "completed") return "Completed";

    if (reservation.status === "active" && reservation.rawDate && reservation.reservationTime && reservation.reservationTime !== "N/A") {
        const now = new Date();
        const [startTimeStr, endTimeStr] = reservation.reservationTime.split(" - ");
        const startDateTime = new Date(`${reservation.rawDate} ${startTimeStr}`);
        const endDateTime = new Date(`${reservation.rawDate} ${endTimeStr}`);

        if (now >= startDateTime && now <= endDateTime) return "Ongoing";
        else if (now > endDateTime) return "Completed";
    }
    return "Active";
}

export default function ViewProfile() {
    const router = useRouter();
    const { userId } = router.query;

    const { user: currentUser } = useAuth();
    const { user, loading: userLoading, error: userError } = useUser(userId);

    const [reservations, setReservations] = useState([]);
    const [reservationsLoading, setReservationsLoading] = useState(true);
    const [reservationsError, setReservationsError] = useState(null);
    const [statusUpdateId, setStatusUpdateId] = useState(null);

    useEffect(() => {
        let active = true;

        if (!router.isReady || !userId) {
            setReservationsLoading(false);
            return;
        }

        async function loadReservations() {
            try {
                const data = await getPublicReservationsByUser(userId);
                if (active) {
                    setReservations(Array.isArray(data) ? data : []);
                    setReservationsError(null);
                }
            } catch (err) {
                if (active) {
                    setReservations([]);
                    setReservationsError(err);
                }
            } finally {
                if (active) {
                    setReservationsLoading(false);
                }
            }
        }

        loadReservations();

        return () => {
            active = false;
        };
    }, [router.isReady, userId]);

    // filter out any reservations marked as anonymous
    const displayReservations = useMemo(() => {
        return reservations.filter(res => !res.isAnonymous);
    }, [reservations]);

    const isLoading = userLoading || reservationsLoading;
    const error = userError || reservationsError;

    if (isLoading) {
        return (
            <AuthWrapper>
                <div className={AccountStyles["page-container"]}>
                    <HomeNavbar />
                    <div style={{ padding: "50px", textAlign: "center", color: "white" }}>
                        <h2>Loading profile...</h2>
                    </div>
                </div>
            </AuthWrapper>
        );
    }

    if (error || !user) {
        return (
            <AuthWrapper>
                <div className={AccountStyles["page-container"]}>
                    <HomeNavbar />
                    <div style={{ padding: "50px", textAlign: "center", color: "white" }}>
                        <h2>Oops!</h2>
                        <p>{error?.message || "We couldn't find this student's profile."}</p>
                        <button
                            onClick={() => router.push("/home")}
                            style={{ padding: "10px 20px", marginTop: "20px", cursor: "pointer" }}
                        >
                            Go Back Home
                        </button>
                    </div>
                </div>
            </AuthWrapper>
        );
    }

    const fullImageUrl = user?.profilePicturePath
        ? `${API_BASE_URL.replace("/api", "")}${user.profilePicturePath}`
        : `${API_BASE_URL.replace("/api", "")}/uploads/profiles/default.png`;

    const isTechnician = currentUser?.role === "technician";

    const handleToggleReservationStatus = async (reservation) => {
        const reservationId = reservation.id || reservation._id;
        const nextStatus = reservation.status === "cancelled" ? "active" : "cancelled";

        if (!reservationId) return;
        setStatusUpdateId(reservationId);

        const previousReservations = reservations;
        setReservations((prev) =>
            prev.map((item) =>
                (item.id || item._id) === reservationId ? { ...item, status: nextStatus } : item
            )
        );

        try {
            await updateReservationStatus(reservationId, nextStatus);
        } catch (err) {
            setReservations(previousReservations);
            alert(err.message || "Failed to update reservation status.");
        } finally {
            setStatusUpdateId(null);
        }
    };

    return (
        <AuthWrapper>
            <Head>
                <title>{user.firstName}&#39;s Profile | LabKoTo</title>
            </Head>

            <div className={AccountStyles["page-container"]}>
                <HomeNavbar />

                <div className={AccountStyles["cover-container"]}>
                    <img src="../../cover-photo.png" className={AccountStyles["cover-photo"]} alt="Cover" />
                </div>

                <img src="../../laboratoryPhoto.png" className={AccountStyles["bg-image"]} alt="Background" />

                <div className={AccountStyles["main-panel"]}>

                    <div className={AccountStyles["sub-panel"]}>
                        <div className={AccountStyles["profile-upper"]}>
                            <div className={AccountStyles["avatar-container"]}>
                                <div className={AccountStyles["default-avatar"]}>
                                    <img
                                        src={fullImageUrl}
                                        alt={`${user.firstName}'s profile`}
                                        className={AccountStyles["profile-img"]}
                                        onError={(e) => {
                                            e.target.src = "https://cdn-icons-png.flaticon.com/512/149/149071.png";
                                        }}
                                    />
                                </div>
                                <h2 className={AccountStyles["profile-name"]}>
                                    {user.firstName} {user.lastName}
                                </h2>
                            </div>

                            <div className={AccountStyles["info-fields"]}>
                                <div className={AccountStyles["field-group"]}>
                                    <label>First Name</label>
                                    <input type="text" className={AccountStyles["custom-input"]} value={user.firstName} readOnly />
                                </div>
                                <div className={AccountStyles["field-group"]}>
                                    <label>Last Name</label>
                                    <input type="text" className={AccountStyles["custom-input"]} value={user.lastName} readOnly />
                                </div>
                                <div className={AccountStyles["field-group"]}>
                                    <label>ID num</label>
                                    <input type="text" className={AccountStyles["custom-input"]} value={user.idNumber || "N/A"} readOnly />
                                </div>
                                <div className={AccountStyles["field-group"]}>
                                    <label>Email</label>
                                    <input type="email" className={AccountStyles["custom-input"]} value={user.email} readOnly />
                                </div>
                            </div>
                        </div>

                        <div className={AccountStyles["profile-lower"]}>
                            <div className={AccountStyles["bio-section"]}>
                                <p className={AccountStyles["profile-desc"]}>
                                    {user.description || "No bio yet."}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className={AccountStyles["sub-panel"]}>
                        <h3 className={AccountStyles["activity-title"]}>Public Reservations</h3>

                        <div className={UpcomingStyles["res-scroll-container"]} style={{ maxHeight: "350px" }}>
                            {displayReservations.length > 0 ? (
                                displayReservations.map((reservation, index) => {
                                    const currentStatus = getRealStatus(reservation);

                                    let statusColor = "#4CAF50";
                                    let statusBg = "#4CAF5022";
                                    if (currentStatus === "Cancelled") { statusColor = "#f44336"; statusBg = "#f4433622"; }
                                    if (currentStatus === "Completed") { statusColor = "#9e9e9e"; statusBg = "#9e9e9e22"; }
                                    if (currentStatus === "Ongoing") { statusColor = "#2196F3"; statusBg = "#2196F322"; }

                                    return (
                                        <div key={reservation.id || index} className={UpcomingStyles["res-card"]}>
                                            <div className={UpcomingStyles["res-icon-section"]}>
                                                <span className={UpcomingStyles["res-calendar-icon"]} style={{ fontSize: "24px" }}>📅</span>
                                            </div>

                                            <div className={UpcomingStyles["res-info-group"]}>
                                                <div className={UpcomingStyles["res-meta-header"]}>
                                                    [{reservation.laboratory || "Unknown Lab"}] - REQUESTED ON {reservation.requestDateTime || "N/A"}
                                                </div>

                                                <div className={UpcomingStyles["res-title"]}>
                                                    {reservation.laboratory || "Unknown Lab"} - Seat {reservation.seatNumber}
                                                </div>

                                                <div style={{ marginTop: "6px", display: "flex", gap: "10px", alignItems: "center" }}>
                          <span style={{
                              fontSize: "0.65rem",
                              textTransform: "uppercase",
                              fontWeight: "bold",
                              padding: "3px 8px",
                              borderRadius: "4px",
                              color: statusColor,
                              backgroundColor: statusBg
                          }}>
                            {currentStatus}
                          </span>

                                                    {isTechnician && (
                                                        <button
                                                            type="button"
                                                            onClick={() => handleToggleReservationStatus(reservation)}
                                                            disabled={statusUpdateId === (reservation.id || reservation._id)}
                                                            style={{
                                                                fontSize: "0.65rem",
                                                                padding: "3px 8px",
                                                                borderRadius: "4px",
                                                                border: "none",
                                                                cursor: statusUpdateId === (reservation.id || reservation._id) ? "not-allowed" : "pointer",
                                                                backgroundColor: reservation.status === "cancelled" ? "#22C55E" : "#F59E0B",
                                                                color: "white",
                                                                fontWeight: "bold",
                                                            }}
                                                        >
                                                            {statusUpdateId === (reservation.id || reservation._id)
                                                                ? "Updating..."
                                                                : reservation.status === "cancelled" ? "Uncancel" : "Cancel"}
                                                        </button>
                                                    )}
                                                </div>
                                            </div>

                                            <div className={UpcomingStyles["res-time-section"]}>
                                                <div className={UpcomingStyles["res-date-text"]}>{reservation.rawDate}</div>
                                                <div className={UpcomingStyles["res-time-text"]}>{reservation.reservationTime}</div>
                                            </div>
                                        </div>
                                    );
                                })
                            ) : (
                                <p className={UpcomingStyles["empty-state"]}>No public reservations found.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthWrapper>
    );
}