// server.js
const app = require('./App');
const mongoose = require('mongoose');
require('dotenv').config();

// Set the port from the environment variable or use 3000
const port = process.env.PORT || 3000;

 // Starting server
 app.listen(port, () => {
  console.log(`Listening to requests on http://localhost:${port}`);
})

