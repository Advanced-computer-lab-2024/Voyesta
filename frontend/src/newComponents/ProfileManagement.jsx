import { useState, useEffect } from 'react';
import axios from 'axios';
import ChangePassword from './ChangePassword';
import UploadDocuments from './UploadDocuments';

function ProfileManagement({ userType, baseUrl }) {
  const [activeTab, setActiveTab] = useState("viewProfile");
  const [profile, setProfile] = useState({});
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [picture, setPicture] = useState(null);

  const token = localStorage.getItem('token');
  const getAuthHeaders = () => {
    return {
      headers: {
        Authorization: `Bearer ${token}`
      }
    };
  };

  const fetchProfile = async () => {
    try {
      const response = await axios.get(`${baseUrl}/get`, getAuthHeaders());
      setProfile(response.data);
    } catch (error) {
      setMessage('Failed to fetch profile details.');
      console.error(error);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${baseUrl}/update`, profile, getAuthHeaders());
      setMessage('Profile updated successfully.');
      fetchProfile();
      setActiveTab("viewProfile");
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to update profile.');
      console.error(error);
    }
  };

  const handleRequestAccountDeletion = async () => {
    try {
      await axios.patch(`${baseUrl}/setStatusToDeleted`, {}, getAuthHeaders());
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
      await axios.post(`${baseUrl}/uploadProfilePicture`, formData, getAuthHeaders());
      setMessage('Profile picture uploaded successfully!');
      fetchProfile();
    } catch (err) {
      setMessage('Failed to upload profile picture.');
      console.error(err);
    }
  };

  const closeErrorPopup = () => {
    setError(null);
  };

  const renderProfileFields = () => {
    const fields = {
      tourGuide: [
        { key: 'username', label: 'Username' },
        { key: 'email', label: 'Email' },
        { key: 'mobileNumber', label: 'Mobile Number' },
        { key: 'yearsOfExperience', label: 'Years of Experience' },
        { key: 'previousWork', label: 'Previous Work' }
      ],
      seller: [
        { key: 'username', label: 'Username' },
        { key: 'email', label: 'Email' },
        { key: 'name', label: 'Name' },
        { key: 'description', label: 'Description' }
      ],
      advertiser: [
        { key: 'username', label: 'Username' },
        { key: 'email', label: 'Email' },
        { key: 'website', label: 'Website' },
        { key: 'hotline', label: 'Hotline' },
        { key: 'companyProfile', label: 'Company Profile' }
      ]
    };

    return fields[userType].map(({ key, label }) => (
      <div key={key} className="mb-4">
        <label htmlFor={key} className="block text-sm font-medium text-gray-700">
          {label}
        </label>
        <input
          type="text"
          id={key}
          value={profile[key] || ''}
          onChange={(e) => setProfile({ ...profile, [key]: e.target.value })}
          className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 w-full"
        />
      </div>
    ));
  };

  return (
    <div className="relative text-center bg-white shadow rounded p-3 w-2/5 mx-auto">
      <h1 className="text-2xl text-gray-600 font-bold mb-3">{userType.charAt(0).toUpperCase() + userType.slice(1)} Profile Management</h1>

      {/* Tab Navigation */}
      <div className="flex justify-around border-b mb-4">
        <button
          className={`p-2 ${activeTab === "viewProfile" ? "border-b-2 border-blue-500" : ""}`}
          onClick={() => {setActiveTab("viewProfile");setMessage(null);setError(null);}}
        >
          View Profile
        </button>
        <button
          className={`p-2 ${activeTab === "editProfile" ? "border-b-2 border-blue-500" : ""}`}
          onClick={() => {setActiveTab("editProfile");setMessage(null);setError(null);}}
        >
          Edit Profile
        </button>
        <button
          className={`p-2 ${activeTab === 'changePassword' ? 'border-b-2 border-blue-500' : ''}`}
          onClick={() => {setActiveTab('changePassword');setMessage(null);setError(null);}}
        >
          Change Password
        </button>
        <button
          className={`p-2 ${activeTab === 'picture' ? 'border-b-2 border-blue-500' : ''}`}
          onClick={() => {setActiveTab('picture');setMessage(null);setError(null);}}
        >
          Profile Picture
        </button>
        <button
          className={`p-2 ${activeTab === 'uploadDocuments' ? 'border-b-2 border-blue-500' : ''}`}
          onClick={() => {setActiveTab('uploadDocuments');setMessage(null);setError(null);}}
        >
          Upload Documents
        </button>
      </div>

      {/* Content based on Active Tab */}
      {activeTab === "viewProfile" && (
        profile ? (
          <div>
            {profile.profilePicture && <img src={profile.profilePicture} alt="Profile" className="w-20 h-20 rounded-full mx-auto" />}
            {Object.entries(profile).map((key) => {
                const k = key.toString().split(',')[0];
                const value = profile[k];
                console.log(value)
              if (['_id', '__v', 'createdAt', 'updatedAt', 'profilePicture', 'personalId', 'additionalDocument', 'status', 'comments'].includes(k)) return null;
              if (k === 'ratings') {

                const averageRating = value ? value.length === 0 ? 0 : value.reduce((acc, rating) => acc + rating.rating, 0) / value.length : 0;
                return (
                    <p><strong>Average Rating:</strong> {averageRating.toFixed(2)}</p>
                );
            }
              return (
                <p key={key}><strong>{k.charAt(0).toUpperCase() + k.slice(1)}:</strong> {value.toString()}</p>
              );
            })}
            <button
              onClick={handleRequestAccountDeletion}
              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-700 mt-4"
            >
              Request Account Deletion
            </button>
          </div>
        ) : (
          <div>Loading...</div>
        )
      )}

      {activeTab === 'changePassword' && (
        <ChangePassword baseUrl={baseUrl} />
      )}

      {activeTab === "editProfile" && (
        <form onSubmit={handleUpdateProfile} className="flex flex-col gap-4">
          {renderProfileFields()}
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
        <UploadDocuments userType={userType} />
      )}

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

export default ProfileManagement;