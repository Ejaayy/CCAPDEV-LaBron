import Head from "next/head";
import Image from "next/image";
import { Geist, Geist_Mono } from "next/font/google";
import styles from '../styles/Landing.module.css';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function Home() {
  return (
    <>
      {/* Background Glows */}
      <div className={`${styles['glow-bg']} ${styles['glow-1']}`}></div>
      <div className={`${styles['glow-bg']} ${styles['glow-2']}`}></div>

      {/* Navbar */}
      <nav className="navbar navbar-expand-md py-4">
        <div className="container">
          <a href="#" className={`${styles['brand-text']}`}>LabKoTo</a>

          <button className="navbar-toggler navbar-dark border-0" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto gap-4">
              <li className="nav-item"><a className={`${styles['nav-link']}`} href="#">about</a></li>
              <li className="nav-item"><a className={`${styles['nav-link']}`} href="#">contact</a></li>
              <li className="nav-item"><a className={`${styles['nav-link']}`} href="#">reserve</a></li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mt-5 pb-5" style={{ marginBottom: '150px' }}>
        <div className="row">
          <div className="col-lg-7">
            <h1 className={`${styles['hero-title']} mb-4`} class="testing">
              Book Your <br /> Seat in <br /> Advance.
            </h1>
            <p className="lead text-secondary mb-5">
              The most accessible Laboratories in DLSU
            </p>
            <div className="d-flex gap-3">
              <button className={`${styles['btn-primary-custom']}`}>BOOK SEATS</button>
              <button className={`${styles['btn-outline-custom']}`}>EDIT BOOKING</button>
            </div>
          </div>
      <div className={`${styles['custom-blur']}`}>

        </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container pb-5 mb-6">
        <div className="row g-4">

          <div className="col-md-4">
            <div className={`${styles['glass-card']} d-flex flex-column align-items-center text-center`}>
              <div className={`${styles['img-placeholder']} rounded-circle`}></div>
              <h3 className="h4 fw-bold mb-2">Real-time availability</h3>
              <p className="text-secondary small">Check seat availability through the website</p>
            </div>
          </div>

          <div className="col-md-4">
            <div className={`${styles['glass-card']} d-flex flex-column align-items-center text-center`}>
              <div className={`${styles['img-placeholder']}`} style={{ borderRadius: '8px', background: '#334155' }}></div>
              <h3 className="h4 fw-bold mb-2">Adjustable Room layouts</h3>
              <p className="text-secondary small">Adjust the room layout as administrator</p>
            </div>
          </div>

          <div className="col-md-4">
            <div className={`${styles['glass-card']} d-flex flex-column align-items-center text-center`}>
              <div className={`${styles['img-placeholder']}`} style={{ borderRadius: '4px', background: '#93c5fd' }}></div>
              <h3 className="h4 fw-bold mb-2">Email Notifications</h3>
              <p className="text-secondary small">Get notified about your seat reservations</p>
            </div>
          </div>

        </div>
      </section>

      {/* Footer */}
      <footer className="py-4 mt-auto">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-6 mb-3 mb-md-0">
              <div className="fw-bold text-primary mb-1">LabKoTo</div>
              <div className="text-secondary">2026 All rights reserved</div>
            </div>
            <div className="col-md-6 text-md-end">
              <a href="#" className="text-secondary text-decoration-none me-4 hover-white">Contact Us</a>
              <a href="#" className="text-secondary text-decoration-none hover-white">Reserve</a>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
