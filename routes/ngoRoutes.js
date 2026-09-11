// ==========================================
// NGO Routes
// Reference: mirai-lms/server.js protected route pattern (lines 144-161)
//            auth + authorizeRoles middleware chain
// ==========================================
const express = require("express");
const router = express.Router();
const { auth, authorizeRoles } = require("../middleware/auth");
const Donation = require("../models/Donation");

// All NGO routes require auth + role check
router.use(auth, authorizeRoles("ngo"));

// --- GET /ngo/dashboard ---
router.get("/dashboard", async (req, res) => {
    try {
        const available = await Donation.countDocuments({ status: "available" });
        const myAccepted = await Donation.countDocuments({
            ngo: req.user.userId,
            status: { $in: ["accepted", "pickedUp"] }
        });
        const myDelivered = await Donation.countDocuments({
            ngo: req.user.userId,
            status: "delivered"
        });

        res.render("ngo/dashboard", {
            user: req.user,
            stats: { available, myAccepted, myDelivered }
        });
    } catch (err) {
        console.error(err);
        res.redirect("/login");
    }
});

// --- GET /ngo/donations ---
// Browse available donations (with optional filter by status)
router.get("/donations", async (req, res) => {
    try {
        const filter = req.query.filter || "available";
        let query = {};

        if (filter === "mine") {
            query = { ngo: req.user.userId };
        } else if (filter === "all") {
            query = {};
        } else {
            query = { status: filter };
        }

        const donations = await Donation.find(query).sort({ createdAt: -1 });

        res.render("ngo/donations", { user: req.user, donations, filter });
    } catch (err) {
        console.error(err);
        res.redirect("/ngo/dashboard");
    }
});

// --- POST /ngo/donation/:id/accept ---
// Accept an available donation
router.post("/donation/:id/accept", async (req, res) => {
    try {
        await Donation.findByIdAndUpdate(req.params.id, {
            status:  "accepted",
            ngo:     req.user.userId,
            ngoName: req.user.name
        });
        res.redirect("/ngo/donations");
    } catch (err) {
        console.error(err);
        res.redirect("/ngo/donations");
    }
});

// --- POST /ngo/donation/:id/pickup ---
// Mark donation as picked up
router.post("/donation/:id/pickup", async (req, res) => {
    try {
        await Donation.findByIdAndUpdate(req.params.id, { status: "pickedUp" });
        res.redirect("/ngo/donations?filter=mine");
    } catch (err) {
        console.error(err);
        res.redirect("/ngo/donations");
    }
});

// --- POST /ngo/donation/:id/deliver ---
// Mark donation as delivered
router.post("/donation/:id/deliver", async (req, res) => {
    try {
        await Donation.findByIdAndUpdate(req.params.id, { status: "delivered" });
        res.redirect("/ngo/donations?filter=mine");
    } catch (err) {
        console.error(err);
        res.redirect("/ngo/donations");
    }
});

module.exports = router;
