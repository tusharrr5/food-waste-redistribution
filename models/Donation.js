// ==========================================
// Donation Model
// Reference: mirai-lms/server.js lines 40-47
// Same mongoose.Schema pattern, adapted for donation entity
// ==========================================
const mongoose = require("mongoose");

const donationSchema = new mongoose.Schema({
    foodType:        String,   // e.g. "Rice", "Cooked Meal", "Vegetables"
    quantity:        String,   // e.g. "10 kg", "50 plates"
    pickupLocation:  String,   // address / area
    preparedAt:      Date,     // when was food prepared
    expiresAt:       Date,     // when does it expire

    // Status lifecycle: available → accepted → pickedUp → delivered | cancelled
    status: {
        type: String,
        default: "available"
        // "available" | "accepted" | "pickedUp" | "delivered" | "cancelled"
    },

    // Donor info
    donor:     { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    donorName: String,  // denormalized for easy display

    // NGO info (null until accepted)
    ngo:     { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    ngoName: { type: String, default: null },

    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Donation = mongoose.model("Donation", donationSchema);

module.exports = Donation;
