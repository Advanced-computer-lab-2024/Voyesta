import { useState, useEffect } from 'react';
import axios from 'axios';
import ChangePassword from '../../newComponents/ChangePassword';

function TouristProfile() {
  const [activeTab, setActiveTab] = useState("viewProfile");
  const [profile, setProfile] = useState(null);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [nationality, setNationality] = useState("");
  const [dob, setDob] = useState("");
  const [job, setJob] = useState("");
  const [wallet, setWallet] = useState(0);
  const [level, setLevel] = useState(0);
  const [accumulatedPoints, setAccumulatedPoints] = useState(0);
  const [currentPoints, setCurrentPoints] = useState(0);
  const [password, setPassword] = useState(""); // For account creation
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null); // State to handle error messages

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
      const data = response.data;
      setProfile(data);
      setUsername(data.username);
      setEmail(data.email);
      setMobileNumber(data.Number);
      setNationality(data.Nationality);
      setDob(data.DOB);
      setJob(data.Job);
      setWallet(data.Wallet);
      setLevel(data.level);
      setAccumulatedPoints(data.accumulatedPoints);
      setCurrentPoints(data.currentPoints);
    } catch (error) {
      console.error('Error fetching profile:', error);
      setMessage("Error fetching profile.");
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    const updatedData = {
      username,
      email,
      mobileNumber,
      nationality,
      dob,
      job
    };

    try {
      await axios.put("http://localhost:3000/api/tourist/update", updatedData, getAuthHeaders());
      setMessage("Profile updated successfully.");
      fetchProfile();
      setActiveTab("viewProfile"); // Refetch updated profile
    } catch (error) {
      console.error('Error updating profile:', error);
      setError(error.response?.data?.message || "Error updating profile.");
    }
  };

  const handleCreateAccount = async (e) => {
    try {
      e.preventDefault();
      const updatedData = {
        username,
        email,
        password,
        mobileNumber,
        nationality,
        dob,
        job
      };

      try {
        await axios.put("http://localhost:3000/api/tourist/update", updatedData, getAuthHeaders());
        setMessage("Account created successfully.");
        fetchProfile(); // Refetch profile after account creation
        setActiveTab("viewProfile");
      } catch (error) {
        console.error('Error creating account:', error);
        setError(error.response?.data?.message || "Error creating account.");
      }
    } catch (error) {
      console.error('Error creating account:', error);
      setError(error.response?.data?.message || "Error creating account.");
    }
  };

  const handleRequestAccountDeletion = async () => {
    try {
      const url = "http://localhost:3000/api/tourist/setStatusToDeleted";
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
      <h1 className="text-2xl text-gray-600 font-bold mb-3">Tourist Profile Management</h1>

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
            <p><strong>Username:</strong> {profile.username}</p>
            <p><strong>Email:</strong> {profile.email}</p>
            <p><strong>Mobile Number:</strong> {profile.mobileNumber}</p>
            <p><strong>Nationality:</strong> {profile.nationality}</p>
            <p><strong>Date of Birth:</strong> {profile.dob}</p>
            <p><strong>Job:</strong> {profile.job}</p>
            <p><strong>Wallet:</strong> {profile.wallet}</p>
            <p><strong>Level:</strong> {profile.level}</p>
            <p><strong>Accumulated Points:</strong> {profile.accumulatedPoints}</p>
            <p><strong>Current Points:</strong> {profile.currentPoints}</p>
            <button
              onClick={handleRequestAccountDeletion}
              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-700 mt-4"
            >
              Request Account Deletion
            </button>
          </div>
        ) : (
          <div>
            <p><strong>Username:</strong> Loading...</p>
            <p><strong>Email:</strong> Loading...</p>
            <p><strong>Mobile Number:</strong> Loading...</p>
            <p><strong>Nationality:</strong> Loading...</p>
            <p><strong>Date of Birth:</strong> Loading...</p>
            <p><strong>Job:</strong> Loading...</p>
            <p><strong>Wallet:</strong> Loading...</p>
            <p><strong>Level:</strong> Loading...</p>
            <p><strong>Accumulated Points:</strong> Loading...</p>
            <p><strong>Current Points:</strong> Loading...</p>
          </div>
        )
      )}

      {activeTab === 'changePassword' && (
          <ChangePassword baseUrl='http://localhost:3000/api/tourist' />
      )}

      {activeTab === "editProfile" && (
        <form onSubmit={handleUpdateProfile} className="flex flex-col gap-4">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700">Username</label>
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
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
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
            <label htmlFor="mobileNumber" className="block text-sm font-medium text-gray-700">Mobile Number</label>
            <input
              type="text"
              id="mobileNumber"
              value={mobileNumber}
              onChange={(e) => setMobileNumber(e.target.value)}
              className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 w-full"
            />
          </div>

          <div>
            <label htmlFor="nationality" className="block text-sm font-medium text-gray-700">Nationality</label>
            <input
              type="text"
              id="nationality"
              value={nationality}
              onChange={(e) => setNationality(e.target.value)}
              className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 w-full"
            />
          </div>

          <div>
            <label htmlFor="dob" className="block text-sm font-medium text-gray-700">Date of Birth</label>
            <input
              type="date"
              id="dob"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
              className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 w-full"
            />
          </div>

          <div>
            <label htmlFor="job" className="block text-sm font-medium text-gray-700">Job</label>
            <input
              type="text"
              id="job"
              value={job}
              onChange={(e) => setJob(e.target.value)}
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

      {activeTab === "createAccount" && (
        <form onSubmit={handleCreateAccount} className="flex flex-col gap-4">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700">Username</label>
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
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
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
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 w-full"
              required
            />
          </div>

          <div>
            <label htmlFor="mobileNumber" className="block text-sm font-medium text-gray-700">Mobile Number</label>
            <input
              type="text"
              id="mobileNumber"
              value={mobileNumber}
              onChange={(e) => setMobileNumber(e.target.value)}
              className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 w-full"
            />
          </div>

          <div>
            <label htmlFor="nationality" className="block text-sm font-medium text-gray-700">Nationality</label>
            <input
              type="text"
              id="nationality"
              value={nationality}
              onChange={(e) => setNationality(e.target.value)}
              className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 w-full"
            />
          </div>

          <div>
            <label htmlFor="dob" className="block text-sm font-medium text-gray-700">Date of Birth</label>
            <input
              type="date"
              id="dob"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
              className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 w-full"
            />
          </div>

          <div>
            <label htmlFor="job" className="block text-sm font-medium text-gray-700">Job</label>
            <input
              type="text"
              id="job"
              value={job}
              onChange={(e) => setJob(e.target.value)}
              className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 w-full"
            />
          </div>

          <button
            type="submit"
            className="bg-blue-500 text-white rounded-lg p-2 mt-4 hover:bg-blue-700"
          >
            Create Account
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
};

export default TouristProfile;