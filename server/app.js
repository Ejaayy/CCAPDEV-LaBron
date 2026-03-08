const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });
const express = require("express");
const  {engine} = require("express-handlebars");

const indexRoutes = require("./routes/indexRoute");
const connectDB = require("./model/db");

const app = express();

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.engine("hbs", engine({ 
    extname: ".hbs",
    helpers: {
        section: function(name, options) {
            if (!this._sections) this._sections = {};
            this._sections[name] = options.fn(this);
            return null;
        }
    }
}));

// View engine
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "view"));

app.use("/", indexRoutes);

connectDB().then(() => {
  const PORT = process.env.PORT || 3000;

  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
}).catch((error) => {
  console.error("Failed to start server:", error.message);
  process.exit(1);
});


