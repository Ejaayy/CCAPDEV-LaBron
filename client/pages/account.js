import { useRef } from 'react';
import HomeNavbar from "@/components/layout/HomeNavbar/HomeNavbar";
import AccountStyles from "@/styles/AccountPage.module.css";

export default function Account() {
    const scrollRef = useRef(null);

    const scroll = (direction) => {
        const { current } = scrollRef;
        if (direction === 'left') {
            current.scrollLeft -= 200;
        } else {
            current.scrollLeft += 200;
        }
    };

    const reservations = [
        { lab: "G304B", date: "Feb 12", status: "active" },
        { lab: "G302A", date: "Feb 10", status: "expired" },
        { lab: "G304A", date: "Feb 5", status: "expired" },
        { lab: "G302B", date: "Jan 29", status: "expired" },
        { lab: "VL101", date: "Dec 4", status: "expired" },
    ];

    return (
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
                                <img src="profilePic.jpg" alt="Profile" className={AccountStyles['profile-img']} />
                            </div>
                            <h2 className={AccountStyles['profile-name']}>EJ Paingers</h2>
                        </div>

                        <div className={AccountStyles['info-fields']}>
                            <div className={AccountStyles['field-group']}>
                                <label>Name</label>
                                <input type="text" className={AccountStyles['custom-input']} defaultValue="EJ Paingers" />
                            </div>
                            <div className={AccountStyles['field-group']}>
                                <label>ID num</label>
                                <input type="text" className={AccountStyles['custom-input']} defaultValue="12345678" />
                            </div>
                            <div className={AccountStyles['field-group']}>
                                <label>email</label>
                                <input type="email" className={AccountStyles['custom-input']} defaultValue="ejaygoat@dlsu.edu.ph" />
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
                    <h3 className={AccountStyles['activity-title']}>Reservations</h3>
                    <div className={AccountStyles['carousel-container']}>
                        <button className={AccountStyles['nav-btn']} onClick={() => scroll('left')}>&#8249;</button>
                        <div className={AccountStyles['reservation-track']} ref={scrollRef}>
                            {reservations.map((res, index) => (
                                <div key={index} className={`${AccountStyles['res-box']} ${AccountStyles[res.status]}`}>
                                    <h4>{res.lab}</h4>
                                    <p>{res.date}</p>
                                    <span className={AccountStyles['status-tag']}>{res.status}</span>
                                </div>
                            ))}
                        </div>
                        <button className={AccountStyles['nav-btn']} onClick={() => scroll('right')}>&#8250;</button>
                    </div>
                </div>

                <div className={AccountStyles['sub-panel']}>
                    <h3 className={AccountStyles['activity-title']}>Recent Activity</h3>
                    <div className={AccountStyles['activity-feed']}>
                        <div className={AccountStyles['activity-item']}>
                            <img src="profilePic.jpg" alt="Profile" className={AccountStyles['activity-avatar']} />
                            <div className={AccountStyles['activity-text']}>
                                <span className={AccountStyles['user-link']}>EJ Paingers</span> reserved
                                <span className={AccountStyles['highlight']}> G304B - Computer Lab</span>
                                <div className={AccountStyles['activity-date']}>Feb 12 @ 12:30am</div>
                            </div>
                        </div>

                        <div className={AccountStyles['activity-item']}>
                            <img src="profilePic.jpg" alt="Profile" className={AccountStyles['activity-avatar']} />
                            <div className={AccountStyles['activity-text']}>
                                <span className={AccountStyles['user-link']}>EJ Paingers</span> posted a status:
                                <p className={AccountStyles['status-quote']}>"ANLALA NUNG STALGCM EXAM MAN"</p>
                                <div className={AccountStyles['activity-date']}>Feb 11 @ 11:02am</div>
                            </div>
                        </div>

                        <div className={AccountStyles['activity-item']}>
                            <img src="profilePic.jpg" alt="Profile" className={AccountStyles['activity-avatar']} />
                            <div className={AccountStyles['activity-text']}>
                                <span className={AccountStyles['user-link']}>EJ Paingers</span> reserved
                                <span className={AccountStyles['highlight']}> G302A - Computer Lab</span>
                                <div className={AccountStyles['activity-date']}>Oct 22 @ 9:00am</div>
                            </div>
                        </div>

                        <div className={AccountStyles['activity-item']}>
                            <img src="profilePic.jpg" alt="Profile" className={AccountStyles['activity-avatar']} />
                            <div className={AccountStyles['activity-text']}>
                                <span className={AccountStyles['user-link']}>EJ Paingers</span> reserved
                                <span className={AccountStyles['highlight']}> G304A - Computer Lab</span>
                                <div className={AccountStyles['activity-date']}>Oct 21 @ 9:00am</div>
                            </div>
                        </div>

                        <div className={AccountStyles['activity-item']}>
                            <img src="profilePic.jpg" alt="Profile" className={AccountStyles['activity-avatar']} />
                            <div className={AccountStyles['activity-text']}>
                                <span className={AccountStyles['user-link']}>EJ Paingers</span> reserved
                                <span className={AccountStyles['highlight']}> G302B - Computer Lab</span>
                                <div className={AccountStyles['activity-date']}>Oct 20 @ 12:00pm</div>
                            </div>
                        </div>

                        <div className={AccountStyles['activity-item']}>
                            <img src="profilePic.jpg" alt="Profile" className={AccountStyles['activity-avatar']} />
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
    );
}