import { useState } from 'react';
import axios from 'axios';

function AddProduct(props) {
  const [name, setName] = useState('');
  const [picture, setPicture] = useState(null);
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [availableQuantity, setAvailableQuantity] = useState('');
  const [message, setMessage] = useState(null);

  const handleAddProduct = async (e) => {
    e.preventDefault();

    const url = props.baseUrl + '/createProduct';
    const token = localStorage.getItem('token');

    const getAuthHeaders = () => {
      return {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    };

    const formData = new FormData();
    formData.append('name', name);
    formData.append('picture', picture);
    formData.append('price', price);
    formData.append('description', description);
    formData.append('available_quantity', availableQuantity);

    axios.post(url, formData, getAuthHeaders())
      .then(res => {
        setMessage("Product created successfully!");
        console.log(res);
      })
      .catch(err => {
        setMessage(err.response?.data?.message || "Failed to create Product.");
        console.log(err);
      });
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Add New Product</h2>
        <form onSubmit={handleAddProduct} className="space-y-6">
          <div className="relative z-0 w-full mb-5 group">
            <input
              type="text"
              name="name"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              placeholder=" "
              required
            />
            <label
              htmlFor="name"
              className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
            >
              Product Name
            </label>
          </div>

          <div className="relative z-0 w-full mb-5 group">
            <input
              type="file"
              name="picture"
              id="picture"
              onChange={(e) => setPicture(e.target.files[0])}
              className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              placeholder=" "
              required
            />
            <label
              htmlFor="picture"
              className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
            >
              Picture
            </label>
          </div>

          <div className="relative z-0 w-full mb-5 group">
            <textarea
              name="description"
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              placeholder=" "
              required
            />
            <label
              htmlFor="description"
              className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
            >
              Description
            </label>
          </div>

          <div className="relative z-0 w-full mb-5 group">
            <label
              htmlFor="price"
              className="block text-sm text-gray-500 mb-2"
            >
              Price
            </label>
            <div className="flex items-center space-x-1">
              <button
                type="button"
                onClick={() => setPrice(price > 0 ? price - 1 : 0)}
                className="bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:border-gray-600 hover:bg-gray-200 border border-gray-300 rounded-s-lg p-2 h-8 focus:ring-gray-100 dark:focus:ring-gray-700 focus:ring-2 focus:outline-none"
              >
                <svg className="w-3 h-3 text-gray-900 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 2">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h16" />
                </svg>
              </button>
              <input
                type="text"
                name="price"
                id="price"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                className="bg-gray-50 border-x-0 border-gray-300 h-8 text-center text-blue-600 text-sm focus:ring-blue-500 focus:border-blue-500 block w-12 py-1 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="0"
                required
                style={{ '-webkit-appearance': 'none', '-moz-appearance': 'textfield' }}
              />
              <button
                type="button"
                onClick={() => setPrice(price + 1)}
                className="bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:border-gray-600 hover:bg-gray-200 border border-gray-300 rounded-e-lg p-2 h-8 focus:ring-gray-100 dark:focus:ring-gray-700 focus:ring-2 focus:outline-none"
              >
                <svg className="w-3 h-3 text-gray-900 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 18">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 1v16M1 9h16" />
                </svg>
              </button>
            </div>
          </div>

          <div className="relative z-0 w-full mb-5 group">
            <label
              htmlFor="availableQuantity"
              className="block text-sm text-gray-500 mb-2"
            >
              Available Quantity
            </label>
            <div className="flex items-center space-x-1">
              <button
                type="button"
                onClick={() => setAvailableQuantity(availableQuantity > 0 ? availableQuantity - 1 : 0)}
                className="bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:border-gray-600 hover:bg-gray-200 border border-gray-300 rounded-s-lg p-2 h-8 focus:ring-gray-100 dark:focus:ring-gray-700 focus:ring-2 focus:outline-none"
              >
                <svg className="w-3 h-3 text-gray-900 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 2">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h16" />
                </svg>
              </button>
              <input
                type="text"
                name="availableQuantity"
                id="availableQuantity"
                value={availableQuantity}
                onChange={(e) => setAvailableQuantity(Number(e.target.value))}
                className="bg-gray-50 border-x-0 border-gray-300 h-8 text-center text-blue-600 text-sm focus:ring-blue-500 focus:border-blue-500 block w-12 py-1 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="0"
                required
                style={{ '-webkit-appearance': 'none', '-moz-appearance': 'textfield' }}
              />
              <button
                type="button"
                onClick={() => setAvailableQuantity(availableQuantity + 1)}
                className="bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:border-gray-600 hover:bg-gray-200 border border-gray-300 rounded-e-lg p-2 h-8 focus:ring-gray-100 dark:focus:ring-gray-700 focus:ring-2 focus:outline-none"
              >
                <svg className="w-3 h-3 text-gray-900 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 18">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 1v16M1 9h16" />
                </svg>
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            Add Product
          </button>

          {message && (
            <p className={`mt-2 ${message.includes("successfully") ? "text-green-500" : "text-red-500"}`}>
              {message}
            </p>
          )}
        </form>
      </div>
    </div>
  );
}

export default AddProduct;