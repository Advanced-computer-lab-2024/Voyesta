import { useState, useEffect } from 'react';
import axios from 'axios';
import ChangePassword from '../../newComponents/ChangePassword';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserPlus, faKey, faTrashAlt, faCheck, faTimes, faUserCircle  } from '@fortawesome/free-solid-svg-icons';

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
  const [showAccountPopup, setShowAccountPopup] = useState(false);
  const [error, setError] = useState(null);
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
        console.log(response.data);
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
    // console.log(user)
    axios.patch(url, {}, getAuthHeaders())
      .then(response => {
        setMessage(`Account deletion rejected for user ID: ${userId}.`);
        // setPendingDeletions(pendingDeletions.filter(account => account._id !== userId));
        fetchPendingDeletions();
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

  const handleCancelDelete = () => {
    setShowPopup(false);
  };

  const deleteAccount = () => {
    const url = `${baseUrl}/deleteAccount`;
    axios.delete(url, getAuthHeaders())
  }

  const handleConfirmAccountDeletion = () => {
    deleteAccount();
    setShowAccountPopup(false);
  }

  const handleCancelAccountDeletion = () => {
    setShowAccountPopup(false);
  }

  const showAccountDeletionPopup = () => {
    setShowAccountPopup(true);
  }

  const handleAddAdmin = () => {
    axios.post(`${baseUrl}/createAdmin`, { username, password }, getAuthHeaders())
    .then(response => setMessage("Admin account created successfully."))
    .catch(error => setMessage("Error creating Admin account. "));
  }

  const handleAddTourismGovernor = () => {
    axios.post(`${baseUrl}/createTourismGoverner`, { username, password }, getAuthHeaders())
    .then(response => setMessage("Tourism Governor account created successfully."))
    .catch(error => setMessage("Error creating Tourism Governor account. "));
  }
  return (
    <div className="max-w-full mx-auto bg-white shadow-md rounded-lg overflow-hidden relative px-40 pb-40">
      <div className="flex justify-between items-center p-4 border-b mb-10">
        <h2 className="text-4xl font-bold text-gray-900">Admin Account Management</h2>
        <FontAwesomeIcon
            icon={faTrashAlt}
            className="cursor-pointer text-2xl text-gray-700 hover:text-red-600"
            onClick={showAccountDeletionPopup}        />      </div>

      {/* Tab Navigation */}
      <div className="flex justify-around border-b mb-4">
        <button
          className={`p-2 ${activeTab === "addTourismGovernor" ? "border-b-2 border-blue-500" : ""}`}
          onClick={() => { setActiveTab("addTourismGovernor"); setMessage("") }}
        >
          <FontAwesomeIcon icon={faUserPlus} className="mr-2" />
          Add Tourism Governor
        </button>
        <button
          className={`p-2 ${activeTab === "addAdmin" ? "border-b-2 border-blue-500" : ""}`}
          onClick={() => { setActiveTab("addAdmin"); setMessage("") }}
        >
          <FontAwesomeIcon icon={faUserPlus} className="mr-2" />
          Add Admin
        </button>
        <button
          className={`p-2 ${activeTab === "approveDeletion" ? "border-b-2 border-blue-500" : ""}`}
          onClick={() => { setActiveTab("approveDeletion"); setMessage("") }}
        >
          <FontAwesomeIcon icon={faTrashAlt} className="mr-2" />
          Approve Account Deletion
        </button>
        <button
          className={`p-2 ${activeTab === 'changePassword' ? 'border-b-2 border-blue-500' : ''}`}
          onClick={() => setActiveTab('changePassword')}
        >
          <FontAwesomeIcon icon={faKey} className="mr-2" />
          Change Password
        </button>
      </div>

      {activeTab === "addTourismGovernor" && (
        <form onSubmit={(e) => { e.preventDefault(); handleAddTourismGovernor(); }} className="flex flex-col items-center gap-4 p-4 max-w-3xl mx-auto">
          <div className="w-1/3 md:w-1/2">
            <label htmlFor="username" className="block mb-2 text-sm font-medium text-gray-900">Username</label>
            <input
              type="text"
              id="username"
              placeholder='Add username'
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-md rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              required
            />
          </div>
          <div className="w-1/3 md:w-1/2">
            <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900">Password</label>
            <input
              type="password"
              id="password"
              placeholder='Add password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-md rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              required
            />
          </div>
          <div className="flex justify-center w-full md:w-1/2">
            <button
              type="submit"
              className="w-full md:w-auto rounded-lg bg-blue-600 py-3 px-6 text-sm font-semibold text-white shadow-md transition duration-200 hover:bg-blue-700"
            >
              Add Tourism Governor
            </button>
          </div>
        </form>
      )}

      {activeTab === "addAdmin" && (
        <form onSubmit={(e) => { e.preventDefault(); handleAddAdmin(); }} className="flex flex-col items-center gap-4 p-4 max-w-3xl mx-auto">
          <div className="w-1/3 md:w-1/2">
            <label htmlFor="username" className="block mb-2 text-sm font-medium text-gray-900">Username</label>
            <input
              type="text"
              id="username"
              placeholder='Add username'
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-md rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              required
            />
          </div>
          <div className="w-1/3 md:w-1/2">
            <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900">Password</label>
            <input
              type="password"
              id="password"
              placeholder='Add password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-md rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              required
            />
          </div>
          <div className="flex justify-center w-full md:w-1/2">
            <button
              type="submit"
              className="w-full md:w-auto rounded-lg bg-blue-600 py-3 px-6 text-sm font-semibold text-white shadow-md transition duration-200 hover:bg-blue-700"
            >
              Add Admin
            </button>
          </div>
        </form>
      )}

      {activeTab === "approveDeletion" && (
        <div className="flex flex-col gap-4 p-4 max-w-3xl mx-auto">
          <div className="md:col-span-2">
            <h5 className="text-xl font-bold leading-none text-gray-900 dark:text-white mb-4">Pending Deletions</h5>
          </div>
          {pendingDeletions.length > 0 ? (
            pendingDeletions.map(account => (
              <div key={account._id} className="flex items-center p-4 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                <div className="flex-shrink-0">
                  {account.profilePicture ? (
                    <img className="w-8 h-8 rounded-full" src={account.profilePicture} alt={`${account.username} image`} />
                  ) : (
                    <FontAwesomeIcon icon={faUserCircle} className="w-8 h-8 text-gray-400" />
                  )}
                </div>
                <div className="flex-1 min-w-0 ms-4">
                  <p className="text-sm font-medium text-gray-900 truncate dark:text-white">
                    {account.username}
                  </p>
                  <p className="text-sm text-gray-500 truncate dark:text-gray-400">
                    {account.email}
                  </p>
                </div>
                <div className="flex space-x-4 pr-5">
                  <FontAwesomeIcon icon={faCheck} onClick={() => handleDeleteClick(account._id)} className="text-green-500 cursor-pointer hover:text-green-700 text-2xl" />
                  <FontAwesomeIcon icon={faTimes} onClick={() => handleRejectAccountDeletion(account._id)} className="text-red-500 cursor-pointer hover:text-red-700 text-2xl" />
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-500 dark:text-gray-400">No pending deletions.</p>
          )}
        </div>
      )}

      {activeTab === 'changePassword' && (
        <ChangePassword baseUrl={baseUrl} />
      )}

      {showPopup && (
        <div id="popup-modal" tabIndex="-1" className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden bg-black bg-opacity-50">
          <div className="relative p-4 w-full max-w-md max-h-full">
            <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
              <button type="button" className="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ml-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" onClick={handleCancelDelete}>
                <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                </svg>
                <span className="sr-only">Close modal</span>
              </button>
              <div className="p-4 md:p-5 text-center">
                <svg className="mx-auto mb-4 text-gray-400 w-12 h-12 dark:text-gray-200" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 11V6m0 8h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/>
                </svg>
                <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">Are you sure you want to approve this account deletion?</h3>
                <button type="button" className="text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center" onClick={handleConfirmDelete}>
                  Yes, I'm sure
                </button>
                <button type="button" className="py-2.5 px-5 ml-3 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700" onClick={handleCancelDelete}>
                  No, cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showAccountPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-md">
            <p>Are you sure you want to delete this account?</p>
            <div className="flex justify-end mt-4">
              <button onClick={handleConfirmAccountDeletion} className="px-4 py-2 bg-red-500 text-white rounded">Delete</button>
              <button onClick={handleCancelAccountDeletion} className="mr-2 px-4 py-2 bg-gray-300 rounded">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {message && (
        <div className={`flex items-center p-4 mb-4 text-sm ${message.includes('successfully') ? 'text-green-800 border border-green-300 bg-green-50 dark:text-green-400 dark:border-green-800' : 'text-red-800 border border-red-300 bg-red-50 dark:text-red-400 dark:border-red-800'} rounded-lg`} role="alert">
          <svg className="flex-shrink-0 inline w-4 h-4 me-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z"/>
          </svg>
          <span className="sr-only">Info</span>
          <div>
            <span className="font-medium">{message.includes('successfully') ? 'Success!' : 'Error!'}</span> {message}
          </div>
        </div>
      )}  

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

export default AdminAccountManagement;