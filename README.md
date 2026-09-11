# FoodShare
Food Waste Donation & Redistribution System

## Problem
Every day, massive amounts of edible surplus food from restaurants, events, and individuals end up in landfills, while many people in the local community go hungry. The core problem is the disconnect and lack of an efficient logistical bridge between those who have surplus food and the NGOs or volunteers who can distribute it to those in need.

## Solution
FoodShare is a centralized web platform designed to eliminate this logistical gap. It connects food donors directly with local NGOs and volunteers. Donors can quickly list available food, and NGOs can browse, claim, and track the pickup and delivery of these donations, ensuring surplus food reaches people instead of the trash.

## Features
- **Donor registration/login:** Secure authentication for restaurants and individuals.
- **NGO/Volunteer registration/login:** Secure authentication for charitable organizations.
- **Food donation creation:** Donors can list surplus food with details (quantity, address, etc.).
- **Browse available donations:** NGOs can view a real-time feed of available food.
- **Accept donation:** NGOs can claim a donation, reserving it for their organization.
- **Mark picked up:** NGOs update the status once they retrieve the food from the donor.
- **Mark delivered:** NGOs finalize the process once the food reaches the end recipients.
- **Admin dashboard:** A centralized control panel for system administrators.
- **Admin user monitoring:** Admins can view all registered users and their roles.
- **Admin donation monitoring:** Admins can track the status of all donations system-wide.
- **Admin cancellation:** Admins can cancel donations if necessary.
- **Donation status lifecycle:** Transparent tracking of a donation from listing to delivery.

## User Roles

### Donor
Restaurants, cafes, or individuals with surplus food. Donors can create new donation listings and monitor the status of their own donations.

### NGO / Volunteer
Organizations or individuals dedicated to redistributing food. NGOs can browse all available donations, accept them, and update the status as they pick up and deliver the food.

### Admin
System administrators who oversee the entire platform. Admins have a global view of all users and donations, and possess the authority to cancel problematic or duplicate donations.

## Donation Lifecycle
The platform tracks food donations through a strict lifecycle:
**Available** → **Accepted** → **Picked Up** → **Delivered**
*(Note: System Admins have the ability to mark a donation as **Cancelled** at any point if required).*

## Tech Stack
- **Node.js**
- **Express.js**
- **MongoDB Atlas**
- **Mongoose**
- **EJS** (Embedded JavaScript templating)
- **JavaScript**
- **HTML/CSS**
- **JWT** (JSON Web Tokens)
- **bcrypt**

## Project Structure
```text
├── middleware/       # Authentication and role authorization logic
├── models/           # Mongoose schemas (User, Donation)
├── public/           # Static assets (CSS, images)
├── routes/           # Express routers (admin, auth, donor, ngo)
├── views/            # EJS templates and layouts
├── package.json      # Project dependencies and scripts
├── seedAdmin.js      # Script to securely generate the initial admin account
└── server.js         # Main application entry point
```

## Getting Started

1. **Clone repository**
   ```bash
   git clone https://github.com/tusharrr5/food-waste-redistribution.git
   cd food-waste-redistribution
   ```
2. **Install dependencies**
   ```bash
   npm install
   ```
3. **Create `.env` file**
   Create a file named `.env` in the root directory.
4. **Configure Environment Variables**
   Add your MongoDB connection string, JWT secret, and desired admin credentials to the `.env` file.
5. **Run Admin Seed Script (One-time setup)**
   ```bash
   node seedAdmin.js
   ```
6. **Start the application**
   ```bash
   npm start
   ```

## Environment Variables
Your `.env` file should look like this:
```env
PORT=3000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret
ADMIN_EMAIL=your_admin_email
ADMIN_PASSWORD=your_admin_password
```

## How It Works
1. A **Donor** logs in and creates a new food donation listing.
2. The donation appears on the dashboard of all registered **NGOs**.
3. An **NGO** reviews the available donations and clicks "Accept" on one they can handle.
4. The NGO travels to the donor's location and marks the donation as "Picked Up".
5. After successfully redistributing the food, the NGO marks it as "Delivered", completing the cycle.

## Admin
The Admin dashboard is a protected route that allows system administrators to monitor the health of the platform. Admins can view a list of all registered users (Donors, NGOs, and other Admins) and a global feed of all donations. If a donation is reported as spam or made in error, the Admin can intervene and cancel it.

## Security
- **Password Hashing:** All user passwords are encrypted using `bcrypt` before being stored in the database.
- **JWT Authentication:** Sessions are managed securely using JSON Web Tokens.
- **HTTP-Only Cookies:** Tokens are stored in `httpOnly` cookies to mitigate XSS attacks.
- **Environment Variables:** Sensitive information (DB URIs, Secrets, Admin credentials) are kept out of the source code.
- **Git Ignore:** The `.env` file is explicitly ignored via `.gitignore` to prevent accidental credential leaks.

## Future Improvements
*(These features are planned but NOT currently implemented in this MVP)*
- Interactive map integration for routing and distance calculation.
- Email/SMS push notifications for status updates.
- AI-based matching of donations to the nearest available NGO.
- Donor analytics and impact reporting.

## Hackathon
This project was built as an MVP for a college hackathon addressing the "Food Waste Donation & Redistribution System" problem statement.
