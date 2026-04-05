import { useMemo, useRef } from "react";

import HomeNavbar from "@/components/layout/HomeNavbar/HomeNavbar";
import AuthWrapper from "@/components/layout/AuthWrapper";
import AccountStyles from "@/styles/AccountPage.module.css";
import { API_BASE_URL } from "@/constants/api";
import useAuth from "@/hooks/useAuth";
import { useMyReservations } from "@/hooks/useReservations";

import { useState } from "react";
import { useRouter } from "next/router";
import { updateProfile, deleteAccount } from "@/lib/users";

function getDynamicStatus(reservation) {
  if (reservation.status !== "active") return reservation.status;

  if (reservation.rawDate && reservation.reservationTime && reservation.reservationTime !== "N/A") {
    const endTimeStr = reservation.reservationTime.split(" - ")[1];
    const endDateTime = new Date(`${reservation.rawDate} ${endTimeStr}`);

    if (new Date() > endDateTime) {
      return "expired";
    }
  }

  return "active";
}

export default function Account() {
  const { user, loading: userLoading } = useAuth();
  const { reservations, loading: reservationsLoading } = useMyReservations();
  const scrollRef = useRef(null);

  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    description: user?.description || ""
  });

  const fullImageUrl = user?.profilePicturePath
    ? `${API_BASE_URL.replace("/api", "")}${user.profilePicturePath}`
    : `${API_BASE_URL.replace("/api", "")}/uploads/profiles/default.png`;

  const displayReservations = useMemo(() => {
    return [...reservations];
  }, [reservations]);

  function scroll(direction) {
    const current = scrollRef.current;
    if (!current) return;

    if (direction === "left") {
      current.scrollLeft -= 200;
    } else {
      current.scrollLeft += 200;
    }
  }

  if (userLoading || reservationsLoading) {
    return (
      <AuthWrapper>
        <div className={AccountStyles["page-container"]}>
          <HomeNavbar />
          <div style={{ padding: "40px", color: "white" }}>Loading Profile...</div>
        </div>
      </AuthWrapper>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <AuthWrapper>
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
                  <input
                      type="text"
                      className={AccountStyles["custom-input"]}
                      value={isEditing ? editData.firstName : user.firstName}
                      onChange={(e) => setEditData({...editData, firstName: e.target.value})}
                      readOnly={!isEditing}
                  />
                </div>

                <div className={AccountStyles["field-group"]}>
                  <label>Last Name</label>
                  <input
                      type="text"
                      className={AccountStyles["custom-input"]}
                      value={isEditing ? editData.lastName : user.lastName}
                      onChange={(e) => setEditData({...editData, lastName: e.target.value})}
                      readOnly={!isEditing}
                  />
                </div>

                <div className={AccountStyles["field-group"]}>
                  <label>ID num</label>
                  <input
                    type="text"
                    className={AccountStyles["custom-input"]}
                    value={user.idNumber}
                    readOnly
                  />
                </div>

                <div className={AccountStyles["field-group"]}>
                  <label>Email</label>
                  <input
                    type="email"
                    className={AccountStyles["custom-input"]}
                    value={user.email}
                    readOnly
                  />
                </div>
              </div>
            </div>

            <div className={AccountStyles["profile-lower"]}>
              <div className={AccountStyles["bio-section"]}>
                {isEditing ? (
                    <textarea
                        className={AccountStyles["custom-input"]}
                        value={editData.description}
                        onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                        style={{ width: "100%", height: "80px", resize: "none", marginTop: "10px" }}
                        placeholder="Write a short bio about yourself..."
                    />
                ) : (
                    <p className={AccountStyles["profile-desc"]}>
                      {user.description || "No bio yet."}
                    </p>
                )}
              </div>

              <div className={AccountStyles["action-buttons-row"]}>
                {isEditing ? (
                    <>
                      <button
                          className={AccountStyles["edit-btn"]}
                          style={{ backgroundColor: "#4CAF50" }} // Make it green for saving
                          onClick={async () => {
                            await updateProfile(editData);
                            setIsEditing(false);
                            window.location.reload(); // Quick way to refresh data
                          }}>
                        Save Changes
                      </button>
                      <button className={AccountStyles["delete-btn"]} onClick={() => setIsEditing(false)}>Cancel</button>
                    </>
                ) : (
                    <>
                      <button
                          className={AccountStyles["edit-btn"]}
                          onClick={() => {
                            setEditData({
                              firstName: user.firstName || "",
                              lastName: user.lastName || "",
                              description: user.description || ""
                            });
                            setIsEditing(true);
                          }}
                      >
                        Edit profile
                      </button>
                      <button
                          className={AccountStyles["delete-btn"]}
                          onClick={async () => {
                            if (confirm("Are you sure? This will delete your account and cancel all your reservations forever.")) {
                              await deleteAccount();
                              router.push("/auth/login"); // Send back to login
                            }
                          }}>
                        Delete account
                      </button>
                    </>
                )}
              </div>
            </div>
          </div>

          <div className={AccountStyles["sub-panel"]}>
            <h3 className={AccountStyles["activity-title"]}>My Reservations</h3>

            <div className={AccountStyles["carousel-container"]}>
              <button className={AccountStyles["nav-btn"]} onClick={() => scroll("left")}>
                &#8249;
              </button>

              <div className={AccountStyles["reservation-track"]} ref={scrollRef}>
                {displayReservations.length > 0 ? (
                  displayReservations.map((reservation, index) => {
                    const currentStatus = getDynamicStatus(reservation);

                    return (
                      <div
                        key={reservation.id || index}
                        className={`${AccountStyles["res-box"]} ${AccountStyles[currentStatus]}`}
                      >
                        <h4>{reservation.laboratory || "Unknown Lab"}</h4>
                        <p>{reservation.rawDate}</p>
                        <p>{reservation.reservationTime}</p>
                        <p className={AccountStyles["seat-text"]}>
                          Seat: {reservation.seatNumber}
                        </p>
                        <span className={AccountStyles["status-tag"]}>{currentStatus}</span>
                      </div>
                    );
                  })
                ) : (
                  <p>No reservations found.</p>
                )}
              </div>

              <button className={AccountStyles["nav-btn"]} onClick={() => scroll("right")}>
                &#8250;
              </button>
            </div>
          </div>

          <div className={AccountStyles["sub-panel"]}>
            <h3 className={AccountStyles["activity-title"]}>Recent Activity</h3>

            <div className={AccountStyles["activity-feed"]}>
              <div className={AccountStyles["activity-item"]}>
                <img
                  src={fullImageUrl}
                  alt={`${user.firstName}'s profile`}
                  className={AccountStyles["activity-avatar"]}
                  onError={(e) => {
                    e.target.src = "https://cdn-icons-png.flaticon.com/512/149/149071.png";
                  }}
                />
                <div className={AccountStyles["activity-text"]}>
                  <span className={AccountStyles["user-link"]}>
                    {user.firstName} {user.lastName}
                  </span>
                  <div className={AccountStyles["activity-date"]}>
                    This section is still placeholder content.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AuthWrapper>
  );
}
