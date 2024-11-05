
const Amadeus = require('amadeus');
const dotenv = require('dotenv');
dotenv.config()

const amadeus = new Amadeus({
  clientId: process.env.AMADEUS_CLIENT_ID,
  clientSecret: process.env.AMADEUS_CLIENT_SECRET
});

module.exports = amadeus;
