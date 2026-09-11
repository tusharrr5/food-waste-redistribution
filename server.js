// ==========================================
// 1. IMPORTS & INITIALIZATION
// Reference: mirai-lms/server.js lines 1-12 (EXACT STRUCTURE)
// ==========================================
const express = require("express");
const app = express();

const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const cookieParser = require("cookie-parser");

// Routes
const authRoutes  = require("./routes/authRoutes");
const donorRoutes = require("./routes/donorRoutes");
const ngoRoutes   = require("./routes/ngoRoutes");
const adminRoutes = require("./routes/adminRoutes");

// ==========================================
// 2. VIEW ENGINE & GLOBAL MIDDLEWARE
// Reference: mirai-lms/server.js lines 17-28 (EXACT COPY)
// ==========================================

// Set EJS as view engine
app.set("view engine", "ejs");

// Parse JSON & URL-encoded request bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Parse cookies
app.use(cookieParser());

// Serve static files (CSS, images)
app.use(express.static("public"));

// ==========================================
// 3. DATABASE CONNECTION
// Reference: mirai-lms/server.js lines 33-35 (adapted to use .env)
// ==========================================
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB connected successfully"))
    .catch((err) => console.error("MongoDB connection error:", err.message));

// ==========================================
// 4. ROUTES
// ==========================================

// Home page
app.get("/", (req, res) => {
    res.render("home");
});

// Auth routes: /register, /login, /logout
app.use("/", authRoutes);

// Donor routes: /donor/...
app.use("/donor", donorRoutes);

// NGO routes: /ngo/...
app.use("/ngo", ngoRoutes);

// Admin routes: /admin/...
app.use("/admin", adminRoutes);

// ==========================================
// 5. START SERVER
// Reference: mirai-lms/server.js lines 166-168
// ==========================================
app.listen(process.env.PORT || 3000, () => {
    console.log(`Server is running on port ${process.env.PORT || 3000}`);
});
