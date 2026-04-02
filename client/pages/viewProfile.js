import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import HomeNavbar from "@/components/layout/HomeNavbar/HomeNavbar";
import { API_BASE_URL } from "@/constants/api";
import { useUser } from "@/hooks/useUsers";
import { getPublicReservationsByUser } from "@/lib/reservations";

export default function ViewProfile() {
  const router = useRouter();
  const { userId } = router.query;

  const { user, loading: userLoading, error: userError } = useUser(userId);
  const [reservations, setReservations] = useState([]);
  const [reservationsLoading, setReservationsLoading] = useState(true);
  const [reservationsError, setReservationsError] = useState(null);

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

  const isLoading = userLoading || reservationsLoading;
  const error = userError || reservationsError;

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

  if (error || !user) {
    return (
      <div style={{ backgroundColor: "#070B20", minHeight: "100vh", color: "white" }}>
        <HomeNavbar />
        <div style={{ padding: "50px", textAlign: "center" }}>
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
    );
  }

  const assetBaseUrl = API_BASE_URL.replace("/api", "");

  return (
    <div style={{ backgroundColor: "#070B20", minHeight: "100vh", paddingBottom: "50px" }}>
      <Head>
        <title>{user.firstName}&#39;s Profile | LabKoTo</title>
      </Head>

      <HomeNavbar />

      <div style={{ maxWidth: "800px", margin: "40px auto", padding: "0 20px", color: "white" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "20px",
            borderBottom: "1px solid #2A2F4A",
            paddingBottom: "30px",
            marginBottom: "30px",
          }}
        >
          <div
            style={{
              width: "100px",
              height: "100px",
              borderRadius: "50%",
              backgroundColor: "#1E233A",
              overflow: "hidden",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: "2px solid #00E5FF",
            }}
          >
            {user.profilePicturePath ? (
              <img
                src={`${assetBaseUrl}${user.profilePicturePath}`}
                alt={`${user.firstName}'s avatar`}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            ) : (
              <span style={{ fontSize: "40px" }}>Profile</span>
            )}
          </div>

          <div>
            <h1 style={{ margin: "0 0 10px 0", fontSize: "2rem" }}>
              {user.firstName} {user.lastName}
            </h1>
            <p style={{ margin: 0, color: "#8B95A5", fontSize: "1.1rem" }}>
              Student ID: {user.idNumber || "N/A"}
            </p>
          </div>
        </div>

        <div>
          <h2 style={{ fontSize: "1.5rem", marginBottom: "20px" }}>Public Reservations</h2>

          {reservations.length > 0 ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
              {reservations.map((reservation, index) => (
                <div
                  key={reservation.id || index}
                  style={{
                    backgroundColor: "#15192B",
                    padding: "20px",
                    borderRadius: "10px",
                    borderLeft: `4px solid ${
                      reservation.status === "active" ? "#00E5FF" : "#FF4C4C"
                    }`,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div>
                    <h3 style={{ margin: "0 0 5px 0", fontSize: "1.2rem", color: "#FFF" }}>
                      {reservation.laboratory}
                    </h3>
                    <p style={{ margin: 0, color: "#8B95A5" }}>
                      {reservation.rawDate} • {reservation.reservationTime}
                    </p>
                  </div>

                  <div style={{ textAlign: "right" }}>
                    <p style={{ margin: "0 0 5px 0", fontWeight: "bold", fontSize: "1.1rem" }}>
                      Seat {reservation.seatNumber}
                    </p>

                    <span
                      style={{
                        fontSize: "0.8rem",
                        padding: "3px 8px",
                        borderRadius: "12px",
                        backgroundColor:
                          reservation.status === "active"
                            ? "rgba(0, 229, 255, 0.1)"
                            : "rgba(255, 76, 76, 0.1)",
                        color: reservation.status === "active" ? "#00E5FF" : "#FF4C4C",
                        textTransform: "uppercase",
                        fontWeight: "bold",
                      }}
                    >
                      {reservation.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div
              style={{
                backgroundColor: "#15192B",
                padding: "40px",
                borderRadius: "10px",
                textAlign: "center",
                color: "#8B95A5",
              }}
            >
              <p>This student currently has no public reservations.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
