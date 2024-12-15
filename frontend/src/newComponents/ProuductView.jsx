import React, { useState, useEffect } from "react";
import axios from "axios";
import PriceFilterBar from "./PriceFilterBar";
import ProductCard from "./ProductCard";
import CurrencyConverter from "./CurrencyConverter";
import SellerCreateProduct from "../components/sellerComponents/SellerCreateProduct";

function ProductsView({ role, baseUrl }) {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [prices, setPrices] = useState([]);
  const [convertedPrices, setConvertedPrices] = useState([]); // New state for converted prices
  const [targetCurrency, setTargetCurrency] = useState('USD'); // New state for target currency
  const [searchTerm, setSearchTerm] = useState("");
  const [minPrice, setMinPrice] = useState();
  const [maxPrice, setMaxPrice] = useState();
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(true);
  const [sortOrder, setSortOrder] = useState("");
  const [user, setUser] = useState(null);
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
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
        setFilteredProducts(res.data.data);
        setPrices(res.data.data.map(product => product.price));
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
        setFilteredProducts(res.data.data);
        setErrorMsg("");
      })
      .catch(error => {
        if (!error.response.data.success) {
          setProducts([]);
          setFilteredProducts([]);
          setErrorMsg("No products found!");
        }
      });
  };

  const resetFilters = () => {
    setSearchTerm('');
    setMinPrice('');
    setMaxPrice('');
    setSortOrder('');
    setTargetCurrency('USD');
    window.location.reload(); // Refresh the page
  };

  const handleSortOrderChange = (order) => {
    setSortOrder(order);
    const sortedProducts = [...filteredProducts].sort((a, b) => {
      const avgRatingA = a.ratings.length > 0 ? a.ratings.reduce((acc, curr) => acc + curr.rating, 0) / a.ratings.length : 0;
      const avgRatingB = b.ratings.length > 0 ? b.ratings.reduce((acc, curr) => acc + curr.rating, 0) / b.ratings.length : 0;

      if (order === 'asc') {
        return avgRatingA - avgRatingB;
      } else if (order === 'desc') {
        return avgRatingB - avgRatingA;
      } else {
        return 0;
      }
    });
    setFilteredProducts(sortedProducts);
    setIsSortDropdownOpen(false);
  };

  const handleEdit = (product) => {
    const editUrl = role === 'admin' ? 'http://localhost:3000/api/admin/updateProduct/' + product._id : baseUrl + '/updateProduct/' + product._id;
    axios.put(editUrl, product, getAuthHeaders())
      .then(res => {
        fetchProducts();
      })
      .catch(err => console.log(err));
  };

  const toggleSortDropdown = () => {
    setIsSortDropdownOpen(!isSortDropdownOpen);
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Sorting and Search Bar */}
      <div className="bg-gray-200 shadow-md p-4">
        <div className="flex flex-wrap justify-center items-center space-x-4">
          {/* Sorting Dropdown - Only for tourist */}
          {role === 'tourist' && (
            <div className="relative">
              <button
                id="dropdownSortButton"
                className="inline-flex items-center px-3 py-2 mb-3 mr-3 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300"
                type="button"
                onClick={toggleSortDropdown}
              >
                {sortOrder === 'asc' ? 'Ascending (by ratings)' : sortOrder === 'desc' ? 'Descending (by ratings)' : 'Sort by'}
                <svg className="w-2 h-2 ml-2" aria-hidden="true" fill="none" viewBox="0 0 10 6">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1l4 4 4-4" />
                </svg>
              </button>

              {isSortDropdownOpen && (
                <div className="absolute z-50 bg-white divide-y divide-gray-100 rounded-lg shadow w-44">
                  <ul className="py-2 text-sm text-gray-700">
                    <li>
                      <button
                        onClick={() => handleSortOrderChange('asc')}
                        className="block px-4 py-2 hover:bg-gray-100 w-full text-left"
                      >
                        Ascending (by ratings)
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={() => handleSortOrderChange('desc')}
                        className="block px-4 py-2 hover:bg-gray-100 w-full text-left"
                      >
                        Descending (by ratings)
                      </button>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Search Bar - Visible to all users */}
          <div className="flex items-center space-x-2 w-1/2">
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearch}
              placeholder="Search products..."
              className="w-full p-2 border border-gray-400 rounded-lg"
            />
            <button
              onClick={resetFilters}
              className="w-1/6 inline-flex items-center px-3 py-2 mb-3 mr-3 text-sm font-medium text-center text-white bg-red-700 rounded-lg hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300"
            >
              Reset Filters
            </button>
            {role === 'admin' && (
              <button onClick={openModal} className="inline-flex items-center w-36 px-3 py-2 mb-3 mr-3 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300">
                Add Product
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="flex">
        {isModalOpen && (
        <div id="popup-modal" tabIndex="-1" className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden bg-black bg-opacity-50">
          <div className="relative p-4 w-full max-w-md max-h-full">
            <div className="relative bg-white rounded-lg shadow dark:bg-gray-100">
              <button type="button" className="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ml-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" onClick={closeModal}>
                <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                </svg>
                <span className="sr-only">Close modal</span>
              </button>
              <div className="p-4 md:p-5 text-left">
                <SellerCreateProduct baseUrl="http://localhost:3000/api/seller" />
              </div>
            </div>
          </div>
        </div>
      )}
          {role === 'tourist' && (
            <div className="w-1/4 pr-4">
              <div className="bg-gray-200 p-4 rounded-lg shadow">
                <PriceFilterBar
                  items={products}
                  setItems={setFilteredProducts}
                  convertedPrices={convertedPrices}
                  priceProperty="price"
                />
                <div className="mt-4">
                  <CurrencyConverter
                    prices={prices}
                    setConvertedPrices={setConvertedPrices}
                    setTargetCurrency={setTargetCurrency}
                  />
                </div>
              </div>
            </div>
          )}

          <div className={`${role === 'tourist' ? 'w-3/4' : 'w-full'}`}>
            {loading ? (
              <div className="text-center text-lg">Loading products...</div>
            ) : (
              <div className="flex gap-3 flex-wrap justify-center">
                {errorMsg ? (
                  <div className="text-red-500 text-lg">{errorMsg}</div>
                ) : (
                  filteredProducts.map((product, index) => (
                    <ProductCard
                    key={product._id}
                    fetchProducts={fetchProducts}
                    oldProduct={product}
                    onEdit={handleEdit}
                    convertedPrice={convertedPrices[index]} // Pass convertedPrice
                    targetCurrency={targetCurrency} // Pass targetCurrency
                  />
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductsView;