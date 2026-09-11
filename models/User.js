// ==========================================
// User Model
// Reference: mirai-lms/server.js lines 40-47
// Same mongoose.Schema pattern, adapted roles
// ==========================================
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name:     String,
    email:    String,
    password: String,
    role:     String  // "donor" | "ngo" | "admin"
});

const User = mongoose.model("User", userSchema);

module.exports = User;
