import { useState, useEffect } from 'react';
import axios from 'axios';

function AdminAccountManagement() {
  const [activeTab, setActiveTab] = useState("addTourismGovernor");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState(null);
  const [token, setToken] = useState("");
  const [pendingDeletions, setPendingDeletions] = useState([]); // New state for pending deletion accounts
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
    const url = baseUrl + "/deleteAccount"; // Assuming this is the correct endpoint

    axios.get(url, getAuthHeaders())
      .then(response => {
        setPendingDeletions(response.data); // Assuming response data contains the list of accounts
      })
      .catch(err => setMessage("Error fetching pending deletion requests."));
  };

  // Call fetchPendingDeletions when "approveDeletion" tab is active
  useEffect(() => {
    if (activeTab === "approveDeletion") {
      fetchPendingDeletions();
    }
  }, [activeTab]);

  const handleAddTourismGovernor = () => {
    const url = baseUrl + "/createTourismGoverner";

    axios.post(url, { username, password }, getAuthHeaders())
      .then(response => {
        setMessage("Tourism Governor added successfully.");
        // Clear the input fields after successful submission
        setUsername("");
        setPassword("");
      })
      .catch(err => {
        console.log(err);
        setMessage(err.data.error)
      });
  };

  const handleAddAdmin = () => {
    const url = baseUrl + "/createAdmin";

    axios.post(url, { username, password }, getAuthHeaders())
      .then(response => {
        setMessage("Admin added successfully.");
        // Clear the input fields after successful submission
        setUsername("");
        setPassword("");
      })
      .catch(err => setMessage("Error adding Admin."));
  };

  const handleApproveAccountDeletion = (accountEmail) => {
    const url = baseUrl + "/approveAccountDeletion";

    axios.post(url, { email: accountEmail }, getAuthHeaders())
      .then(response => {
        setMessage(`Account deletion approved for ${accountEmail}.`);
        setPendingDeletions(pendingDeletions.filter(account => account.email !== accountEmail));
      })
      .catch(err => setMessage(`Error approving account deletion for ${accountEmail}.`));
  };

  return (
    <div className="relative text-center bg-white shadow rounded p-3 w-2/5 mx-auto">
      <h1 className="text-2xl text-gray-600 font-bold mb-3">Admin Account Management</h1>

      {/* Tab Navigation */}
      <div className="flex justify-around border-b mb-4">
        <button
          className={`p-2 ${activeTab === "addTourismGovernor" ? "border-b-2 border-blue-500" : ""}`}
          onClick={() => {setActiveTab("addTourismGovernor"); setMessage("")}}
        >
          Add Tourism Governor
        </button>
        <button
          className={`p-2 ${activeTab === "addAdmin" ? "border-b-2 border-blue-500" : ""}`}
          onClick={() => {setActiveTab("addAdmin");setMessage("")}}
        >
          Add Admin
        </button>
        <button
          className={`p-2 ${activeTab === "approveDeletion" ? "border-b-2 border-blue-500" : ""}`}
          onClick={() => {setActiveTab("approveDeletion");setMessage("")}}
        >
          Approve Account Deletion
        </button>
      </div>

      {/* Form Display based on Active Tab */}
      {activeTab === "addTourismGovernor" && (
        <form onSubmit={(e) => {e.preventDefault(); handleAddTourismGovernor();}} className="flex flex-col gap-4">
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

      {activeTab === "addAdmin" && (
        <form onSubmit={(e) => {e.preventDefault(); handleAddAdmin();}} className="flex flex-col gap-4">
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
              <div key={account.email} className="bg-gray-100 p-4 rounded shadow-md flex justify-between items-center">
                <div>
                  <p className="font-bold">{account.username}</p>
                  <p>{account.email}</p>
                </div>
                <button
                  onClick={() => handleApproveAccountDeletion(account.email)}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-700"
                >
                  Approve Deletion
                </button>
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
    </div>
  );
}

export default AdminAccountManagement;
