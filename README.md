# LabKoTo - Computer Laboratory Reservation System

**LabKoTo** is a full-stack web application designed to streamline the reservation and management of computer laboratory slots. Built for both students and laboratory technicians, it provides a seamless interface for booking seats, managing availability, and tracking lab usage.

**Live Deployment:** [https://ccapdev-labkoto.vercel.app](https://ccapdev-labkoto.vercel.app)

---

## Key Features
* **Role-Based Access Control:** Distinct dashboards and permissions for Students and Lab Technicians.
* **Real-Time Availability:** View which labs and specific seats are currently available, booked, or under maintenance.
* **Reservation Management:** Students can reserve, edit, or cancel their bookings.
* **Technician Controls:** Lab Technicians can add new buildings, manage lab capacities, modify seat statuses, and oversee all reservations.
* **Profile Management:** Users can update their profiles, including uploading custom profile pictures.
* **Secure Authentication:** Password hashing via bcrypt, secure session cookies, and forgot-password functionality.

---

## Tech Stack (MVC Architecture)
* **Frontend (View):** Next.js (React), CSS Modules
* **Backend (Controller):** Node.js, Express.js
* **Database (Model):** MongoDB Atlas, Mongoose ODM
* **Authentication:** Express-Session, Connect-Mongo, Bcryptjs
* **Deployment:** Vercel (Frontend), Render (Backend)

---

## Test Credentials
To make testing easier, the database has been seeded with the required Phase 3 sample data. You can log in using the following accounts to explore both roles:

**Lab Technician Account**
* **Email:** `tech_test@dlsu.edu.ph`
* **Password:** `password123`

**Student Account**
* **Email:** `student_test@dlsu.edu.ph`
* **Password:** `password123`

*(Note: You can also register a new account from the login page. To register a new technician, navigate to the hidden route `/registration/labtechnician/1658`)*

---

## How to Run Locally

If you wish to run this project on your local machine, follow these steps:

### 1. Prerequisites
Ensure you have the following installed on your machine:
* [Node.js](https://nodejs.org/) (v18 or higher recommended)
* [MongoDB](https://www.mongodb.com/try/download/community) (Local instance, or a MongoDB Atlas cluster URI)

### 2. Clone the Repository
```bash
git clone [https://github.com/](https://github.com/)[your-username]/ccapdev-labkoto.git
cd ccapdev-labkoto
```

### 3. Install package dependencies
Run `npm install` on the client, server, and main folders.

### 4. Run
Run `npm run dev` on the main folder.
