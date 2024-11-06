import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CurrencyConverter = ({ prices, setConvertedPrices, setTargetCurrency }) => {
  const [baseCurrency] = useState('USD'); // Set base currency to USD and hide it
  const [targetCurrency, setLocalTargetCurrency] = useState('EUR');
  const [currencies, setCurrencies] = useState([]);

  useEffect(() => {
    const fetchCurrencies = async () => {
      try {
        const response = await axios.get('https://v6.exchangerate-api.com/v6/c214d671b9e5b4732e3fc0ef/latest/USD');
        const currencyData = response.data.conversion_rates;
        setCurrencies(Object.keys(currencyData));
      } catch (error) {
        console.error('Error fetching currencies:', error);
      }
    };

    fetchCurrencies();
  }, []);

  const handleConvert = async () => {
    try {
      const response = await axios.post('http://localhost:3000/api/product/convertPrices', {
        baseCurrency,
        targetCurrency,
        prices
      });
      const newConvertedPrices = response.data.convertedPrices;
      setConvertedPrices(newConvertedPrices); // Update the prices in the parent component
      setTargetCurrency(targetCurrency); // Update the target currency in the parent component
    } catch (error) {
      console.error('Error converting prices:', error);
    }
  };

  return (
    <div className="currency-converter">
      <div className="flex flex-col gap-4">
        <div>
          <label htmlFor="targetCurrency" className="block text-sm font-medium text-gray-700">Target Currency</label>
          <select
            id="targetCurrency"
            value={targetCurrency}
            onChange={(e) => setLocalTargetCurrency(e.target.value)}
            className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 w-full"
          >
            {currencies.map((currency) => (
              <option key={currency} value={currency}>{currency}</option>
            ))}
          </select>
        </div>
        <button
          onClick={handleConvert}
          className="bg-blue-500 text-white rounded-lg p-2 mt-4 hover:bg-blue-700"
        >
          Convert Prices
        </button>
      </div>
    </div>
  );
};

export default CurrencyConverter;