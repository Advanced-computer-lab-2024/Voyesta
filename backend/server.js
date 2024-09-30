// server.js
<<<<<<< Updated upstream
const app = require('./App');

// Set the port from the environment variable or use 3000
const PORT = process.env.PORT || 3000;

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
=======
const app = require('./src/App');
const mongoose = require('mongoose');
require('dotenv').config();
// Set the port from the environment variable or use 3000
const port = process.env.PORT || 3000;
const MongoURI = process.env.MONGO_URI;
mongoose.connect(MongoURI)
.then(()=>{
  console.log("MongoDB is now connected!")
// Starting server
 app.listen(port, () => {
    console.log(`Listening to requests on http://localhost:${port}`);
  })
})
>>>>>>> Stashed changes
