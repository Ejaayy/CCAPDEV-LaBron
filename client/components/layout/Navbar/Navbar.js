import styles from './Navbar.module.css';
import Link from 'next/link';

export default function Navbar() {
  const scrollToSection = (e, sectionId) => {
    e.preventDefault();
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
      <nav className={`navbar navbar-expand-md py-4 ${styles.navbarSticky}`}>
        <div className="container">
          <Link href="/" className={styles['brand-text']}>
            LabKoTo
          </Link>

          <button
              className="navbar-toggler navbar-dark border-0"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarNav"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto gap-4">
              <li className="nav-item">
                <a
                    className={`text-decoration-none ${styles.navLink}`}
                    href="#about"
                    onClick={(e) => scrollToSection(e, 'about')}
                >
                  About
                </a>
              </li>
              <li className="nav-item">
                <a
                    className={`text-decoration-none ${styles.navLink}`}
                    href="#contact"
                    onClick={(e) => scrollToSection(e, 'contact')}
                >
                  Contact
                </a>
              </li>
              <li className="nav-item">
                <Link
                    className={`text-decoration-none ${styles.navLink}`}
                    href="/auth/login"
                >
                  Reserve
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
  );
}