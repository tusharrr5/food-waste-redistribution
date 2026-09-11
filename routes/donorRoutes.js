// ==========================================
// Donor Routes
// Reference: mirai-lms/server.js protected route pattern (lines 144-161)
//            auth + authorizeRoles middleware chain
// ==========================================
const express = require("express");
const router = express.Router();
const { auth, authorizeRoles } = require("../middleware/auth");
const Donation = require("../models/Donation");

// All donor routes require auth + role check
router.use(auth, authorizeRoles("donor"));

// --- GET /donor/dashboard ---
router.get("/dashboard", async (req, res) => {
    try {
        const myDonations = await Donation.find({ donor: req.user.userId });

        const total     = myDonations.length;
        const active    = myDonations.filter(d => d.status === "available" || d.status === "accepted" || d.status === "pickedUp").length;
        const delivered = myDonations.filter(d => d.status === "delivered").length;
        const cancelled = myDonations.filter(d => d.status === "cancelled").length;

        res.render("donor/dashboard", {
            user: req.user,
            stats: { total, active, delivered, cancelled }
        });
    } catch (err) {
        console.error(err);
        res.redirect("/login");
    }
});

// --- GET /donor/donation/new ---
// Render create donation form
router.get("/donation/new", (req, res) => {
    res.render("donor/newDonation", { user: req.user, error: null });
});

// --- POST /donor/donation ---
// Save new donation to DB
router.post("/donation", async (req, res) => {
    try {
        const { foodType, quantity, pickupLocation, preparedAt, expiresAt } = req.body;

        const donation = new Donation({
            foodType,
            quantity,
            pickupLocation,
            preparedAt:  new Date(preparedAt),
            expiresAt:   new Date(expiresAt),
            status:      "available",
            donor:       req.user.userId,
            donorName:   req.user.name
        });

        await donation.save();

        res.redirect("/donor/donations");

    } catch (err) {
        console.error(err);
        res.render("donor/newDonation", { user: req.user, error: "Failed to create donation. Please try again." });
    }
});

// --- GET /donor/donations ---
// Show this donor's donations
router.get("/donations", async (req, res) => {
    try {
        const donations = await Donation.find({ donor: req.user.userId }).sort({ createdAt: -1 });
        res.render("donor/myDonations", { user: req.user, donations });
    } catch (err) {
        console.error(err);
        res.redirect("/donor/dashboard");
    }
});

module.exports = router;
