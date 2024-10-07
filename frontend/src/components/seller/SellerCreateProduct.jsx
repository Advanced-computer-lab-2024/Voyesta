import { useEffect, useState } from 'react';
import axios from 'axios';
//import _ from '../../../../backend/src/routes';

function AddProduct(props) {
  const [name, setName] = useState('');
  const [picture, setPicture] = useState('');  // Could be a URL or file path
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [seller, setSeller] = useState('');
  //const [ratings, setRatings] = useState('');  // Assuming ratings is a number
  const [reviews, setReviews] = useState([]);  // Assuming reviews is an array
  const [availableQuantity, setAvailableQuantity] = useState('');
  const [message, setMessage] = useState(null);
  const [user, setUser] = useState(null);
  const handleAddProduct = async (e) => {
    e.preventDefault();  // Prevent the default form submission behavior

    const url = props.baseUrl + '/createProduct';  // Backend API URL


    const token = localStorage.getItem('token');

    const getAuthHeaders = () =>{
      console.log(token);
      return {
      headers: {
          Authorization: `Bearer ${token}`
      }}
  };

    // useEffect(() => {
    //   axios.get('/api/user', getAuthHeaders()).then((res) => {
    //     console.log(res.data.user);
    //     setUser(res.data.user);
    //   });
    // }, []);

    // const createdBy = {
    //   _id: user._id,
    //   role: user.type
    // };

      axios.post(url, {
        name,
        picture,
        price,
        description,
        seller,
        available_quantity: availableQuantity,
        // createdBy
      }, getAuthHeaders()).then(res => {
        setMessage("Product created successfully!"); 
        console.log(res);
    }).catch(err => {
        setMessage(err.response?.data?.message || "Failed to create Product.");
        console.log(err)});

  };

  return (
    <div className="relative text-center bg-white shadow rounded p-3 w-2/5 mx-auto">
      <h1 className="text-2xl text-gray-600 font-bold mb-3">Add Product</h1>
      <form onSubmit={handleAddProduct} className="flex flex-col gap-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Product Name
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 w-full"
            required
          />
        </div>

        <div>
          <label htmlFor="picture" className="block text-sm font-medium text-gray-700">
            Picture URL
          </label>
          <input
            type="text"
            id="picture"
            value={picture}
            onChange={(e) => setPicture(e.target.value)}
            className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 w-full"
            required
          />
        </div>

        <div>
          <label htmlFor="price" className="block text-sm font-medium text-gray-700">
            Price
          </label>
          <input
            type="number"
            id="price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="bg-gray-50  border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 w-full"
            required
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 w-full"
            required
          />
        </div>

        <div>
          <label htmlFor="seller" className="block text-sm font-medium text-gray-700">
            Seller
          </label>
          <input
            type="text"
            id="seller"
            value={seller}
            onChange={(e) => setSeller(e.target.value)}
            className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 w-full"
            required
          />
        </div>


        <div>
          <label htmlFor="availableQuantity" className="block text-sm font-medium text-gray-700">
            Available Quantity
          </label>
          <input
            type="number"
            id="availableQuantity"
            value={availableQuantity}
            onChange={(e) => setAvailableQuantity(e.target.value)}
            className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 w-full"
            required
          />
        </div>

        <button
          type="submit"
          className="bg-blue-500 text-white rounded-lg p-2 mt-4 hover:bg-blue-700"
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
  );
}

export default AddProduct;
