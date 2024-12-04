import React, { useEffect, useState } from 'react';
import '../css/PriceFilterBar.css';

const PriceFilterBar = ({
  items = [],
  setItems,
  convertedPrices = [],
  priceProperty = 'price',
}) => {
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(1000);
  const [minVal, setMinVal] = useState(minPrice);
  const [maxVal, setMaxVal] = useState(maxPrice);
  const [currency, setCurrency] = useState('USD');

  useEffect(() => {
    if (items.length > 0) {
      const prices = convertedPrices.length > 0 ? convertedPrices : items.map((item) => item[priceProperty]);
      const min = Math.min(...prices).toFixed(2);
      const max = Math.max(...prices).toFixed(2);
      setMinPrice(min);
      setMaxPrice(max);
      setMinVal(min);
      setMaxVal(max);
    }
  }, [items, convertedPrices, priceProperty]);

  const onFilter = () => {
    const filteredItems = items.filter((item, index) => {
      const price = convertedPrices.length > 0 ? convertedPrices[index] : item[priceProperty];
      return price >= minVal && price <= maxVal;
    });
    setItems(filteredItems);
  };

  const handleMinChange = (e) => {
    const value = Math.min(Number(e.target.value), maxVal).toFixed(2);
    setMinVal(value);
  };

  const handleMaxChange = (e) => {
    const value = Math.max(Number(e.target.value), minVal).toFixed(2);
    setMaxVal(value);
  };

  return (
    <form className="max-w-[24rem] mx-auto">
      <div className="flex mb-4">
        <button
          id="dropdown-currency-button"
          data-dropdown-toggle="dropdown-currency"
          className="flex-shrink-0 z-10 inline-flex items-center py-2.5 px-4 text-sm font-medium text-center text-gray-900 bg-gray-100 border border-gray-300 rounded-s-lg hover:bg-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:focus:ring-gray-700 dark:text-white dark:border-gray-600"
          type="button"
          onClick={() => document.getElementById('dropdown-currency').classList.toggle('hidden')}
        >
          {currency}
          <svg className="w-2.5 h-2.5 ms-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4" />
          </svg>
        </button>
        <div id="dropdown-currency" className="z-10 hidden bg-white divide-y divide-gray-100 rounded-lg shadow w-36 dark:bg-gray-700">
          <ul className="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdown-currency-button">
            <li>
              <button
                type="button"
                className="inline-flex w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-600 dark:hover:text-white"
                onClick={() => setCurrency('USD')}
              >
                USD
              </button>
            </li>
            <li>
              <button
                type="button"
                className="inline-flex w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-600 dark:hover:text-white"
                onClick={() => setCurrency('EUR')}
              >
                EUR
              </button>
            </li>
            <li>
              <button
                type="button"
                className="inline-flex w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-600 dark:hover:text-white"
                onClick={() => setCurrency('GBP')}
              >
                GBP
              </button>
            </li>
          </ul>
        </div>
      </div>

      <div className="range_container">
        <div className="slider_label flex justify-between mx-2">
          <span>{minVal}</span>
          <span>{maxVal}</span>
        </div>

        <div className="flex mb-4 space-x-4">
          {/* Min Price Slider */}
          <input
            type="range"
            min={minPrice}
            max={maxPrice}
            step="0.01"
            value={minVal}
            onChange={handleMinChange}
            className="slider w-1/2 h-2 bg-gray-300 rounded-full"
          />

          {/* Max Price Slider */}
          <input
            type="range"
            min={minPrice}
            max={maxPrice}
            step="0.01"
            value={maxVal}
            onChange={handleMaxChange}
            className="slider w-1/2 h-2 bg-gray-300 rounded-full"
          />
        </div>

        <div className="flex mb-4">
          <button
            type="button"
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-900 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 dark:bg-gray-700 dark:text-white dark:border-gray-600"
            onClick={onFilter}
          >
            Filter
          </button>
        </div>
      </div>
    </form>
  );
};

export default PriceFilterBar;
