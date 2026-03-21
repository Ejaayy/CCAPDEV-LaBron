import { useEffect, useState, useRef } from 'react';
import HomeNavbar from "@/components/layout/HomeNavbar/HomeNavbar";
import AccountStyles from "@/styles/AccountPage.module.css";
import AuthWrapper from "@/components/layout/AuthWrapper";

export default function Account() {
    const [userData, setUserData] = useState(null);
    const [userReservations, setUserReservations] = useState([]);
    const [reservations, setReservations] = useState([]);
    const scrollRef = useRef(null);
    const imagePath = userData?.profilePicturePath || '/uploads/profiles/default.png';
    const fullImageUrl = `http://localhost:3001${imagePath}`;

    const scroll = (direction) => {
        const { current } = scrollRef;
        if (direction === 'left') {
            current.scrollLeft -= 200;
        } else {
            current.scrollLeft += 200;
        }
    };

    useEffect(() => {
        const fetchProfileData = async () => {
            try {
                const userRes = await fetch('http://localhost:3001/api/auth/me', {
                    credentials: 'include'
                });
                const userJson = await userRes.json();
                setUserData(userJson);

                const resRes = await fetch('http://localhost:3001/api/reservations/my-reservations', {
                    credentials: 'include'
                });
                const resJson = await resRes.json();
                setUserReservations(resJson);
            } catch (err) {
                console.error("Failed to fetch profile data", err);
            }
        };
        fetchProfileData();
    }, []);

    useEffect(() => {
        const fetchMyReservations = async () => {
            try {
                // Ensure this URL matches your actual backend route!
                const response = await fetch('http://localhost:3001/api/reservations/my-reservations', {
                    method: 'GET',
                    headers: {
                        'Accept': 'application/json',
                    },
                    credentials: 'include' // CRITICAL: This sends your session cookie so the backend knows it's you
                });

                if (response.ok) {
                    const data = await response.json();
                    setReservations(data);
                } else {
                    console.error("Failed to fetch reservations");
                }
            } catch (error) {
                console.error("Error connecting to server:", error);
            }
        };

        fetchMyReservations();
    }, []); // The empty array ensures this only runs once when the page loads

    if (!userData) return <div>Loading Profile...</div>;

    const getDynamicStatus = (res) => {
        // check status
        if (res.status !== 'active') return res.status;

        // check if time has passed
        if (res.rawDate && res.reservationTime && res.reservationTime !== "N/A") {
            // get end time
            const endTimeStr = res.reservationTime.split(' - ')[1];
            const endDateTime = new Date(`${res.rawDate} ${endTimeStr}`);

            // check if end time has passed
            if (new Date() > endDateTime) {
                return "expired";
            }
        }
        return "active";
    };

    return (
        <AuthWrapper>
        <div className={AccountStyles['page-container']}>
            <HomeNavbar />
            <div className={AccountStyles['cover-container']}>
                <img src="../../cover-photo.png" className={AccountStyles['cover-photo']} alt="Cover" />
            </div>
            <img src="../../laboratoryPhoto.png" className={AccountStyles['bg-image']} alt="Background" />
            <div className={AccountStyles['main-panel']}>
                {/* Profile Panel */}
                <div className={AccountStyles['sub-panel']}>
                    <div className={AccountStyles['profile-upper']}>
                        <div className={AccountStyles['avatar-container']}>
                            <div className={AccountStyles['default-avatar']}>
                                <img
                                    src={fullImageUrl}
                                    alt={`${userData?.firstName}'s profile`}
                                    className={AccountStyles['profile-img']}
                                    onError={(e) => {
                                        e.target.src = "https://cdn-icons-png.flaticon.com/512/149/149071.png";
                                    }}
                                />
                            </div>
                            <h2 className={AccountStyles['profile-name']}>{userData.firstName} {userData.lastName}</h2>
                        </div>

                        <div className={AccountStyles['info-fields']}>
                            <div className={AccountStyles['field-group']}>
                                <label>Name</label>
                                <input type="text" className={AccountStyles['custom-input']} value={`${userData.firstName} ${userData.lastName}`} readOnly />
                            </div>
                            <div className={AccountStyles['field-group']}>
                                <label>ID num</label>
                                <input type="text" className={AccountStyles['custom-input']} value={userData.idNumber} readOnly />
                            </div>
                            <div className={AccountStyles['field-group']}>
                                <label>email</label>
                                <input type="email" className={AccountStyles['custom-input']} value={userData.email} readOnly />
                            </div>
                        </div>
                    </div>
                    <div className={AccountStyles['profile-lower']}>
                        <div className={AccountStyles['bio-section']}>
                            <p className={AccountStyles['profile-desc']}>
                                Computer Science Student | DLSU ID124. <br/>
                                AVP in Research and Development @ 40th LSCS
                            </p>
                        </div>
                        <div className={AccountStyles['action-buttons-row']}>
                            <button className={AccountStyles['edit-btn']}>Edit profile</button>
                            <button className={AccountStyles['delete-btn']}>Delete account</button>
                        </div>
                    </div>
                </div>

                <div className={AccountStyles['sub-panel']}>
                    <h3 className={AccountStyles['activity-title']}>My Reservations</h3>
                    <div className={AccountStyles['carousel-container']}>
                        <button className={AccountStyles['nav-btn']} onClick={() => scroll('left')}>&#8249;</button>
                        <div className={AccountStyles['reservation-track']} ref={scrollRef}>
                            {reservations.length > 0 ? reservations.map((res, index) => {
                                const currentStatus = getDynamicStatus(res); // Calculate status once per item

                                return (
                                    <div key={index} className={`${AccountStyles['res-box']} ${AccountStyles[currentStatus]}`}>
                                        <h4>{res.laboratory || "Unknown Lab"}</h4>
                                        <p>{res.rawDate}</p>
                                        <p>{res.reservationTime}</p>
                                        <p className={AccountStyles['seat-text']}>Seat: {res.seatNumber}</p>
                                        <span className={AccountStyles['status-tag']}>{currentStatus}</span>
                                    </div>
                                );
                            }) : <p>No reservations found.</p>}
                        </div>
                        <button className={AccountStyles['nav-btn']} onClick={() => scroll('right')}>&#8250;</button>
                    </div>
                </div>

                <div className={AccountStyles['sub-panel']}>
                    <h3 className={AccountStyles['activity-title']}>Recent Activity</h3>
                    <div className={AccountStyles['activity-feed']}>
                        <div className={AccountStyles['activity-item']}>
                            <img
                                src={fullImageUrl}
                                alt={`${userData?.firstName}'s profile`}
                                className={AccountStyles['activity-avatar']}
                                onError={(e) => {
                                    e.target.src = "https://cdn-icons-png.flaticon.com/512/149/149071.png";
                                }}
                            />
                            <div className={AccountStyles['activity-text']}>
                                <span className={AccountStyles['user-link']}>EJ Paingers</span> reserved
                                <span className={AccountStyles['highlight']}> G304B - Computer Lab</span>
                                <div className={AccountStyles['activity-date']}>Feb 12 @ 12:30am</div>
                            </div>
                        </div>

                        <div className={AccountStyles['activity-item']}>
                            <img
                                src={fullImageUrl}
                                alt={`${userData?.firstName}'s profile`}
                                className={AccountStyles['activity-avatar']}
                                onError={(e) => {
                                    e.target.src = "https://cdn-icons-png.flaticon.com/512/149/149071.png";
                                }}
                            />
                            <div className={AccountStyles['activity-text']}>
                                <span className={AccountStyles['user-link']}>EJ Paingers</span> posted a status:
                                <p className={AccountStyles['status-quote']}>&#34;ANLALA NUNG STALGCM EXAM MAN&#34;</p>
                                <div className={AccountStyles['activity-date']}>Feb 11 @ 11:02am</div>
                            </div>
                        </div>

                        <div className={AccountStyles['activity-item']}>
                            <img
                                src={fullImageUrl}
                                alt={`${userData?.firstName}'s profile`}
                                className={AccountStyles['activity-avatar']}
                                onError={(e) => {
                                    e.target.src = "https://cdn-icons-png.flaticon.com/512/149/149071.png";
                                }}
                            />
                            <div className={AccountStyles['activity-text']}>
                                <span className={AccountStyles['user-link']}>EJ Paingers</span> reserved
                                <span className={AccountStyles['highlight']}> G302A - Computer Lab</span>
                                <div className={AccountStyles['activity-date']}>Oct 22 @ 9:00am</div>
                            </div>
                        </div>

                        <div className={AccountStyles['activity-item']}>
                            <img
                                src={fullImageUrl}
                                alt={`${userData?.firstName}'s profile`}
                                className={AccountStyles['activity-avatar']}
                                onError={(e) => {
                                    e.target.src = "https://cdn-icons-png.flaticon.com/512/149/149071.png";
                                }}
                            />
                            <div className={AccountStyles['activity-text']}>
                                <span className={AccountStyles['user-link']}>EJ Paingers</span> reserved
                                <span className={AccountStyles['highlight']}> G304A - Computer Lab</span>
                                <div className={AccountStyles['activity-date']}>Oct 21 @ 9:00am</div>
                            </div>
                        </div>

                        <div className={AccountStyles['activity-item']}>
                            <img
                                src={fullImageUrl}
                                alt={`${userData?.firstName}'s profile`}
                                className={AccountStyles['activity-avatar']}
                                onError={(e) => {
                                    e.target.src = "https://cdn-icons-png.flaticon.com/512/149/149071.png";
                                }}
                            />
                            <div className={AccountStyles['activity-text']}>
                                <span className={AccountStyles['user-link']}>EJ Paingers</span> reserved
                                <span className={AccountStyles['highlight']}> G302B - Computer Lab</span>
                                <div className={AccountStyles['activity-date']}>Oct 20 @ 12:00pm</div>
                            </div>
                        </div>

                        <div className={AccountStyles['activity-item']}>
                            <img
                                src={fullImageUrl}
                                alt={`${userData?.firstName}'s profile`}
                                className={AccountStyles['activity-avatar']}
                                onError={(e) => {
                                    e.target.src = "https://cdn-icons-png.flaticon.com/512/149/149071.png";
                                }}
                            />
                            <div className={AccountStyles['activity-text']}>
                                <span className={AccountStyles['user-link']}>EJ Paingers</span> reserved
                                <span className={AccountStyles['highlight']}> VL101 - Chemistry Lab</span>
                                <div className={AccountStyles['activity-date']}>Oct 13 @ 12:00pm</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        </AuthWrapper>
    );
}