const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
require("dotenv").config();

const User = require("./models/User");

const seedAdmin = async () => {
    try {
        // Connect to MongoDB using the URI from .env
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB...");

        const adminEmail = process.env.ADMIN_EMAIL;
        const adminPassword = process.env.ADMIN_PASSWORD;

        if (!adminEmail || !adminPassword) {
            console.error("ADMIN_EMAIL and ADMIN_PASSWORD must be provided in .env");
            process.exit(1);
        }

        // Check if admin already exists
        const existingAdmin = await User.findOne({ email: adminEmail });
        
        if (existingAdmin) {
            console.log("Admin user already exists. Skipping creation.");
            process.exit(0);
        }

        // Hash the admin password securely
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(adminPassword, saltRounds);

        // Create the admin user
        const adminUser = new User({
            name: "System Admin",
            email: adminEmail,
            password: hashedPassword,
            role: "admin"
        });

        await adminUser.save();
        console.log("Admin user created successfully!");
        
        process.exit(0);
    } catch (err) {
        console.error("Error seeding admin user:", err);
        process.exit(1);
    }
};

seedAdmin();
