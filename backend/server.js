// server.js
const app = require('./src/App');

// Set the port from the environment variable or use 3000
const PORT = process.env.PORT || 3000;
const MongoURI = "mongodb+srv://VoyestaDB:GUC_1234@voyestadb.cvp0i.mongodb.net/?retryWrites=true&w=majority&appName=VoyestaDB" ;

mongoose.connect(MongoURI)
.then(()=>{
  console.log("MongoDB is now connected!")
// Starting server
 app.listen(port, () => {
    console.log(`Listening to requests on http://localhost:${port}`);
  })
})
