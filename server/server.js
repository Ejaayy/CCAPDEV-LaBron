const path = require("path");
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const session = require("express-session");
const MongoStore = require("connect-mongo").default;

const connectDB = require("./model/db");
const authRoutes = require("./routes/authRoute");
const reservationRoutes = require("./routes/reservation.route");
const slotRoutes = require('./routes/slot.route');
const labRoutes = require('./routes/lab.route');
const userRoutes = require('./routes/userRoute');

const app = express();

app.use(
  cors({
    origin: ["http://localhost:3000", "http://192.168.68.117:3000"],
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use(session({
  secret: process.env.SESSION_SECRET || "ccapdev-secret",
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }),
  cookie: {
    maxAge: 1000 * 60 * 60 * 24,
    secure: false,
    sameSite: 'lax'
  }
}));

app.use('/api/auth', authRoutes);
app.use('/api/reservations', reservationRoutes);
app.use('/api/slots', slotRoutes);
app.use('/api/labs', labRoutes);
app.use('/api/users', userRoutes);
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

connectDB().then(() => {
  const PORT = process.env.PORT || 3001;
  app.listen(PORT, () => {
    console.log(`API Server is running on http://localhost:${PORT}`);
  });
}).catch((error) => {
  console.error("Failed to start server:", error.message);
  process.exit(1);
});