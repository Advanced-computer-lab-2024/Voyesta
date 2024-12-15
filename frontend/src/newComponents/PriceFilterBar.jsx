import React, { useState, useEffect } from 'react';
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

  useEffect(() => {
    if (items.length > 0) {
      const prices = convertedPrices.length > 0 ? convertedPrices : items.map((item) => item[priceProperty]);
      const min = Math.min(...prices);
      const max = Math.max(...prices);
      setMinPrice(min);
      setMaxPrice(max);
      setMinVal(min);
      setMaxVal(max);
    }
  }, [items, convertedPrices, priceProperty]);

  useEffect(() => {
    filterItems();
  }, [minVal, maxVal]);

  const handleMinChange = (e) => {
    const value = Math.min(e.target.value, maxVal - 1);
    setMinVal(value);
  };

  const handleMaxChange = (e) => {
    const value = Math.max(e.target.value, minVal + 1);
    setMaxVal(value);
  };

  const filterItems = () => {
    const filtered = items.filter(item => {
      const price = convertedPrices.length > 0 ? convertedPrices[items.indexOf(item)] : item[priceProperty];
      return price >= minVal && price <= maxVal;
    });
    setItems(filtered);
  };

  return (
    <div className="price-filter-bar mb-14 mt-14 ">
      <input
        type="range"
        min={minPrice}
        max={maxPrice}
        value={minVal}
        onChange={handleMinChange}
        className="thumb thumb--left"
        style={{ zIndex: minVal > maxPrice - 100 && '5' }}
      />
      <input
        type="range"
        min={minPrice}
        max={maxPrice}
        value={maxVal}
        onChange={handleMaxChange}
        className="thumb thumb--right"
      />
      <div className="slider">
        <div className="slider__track"></div>
        <div className="slider__range" style={{ left: `${(minVal / maxPrice) * 100}%`, right: `${100 - (maxVal / maxPrice) * 100}%` }}></div>
        <div className="slider__left-value">{minVal}</div>
        <div className="slider__right-value">{maxVal}</div>
      </div>
    </div>
  );
};

export default PriceFilterBar;