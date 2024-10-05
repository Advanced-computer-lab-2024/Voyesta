import React, { useState, useEffect } from "react";
import PriceFilterBar from "./PriceFilterBar";
import ProductCard from "./ProductCard";


import axios from "axios";

// TODO:
// 1. filter values is currently working on the whole range of values in DB
// 2. search is currently working with substring we want it to work correctly

function AdminProductsView() {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [minPrice, setMinPrice] = useState();
  const [maxPrice, setMaxPrice] = useState();
  // console.log(minPrice, maxPrice)

  const [sortOrder, setSortOrder] = useState("asc");

  useEffect(() => {
    axios.get('http://localhost:3000/api/products/getAllProducts')
      .then(res => {
        console.log(res.data.data);
        setProducts(res.data.data);
        // setFilteredProducts(res.data.data);
      })
      .catch(err => console.log(err));
  }, []);


  const handleSearch = (e) => {
    // const term = e.target.value.toLowerCase();
    setSearchTerm(e.target.value);
    axios.get('http://localhost:3000/api/products/search', {
        params: {
            name: e.target.value
        }
    })
    .then(res => {
    // console.log(res.data);
    setProducts(res.data.data);
    })
    .catch(error => {console.error(error)});
    
  };
  

  const handleSortOrderChange = (e) => {
    setSortOrder(e.target.value);
    const sorted = filteredProducts.sort((a, b) => {
      if (e.target.value === "asc") {
        return a.price - b.price;
      } else {
        return b.price - a.price;
      }
    });
    setFilteredProducts(sorted);
  };

  const handleEdit = (product) => {
    console.log("Edit product:", product);
    // Add your edit product logic here
  };

  return (
    <div className="flex">

      <div className="w-1/5 bg-red-300">

        <h2 className="text-lg font-bold mb-4 bg-green-200 p-2">Filter and Sort</h2>

        <div className="mb-4">
          <PriceFilterBar minPrice={minPrice} maxPrice={maxPrice} setProducts={setProducts}/>
        </div>
        
        <div className="mb-4">
          <label>Sort Order:</label>
          <select value={sortOrder} onChange={() =>{}} className="w-full p-2 border border-gray-400 rounded">
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
        </div>
      </div>

      <div className="w-4/5 pl-4 pt-5">

        <div className="mb-4 w-1/2 mx-auto">

          <input
            type="text"
            value={searchTerm}
            onChange={handleSearch}
            placeholder="Search products..."
            className="w-full p-2 border border-gray-400 rounded-lg"
          />
        </div>
        
        <div className="flex gap-3 flex-wrap justify-center">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} onEdit={() => {}} />
          ))}
        </div>

      </div>

    </div>
  );
}

export default AdminProductsView;