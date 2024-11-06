
const Amadeus = require('amadeus');
const dotenv = require('dotenv');
dotenv.config()

const amadeus = new Amadeus({
  clientId: process.env.AMADEUS_CLIENT_ID,
  clientSecret: process.env.AMADEUS_CLIENT_SECRET,
  logLevel: 'debug'
});

const handleAmadeusError = (error) => {
  if (error.response) {
      const statusCode = error.response.status;
      const errorMsg = error.response.data.errors?.[0].detail || error.message;

      switch (statusCode) {
          case 400:
              return { status: 400, message: `Bad Request: ${errorMsg}` };
          case 401:
              return { status: 401, message: 'Unauthorized: Invalid API key or token' };
          case 403:
              return { status: 403, message: 'Forbidden: Access denied or quota exceeded' };
          case 429:
              return { status: 429, message: 'Rate limit exceeded. Please try again later' };
          case 500:
              return { status: 500, message: 'Amadeus server error. Try again later' };
          default:
              return { status: statusCode, message: `Unexpected error: ${errorMsg}` };
      }
  } else {
      return { status: 500, message: `Network error: ${error.message}` };
  }
};

module.exports = {amadeus, handleAmadeusError}; // Export the Amadeus client and error handler
