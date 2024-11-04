import React, { useState, useEffect } from "react";
import PriceFilterBar from "./PriceFilterBar";
import ProductCard from "./ProductCard";
import axios from "axios";

function ProductsView({ role, baseUrl }) {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [minPrice, setMinPrice] = useState();
  const [maxPrice, setMaxPrice] = useState();
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(true);
  const [sortOrder, setSortOrder] = useState("");
  const [user, setUser] = useState(null);

  const token = localStorage.getItem('token');

  const getAuthHeaders = () => {
    return {
      headers: {
        Authorization: `Bearer ${token}`
      }
    };
  };

  useEffect(() => {
    axios.get('http://localhost:3000/api/user', getAuthHeaders())
      .then(res => {
        setUser(res.data.user);
      })
      .catch(err => console.log(err));
  }, []);

  useEffect(() => {
    if (role === 'admin') {
      fetchProducts('http://localhost:3000/api/admin/getProducts');
    } else if (role === 'seller') {
      fetchProducts('http://localhost:3000/api/seller/getAllProducts');
    } else if (role === 'sellerMyProducts') {
      fetchProducts('http://localhost:3000/api/seller/getMyProducts');
    } else if (role === 'tourist') {
      fetchProducts('http://localhost:3000/api/tourist/getProducts');
    }
  }, [role]);

  const fetchProducts = (url) => {
    setLoading(true);
    axios.get(url, getAuthHeaders())
      .then(res => {
        setProducts(res.data.data);
        setLoading(false);
      })
      .catch(err => {
        console.log(err);
        setLoading(false);
      });
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    const searchUrl = role === 'admin' ? 'http://localhost:3000/api/admin/searchProducts' : 'http://localhost:3000/api/seller/searchProductByName';
    axios.get(searchUrl, {
      params: {
        name: e.target.value
      }
    })
      .then(res => {
        setProducts(res.data.data);
        setErrorMsg("");
      })
      .catch(error => {
        if (!error.response.data.success) {
          setProducts([]);
          setErrorMsg("No products found!");
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
        return 0;
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
    const editUrl = role === 'admin' ? 'http://localhost:3000/api/admin/updateProduct/' + product._id : baseUrl + '/updateProduct/' + product._id;
    axios.put(editUrl, product, getAuthHeaders())
      .then(res => {
        fetchProducts();
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
        <div className="mb-4 w-1/2 mx-auto">
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearch}
            placeholder="Search products..."
            className="w-full p-2 border border-gray-400 rounded-lg"
          />
        </div>

        {loading ? (
          <div className="text-center text-lg">Loading products...</div>
        ) : (
          <div className="flex gap-3 flex-wrap justify-center">
            {errorMsg ? (
              <p className="text-center text-red-400 text-lg">{errorMsg}</p>
            ) : (
              products.length > 0 ? (
                products.map((product) => (
                  <ProductCard key={product._id} oldProduct={product} onEdit={handleEdit} userType={user?.type} userId={user?.id} />
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

export default ProductsView;