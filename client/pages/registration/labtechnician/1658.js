import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Head from 'next/head';
import styles from './LabTechRegister.module.css';

export default function LabTechnicianRegistration() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    idNumber: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    try {
      const res = await fetch('http://localhost:3001/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          idNumber: formData.idNumber,
          password: formData.password,
          role: 'technician',
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setError(data.message || 'Registration failed.');
        return;
      }

      router.push('/auth/login');
    } catch (err) {
      setError('Unable to connect. Please try again later.');
    }
  };

  return (
    <>
      <Head>
        <title>Lab Technician Registration | LabKoTo</title>
      </Head>
      <div className={styles.pageWrapper}>
        <div className={styles.glowBg1}></div>
        <div className={styles.glowBg2}></div>

        <div className={styles.container}>
          <Link href="/auth/login" className={styles.backLink}>
            &larr; Back to Login
          </Link>

          <div className={styles.card}>
            <div className={styles.badge}>Lab Technician</div>
            <h1>Register as Lab Technician</h1>
            <p className={styles.subtitle}>
              Join LabKoTo as a laboratory technician to manage lab bookings and reservations.
            </p>

            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.row}>
                <div className={styles.field}>
                  <label htmlFor="firstName">First Name</label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className={styles.field}>
                  <label htmlFor="lastName">Last Name</label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className={styles.field}>
                <label htmlFor="email">DLSU Email Address</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="name@dlsu.edu.ph"
                  required
                />
              </div>

              <div className={styles.field}>
                <label htmlFor="idNumber">ID Number</label>
                <input
                  type="text"
                  id="idNumber"
                  name="idNumber"
                  value={formData.idNumber}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className={styles.field}>
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className={styles.field}>
                <label htmlFor="confirmPassword">Re-enter Password</label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
              </div>

              {error && <p className={styles.error}>{error}</p>}

              <button type="submit" className={styles.submitBtn}>
                Register as Lab Technician
              </button>
            </form>

            <p className={styles.footerText}>
              Already have an account?{' '}
              <Link href="/auth/login" className={styles.link}>
                Log in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
