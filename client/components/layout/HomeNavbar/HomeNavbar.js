import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import styles from './HomeNavbar.module.css';

export default function HomeNavbar({ style, className, ...rest }) {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const isActive = (path) => {
    if (path === '/') {
      return router.pathname === '/' || router.pathname === '/home';
    }
    return router.pathname.startsWith(path);
  };

  return (
    <nav
      {...rest}
      style={style}
      className={`navbar navbar-expand-md py-4 ${styles.homeNavbar} ${className || ''}`}
    >
      <div className="container">
        <Link href="/home" className={styles['brand-text']}>
          LabKoTo
        </Link>

        <button
          className="navbar-toggler navbar-dark border-0"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Navbar links */}
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto gap-4">
            <li className="nav-item">
              <Link 
                href="/home"
                className={`text-decoration-none ${styles.navLink} ${isActive('/home') ? styles.activeNavLink : ''}`}
              >
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link 
                href="/reserve" 
                className={`text-decoration-none ${styles.navLink} ${isActive('/reserve') ? styles.activeNavLink : ''}`}
              >
                Reserve
              </Link>
            </li>
            <li className="nav-item">
              <Link 
                href="/edit-reservations/manage-reservations" 
                className={`text-decoration-none ${styles.navLink} ${isActive('/edit-reservations/manage') ? styles.activeNavLink : ''}`}
              >
                Manage Reservations
              </Link>
            </li>
            <li className="nav-item">
              <Link 
                href="/edit-reservations/my-reservations" 
                className={`text-decoration-none ${styles.navLink} ${isActive('/edit-reservations/my') ? styles.activeNavLink : ''}`}
              >
                My Reservations
              </Link>
            </li>

            {/* Account Dropdown */}
            <li className="nav-item dropdown">
              <button
                className={`nav-link dropdown-toggle btn btn-link border-0 p-0 ${styles.navLink} ${isActive('/account') ? styles.activeNavLink : ''}`}
                onClick={toggleDropdown}
                type="button"
                style={{ textDecoration: 'none' }}
              >
                Account
              </button>
              <ul
                className={`dropdown-menu dropdown-menu-end shadow ${isOpen ? 'show' : ''}`}
                style={{
                  display: isOpen ? 'block' : 'none',
                  position: 'absolute',
                  backgroundColor: "#242738",
                }}
              >
                <li>
                  <Link href="/account" className="dropdown-item text-white fw-semibold">
                    Account Settings
                  </Link>
                </li>
                <li><hr className="dropdown-divider bg-black" /></li>
                <li>
                  <Link href="/" className="dropdown-item text-danger fw-semibold">
                    Log Out
                  </Link>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
