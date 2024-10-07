import React, { useEffect, useState } from 'react';
import '../../css/PriceFilterBar.css';
import axios from 'axios';

const PriceFilterBar = ({products, setProducts }) => {
  
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(0);
  const [minVal, setMinVal] = useState(minPrice);
  const [maxVal, setMaxVal] = useState(maxPrice);
  // const [filteredProducts, setFilteredProducts] = useState([]);
  // console.log(minPrice, maxPrice);


  const totalWidth = maxPrice - minPrice;
  const minMaxDiff = totalWidth * 0.1; // 10% of total width
  
  useEffect(() => {
    // axios.get("http://localhost:3000/api/admin/getProductsMinAndMax")
    // .then(res => {
    //   // console.log(res.data.data);
    //   setMaxPrice(res.data.data.maxPrice);
    //   setMaxVal(res.data.data.maxPrice);

    //   setMinPrice(res.data.data.minPrice);
    //   setMinVal(res.data.data.minPrice); 
    // })
    // .catch(err => console.log(err));
    const prices = products.map((product) => product.price);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    setMinPrice(minPrice);
    setMaxPrice(maxPrice);
    setMinVal(minPrice);
    setMaxVal(maxPrice);
  },[products]);

  const onFilter = () =>{
    // axios.get('http://localhost:3000/api/admin/filterProductsByPrice', {
    //   params: {
    //       minPrice: minVal,
    //       maxPrice: maxVal
    //   }
    // })
    // .then(res => {
    // // console.log(res.data);
    // setProducts(res.data.data);
    // })
    // .catch(error => {console.error(error)});
    const filteredProducts = products.filter((product) => {
      return product.price >= minVal && product.price <= maxVal;
    });
    setProducts(filteredProducts);
  }

  const handleMinChange = (e) => {
    const value = Math.min(Number(e.target.value), maxVal - minMaxDiff);
    setMinVal(value);
  };

  const handleMaxChange = (e) => {
    const value = Math.max(Number(e.target.value), minVal + minMaxDiff);
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