import { useState, useEffect } from 'react';
import axios from 'axios';

function SellerProfileManagement(props) {
  const [sellerData, setSellerData] = useState(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(true);

  const url = props.baseUrl;

  const token = localStorage.getItem('token');

  const getAuthHeaders = () =>{
    console.log(token);
    return {
    headers: {
        Authorization: `Bearer ${token}`
    }}
};



const fetchMyProfile = () => {
  setLoading(true);  // Set loading to true when fetching
  axios.get(url + '/get', getAuthHeaders())
    .then(res => {
      const { username, email, name, description } = response.data;
      setSellerData({ username, email });
      setName(name);
      setDescription(description);
      setLoading(false);  // Stop loading when data is fetched
    })
    .catch(err => {
      setMessage('Failed to fetch seller details.');
      console.log(err);
      setLoading(false);
    });
};

  // Fetch seller details on component mount
  useEffect(() => {
    fetchMyProfile();
  }, []);

  const handleUpdateSeller = (e) => {
    e.preventDefault();
    setLoading(true); // Set loading to true when updating
    axios.put(url + '/updateSeller',{ name, description },getAuthHeaders())
      .then((response) => {
        setMessage('Seller profile updated successfully!');
        console.log(response.data);
        setLoading(false); // Stop loading after updating
      })
      .catch((error) => {
        setMessage(error.response?.data?.message || 'Failed to update profile.');
        console.error(error);
        setLoading(false);
      });
  };

  const handleDeleteAccount = () => {
    setLoading(true); // Set loading to true when deleting
    axios.delete(url + '/deleteSeller', getAuthHeaders())
      .then((response) => {
        setMessage('Seller account deleted successfully.');
        console.log(response.data);
        setLoading(false); // Stop loading after deletion
      })
      .catch((error) => {
        setMessage('Failed to delete account.');
        console.error(error);
        setLoading(false);
      });
  };

  return (
    <div className="relative text-center bg-white shadow rounded p-3 w-2/5 mx-auto">
      <h1 className="text-2xl text-gray-600 font-bold mb-3">Seller Profile Management</h1>

      {sellerData ? (
        <form onSubmit={handleUpdateSeller} className="flex flex-col gap-4">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700">
              Username
            </label>
            <input
              type="text"
              id="username"
              value={sellerData.username}
              disabled
              className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg p-2.5 w-full"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={sellerData.email}
              disabled
              className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg p-2.5 w-full"
            />
          </div>

          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg p-2.5 w-full"
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <input
              type="text"
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg p-2.5 w-full"
            />
          </div>

          <button
            type="submit"
            className="bg-blue-500 text-white rounded-lg p-2 mt-4 hover:bg-blue-700"
          >
            Update Profile
          </button>

          <button
            type="button"
            onClick={handleDeleteAccount}
            className="bg-red-500 text-white rounded-lg p-2 mt-4 hover:bg-red-700"
          >
            Delete Account
          </button>

          {message && (
            <p className={`mt-2 ${message.includes('successfully') ? 'text-green-500' : 'text-red-500'}`}>
              {message}
            </p>
          )}
        </form>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

export default SellerProfileManagement;
