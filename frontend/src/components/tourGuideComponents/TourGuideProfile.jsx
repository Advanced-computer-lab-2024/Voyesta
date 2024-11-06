import { useState, useEffect } from 'react';
import axios from 'axios';
import ChangePassword from '../../newComponents/ChangePassword';
import UploadDocuments from '../../newComponents/UploadDocuments';


function TourGuideProfile() {
  const [activeTab, setActiveTab] = useState("viewProfile");
  const [profile, setProfile] = useState(null);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [yearsOfExperience, setYearsOfExperience] = useState("");
  const [previousWork, setPreviousWork] = useState("");
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null); // State to handle error messages
  const [picture, setPicture] = useState(null); // State for profile picture

  const url = "http://localhost:3000/api/tourGuide"; // Adjust based on your backend

  const token = localStorage.getItem('token');
  const getAuthHeaders = () => {
    return {
      headers: {
        Authorization: `Bearer ${token}`
      }
    };
  };

  // Fetch tour guide profile
  const fetchProfile = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/tourGuide/get", getAuthHeaders());
      console.log(response.data);
      setProfile(response.data);
      setUsername(response.data.username);
      setEmail(response.data.email);
      setMobileNumber(response.data.mobileNumber);
      setYearsOfExperience(response.data.yearsOfExperience);
      setPreviousWork(response.data.previousWork);
    } catch (error) {
      setMessage('Failed to fetch tour guide details.');
      console.error(error);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    const updatedData = { username, email, mobileNumber, yearsOfExperience, previousWork };
    console.log(updatedData);
    // try {
      axios.put(url + '/update', updatedData, getAuthHeaders())
      .then(res => {
        setMessage('Profile updated successfully.');
        fetchProfile();
        setActiveTab("viewProfile");
      })
      .catch(err => console.log(err));
      
    // } catch (error) {
    //   setError(error.response?.data?.message || 'Failed to update profile.');
    //   console.error(error);
    // }
  };

  const handleRequestAccountDeletion = async () => {
    try {
      const url = "http://localhost:3000/api/tourGuide/setStatusToDeleted";
      await axios.patch(url, {}, getAuthHeaders());
      setMessage("Account deletion requested successfully.");
      fetchProfile();
    } catch (error) {
      console.error('Error requesting account deletion:', error);
      setError(error.response?.data?.message || "Error requesting account deletion.");
    }
  };

  const handlePictureUpload = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('picture', picture);

    try {
      const res = await axios.post('http://localhost:3000/api/cloudinary/upload', formData, getAuthHeaders());
      setMessage('Profile picture uploaded successfully!');
      fetchProfile();
      // console.log(res.data);
    } catch (err) {
      setMessage('Failed to upload profile picture.');
      console.error(err);
    }
  };

  const closeErrorPopup = () => {
    setError(null);
  };

  return (
    <div className="relative text-center bg-white shadow rounded p-3 w-2/5 mx-auto">
      <h1 className="text-2xl text-gray-600 font-bold mb-3">Tour Guide Profile Management</h1>

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
        <button
          className={`p-2 ${activeTab === 'picture' ? 'border-b-2 border-blue-500' : ''}`}
          onClick={() => setActiveTab('picture')}
        >

          Profile Picture
        </button>
        <button
          className={`p-2 ${activeTab === 'uploadDocuments' ? 'border-b-2 border-blue-500' : ''}`}
          onClick={() => setActiveTab('uploadDocuments')}
        >
          
          Upload Documents
        </button>
      </div>

      {/* Content based on Active Tab */}
      {activeTab === "viewProfile" && (
        profile ? (
          <div>
            <img src={profile.profilePicture} alt="Profile" className="w-20 h-20 rounded-full mx-auto" />
            <p><strong>Username:</strong> {profile.username}</p>
            <p><strong>Email:</strong> {profile.email}</p>
            <p><strong>Mobile Number:</strong> {profile.mobileNumber}</p>
            <p><strong>Years of Experience:</strong> {profile.yearsOfExperience}</p>
            <p><strong>Previous Work:</strong> {profile.previousWork}</p>
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
            <p><strong>Years of Experience:</strong> Loading...</p>
            <p><strong>Previous Work:</strong> Loading...</p>
          </div>
        )
      )}

      {activeTab === 'changePassword' && (
          <ChangePassword baseUrl='http://localhost:3000/api/tourGuide' />
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
            <label htmlFor="yearsOfExperience" className="block text-sm font-medium text-gray-700">Years of Experience</label>
            <input
              type="number"
              id="yearsOfExperience"
              value={yearsOfExperience}
              onChange={(e) => setYearsOfExperience(e.target.value)}
              className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 w-full"
            />
          </div>

          <div>
            <label htmlFor="previousWork" className="block text-sm font-medium text-gray-700">Previous Work</label>
            <textarea
              id="previousWork"
              value={previousWork}
              onChange={(e) => setPreviousWork(e.target.value)}
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

      {activeTab === 'picture' && (
        <div className="picture-tab">
          <h2 className="text-lg font-bold">Upload Profile Picture</h2>
          <form onSubmit={handlePictureUpload}>
            <input type="file" onChange={(e) => setPicture(e.target.files[0])} required />
            <button type="submit" className="bg-blue-500 text-white rounded p-2 mt-2">Upload</button>
          </form>
          {message && <p>{message}</p>}
        </div>
      )}

      {activeTab === 'uploadDocuments' && ( 
          <UploadDocuments userType='tourGuide' /> 
      )}

      {/* Display Message */}
      {message && (
        <p className={`mt-4 ${message.includes('successfully') ? 'text-green-500' : 'text-red-500'}`}>
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

export default TourGuideProfile;