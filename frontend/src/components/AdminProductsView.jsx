import React, { useState, useEffect } from "react";
import PriceFilterBar from "./PriceFilterBar";
import ProductCard from "./ProductCard";


import axios from "axios";

// TODO:
// 1. add Product

function AdminProductsView() {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [minPrice, setMinPrice] = useState();
  const [maxPrice, setMaxPrice] = useState();
  const [errorMsg, setErrorMsg] = useState();


  // console.log(minPrice, maxPrice)

  const [sortOrder, setSortOrder] = useState("");

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = () =>{
    axios.get('http://localhost:3000/api/admin/getProducts')
    .then(res => {
      setProducts(res.data.data);
    })
    .catch(err => console.log(err));
  }

  const handleSearch = (e) => {
    // const term = e.target.value.toLowerCase();
    setSearchTerm(e.target.value);
    axios.get('http://localhost:3000/api/admin/searchProducts', {
        params: {
            name: e.target.value
        }
    })
    .then(res => {
    // console.log(res.data);
    setProducts(res.data.data);
    setErrorMsg();
    })
    .catch(error => {
      if(!error.response.data.success){
        setProducts([]);
        setErrorMsg("No products found!")
      }
    });
    
  };

  const handleSortOrderChange = (e) => {
    const newSortOrder = e.target.value;
    setSortOrder(newSortOrder);
    
    
    const sortedProducts = [...products].sort((a, b) => {
      const avgRatingA = a.ratings.reduce((acc, curr) => acc + curr.rating, 0) / a.ratings.length;
      const avgRatingB = b.ratings.reduce((acc, curr) => acc + curr.rating, 0) / b.ratings.length;
    
      if (isNaN(avgRatingA) || isNaN(avgRatingB)) {
        return 0; // or some other default value
      }
    
      if (newSortOrder === 'asc') {
        return avgRatingA - avgRatingB;
      } else if (newSortOrder === 'desc') {
        return avgRatingB - avgRatingA;
      }
    });
    setProducts(sortedProducts);
  };
  

  const handleEdit = (product) => {
    const url = 'http://localhost:3000/api/admin/updateProduct/'+product._id;
    axios.put(url, product)
    .then(res => {
      console.log(res.data);
      fetchProducts();
      // setFilteredProducts(res.data.data);
    })
    .catch(err => console.log(err));
    
    
  };

  return (
    <div className="flex">

      <div className="w-1/5 bg-red-300">

        <h2 className="text-lg font-bold mb-4 bg-green-200 p-2">Filter and Sort</h2>

        <div className="mb-4">
          <PriceFilterBar products={products} setProducts={setProducts}/>
        </div>
        
        <div className="mb-4  text-center">
          <label>Sort Order:</label>
          <select value={sortOrder} onChange={handleSortOrderChange} className="w-full p-2 border border-gray-400 rounded">
            <option value="" disabled>Select an option</option>
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>

          {/* <button className='form_control' onClick={handleSortOrderChange}>Sort</button> */}

        </div>
      </div>

      <div className="w-4/5 pl-4 pt-5">

        <div className="mb-4 w-1/2 mx-auto flex flex-row gap-2">
          <button className="border px-3 rounded" onClick={fetchProducts}>Reset</button>
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearch}
            placeholder="Search products..."
            className="w-full p-2 border border-gray-400 rounded-lg"
          />
        </div>
        
        <div className="flex gap-3 flex-wrap justify-center">
          {errorMsg ? <p className="text-center text-red-400 text-lg">{errorMsg}</p> : null}
          {products.map((product) => (
            <ProductCard key={product._id} oldProduct={product} onEdit={handleEdit} />
          ))}
        </div>

      </div>

    </div>
  );
}

export default AdminProductsView;
