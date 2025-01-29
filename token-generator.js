require('dotenv').config();
const jwt = require('jsonwebtoken');

// Secret key from environment variable
const SECRET_KEY = process.env.JWT_SECRET;

// Create test user data
const userData = {
    id: "123",
    email: "test@example.com",
    name: "Test User"
};

try {
    // Generate token
    const token = jwt.sign(userData, SECRET_KEY, { expiresIn: '24h' });
    
    console.log("\n=== JWT Token Generator ===\n");
    console.log("Token generated successfully!");
    console.log("\nYour token:");
    console.log(token);
    console.log("\nFor Postman, use this full header value:");
    console.log(`Bearer ${token}`);
    console.log("\n=========================\n");
} catch (error) {
    console.error("Error generating token:", error.message);
}