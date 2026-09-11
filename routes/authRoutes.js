// ==========================================
// Auth Routes — Register, Login, Logout
// Reference: mirai-lms/server.js lines 53-135 (adapted to router + res.redirect)
// ==========================================
const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Simple email format validator — no external library
// Requires: chars@chars.tld (TLD must be 2+ letters)
// Rejects: donor@coim, donor@, @test.com, donor.com, donor@test, donor @test.com
const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);

// --- GET /register ---
// Render the registration page
router.get("/register", (req, res) => {
    res.render("register", { error: null });
});

// --- POST /register ---
// Hash password and save new user to DB
// Reference: mirai-lms/server.js lines 70-90
router.post("/register", async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        // Server-side email format validation
        if (!isValidEmail(email)) {
            return res.render("register", {
                error: "Invalid email address. Please use a valid email such as name@example.com.",
                formData: req.body
            });
        }

        // Check if email already exists
        const existing = await User.findOne({ email });
        if (existing) {
            return res.render("register", { error: "Email already registered. Please login." });
        }

        // Hash password with salt rounds = 10
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new User document
        const user = new User({
            name,
            email,
            password: hashedPassword,
            role
        });

        // Save user in MongoDB
        await user.save();

        res.redirect("/login");

    } catch (err) {
        console.error(err);
        res.render("register", { error: "Something went wrong. Try again." });
    }
});

// --- GET /login ---
// Render login page
router.get("/login", (req, res) => {
    res.render("login", { error: null });
});

// --- POST /login ---
// Validate credentials, sign JWT, set cookie, redirect by role
// Reference: mirai-lms/server.js lines 94-136
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        // Server-side email format validation
        if (!isValidEmail(email)) {
            return res.render("login", { error: "Invalid email address. Please use a valid format like user@example.com" });
        }

        // 1. Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.render("login", { error: "User not found. Please register first." });
        }

        // 2. Verify hashed password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.render("login", { error: "Invalid password. Please try again." });
        }

        // 3. Create & Sign JWT Token
        // Reference: mirai-lms/server.js lines 116-126
        const token = jwt.sign(
            {
                userId: user._id,
                role: user.role,
                name: user.name
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "1d"
            }
        );

        // 4. Set token in HTTP-only cookie
        // Reference: mirai-lms/server.js line 129
        res.cookie("token", token, { httpOnly: true });

        // 5. Redirect based on role
        if (user.role === "donor") {
            return res.redirect("/donor/dashboard");
        } else if (user.role === "ngo") {
            return res.redirect("/ngo/dashboard");
        } else if (user.role === "admin") {
            return res.redirect("/admin/dashboard");
        } else {
            return res.redirect("/login");
        }

    } catch (err) {
        console.error(err);
        res.render("login", { error: "Something went wrong. Try again." });
    }
});

// --- GET /logout ---
// Clear the cookie and redirect to login
router.get("/logout", (req, res) => {
    res.clearCookie("token");
    res.redirect("/login");
});

module.exports = router;
