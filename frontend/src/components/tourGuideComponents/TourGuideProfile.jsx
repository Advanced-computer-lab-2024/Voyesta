import { useState, useEffect } from 'react';
import axios from 'axios';

const ProfileView = () => {
  const [activeTab, setActiveTab] = useState("createAccount");
  const [profile, setProfile] = useState(null);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [yearsOfExperience, setYearsOfExperience] = useState("");
  const [previousWork, setPreviousWork] = useState("");
  const [password, setPassword] = useState(""); // For account creation
  const [message, setMessage] = useState(null);


  const baseUrl = "http://localhost:3000/api/tourGuide/get"; // Adjust based on your backend
  const createAccountUrl = "http://localhost:3000/api/tourGuide/add"; // Update to your backend create account URL

  // Load token from local storage (or wherever you store it)
  useEffect(() => {
    fetchProfile();
  }, []);

  const token = localStorage.getItem('token');

  const getAuthHeaders = () =>{
    console.log(token);
    return {
    headers: {
        Authorization: `Bearer ${token}`
      }}
  };

  // Fetch user profile
  const fetchProfile = async () => {
    try {
      const response = await axios.get(baseUrl, getAuthHeaders());
      setProfile(response.data);
      setUsername(response.data.username); // Set initial values for form fields
      setEmail(response.data.email);
      setMobileNumber(response.data.mobileNumber);
      setYearsOfExperience(response.data.yearsOfExperience);
      setPreviousWork(response.data.previousWork);
    } catch (error) {
      console.error('Error fetching profile:', error);
      setMessage("Error fetching profile.");
    }
    
    
  };

  useEffect(()=>{
    if( activeTab === "createAccount"){
      setActiveTab("createAccount")
    } else{
      setActiveTab("viewProfile") 
    }
  }
    ,[mobileNumber])



  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    const updatedData = { username, email, mobileNumber, yearsOfExperience, previousWork }; // Include all fields
    try {
      await axios.put("http://localhost:3000/api/tourGuide/update", updatedData, getAuthHeaders());
      setMessage("Profile updated successfully.");
      fetchProfile(); // Refetch updated profile
    } catch (error) {
      console.error('Error updating profile:', error);
      setMessage("Error updating profile.");
    }
  };

  const handleCreateAccount = async (e) => {
    try {
      e.preventDefault();
      const updatedData = { username, email, password, mobileNumber, yearsOfExperience, previousWork }; // Include all fields
      try {
        await axios.put("http://localhost:3000/api/tourGuide/update", updatedData, getAuthHeaders());
        setMessage("Profile updated successfully.");
        fetchProfile(); // Refetch updated profile
        setActiveTab("viewProfile"); // After account creation, go back to viewing profile
      } catch (error) {
        console.error('Error updating profile:', error);
        setMessage("Error updating profile.");
      }
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
        
        {
          activeTab !== "createAccount" ?( 
            <>
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
        </>):
        <button
        className={`p-2 ${activeTab === "createAccount" ? "border-b-2 border-blue-500" : ""}`}
        onClick={() => setActiveTab("createAccount")}
      >
        Add Account Details
      </button>
        }
        
        
      </div>

      {/* Content based on Active Tab */}
      {activeTab === "viewProfile" && (
        profile ? (
          <div>
            <p><strong>Username:</strong> {profile.username}</p>
            <p><strong>Email:</strong> {profile.email}</p>
            <p><strong>Mobile Number:</strong> {profile.mobileNumber}</p>
            <p><strong>Years of Experience:</strong> {profile.yearsOfExperience}</p>
            <p><strong>Previous Work:</strong> {profile.previousWork}</p>
          </div>
        ) : (
          <div>
            <p><strong>Username:</strong> Loading...</p>
            <p><strong>Email:</strong> Loading...</p>
            <p><strong>Mobile Number:</strong> Loading...</p>
            <p><strong>Years of Experience:</strong> Loading...</p>
            <p><strong>Previous Work:</strong> Loading...</p>
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
            Update Profile
          </button>
        </form>
      )}

      {activeTab === "createAccount" && (
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
            Add Account Details
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
