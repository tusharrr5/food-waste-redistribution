// ==========================================
// Admin Routes
// Reference: mirai-lms/server.js protected route pattern (lines 144-161)
//            auth + authorizeRoles middleware chain
// ==========================================
const express = require("express");
const router = express.Router();
const { auth, authorizeRoles } = require("../middleware/auth");
const Donation = require("../models/Donation");
const User = require("../models/User");

// All admin routes require auth + role check
router.use(auth, authorizeRoles("admin"));

// --- GET /admin/dashboard ---
// Dashboard with aggregated stats
router.get("/dashboard", async (req, res) => {
    try {
        const totalDonations     = await Donation.countDocuments();
        const availableDonations = await Donation.countDocuments({ status: "available" });
        const acceptedDonations  = await Donation.countDocuments({ status: "accepted" });
        const pickedUpDonations  = await Donation.countDocuments({ status: "pickedUp" });
        const deliveredDonations = await Donation.countDocuments({ status: "delivered" });
        const cancelledDonations = await Donation.countDocuments({ status: "cancelled" });
        const totalUsers         = await User.countDocuments();
        const totalDonors        = await User.countDocuments({ role: "donor" });
        const totalNGOs          = await User.countDocuments({ role: "ngo" });

        const activeDonations = availableDonations + acceptedDonations + pickedUpDonations;

        res.render("admin/dashboard", {
            user: req.user,
            stats: {
                totalDonations,
                activeDonations,
                availableDonations,
                acceptedDonations,
                pickedUpDonations,
                deliveredDonations,
                cancelledDonations,
                totalUsers,
                totalDonors,
                totalNGOs
            }
        });
    } catch (err) {
        console.error(err);
        res.redirect("/login");
    }
});

// --- GET /admin/donations ---
// View all donations
router.get("/donations", async (req, res) => {
    try {
        const filter = req.query.status || "all";
        const query  = filter === "all" ? {} : { status: filter };
        const donations = await Donation.find(query).sort({ createdAt: -1 });

        res.render("admin/donations", { user: req.user, donations, filter });
    } catch (err) {
        console.error(err);
        res.redirect("/admin/dashboard");
    }
});

// --- GET /admin/users ---
// View all users
router.get("/users", async (req, res) => {
    try {
        const users = await User.find({}, { password: 0 }); // exclude password
        res.render("admin/users", { user: req.user, users });
    } catch (err) {
        console.error(err);
        res.redirect("/admin/dashboard");
    }
});

// --- POST /admin/donation/:id/cancel ---
// Cancel a donation
router.post("/donation/:id/cancel", async (req, res) => {
    try {
        await Donation.findByIdAndUpdate(req.params.id, { status: "cancelled" });
        res.redirect("/admin/donations");
    } catch (err) {
        console.error(err);
        res.redirect("/admin/donations");
    }
});

module.exports = router;
