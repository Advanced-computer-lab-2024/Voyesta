// server.js
const app = require('./App');
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
