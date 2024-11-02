// PriceFilterBar.jsx
import React, { useEffect, useState } from 'react';
import '../css/PriceFilterBar.css';

const PriceFilterBar = ({ products, setProducts }) => {
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(0);
  const [minVal, setMinVal] = useState(minPrice);
  const [maxVal, setMaxVal] = useState(maxPrice);

  useEffect(() => {
    const prices = products.map((product) => 
      typeof product.price === 'object' ? product.price.min : product.price
    );
    setMinPrice(Math.min(...prices));
    setMaxPrice(Math.max(...prices));
    setMinVal(Math.min(...prices));
    setMaxVal(Math.max(...prices));
  }, [products]);

  const onFilter = () => {
    const filteredProducts = products.filter((product) => {
      const price = typeof product.price === 'object' ? product.price.min : product.price;
      return price >= minVal && price <= maxVal;
    });
    setProducts(filteredProducts);
  };

  const handleMinChange = (e) => {
    const value = Math.min(Number(e.target.value), maxVal);
    setMinVal(value);
  };

  const handleMaxChange = (e) => {
    const value = Math.max(Number(e.target.value), minVal);
    setMaxVal(value);
  };

  return (
    <div className="range_container">
      <div className="slider_label flex justify-between mx-2">
        <span>${minVal}</span>
        <span>${maxVal}</span>
      </div>
      <div className="sliders_control">
        <input
          id="fromSlider"
          type="range"
          value={minVal}
          min={minPrice}
          max={maxPrice}
          onChange={handleMinChange}
        />
        <input
          id="toSlider"
          type="range"
          value={maxVal}
          min={minPrice}
          max={maxPrice}
          onChange={handleMaxChange}
        />
      </div>
      <button className='form_control' onClick={onFilter}>Filter</button>
    </div>
  );
};

export default PriceFilterBar;
