import { useState, useEffect } from 'react';
import axios from 'axios';
import ChangePassword from '../../newComponents/ChangePassword';

function AdminAccountManagement() {
  const [activeTab, setActiveTab] = useState("addTourismGovernor");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState(null);
  const [token, setToken] = useState("");
  const [pendingDeletions, setPendingDeletions] = useState([]); // New state for pending deletion accounts
  const [showPopup, setShowPopup] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const baseUrl = 'http://localhost:3000/api/admin';

  // Load token from local storage (or wherever you store it)
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    setToken(storedToken);
  }, []);

  // Function to configure axios headers with the token
  const getAuthHeaders = () => ({
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  // Function to handle fetching accounts with pending deletion requests
  const fetchPendingDeletions = () => {
    const url = baseUrl + "/getDeletedUsers";

    axios.get(url, getAuthHeaders())
      .then(response => {
        setPendingDeletions(response.data);
      })
      .catch(err => setMessage("Error fetching pending deletion requests."));
  };

  // Call fetchPendingDeletions when "approveDeletion" tab is active
  useEffect(() => {
    if (activeTab === "approveDeletion") {
      fetchPendingDeletions();
    }
  }, [activeTab]);

  const handleApproveAccountDeletion = (userId) => {
    const url = `${baseUrl}/deleteAccount/${userId}`;

    axios.delete(url, getAuthHeaders())
      .then(response => {
        setMessage(`Account deletion approved for user ID: ${userId}.`);
        setPendingDeletions(pendingDeletions.filter(account => account._id !== userId));
      })
      .catch(err => setMessage(`Error approving account deletion for user ID: ${userId}.`));
  };

  const handleRejectAccountDeletion = (userId) => {
    const url = `${baseUrl}/setStatusToActive/${userId}`;

    axios.patch(url, {}, getAuthHeaders())
      .then(response => {
        setMessage(`Account deletion rejected for user ID: ${userId}.`);
        setPendingDeletions(pendingDeletions.filter(account => account._id !== userId));
      })
      .catch(err => setMessage(`Error rejecting account deletion for user ID: ${userId}.`));
  };

  const handleDeleteClick = (userId) => {
    setSelectedUserId(userId);
    setShowPopup(true);
  };

  const handleConfirmDelete = () => {
    handleApproveAccountDeletion(selectedUserId);
    setShowPopup(false);
  };

  return (
    <div className="relative text-center bg-white shadow rounded p-3 w-2/5 mx-auto">
      <h1 className="text-2xl text-gray-600 font-bold mb-3">Admin Account Management</h1>

      {/* Tab Navigation */}
      <div className="flex justify-around border-b mb-4">
        <button
          className={`p-2 ${activeTab === "addTourismGovernor" ? "border-b-2 border-blue-500" : ""}`}
          onClick={() => { setActiveTab("addTourismGovernor"); setMessage("") }}
        >
          Add Tourism Governor
        </button>
        <button
          className={`p-2 ${activeTab === "addAdmin" ? "border-b-2 border-blue-500" : ""}`}
          onClick={() => { setActiveTab("addAdmin"); setMessage("") }}
        >
          Add Admin
        </button>
        <button
          className={`p-2 ${activeTab === "approveDeletion" ? "border-b-2 border-blue-500" : ""}`}
          onClick={() => { setActiveTab("approveDeletion"); setMessage("") }}
        >
          Approve Account Deletion
        </button>
        <button
          className={`p-2 ${activeTab === 'changePassword' ? 'border-b-2 border-blue-500' : ''}`}
          onClick={() => setActiveTab('changePassword')}
        >
          Change Password
        </button>
      </div>

      {/* Form Display based on Active Tab */}
      {activeTab === "addTourismGovernor" && (
        <form onSubmit={(e) => { e.preventDefault(); handleAddTourismGovernor(); }} className="flex flex-col gap-4">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700">
              Username
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 w-full"
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 w-full"
              required
            />
          </div>
          <button
            type="submit"
            className="bg-blue-500 text-white rounded-lg p-2 mt-4 hover:bg-blue-700"
          >
            Add Tourism Governor
          </button>
        </form>
      )}

      {activeTab === 'changePassword' && (
        <ChangePassword baseUrl={baseUrl} />
      )}

      {activeTab === "addAdmin" && (
        <form onSubmit={(e) => { e.preventDefault(); handleAddAdmin(); }} className="flex flex-col gap-4">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700">
              Username
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 w-full"
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 w-full"
              required
            />
          </div>
          <button
            type="submit"
            className="bg-blue-500 text-white rounded-lg p-2 mt-4 hover:bg-blue-700"
          >
            Add Admin
          </button>
        </form>
      )}

      {activeTab === "approveDeletion" && (
        <div className="flex flex-col gap-4">
          {/* Display account cards for pending deletions */}
          {pendingDeletions.length > 0 ? (
            pendingDeletions.map(account => (
              <div key={account._id} className="bg-gray-100 p-4 rounded shadow-md flex justify-between items-center">
                <div>
                  <p className="font-bold">{account.username}</p>
                  <p>{account.email}</p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleDeleteClick(account._id)}
                    className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-700"
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => handleRejectAccountDeletion(account._id)}
                    className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p>No pending account deletions.</p>
          )}
        </div>
      )}

      {/* Display Message */}
      {message && (
        <p className={`mt-4 ${message.includes("successfully") ? "text-green-500" : "text-red-500"}`}>
          {message}
        </p>
      )}

      {/* Confirmation Popup */}
      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-md text-center">
            <p>Are you sure you want to delete this account?</p>
            <div className="flex justify-center space-x-4 mt-4">
              <button
                onClick={handleConfirmDelete}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-700"
              >
                Confirm
              </button>
              <button
                onClick={() => setShowPopup(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminAccountManagement;