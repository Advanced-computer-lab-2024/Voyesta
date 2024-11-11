import React, { useEffect, useState } from 'react';
import '../css/PriceFilterBar.css';

const PriceFilterBar = ({ items = [], setItems, convertedPrices = [], priceProperty = 'price' }) => {
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(0);
  const [minVal, setMinVal] = useState(minPrice);
  const [maxVal, setMaxVal] = useState(maxPrice);

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
    <div className="range_container">
      <div className="slider_label flex justify-between mx-2">
        <span>{minVal}</span>
        <span>{maxVal}</span>
      </div>
      <div className="sliders_control">
        <input
          id="fromSlider"
          type="range"
          value={minVal}
          min={minPrice}
          max={maxPrice}
          step="0.01"
          onChange={handleMinChange}
        />
        <input
          id="toSlider"
          type="range"
          value={maxVal}
          min={minPrice}
          max={maxPrice}
          step="0.01"
          onChange={handleMaxChange}
        />
      </div>
      <button className='form_control' onClick={onFilter}>Filter</button>
    </div>
  );
};

export default PriceFilterBar;