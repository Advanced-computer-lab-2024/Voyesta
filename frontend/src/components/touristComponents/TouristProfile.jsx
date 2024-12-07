import { useState, useEffect } from 'react';
import axios from 'axios';
import ChangePassword from '../../newComponents/ChangePassword';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCircle, faEnvelope, faPhone, faGlobe, faBuilding, faBirthdayCake, faWallet, faMedal, faStar, faListAlt, faHome, faTrash, faEdit, faKey } from '@fortawesome/free-solid-svg-icons';

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
  const [preferences, setPreferences] = useState([]);
  const [allTags, setAllTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const baseUrl = "http://localhost:3000/api/tourist/get"; // Adjust based on your backend
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Load token from local storage (or wherever you store it)
  useEffect(() => {
    const fetchData = async () => {
      await fetchTags(); // Ensure tags are fetched first
      await fetchProfile(); // Then fetch profile
    };
  
    fetchData();
  }, []);

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage('');
      }, 5000); // Clear the message after 5 seconds

      return () => clearTimeout(timer); // Clear the timer if the component unmounts
    }
  }, [message]);

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
      console.log(data);
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
      setPreferences(data.preferences);
      setSelectedTags(data.preferences.map(tag => tag._id));
    
    } catch (error) {
      console.error('Error fetching profile:', error);
      setMessage("Error fetching profile.");
    }
  };

  const fetchTags = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/tourist/getTags", getAuthHeaders()); // Update with correct API endpoint
  

      setAllTags(response.data);
    } catch (error) {
      console.error('Error fetching tags:', error);
      setMessage("Error fetching tags.");
    }
  };

