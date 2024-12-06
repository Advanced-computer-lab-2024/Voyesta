import { useState, useEffect } from 'react';
import axios from 'axios';
import ChangePassword from './ChangePassword';
import UploadDocuments from './UploadDocuments';
import ProfileView from '../newComponents/ProfileView';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCircle, faEnvelope, faPhone, faGlobe, faBuilding, faListAlt, faTrash, faEdit, faKey, faUpload, faCamera } from '@fortawesome/free-solid-svg-icons';

function ProfileManagement({ userType, baseUrl }) {
  const [activeTab, setActiveTab] = useState("viewProfile");
  const [profile, setProfile] = useState({});
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [picture, setPicture] = useState(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

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
      if(userType !== 'tourismGovernor') {
        const response = await axios.get(`${baseUrl}/get`, getAuthHeaders());
        setProfile(response.data);
      }
    } catch (error) {
      setMessage('Failed to fetch profile details.');
      console.error(error);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  useEffect(() => {
    if(userType === 'tourismGovernor') {
      setActiveTab("changePassword");
    }
  }, []);

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage('');
      }, 5000); // Clear the message after 5 seconds

      return () => clearTimeout(timer); // Clear the timer if the component unmounts
    }
  }, [message]);

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
      setIsUploadModalOpen(false); // Close the modal after upload
    } catch (err) {
      setMessage('Failed to upload profile picture.');
      console.error(err);
    }
  };

  const closeErrorPopup = () => {
    setError(null);
  };

  const toggleChangePassword = () => {
    setActiveTab(activeTab === "changePassword" ? "viewProfile" : "changePassword");
  };

  const toggleEdit = () => {
    setActiveTab(activeTab === "viewProfile" ? "editProfile" : "viewProfile");
  };

  const toggleUploadModal = () => {
    setIsUploadModalOpen(!isUploadModalOpen);
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
  
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 max-w-3xl mx-auto">
      {fields[userType].map(({ key, label }) => (
        <div key={key} className="mb-4">
          <label htmlFor={key} className="block mb-2 text-sm font-medium text-gray-900">{label}</label>
          <input
            type="text"
            id={key}
            value={profile[key] || ''}
            onChange={(e) => setProfile({ ...profile, [key]: e.target.value })}
            className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-md rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          />
        </div>
      ))}
    </div>
    );
  };

  return (
    <div className="max-w-full mx-auto bg-white rounded-lg overflow-hidden relative px-40 pb-40">
      <div className="flex justify-between items-center p-4 border-b mb-10">
        <h2 className="text-4xl font-bold text-gray-900">{userType.charAt(0).toUpperCase() + userType.slice(1)} Profile Management</h2>
        <div className="flex space-x-4 pe-9 mr">
          {userType !== 'tourismGovernor' && (
            <>
            <FontAwesomeIcon
            icon={faEdit}
            className={`cursor-pointer text-2xl hover:text-blue-700 ${activeTab === "editProfile" ? "text-blue-700" : "text-gray-700"}`}
            onClick={toggleEdit}
          />
          <FontAwesomeIcon
            icon={faKey}
            className={`cursor-pointer text-2xl hover:text-green-600 ${activeTab === "changePassword" ? "text-green-600" : "text-gray-700"}`}
            onClick={toggleChangePassword}
          />
          </>)}
        </div>
      </div>

      {/* Content based on Active Tab */}
      {userType !== 'tourismGovernor' && activeTab === "viewProfile" && (
        <ProfileView userType={userType} baseUrl={baseUrl} toggleUploadModal={toggleUploadModal} />
      )}

      {activeTab === 'changePassword' && (
        <ChangePassword baseUrl={baseUrl} />
      )}

      {userType !== 'tourismGovernor' && activeTab === "editProfile" && (
        <form onSubmit={handleUpdateProfile} className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 max-w-3xl mx-auto">
          {userType === 'tourGuide' && (
            <>
              <div className="mb-4">
                <label htmlFor="username" className="block mb-2 text-sm font-medium text-gray-900">Username</label>
                <input
                  type="text"
                  id="username"
                  value={profile.username || ''}
                  onChange={(e) => setProfile({ ...profile, username: e.target.value })}
                  className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-md rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900">Email</label>
                <input
                  type="email"
                  id="email"
                  value={profile.email || ''}
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-md rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="mobileNumber" className="block mb-2 text-sm font-medium text-gray-900">Mobile Number</label>
                <input
                  type="text"
                  id="mobileNumber"
                  value={profile.mobileNumber || ''}
                  onChange={(e) => setProfile({ ...profile, mobileNumber: e.target.value })}
                  className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-md rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="yearsOfExperience" className="block mb-2 text-sm font-medium text-gray-900">Years of Experience</label>
                <input
                  type="text"
                  id="yearsOfExperience"
                  value={profile.yearsOfExperience || ''}
                  onChange={(e) => setProfile({ ...profile, yearsOfExperience: e.target.value })}
                  className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-md rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="previousWork" className="block mb-2 text-sm font-medium text-gray-900">Previous Work</label>
                <input
                  type="text"
                  id="previousWork"
                  value={profile.previousWork || ''}
                  onChange={(e) => setProfile({ ...profile, previousWork: e.target.value })}
                  className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-md rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                />
              </div>
            </>
          )}
          {userType === 'seller' && (
            <>
              <div className="mb-4">
                <label htmlFor="username" className="block mb-2 text-sm font-medium text-gray-900">Username</label>
                <input
                  type="text"
                  id="username"
                  value={profile.username || ''}
                  onChange={(e) => setProfile({ ...profile, username: e.target.value })}
                  className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-md rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900">Email</label>
                <input
                  type="email"
                  id="email"
                  value={profile.email || ''}
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-md rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900">Name</label>
                <input
                  type="text"
                  id="name"
                  value={profile.name || ''}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-md rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="description" className="block mb-2 text-sm font-medium text-gray-900">Description</label>
                <input
                  type="text"
                  id="description"
                  value={profile.description || ''}
                  onChange={(e) => setProfile({ ...profile, description: e.target.value })}
                  className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-md rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                />
              </div>
            </>
          )}
          {userType === 'advertiser' && (
            <>
              <div className="mb-4">
                <label htmlFor="username" className="block mb-2 text-sm font-medium text-gray-900">Username</label>
                <input
                  type="text"
                  id="username"
                  value={profile.username || ''}
                  onChange={(e) => setProfile({ ...profile, username: e.target.value })}
                  className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-md rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900">Email</label>
                <input
                  type="email"
                  id="email"
                  value={profile.email || ''}
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-md rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="website" className="block mb-2 text-sm font-medium text-gray-900">Website</label>
                <input
                  type="text"
                  id="website"
                  value={profile.website || ''}
                  onChange={(e) => setProfile({ ...profile, website: e.target.value })}
                  className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-md rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="hotline" className="block mb-2 text-sm font-medium text-gray-900">Hotline</label>
                <input
                  type="text"
                  id="hotline"
                  value={profile.hotline || ''}
                  onChange={(e) => setProfile({ ...profile, hotline: e.target.value })}
                  className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-md rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="companyProfile" className="block mb-2 text-sm font-medium text-gray-900">Company Profile</label>
                <input
                  type="text"
                  id="companyProfile"
                  value={profile.companyProfile || ''}
                  onChange={(e) => setProfile({ ...profile, companyProfile: e.target.value })}
                  className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-md rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                />
              </div>
            </>
          )}
          <div className="md:col-span-2 flex justify-center">
            <button
              type="submit"
              className="w-full md:w-auto rounded-lg bg-blue-600 py-3 px-6 text-sm font-semibold text-white shadow-md transition duration-200 hover:bg-blue-700"
            >
              Update Profile
            </button>
          </div>
        </form>
      )}
{isUploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden bg-black bg-opacity-50">
          <div className="relative p-6 w-full max-w-lg max-h-full">
            <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
              <button type="button" className="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ml-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" onClick={toggleUploadModal}>
                <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                </svg>
                <span className="sr-only">Close modal</span>
              </button>
              <div className="p-6 md:p-7 text-center">
                <h2 className="text-lg font-bold mb-4">Upload Profile Picture</h2>
                <form onSubmit={handlePictureUpload}>
                  <div className="flex items-center justify-center w-full mb-4">
                    <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <svg className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                          <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                        </svg>
                        <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
                      </div>
                      <input id="dropzone-file" type="file" className="hidden" onChange={(e) => setPicture(e.target.files[0])} required />
                    </label>
                  </div>
                  <button type="submit" className="bg-blue-700 text-white rounded p-2 mt-4">Upload</button>
                </form>
                {message && <p className="mt-4">{message}</p>}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'uploadDocuments' && (
        <UploadDocuments userType={userType} />
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