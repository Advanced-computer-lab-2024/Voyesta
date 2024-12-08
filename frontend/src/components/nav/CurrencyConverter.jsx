import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CurrencyConverter = () => {
  const [currencies, setCurrencies] = useState([]);
  const [selectedCurrency, setSelectedCurrency] = useState(
    localStorage.getItem('selectedCurrency') || 'USD'
  );
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const fetchCurrencies = async () => {
      try {
        const response = await axios.get(
          'https://v6.exchangerate-api.com/v6/c214d671b9e5b4732e3fc0ef/latest/USD'
        );
        const currencyData = response.data.conversion_rates;
        setCurrencies(Object.keys(currencyData));
      } catch (error) {
        console.error('Error fetching currencies:', error);
      }
    };

    fetchCurrencies();
  }, []);

  const handleCurrencyChange = (currency) => {
    setSelectedCurrency(currency);
    localStorage.setItem('selectedCurrency', currency);
    window.dispatchEvent(new CustomEvent('currencyChange', { detail: currency }));
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 bg-transparent text-gray-900 dark:text-white px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
      >
        <i className="fas fa-money-bill"></i>
        <span>{selectedCurrency}</span>
        <i className={`fas fa-chevron-down transform ${isOpen ? 'rotate-180' : ''}`}></i>
      </button>
      
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
          {currencies.map((currency) => (
            <button
              key={currency}
              onClick={() => handleCurrencyChange(currency)}
              className={`w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 
                ${currency === selectedCurrency ? 'bg-blue-50 dark:bg-blue-900' : ''}`}
            >
              {currency}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default CurrencyConverter;