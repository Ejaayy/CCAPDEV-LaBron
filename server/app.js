const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });
const express = require("express");
const { engine } = require("express-handlebars");

const cors = require("cors");
const session = require("express-session");
const MongoStore = require("connect-mongo").default;

const authRoutes = require("./routes/authRoute");
const indexRoutes = require("./routes/indexRoute");
const connectDB = require("./model/db");

const app = express();

app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
app.set('trust proxy', 1);

app.use(session({
    secret: process.env.SESSION_SECRET || "ccapdev-secret",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: process.env.MONGO_URI
    }),
    cookie: {
        maxAge: 1000 * 60 * 60 * 24,
        secure: false
    }
}));

app.use("/api/auth", authRoutes);
app.use("/", indexRoutes);

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

app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "view"));

connectDB().then(() => {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
}).catch((error) => {
    console.error("Failed to start server:", error.message);
    process.exit(1);
});