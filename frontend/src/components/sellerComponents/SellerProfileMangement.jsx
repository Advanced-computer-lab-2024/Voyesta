import { useState, useEffect } from 'react';
import axios from 'axios';
import ChangePassword from '../../newComponents/ChangePassword';

function SellerProfileManagement(props) {
  const [activeTab, setActiveTab] = useState("viewProfile");
  const [profile, setProfile] = useState(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null); // State to handle error messages

  const url = "http://localhost:3000/api/seller/get"; // Adjust based on your backend

  const token = localStorage.getItem('token');
  const getAuthHeaders = () => {
    return {
      headers: {
        Authorization: `Bearer ${token}`
      }
    };
  };

  // Fetch seller profile
  const fetchProfile = async () => {
    try {
      const response = await axios.get(url, getAuthHeaders());
      setProfile(response.data);
      console.log(response.data);
      // Set initial values for form fields
      setName(response.data.name);
      setDescription(response.data.description);
    } catch (error) {
      console.error('Error fetching profile:', error);
      setMessage("Error fetching profile.");
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    const updatedData = {
      name,
      description
    };

    try {
      await axios.put(url + '/update', updatedData, getAuthHeaders());
      setMessage("Profile updated successfully.");
      fetchProfile();
      setActiveTab("viewProfile"); // Refetch updated profile
    } catch (error) {
      console.error('Error updating profile:', error);
      setError(error.response?.data?.message || "Error updating profile.");
    }
  };

  const handleRequestAccountDeletion = async () => {
    try {
      const url = "http://localhost:3000/api/seller/setStatusToDeleted";
      await axios.patch(url, {}, getAuthHeaders());
      setMessage("Account deletion requested successfully.");
      fetchProfile();
    } catch (error) {
      console.error('Error requesting account deletion:', error);
      setError(error.response?.data?.message || "Error requesting account deletion.");
    }
  };

  const closeErrorPopup = () => {
    setError(null);
  };

  return (
    <div className="relative text-center bg-white shadow rounded p-3 w-2/5 mx-auto">
      <h1 className="text-2xl text-gray-600 font-bold mb-3">Seller Profile Management</h1>

      {/* Tab Navigation */}
      <div className="flex justify-around border-b mb-4">
        <button
          className={`p-2 ${activeTab === "viewProfile" ? "border-b-2 border-blue-500" : ""}`}
          onClick={() => setActiveTab("viewProfile")}
        >
          View Profile
        </button>
        <button
          className={`p-2 ${activeTab === "editProfile" ? "border-b-2 border-blue-500" : ""}`}
          onClick={() => setActiveTab("editProfile")}
        >
          Edit Profile
        </button>
        <button
          className={`p-2 ${activeTab === 'changePassword' ? 'border-b-2 border-blue-500' : ''}`}
          onClick={() => setActiveTab('changePassword')}
        >
          Change Password
        </button>
      </div>

      {/* Content based on Active Tab */}
      {activeTab === "viewProfile" && (
        profile ? (
          <div>
            <p><strong>Name:</strong> {profile.name}</p>
            <p><strong>Description:</strong> {profile.description}</p>
            <button
              onClick={handleRequestAccountDeletion}
              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-700 mt-4"
            >
              Request Account Deletion
            </button>
          </div>
        ) : (
          <div>
            <p><strong>Name:</strong> Loading...</p>
            <p><strong>Description:</strong> Loading...</p>
          </div>
        )
      )}

      {activeTab === 'changePassword' && (
          <ChangePassword baseUrl='http://localhost:3000/api/seller' />
      )}

      {activeTab === "editProfile" && (
        <form onSubmit={handleUpdateProfile} className="flex flex-col gap-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
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
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 w-full"
            />
          </div>

          <button
            type="submit"
            className="bg-blue-500 text-white rounded-lg p-2 mt-4 hover:bg-blue-700"
          >
            Update Profile
          </button>
        </form>
      )}

      {/* Display Message */}
      {message && (
        <p className={`mt-4 ${message.includes("successfully") ? "text-green-500" : "text-red-500"}`}>
          {message}
        </p>
      )}

      {/* Error Popup */}
      {error && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-md text-center">
            <p>{error}</p>
            <button
              onClick={closeErrorPopup}
              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-700 mt-4"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default SellerProfileManagement;