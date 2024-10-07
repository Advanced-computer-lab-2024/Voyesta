import React, { useState, useEffect } from "react";
import PriceFilterBar from "./SellerPriceFilterBar";
import ProductCard from "./SellerProductCard";
import axios from "axios";

function SellerViewMyProducts(props) {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [minPrice, setMinPrice] = useState();
  const [maxPrice, setMaxPrice] = useState();
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(true);  // Loading state
  const url = props.baseUrl;
  const [sortOrder, setSortOrder] = useState("");
  const [user, setUser] = useState(null);





  const token = localStorage.getItem('token');

  const getAuthHeaders = () =>{
    console.log(token);
    return {
    headers: {
        Authorization: `Bearer ${token}`
    }}
};
// for the edit to be accessed only by the seller of the product or the admin
useEffect(() => {
    axios.get('http://localhost:3000/api/user', getAuthHeaders()).then((res) => {
      console.log(res.data.user);
      setUser(res.data.user);
    }).then(res =>{
      setUser(res.data.user);
    }).catch(err => console.log(err));
  }, []);





useEffect(() => {
  fetchMyProducts();
}, []);

  const fetchMyProducts = () => {
    setLoading(true);  // Set loading to true when fetching
    axios.get(url + '/getMyProducts', getAuthHeaders())
      .then(res => {
        setProducts(res.data.data);
        setLoading(false);  // Stop loading when data is fetched
      })
      .catch(err => {
        console.log(err);
        setLoading(false);
      });
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    axios.get('http://localhost:3000/api/seller/searchProductByName', {
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
    axios.put(url + '/updateProduct/' + product._id, product, getAuthHeaders())
      .then(res => {
        console.log(res.data);
        fetchProducts();  // Refresh products after editing
      })
      .catch(err => console.log(err));
  };

  return (
    <div className="flex">
      <div className="w-1/5 bg-red-300">
        <h2 className="text-lg font-bold mb-4 bg-green-200 p-2">Filter and Sort</h2>

        <div className="mb-4">
          <PriceFilterBar products={products} setProducts={setProducts} />
        </div>

        <div className="mb-4 text-center">
          <label>Sort Order:</label>
          <select value={sortOrder} onChange={handleSortOrderChange} className="w-full p-2 border border-gray-400 rounded">
            <option value="" disabled>Select an option</option>
            <option value="asc">Ascending (by ratings)</option>
            <option value="desc">Descending (by ratings)</option>
          </select>
        </div>
      </div>

      <div className="w-4/5 pl-4 pt-5">
        {/* <div className="mb-4 w-1/2 mx-auto">
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearch}
            placeholder="Search products..."
            className="w-full p-2 border border-gray-400 rounded-lg"
          />
        </div> */}

        {loading ? (
          <div className="text-center text-lg">Loading products...</div>
        ) : (
          <div className="flex gap-3 flex-wrap justify-center">
            {errorMsg ? (
              <p className="text-center text-red-400 text-lg">{errorMsg}</p>
            ) : (
              products.length > 0 ? (
                products.map((product) => (
                  <ProductCard key={product._id} oldProduct={product} onEdit={handleEdit}  userType={user.type} userId={user.id} />
                ))
              ) : (
                <p className="text-center text-lg">No products available.</p>
              )
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default SellerViewMyProducts;
