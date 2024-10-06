const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config()

// Access the secret key from the environment variables
const JWT_SECRET = process.env.JWT_SECRET;

// Function to generate JWT
const generateToken = (userId, userType) => {
  const payload = { id: userId, type: userType };
  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '300d' });
  return token;
};

// Function to verify JWT
const verifyToken = (token) => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return decoded;
  } catch (error) {
    console.error('Invalid token:', error.message);
    return null;
  }
};

module.exports = { generateToken, verifyToken };