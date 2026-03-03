import Head from "next/head";
import Image from "next/image";
import { Geist, Geist_Mono } from "next/font/google";
import styles from '../styles/Landing.module.css';
import Navbar from '../components/layout/Navbar/Navbar';
import Footer from '../components/layout/Footer/Footer';
import { useRouter } from 'next/router';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function Home() {
  const router = useRouter();

  const goToLogin = () => {
    router.push('/auth/login');
  }

  return (
    <>
      <div className={`${styles['glow-bg']} ${styles['glow-1']}`}></div>
      <div className={`${styles['glow-bg']} ${styles['glow-2']}`}></div>

      <Navbar/>

      <section className="container mt-5 pb-5" style={{ marginBottom: '150px' }}>
        <div className="row">
          <div className="col-lg-7">
            <h1 className={`${styles['hero-title']}`}>
              Book Your <br /> Seat in <br /> Advance.
            </h1>
            <p className="lead text-secondary mb-5">
              The most accessible Laboratories in DLSU
            </p>
            <div className="d-flex gap-3">
              <button className={`${styles['btn-primary-custom']}`} onClick={goToLogin}>BOOK SEATS</button>
              <button className={`${styles['btn-outline-custom']}`} onClick={goToLogin}>EDIT BOOKING</button>
            </div>
          </div>
          <div className={`${styles['custom-blur']}`}></div>
        </div>
      </section>

      <section className="container pb-5 mb-6">
        <div className="row g-4">
          <div className="col-md-4">
            <div className={`${styles['glass-card']} d-flex flex-column align-items-center text-center`}>
              <img className={styles['img-placeholder']} src="../../clock.png" alt="Clock"/>
              <h3 className="h4 fw-bold mb-2">Real-time availability</h3>
              <p className="text-secondary small">Check seat availability through the website</p>
            </div>
          </div>
          <div className="col-md-4">
            <div className={`${styles['glass-card']} d-flex flex-column align-items-center text-center`}>
              <img className={styles['img-placeholder']} src="../../room.png" alt="Room"/>
              <h3 className="h4 fw-bold mb-2">Adjustable Room layouts</h3>
              <p className="text-secondary small">Adjust the room layout as administrator</p>
            </div>
          </div>
          <div className="col-md-4">
            <div className={`${styles['glass-card']} d-flex flex-column align-items-center text-center`}>
              <img className={styles['img-placeholder']} src="../../mail.png" alt="Mail"/>
              <h3 className="h4 fw-bold mb-2">Email Notifications</h3>
              <p className="text-secondary small">Get notified about your seat reservations</p>
            </div>
          </div>
        </div>
      </section>

      <section id="about" className={`container py-5 ${styles.aboutSection}`}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>About Us</h2>
          <div className={styles.sectionDivider}></div>
          <p className={styles.sectionSubtitle}>Learn more about our mission and team</p>
        </div>
        <div className="row align-items-center g-5 mt-4">
          <div className="col-lg-6">
            <div className={styles.aboutContent}>
              <h3 className={styles.aboutHeading}>Simplifying Lab Reservations at DLSU</h3>
              <p className={styles.aboutText}>
                LabKoTo is designed to make reserving seats in DLSU laboratories fast, easy, and accessible.
                Our platform allows students to check real-time availability, manage reservations, and get notified instantly.
              </p>
              <p className={styles.aboutText}>
                Our mission is to improve productivity and ensure fair access to laboratory resources for all students.
                We believe technology should make campus life easier, not harder.
              </p>
              <div className={styles.aboutStats}>
                <div className={styles.statItem}>
                  <span className={styles.statNumber}>500+</span>
                  <span className={styles.statLabel}>Daily Users</span>
                </div>
                <div className={styles.statItem}>
                  <span className={styles.statNumber}>20+</span>
                  <span className={styles.statLabel}>Lab Rooms</span>
                </div>
                <div className={styles.statItem}>
                  <span className={styles.statNumber}>99%</span>
                  <span className={styles.statLabel}>Uptime</span>
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-6">
            <div className={styles.aboutImageWrapper}>
              <div className={styles.aboutImageGlow}></div>
            </div>
          </div>
        </div>
      </section>

      <section id="contact" className={`py-5 ${styles.contactSection}`}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Contact Us</h2>
            <div className={styles.sectionDivider}></div>
            <p className={styles.sectionSubtitle}>Have questions? We&apos;d love to hear from you</p>
          </div>
          <div className="row g-5 mt-4">
            <div className="col-lg-5">
              <div className={styles.contactInfo}>
                <h3 className={styles.contactInfoTitle}>Get in Touch</h3>
                <p className={styles.contactInfoText}>
                  Feel free to reach out with any questions, suggestions, or feedback. Our team is here to help!
                </p>
                <div className={styles.contactDetails}>
                  <div className={styles.contactItem}>
                    
                    <div>
                      <strong>Address</strong>
                      <p>De La Salle University, Manila</p>
                    </div>
                  </div>
                  <div className={styles.contactItem}>
                   
                    <div>
                      <strong>Email</strong>
                      <p>labkoto@dlsu.edu.ph</p>
                    </div>
                  </div>
                  <div className={styles.contactItem}>
                   
                    <div>
                      <strong>Phone</strong>
                      <p>(02) 8524-4611</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-7">
              <div className={styles.contactFormCard}>
                <form className={styles.contactForm}>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className={styles.formLabel}>Your Name</label>
                      <input type="text" placeholder="John Doe" className={styles.formInput}/>
                    </div>
                    <div className="col-md-6">
                      <label className={styles.formLabel}>Your Email</label>
                      <input type="email" placeholder="john@dlsu.edu.ph" className={styles.formInput}/>
                    </div>
                    <div className="col-12">
                      <label className={styles.formLabel}>Subject</label>
                      <input type="text" placeholder="How can we help?" className={styles.formInput}/>
                    </div>
                    <div className="col-12">
                      <label className={styles.formLabel}>Message</label>
                      <textarea placeholder="Write your message here..." className={styles.formTextarea} rows="5"></textarea>
                    </div>
                    <div className="col-12">
                      <button type="submit" className={styles['btn-primary-custom']}>
                        Send Message
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer/>
    </>
  );
}
