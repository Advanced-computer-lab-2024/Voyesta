const axios = require('axios');

const getExchangeRates = async (baseCurrency) => {
  try {
    const response = await axios.get(`https://v6.exchangerate-api.com/v6/262e65b60f85459c7be530f9/latest/${baseCurrency}`);
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

    const convertedPrices = prices.map(price => {
      if (typeof price === 'object') {
        return {
          foreigner: price.foreigner * exchangeRate,
          native: price.native * exchangeRate,
          student: price.student * exchangeRate
        };
      } else {
        return price * exchangeRate;
      }
    });

    res.status(200).json({ convertedPrices });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { convertPrices };