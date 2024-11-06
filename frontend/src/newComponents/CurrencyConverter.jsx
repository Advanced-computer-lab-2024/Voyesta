import React, { useState } from 'react';
import axios from 'axios';

const CurrencyConverter = ({ prices }) => {
  const [baseCurrency, setBaseCurrency] = useState('USD');
  const [targetCurrency, setTargetCurrency] = useState('EUR');
  const [convertedPrices, setConvertedPrices] = useState([]);

  const handleConvert = async () => {
    try {
      const response = await axios.post('http://localhost:3000/api/product/convertPrices', {
        baseCurrency,
        targetCurrency,
        prices
      });
      setConvertedPrices(response.data.convertedPrices);
    } catch (error) {
      console.error('Error converting prices:', error);
    }
  };

  return (
    <div className="currency-converter">
      <div className="flex flex-col gap-4">
        <div>
          <label htmlFor="baseCurrency" className="block text-sm font-medium text-gray-700">Base Currency</label>
          <input
            type="text"
            id="baseCurrency"
            value={baseCurrency}
            onChange={(e) => setBaseCurrency(e.target.value)}
            className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 w-full"
          />
        </div>
        <div>
          <label htmlFor="targetCurrency" className="block text-sm font-medium text-gray-700">Target Currency</label>
          <input
            type="text"
            id="targetCurrency"
            value={targetCurrency}
            onChange={(e) => setTargetCurrency(e.target.value)}
            className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 w-full"
          />
        </div>
        <button
          onClick={handleConvert}
          className="bg-blue-500 text-white rounded-lg p-2 mt-4 hover:bg-blue-700"
        >
          Convert Prices
        </button>
      </div>
      <div className="mt-4">
        <h2 className="text-xl font-bold">Converted Prices</h2>
        <ul>
          {convertedPrices.map((price, index) => (
            <li key={index}>{price.toFixed(2)} {targetCurrency}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default CurrencyConverter;