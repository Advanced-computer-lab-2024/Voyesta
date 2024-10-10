import { useState, useEffect } from 'react';
import axios from 'axios';

const ProfileView = () => {
  const [activeTab, setActiveTab] = useState("createAccount"); // Default to "createAccount"
  const [profile, setProfile] = useState({});
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [Number, setMobileNumber] = useState("");
  const [Job, setJob] = useState("");
  const [DOB, setDOB] = useState("");
  const [previousWork, setPreviousWork] = useState("");
  const [password, setPassword] = useState(""); // For account creation
  const [wallet, setWallet] = useState(0); // State for wallet amount
  const [message, setMessage] = useState(null);
  const [isAccountDetailsAdded, setIsAccountDetailsAdded] = useState(false); // Track if account details are added

  const baseUrl = "http://localhost:3000/api/tourist/get"; // Adjust based on your backend

  // Load token from local storage (or wherever you store it)
  useEffect(() => {
    fetchProfile();
  }, []);

  const token = localStorage.getItem('token');

  const getAuthHeaders = () => {
    return {
      headers: {
        Authorization: `Bearer ${token}`
      }
    };
  };

  // Fetch user profile
  const fetchProfile = async () => {
    try {
      const response = await axios.get(baseUrl, getAuthHeaders());
      setProfile(response.data);
      setUsername(response.data.username); // Set initial values for form fields
      setEmail(response.data.email);
      setDOB(response.data.DOB);
      setMobileNumber(response.data.Number);
      setJob(response.data.Job);
      setPreviousWork(response.data.previousWork);
      setWallet(response.data.wallet || 0); // Set wallet amount, default to 0 if not available
    } catch (error) {
      console.error('Error fetching profile:', error);
      setMessage("Error fetching profile.");
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    const updatedData = { username, email, DOB, Number, Job }; // Include all fields
    try {
      await axios.put("http://localhost:3000/api/tourist/update", updatedData, getAuthHeaders());
      setMessage("Profile updated successfully.");
      fetchProfile();
      setActiveTab("viewProfile");
    } catch (error) {
      console.error('Error updating profile:', error);
      setMessage("Error updating profile.");
    }
  };

  const handleCreateAccount = async (e) => {
    e.preventDefault();
    const updatedData = { username, email, DOB, Number, Job }; // Include all fields
    try {
      await axios.put("http://localhost:3000/api/tourist/update", updatedData, getAuthHeaders());
      setMessage("Account details added successfully.");
      fetchProfile(); // Refetch updated profile
      setIsAccountDetailsAdded(true); // Mark account details as added
      setActiveTab("viewProfile"); // After account creation, go back to viewing profile
    } catch (error) {
      console.error('Error creating account:', error);
      setMessage("Error creating account.");
    }
  };

  return (
    <div className="relative text-center bg-white shadow rounded p-3 w-2/5 mx-auto">
      <h1 className="text-2xl text-gray-600 font-bold mb-3">Profile Management</h1>

      {/* Show only if account details have been added */}
      {isAccountDetailsAdded && (
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
        </div>
      )}

      {/* Content based on Active Tab */}
      {activeTab === "viewProfile" && (
        profile ? (
          <div>
            <p><strong>Username:</strong> {profile.username}</p>
            <p><strong>Email:</strong> {profile.email}</p>
            <p><strong>Date of Birth:</strong> {profile.DOB}</p>
            <p><strong>Mobile Number:</strong> {profile.Number}</p>
            <p><strong>Job:</strong> {profile.Job}</p>
            <p><strong>Wallet Amount:</strong> ${wallet.toFixed(2)}</p> {/* Display wallet amount */}
          </div>
        ) : (
          <div>
            <p><strong>Username:</strong> Loading...</p>
            <p><strong>Email:</strong> Loading...</p>
            <p><strong>Date of Birth:</strong> Loading...</p>
            <p><strong>Mobile Number:</strong> Loading...</p>
            <p><strong>Job:</strong> Loading...</p>
            <p><strong>Wallet Amount:</strong> Loading...</p>
          </div>
        )
      )}

      {activeTab === "editProfile" && (
        <form onSubmit={handleUpdateProfile} className="flex flex-col gap-4">
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
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
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

          <div>
            <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700">
              Date of Birth
            </label>
            <input
              type="date"
              id="dateOfBirth"
              value={DOB}
              onChange={(e) => setDOB(e.target.value)}
              className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 w-full"
              required
            />
          </div>

          <div>
            <label htmlFor="mobileNumber" className="block text-sm font-medium text-gray-700">
              Mobile Number
            </label>
            <input
              type="text"
              id="mobileNumber"
              value={Number}
              onChange={(e) => setMobileNumber(e.target.value)}
              className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 w-full"
              required
            />
          </div>

          <div>
            <label htmlFor="Job" className="block text-sm font-medium text-gray-700">
              Job
            </label>
            <input
              type="text"
              id="Job"
              value={Job}
              onChange={(e) => setJob(e.target.value)}
              className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 w-full"
              required
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

      {!isAccountDetailsAdded && activeTab === "createAccount" && (
        <form onSubmit={handleCreateAccount} className="flex flex-col gap-4">
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
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
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

          <div>
            <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700">
              Date of Birth
            </label>
            <input
              type="date"
              id="dateOfBirth"
              value={DOB}
              onChange={(e) => setDOB(e.target.value)}
              className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 w-full"
              required
            />
          </div>

          <div>
            <label htmlFor="mobileNumber" className="block text-sm font-medium text-gray-700">
              Mobile Number
            </label>
            <input
              type="text"
              id="mobileNumber"
              value={Number}
              onChange={(e) => setMobileNumber(e.target.value)}
              className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 w-full"
              required
            />
          </div>

          <div>
            <label htmlFor="Job" className="block text-sm font-medium text-gray-700">
              Job
            </label>
            <input
              type="text"
              id="Job"
              value={Job}
              onChange={(e) => setJob(e.target.value)}
              className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 w-full"
              required
            />
          </div>

          <button
            type="submit"
            className="bg-blue-500 text-white rounded-lg p-2 mt-4 hover:bg-blue-700"
          >
            Add Account Details
          </button>
        </form>
      )}

      {message && <p className="text-red-500 mt-2">{message}</p>}
    </div>
  );
};

export default ProfileView;
