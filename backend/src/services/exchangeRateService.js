const axios = require('axios');

const getExchangeRates = async (baseCurrency) => {
  try {
    const response = await axios.get(`https://v6.exchangerate-api.com/v6/c214d671b9e5b4732e3fc0ef/latest/${baseCurrency}`);
    return response.data.conversion_rates;
  } catch (error) {
    throw new Error('Error fetching exchange rates');
  }
};

const convertPrices = async (req, res) => {
    const { baseCurrency, targetCurrency, prices } = req.body;
  
    try {
      const rates = await getExchangeRates(baseCurrency);
      const exchangeRate = rates[targetCurrency];
  
      if (!exchangeRate) {
        return res.status(400).json({ error: 'Invalid target currency' });
      }
  
      const convertedPrices = prices.map(price => price * exchangeRate);
      res.status(200).json({ convertedPrices });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

module.exports = { convertPrices };