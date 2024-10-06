import { useState, useEffect } from 'react';
import axios from 'axios';

const ProfileView = () => {
  const [activeTab, setActiveTab] = useState("viewProfile");
  const [profile, setProfile] = useState(null);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState(""); // For account creation
  const [mobileNumber, setMobileNumber] = useState(""); // For account creation
  const [yearsOfExperience, setYearsOfExperience] = useState(""); // For account creation
  const [previousWork, setPreviousWork] = useState(""); // For account creation
  const [message, setMessage] = useState(null);
  const [token, setToken] = useState("");

  const baseUrl = "http://localhost:3000/api/tourGuide/get"; // Adjust based on your backend
  const createAccountUrl = "http://localhost:3000/api/tourGuide/add"; // Update to your backend create account URL

  // Load token from local storage (or wherever you store it)
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    setToken(storedToken);
    fetchProfile();
  }, []);

  // Fetch user profile
  const fetchProfile = async () => {
    try {
      const response = await axios.get(baseUrl,getAuthHeaders());
      setProfile(response.data);
      setUsername(response.data.username); // Set initial values for form fields
      setEmail(response.data.email);
    } catch (error) {
      console.error('Error fetching profile:', error);
      setMessage("Error fetching profile.");
    }
  };

  const getAuthHeaders = () => ({
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    const updatedData = { username, email }; // Include other fields as necessary
    try {
      await axios.put("http://localhost:3000/api/tourGuide/update", updatedData, getAuthHeaders());
      setMessage("Profile updated successfully.");
      // Optionally refetch the profile
      fetchProfile(); // Refetch updated profile
    } catch (error) {
      console.error('Error updating profile:', error);
      setMessage("Error updating profile.");
    }
  };

  const handleCreateAccount = async (e) => {
    e.preventDefault();
    const newAccountData = { username, email, password, mobileNumber, yearsOfExperience, previousWork };
    try {
      const response = await axios.post(createAccountUrl, newAccountData);

      const { token } = response.data;
      
      localStorage.setItem('token', token);

      setMessage(response.data.message); // Success message from backend
      // Optionally clear the input fields
      setUsername('');
      setEmail('');
      setPassword('');
      setMobileNumber('');
      setYearsOfExperience('');
      setPreviousWork('');
    } catch (error) {
      console.error('Error creating account:', error);
      setMessage("Error creating account.");
    }
  };

  return (
    <div className="relative text-center bg-white shadow rounded p-3 w-2/5 mx-auto">
      <h1 className="text-2xl text-gray-600 font-bold mb-3">Profile Management</h1>

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
          className={`p-2 ${activeTab === "createAccount" ? "border-b-2 border-blue-500" : ""}`}
          onClick={() => setActiveTab("createAccount")}
        >
          Create Account
        </button>
      </div>

      {/* Content based on Active Tab */}
      {activeTab === "viewProfile" && profile ? (
        <div>
          <p><strong>Name:</strong> {profile.username}</p>
          <p><strong>Email:</strong> {profile.email}</p>
          {/* Add more profile fields if necessary */}
        </div>
      ) : activeTab === "viewProfile" ? (
        <p>Loading...</p>
      ) : activeTab === "editProfile" ? (
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

          <button
            type="submit"
            className="bg-blue-500 text-white rounded-lg p-2 mt-4 hover:bg-blue-700"
          >
            Update Profile
          </button>
        </form>
      ) : activeTab === "createAccount" && (
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

          <div>
            <label htmlFor="mobileNumber" className="block text-sm font-medium text-gray-700">
              Mobile Number
            </label>
            <input
              type="text"
              id="mobileNumber"
              value={mobileNumber}
              onChange={(e) => setMobileNumber(e.target.value)}
              className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 w-full"
              required
            />
          </div>

          <div>
            <label htmlFor="yearsOfExperience" className="block text-sm font-medium text-gray-700">
              Years of Experience
            </label>
            <input
              type="text"
              id="yearsOfExperience"
              value={yearsOfExperience}
              onChange={(e) => setYearsOfExperience(e.target.value)}
              className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 w-full"
              required
            />
          </div>

          <div>
            <label htmlFor="previousWork" className="block text-sm font-medium text-gray-700">
              Previous Work
            </label>
            <textarea
              id="previousWork"
              value={previousWork}
              onChange={(e) => setPreviousWork(e.target.value)}
              className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 w-full"
              required
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
    </div>
  );
};

export default ProfileView;
