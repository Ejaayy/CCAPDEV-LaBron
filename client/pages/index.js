import Head from "next/head";
import Image from "next/image";
import { Geist, Geist_Mono } from "next/font/google";
import styles from '../styles/Landing.module.css';
import Navbar from '../components/layout/Navbar/Navbar';
import Footer from '../components/layout/Footer/Footer';

import useAuth from "@/hooks/useAuth";
import { useRouter } from 'next/router';

const allDependencies = [
  // Backend & Core
  { name: "express", version: "^4.22.1", type: "Backend Framework" },
  { name: "next", version: "^16.1.6", type: "Frontend Framework" },
  { name: "react", version: "19.2.3", type: "UI Library" },
  { name: "react-dom", version: "19.2.3", type: "DOM Rendering" },
  
  // Database & Logic
  { name: "mongoose", version: "^8.23.0", type: "MongoDB ODM" },
  { name: "connect-mongo", version: "^6.0.0", type: "Session Store" },
  { name: "express-session", version: "^1.19.0", type: "Session Management" },
  { name: "dotenv", version: "^17.3.1", type: "Environment Config" },
  { name: "cors", version: "^2.8.6", type: "Cross-Origin Resource Sharing" },

  // Security & Utilities
  { name: "bcrypt", version: "^6.0.0", type: "Password Hashing" },
  { name: "bcryptjs", version: "^3.0.3", type: "Password Hashing (JS)" },
  { name: "multer", version: "^2.1.1", type: "File Upload Handling" },
  { name: "nodemailer", version: "^8.0.4", type: "Email Service" },

  // Templating & UI
  { name: "bootstrap", version: "^5.3.8", type: "CSS Framework" },
  { name: "react-icons", version: "^5.5.0", type: "Icon Library" },
  { name: "ejs", version: "^3.1.9", type: "Templating Engine" },
  { name: "express-handlebars", version: "^8.0.3", type: "Templating Engine" },
  { name: "hbs", version: "^4.2.0", type: "Templating Engine" },

  // Development Tools
  { name: "eslint", version: "^9", type: "Linting" },
  { name: "eslint-config-next", version: "16.1.4", type: "Next.js Linting" },
  { name: "babel-plugin-react-compiler", version: "1.0.0", type: "Compiler Optimization" }
];

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

  const { user, loading } = useAuth();

  const handleAction = () => {
    if (user) {
      if (user.role === 'technician') {
        router.push('/home-tech');
      } else {
        router.push('/home');
      }
    } else {
      router.push('/auth/login');
    }
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
              <button className={`${styles['btn-primary-custom']}`} onClick={handleAction}>
                {user ? "GO TO DASHBOARD" : "BOOK SEATS"}
              </button>

              {!user && (
                  <button className={`${styles['btn-outline-custom']}`} onClick={handleAction}>
                    EDIT BOOKING
                  </button>
              )}
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
              <div className={styles.aboutSection}>
               <h3 className={styles.carouselTitle}>Libraries used</h3>
                <div className={styles.carouselContainer}>
                <div className={styles.carouselTrack}>
                  {/* First set of dependencies */}
                  {allDependencies.map((pkg, index) => (
                    <div key={`first-${index}`} className={styles.carouselItem}>
                      <span className={styles.pkgName}>{pkg.name}</span>
                      <span className={styles.pkgVersion}>{pkg.version}</span>
                    </div>
                  ))}
                  {/* Duplicate set for infinite loop */}
                  {allDependencies.map((pkg, index) => (
                    <div key={`second-${index}`} className={styles.carouselItem}>
                      <span className={styles.pkgName}>{pkg.name}</span>
                      <span className={styles.pkgVersion}>{pkg.version}</span>
                    </div>
                  ))}
                </div>
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
