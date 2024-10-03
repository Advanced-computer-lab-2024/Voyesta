// server.js

const app = require('./App');

// Set the port from the environment variable or use 3000
const PORT = process.env.PORT || 3000;

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
