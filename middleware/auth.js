// ==========================================
// Auth Middleware — Authentication + Role Authorization
// Reference: mirai-lms/middleware/auth.js (EXACT COPY, adapted secret to env)
// ==========================================
const jwt = require("jsonwebtoken");

// ==============================================================================
// 1. AUTHENTICATION MIDDLEWARE (Verifies JWT Token)
// ==============================================================================
const auth = (req, res, next) => {
    try {
        // 1. Check for token in Authorization header or Cookies
        const authHeader = req.headers.authorization || req.headers.Authorization;
        let token;

        if (authHeader && authHeader.startsWith("Bearer ")) {
            token = authHeader.split(" ")[1];
        } else if (req.cookies && req.cookies.token) {
            token = req.cookies.token;
        }

        // 2. If no token found
        if (!token) {
            return res.redirect("/login");
        }

        // 3. Verify the token with the secret key
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // 4. Attach the decoded user data (userId, role, name) to req.user
        req.user = decoded;

        // 5. Proceed to the next middleware or route handler
        next();

    } catch (error) {
        // Token expired or invalid — redirect to login
        return res.redirect("/login");
    }
};

// ==============================================================================
// 2. ROLE-BASED AUTHORIZATION MIDDLEWARE
// Reference: mirai-lms/middleware/auth.js lines 55-75
// ==============================================================================
const authorizeRoles = (...allowedRoles) => {
    return (req, res, next) => {
        // Ensure user is authenticated first
        if (!req.user || !req.user.role) {
            return res.redirect("/login");
        }

        // Check if user's role is allowed
        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).send(`<h2>Access Denied</h2><p>Role '${req.user.role}' cannot access this page.</p><a href="/login">Go back</a>`);
        }

        next();
    };
};

module.exports = auth;
module.exports.auth = auth;
module.exports.authorizeRoles = authorizeRoles;
