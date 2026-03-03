import styles from './Footer.module.css';
import Link from 'next/link'

export default function Footer(){
    return(
        <footer className="py-4" style={{ height: '218px', backgroundColor: "#16141E", marginTop: "100px"}}>
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-6 mb-3 mb-md-0">
              <Link href="/" className={`${styles['brand-text']}`}>LabKoTo</Link>
              <div className="text-secondary">2026 All rights reserved</div>
            </div>
            <div className="col-md-6 text-md-end">
              <a href="#" className="text-secondary text-decoration-none me-4 hover-white">Contact Us</a>
              <a href="#" className="text-secondary text-decoration-none hover-white">Reserve</a>
            </div>
          </div>
        </div>
      </footer>
    )
}