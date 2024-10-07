import { useState, useEffect } from 'react';
import axios from 'axios';

function AdvertiserProfile() {
  const [activeTab, setActiveTab] = useState("createAccount");
  const [profile, setProfile] = useState(null);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState("");
  const [companyProfile, setCompanyProfile] = useState("");
  const [hotline, setHotline] = useState("");
  const [servicesOffered, setServicesOffered] = useState([]);
  const [password, setPassword] = useState(""); // For account creation
  const [message, setMessage] = useState(null);

  const baseUrl = "http://localhost:3000/api/advertiser/get"; // Adjust based on your backend
  const createAccountUrl = "http://localhost:3000/api/advertiser/add"; // Update to your backend create account URL

  // Load token from local storage (or wherever you store it)
  useEffect(() => {
    fetchProfile();
  }, []);

  // const token = localStorage.getItem('token');
  const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3MDNiYjhmNzNkYjdkZTU3YmEyMjRiNCIsInR5cGUiOiJhZHZlcnRpc2VyIiwiaWF0IjoxNzI4Mjk3ODcxLCJleHAiOjE3NTQyMTc4NzF9.J75YSz_DmEuLdm1WvtiEIb6EFf5Q-qjKqAmFB5wWV9Y"

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
      // Set initial values for form fields
      setUsername(response.data.username);
      setEmail(response.data.email);
      setWebsite(response.data.website);
      setCompanyProfile(response.data.companyProfile);
      setHotline(response.data.hotline);
      setServicesOffered(response.data.servicesOffered || []);
    } catch (error) {
      console.error('Error fetching profile:', error);
      setMessage("Error fetching profile.");
    }
  };

  useEffect(() => {
    if (activeTab === "createAccount") {
      setActiveTab("createAccount");
    } else {
      setActiveTab("viewProfile");
    }
  }, [website]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    const updatedData = {
      username,
      email,
      website,
      companyProfile,
      hotline,
      servicesOffered
    };

    try {
      await axios.put("http://localhost:3000/api/advertiser/update", updatedData, getAuthHeaders());
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
      const updatedData = {
        username,
        email,
        password,
        website,
        companyProfile,
        hotline,
        servicesOffered
      };

      try {
        await axios.post(createAccountUrl, updatedData, getAuthHeaders());
        setMessage("Account created successfully.");
        fetchProfile(); // Refetch profile after account creation
        setActiveTab("viewProfile");
      } catch (error) {
        console.error('Error creating account:', error);
        setMessage("Error creating account.");
      }
    } catch (error) {
      console.error('Error creating account:', error);
      setMessage("Error creating account.");
    }
  };

  return (
    <div className="relative text-center bg-white shadow rounded p-3 w-2/5 mx-auto">
      <h1 className="text-2xl text-gray-600 font-bold mb-3">Advertiser Profile Management</h1>

      {/* Tab Navigation */}
      <div className="flex justify-around border-b mb-4">
        {activeTab !== "createAccount" ? (
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
          </>
        ) : (
          <button
            className={`p-2 ${activeTab === "createAccount" ? "border-b-2 border-blue-500" : ""}`}
            onClick={() => setActiveTab("createAccount")}
          >
            Add Account Details
          </button>
        )}
      </div>

      {/* Content based on Active Tab */}
      {activeTab === "viewProfile" && (
        profile ? (
          <div>
            <p><strong>Username:</strong> {profile.username}</p>
            <p><strong>Email:</strong> {profile.email}</p>
            <p><strong>Website:</strong> {profile.website}</p>
            <p><strong>Company Profile:</strong> {profile.companyProfile}</p>
            <p><strong>Hotline:</strong> {profile.hotline}</p>
            <p><strong>Services Offered:</strong> {profile.servicesOffered?.join(", ")}</p>
          </div>
        ) : (
          <div>
            <p><strong>Username:</strong> Loading...</p>
            <p><strong>Email:</strong> Loading...</p>
            <p><strong>Website:</strong> Loading...</p>
            <p><strong>Company Profile:</strong> Loading...</p>
            <p><strong>Hotline:</strong> Loading...</p>
            <p><strong>Services Offered:</strong> Loading...</p>
          </div>
        )
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
            <label htmlFor="website" className="block text-sm font-medium text-gray-700">Website</label>
            <input
              type="text"
              id="website"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 w-full"
            />
          </div>

          <div>
            <label htmlFor="companyProfile" className="block text-sm font-medium text-gray-700">Company Profile</label>
            <textarea
              id="companyProfile"
              value={companyProfile}
              onChange={(e) => setCompanyProfile(e.target.value)}
              className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 w-full"
            />
          </div>

          <div>
            <label htmlFor="hotline" className="block text-sm font-medium text-gray-700">Hotline</label>
            <input
              type="text"
              id="hotline"
              value={hotline}
              onChange={(e) => setHotline(e.target.value)}
              className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 w-full"
            />
          </div>

          <div>
            <label htmlFor="servicesOffered" className="block text-sm font-medium text-gray-700">Services Offered</label>
            <input
              type="text"
              id="servicesOffered"
              value={servicesOffered.join(", ")}
              onChange={(e) => setServicesOffered(e.target.value.split(",").map(service => service.trim()))}
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
            <label htmlFor="website" className="block text-sm font-medium text-gray-700">Website</label>
            <input
              type="text"
              id="website"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 w-full"
            />
          </div>

          <div>
            <label htmlFor="companyProfile" className="block text-sm font-medium text-gray-700">Company Profile</label>
            <textarea
              id="companyProfile"
              value={companyProfile}
              onChange={(e) => setCompanyProfile(e.target.value)}
              className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 w-full"
            />
          </div>

          <div>
            <label htmlFor="hotline" className="block text-sm font-medium text-gray-700">Hotline</label>
            <input
              type="text"
              id="hotline"
              value={hotline}
              onChange={(e) => setHotline(e.target.value)}
              className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 w-full"
            />
          </div>

          <div>
            <label htmlFor="servicesOffered" className="block text-sm font-medium text-gray-700">Services Offered</label>
            <input
              type="text"
              id="servicesOffered"
              value={servicesOffered.join(", ")}
              onChange={(e) => setServicesOffered(e.target.value.split(",").map(service => service.trim()))}
              className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 w-full"
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

export default AdvertiserProfile;