// see which tags are already selected and update the state accordingly also to help remove tags 
  const handleTagSelection = (tagId) => {
    setSelectedTags(prevSelectedTags =>
        prevSelectedTags.includes(tagId)
            ? prevSelectedTags.filter(id => id !== tagId)
            : [...prevSelectedTags, tagId]
    );
};



  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    const updatedData = {
      username,
      email,
      mobileNumber,
      nationality,
      dob,
      job,
      preferences : selectedTags
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
        job,
        preferences : selectedTags
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
      setIsModalOpen(false);
      fetchProfile();
    } catch (error) {
      console.error('Error requesting account deletion:', error);
      setError(error.response?.data?.message || "Error requesting account deletion.");
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

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <div className="max-w-full mx-auto bg-white shadow-md rounded-lg overflow-hidden relative px-40 pb-10">
      <div className="flex justify-between items-center p-4 border-b mb-10">
        <h2 className="text-4xl font-bold text-gray-900">Profile</h2>
        <div className="flex space-x-4 pe-9">
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
          <FontAwesomeIcon
            icon={faTrash}
            className="cursor-pointer text-2xl text-gray-700 hover:text-red-600"
            onClick={toggleModal}        />
        </div>
      </div>
      {profile && activeTab === "viewProfile" && (
        <div className="w-full p-4 text-left flex shadow-md">
          <div className="flex-1">
            <div className="flex justify-left">
              {profile.profilePicture ? (
                <img
                  src={profile.profilePicture}
                  alt="Profile"
                  className="w-24 h-24 rounded-full object-cover"
                />
              ) : (
                <FontAwesomeIcon icon={faUserCircle} className="w-24 h-24 text-gray-400" />
              )}
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mt-4">
              {profile.name || profile.username}
            </h2>
            <div className="flex items-center mt-2 text-gray-600">
              <FontAwesomeIcon icon={faEnvelope} className="mr-2 text-xl" />
              <span>{profile.email}</span>
            </div>
            <div className="flex items-center mt-2 text-gray-600">
              <FontAwesomeIcon icon={faPhone} className="mr-2 text-xl" />
              <span>{profile.Number}</span>
            </div>
            <div className="flex items-center mt-2 text-gray-600">
              <FontAwesomeIcon icon={faGlobe} className="mr-2 text-xl" />
              <span>{profile.Nationality}</span>
            </div>
            <div className="flex items-center mt-2 text-gray-600">
              <FontAwesomeIcon icon={faBirthdayCake} className="mr-2 text-xl" />
              <span>{new Date(profile.DOB).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center mt-2 text-gray-600">
              <FontAwesomeIcon icon={faBuilding} className="mr-2 text-xl" />
              <span>{profile.Job}</span>
            </div>
            <div className="flex items-center mt-2 text-gray-600">
              <FontAwesomeIcon icon={faListAlt} className="mr-2 text-xl" />
              <span>{profile.preferences.map(tag => tag.Name).join(', ')}</span>
            </div>
            
            <p className="mt-2 text-gray-600">{profile.description}</p>
          </div>
          <div className="flex-1 flex flex-col justify-between mt-7">
            <div className="flex flex-row space-x-20 text-gray-600">
              <div className="flex items-center">
                <FontAwesomeIcon icon={faWallet} className="mr-2 text-xl" />
                <span>Wallet: {profile.Wallet}</span>
              </div>
              <div className="flex items-center">
                <FontAwesomeIcon icon={faMedal} className="mr-2 text-xl" />
                <span>Level: {profile.level}</span>
              </div>
              <div className="flex items-center">
                <FontAwesomeIcon icon={faStar} className="mr-2 text-xl" />
                <span>Points: {profile.currentPoints}</span>
              </div>
            </div>
            {profile.addresses && profile.addresses.length > 0 && (
              <div className="mt-4 mb-14">
                <h3 className="text-xl font-bold text-gray-900">Addresses</h3>
                {profile.addresses.map((address, index) => (
                  <div key={index} className="flex items-center mt-2 text-gray-600">
                    <FontAwesomeIcon icon={faHome} className="mr-2 text-xl" />
                    <span>{address.address}, {address.city}, {address.state}, {address.zip}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
      {activeTab === 'changePassword' && (
          <ChangePassword baseUrl='http://localhost:3000/api/tourist' />
      )}

      {activeTab === "editProfile" && (
        <form onSubmit={handleUpdateProfile} className="grid grid-cols-1 md:grid-cols-2 gap-7 p-4 max-w-3xl mx-auto">
        <div>
          <label htmlFor="username" className="block mb-2 text-sm font-medium text-gray-900">Username</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-md rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            required
          />
        </div>
        <div>
          <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-md rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            required
          />
        </div>
        <div>
          <label htmlFor="mobileNumber" className="block mb-2 text-sm font-medium text-gray-900">Mobile Number</label>
          <input
            type="text"
            id="mobileNumber"
            value={mobileNumber}
            onChange={(e) => setMobileNumber(e.target.value)}
            className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-md rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            required
          />
        </div>
        <div>
          <label htmlFor="nationality" className="block mb-2 text-sm font-medium text-gray-900">Nationality</label>
          <input
            type="text"
            id="nationality"
            value={nationality}
            onChange={(e) => setNationality(e.target.value)}
            className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-md rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            required
          />
        </div>
        <div>
          <label htmlFor="job" className="block mb-2 text-sm font-medium text-gray-900">Job</label>
          <input
            type="text"
            id="job"
            value={job}
            onChange={(e) => setJob(e.target.value)}
            className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-md rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            required
          />
        </div>
        <div>
            <label htmlFor="preferences" className="block mb-2 text-sm font-medium text-gray-900">Preferences</label>
            <div className="relative">
              <button
                id="dropdownSearchButton"
                onClick={toggleDropdown}
                className="inline-flex items-center h-11 px-4 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                type="button"
              >
                Dropdown search
                <svg className="w-2.5 h-2.5 ms-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4"/>
                </svg>
              </button>

              {/* Dropdown menu */}
              {isDropdownOpen && (
                <div id="dropdownSearch" className="absolute z-10 bg-white rounded-lg shadow w-60 dark:bg-gray-700" style={{ top: '100%', marginTop: '10px' }}>
                  <ul className="h-28 px-3 pb-3 overflow-y-auto text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownSearchButton">
                    {allTags.map(tag => (
                      <li key={tag._id}>
                        <div className="flex items-center p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-600">
                          <input
                            id={`${tag._id}-checkbox-list`}
                            type="checkbox"
                            checked={selectedTags.includes(tag._id)}
                            onChange={() => handleTagSelection(tag._id)}
                            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                          />
                          <label htmlFor={`${tag._id}-checkbox-list`} className="w-full ms-2 text-sm font-medium text-gray-900 rounded dark:text-gray-300">
                            {tag.Name}
                          </label>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

        <div className="md:col-span-2 flex justify-center">
            <button
              type="submit"
              className="w-full md:w-auto rounded-lg bg-blue-800 py-3 px-6 text-sm font-semibold text-white shadow-md transition duration-200 hover:bg-blue-700"
            >
              Update Profile
            </button>
          </div>
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

      {isModalOpen && (
              <div id="popup-modal" tabIndex="-1" className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden bg-black bg-opacity-50">
                <div className="relative p-4 w-full max-w-md max-h-full">
                  <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
                    <button type="button" className="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ml-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" onClick={toggleModal}>
                      <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                      </svg>
                      <span className="sr-only">Close modal</span>
                    </button>
                    <div className="p-4 md:p-5 text-center">
                      <svg className="mx-auto mb-4 text-gray-400 w-12 h-12 dark:text-gray-200" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 11V6m0 8h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/>
                      </svg>
                      <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">Are you sure you want to delete your account?</h3>
                      <button type="button" className="text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center" onClick={handleRequestAccountDeletion}>
                        Yes, I'm sure
                      </button>
                      <button type="button" className="py-2.5 px-5 ml-3 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700" onClick={toggleModal}>
                        No, cancel
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
    </div>
  );
};

export default TouristProfile;