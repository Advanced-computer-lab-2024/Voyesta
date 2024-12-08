import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CurrencyConverter = ({ prices, setConvertedPrices, setTargetCurrency }) => {
  const [baseCurrency, setBaseCurrency] = useState('USD');
  const [localTargetCurrency, setLocalTargetCurrency] = useState('USD');
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

  const handleConvertPrices = async () => {
    try {
      const response = await axios.post('http://localhost:3000/api/product/convertPrices', {
        baseCurrency,
        targetCurrency: localTargetCurrency,
        prices
      });
      const newConvertedPrices = response.data.convertedPrices;
      setConvertedPrices(newConvertedPrices); // Update the prices in the parent component
      setTargetCurrency(localTargetCurrency); // Update the target currency in the parent component
    } catch (error) {
      console.error('Error converting prices:', error);
    }
  };

  return (
    <div className="currency-converter flex items-center space-x-2">
      <div className='flex items-center space-x-2'>
        {/* <label htmlFor="targetCurrency" className="block text-sm font-medium text-gray-700">Target Currency</label> */}
        <select
          id="targetCurrency"
          value={localTargetCurrency}
          onChange={(e) => setLocalTargetCurrency(e.target.value)}
          className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5"
        >
          {currencies.map((currency) => (
            <option key={currency} value={currency}>{currency}</option>
          ))}
        </select>
      </div>
      <button
        onClick={handleConvertPrices}
        className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
      >
        Convert
      </button>
    </div>
  );
};

export default CurrencyConverter;