require("dotenv").config({ path: path.join(__dirname, ".env") });
const path = require("path");
const express = require("express");

const connectDB = require("./model/db");

const app = express();

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// View engine
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "view"));

connectDB().then(() => {
  const PORT = process.env.PORT || 3000;

  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
}).catch((err) => {
  console.err("Failed to start server:", err.message);
  process.exit(1);
});