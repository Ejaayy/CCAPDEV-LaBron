const path = require("express");
require("dotenv").config();
const express = require("express");
const cors = require("cors"); 

const connectDB = require("./model/db");
const reservationRoutes = require("./routes/reservation.route");

const app = express();

// Middleware
app.use(cors()); 
app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 

// API Routes
app.use('/api/reservations', reservationRoutes); 

// Database Connection and Server Start
connectDB().then(() => {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`API Server is running on http://localhost:${PORT}`);
  });
}).catch((error) => {
  console.error("Failed to start server:", error.message);
  process.exit(1);
});