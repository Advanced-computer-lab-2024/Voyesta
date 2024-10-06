import { useState } from 'react';
import axios from 'axios';

function AdminAccountManagement() {
  const [activeTab, setActiveTab] = useState("addTourismGovernor"); // Tab management
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState(null);
  const baseUrl = 'http://localhost:3000/api/admin'

  // Handle Add Tourism Governor
  const handleAddTourismGovernor = () => {
    const url = baseUrl + "/createTourismGovernor";
    
    axios.post(url, { 
      username: username, 
      password: password 
    })
    .then(response => setMessage("Tourism Governor added successfully."))
    .catch(err => setMessage("Error adding Tourism Governor."));
  };

  // Handle Add Admin
  const handleAddAdmin = () => {
    const url = baseUrl + "/createAdmin";
    
    axios.post(url, { 
      username: username, 
      password: password 
    })
    .then(response => setMessage("Admin added successfully."))
    .catch(err => setMessage("Error adding Admin."));
  };

  // Handle Approve Account Deletion Request
  const handleApproveAccountDeletion = () => {
    const url = baseUrl + "/approveAccountDeletion";
    
    axios.post(url, { 
      email: email 
    })
    .then(response => setMessage("Account deletion request approved."))
    .catch(err => setMessage("Error approving account deletion request."));
  };

  return (
    <div className="relative text-center bg-white shadow rounded p-3 w-2/5 mx-auto">
      <h1 className="text-2xl text-gray-600 font-bold mb-3">Admin Account Management</h1>

      {/* Tab Navigation */}
      <div className="flex justify-around border-b mb-4">
        <button 
          className={`p-2 ${activeTab === "addTourismGovernor" ? "border-b-2 border-blue-500" : ""}`}
          onClick={() => setActiveTab("addTourismGovernor")}
        >
          Add Tourism Governor
        </button>
        <button 
          className={`p-2 ${activeTab === "addAdmin" ? "border-b-2 border-blue-500" : ""}`}
          onClick={() => setActiveTab("addAdmin")}
        >
          Add Admin
        </button>
        <button 
          className={`p-2 ${activeTab === "approveDeletion" ? "border-b-2 border-blue-500" : ""}`}
          onClick={() => setActiveTab("approveDeletion")}
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
        <form onSubmit={(e) => {e.preventDefault(); handleApproveAccountDeletion();}} className="flex flex-col gap-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Enter Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 w-full"
              required
            />
          </div>

          <button
            type="submit"
            className="bg-red-500 text-white rounded-lg p-2 mt-4 hover:bg-red-700"
          >
            Approve Account Deletion
          </button>
        </form>
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
