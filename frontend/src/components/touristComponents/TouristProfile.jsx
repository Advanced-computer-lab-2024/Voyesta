import { useState, useEffect } from 'react';
import axios from 'axios';
import ChangePassword from '../../newComponents/ChangePassword';

const ProfileView = () => {
  const [activeTab, setActiveTab] = useState("viewProfile"); // Default to "viewProfile"
  const [profile, setProfile] = useState({});
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [nationality, setNationality] = useState("");
  const [dob, setDob] = useState("");
  const [job, setJob] = useState("");
  const [wallet, setWallet] = useState(0);
  const [level, setLevel] = useState(1);
  const [accumulatedPoints, setAccumulatedPoints] = useState(0);
  const [currentPoints, setCurrentPoints] = useState(0);
  const [pointsToRedeem, setPointsToRedeem] = useState(""); // For redeeming points
  const [password, setPassword] = useState(""); // For account creation
  const [message, setMessage] = useState(null);
  const [isAccountDetailsAdded, setIsAccountDetailsAdded] = useState(false); // Track if account details are added

  const baseUrl = "http://localhost:3000/api/tourist/get"; // Adjust based on your backend

  // Load token from local storage (or wherever you store it)
  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await axios.get(baseUrl, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
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
      setIsAccountDetailsAdded(true);
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      const updatedData = {
        username,
        email,
        Number: mobileNumber,
        Nationality: nationality,
        Job: job
      };
      await axios.put(baseUrl, updatedData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setMessage("Profile updated successfully.");
      fetchProfile(); // Refetch updated profile
    } catch (error) {
      console.error('Error updating profile:', error);
      setMessage("Error updating profile.");
    }
  };

  const handleRedeemPoints = async (e) => {
    e.preventDefault();
    const points = parseInt(pointsToRedeem, 10);

    if (isNaN(points) || points % 10000 !== 0) {
      setMessage("Points to redeem must be a multiple of 10,000.");
      return;
    }

    if (points > currentPoints) {
      setMessage("Insufficient points to redeem.");
      return;
    }

    console.log(points);

    try {
      const response = await axios.patch("http://localhost:3000/api/tourist/redeemPoints", { pointsToRedeem: points }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setMessage(response.data.message);
      fetchProfile(); // Refetch updated profile
    } catch (error) {
      console.log('Error redeeming points:', error);
      // setMessage(error.response.data.error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="bg-white shadow-md rounded-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Profile</h1>
          <div className="flex space-x-4">
            <button
              onClick={() => setActiveTab(activeTab === "viewProfile" ? "editProfile" : "viewProfile")}
              className="bg-blue-500 text-white rounded-lg p-2 hover:bg-blue-700"
            >
              {activeTab === "viewProfile" ? "Edit Profile" : "View Profile"}
            </button>
            <button
              onClick={() => setActiveTab("changePassword")}
              className="bg-blue-500 text-white rounded-lg p-2 hover:bg-blue-700"
            >
              Change Password
            </button>
          </div>
        </div>
        {message && (
          <p className={`${message.includes("successfully") ? "text-green-500" : "text-red-500"}`}>
            {message}
          </p>
        )}
        {activeTab === "viewProfile" ? (
          <div>
            <div className="mb-4">
              <h2 className="text-xl font-semibold">Personal Information</h2>
              <p><strong>Username:</strong> {username}</p>
              <p><strong>Email:</strong> {email}</p>
              <p><strong>Mobile Number:</strong> {mobileNumber}</p>
              <p><strong>Nationality:</strong> {nationality}</p>
              <p><strong>Date of Birth:</strong> {new Date(dob).toLocaleDateString()}</p>
              <p><strong>Job:</strong> {job}</p>
            </div>
            <div className="mb-4">
              <h2 className="text-xl font-semibold">Loyalty Points</h2>
              <p><strong>Level:</strong> {level}</p>
              <p><strong>Current Points:</strong> {currentPoints}</p>
            </div>
            <div className="mb-4">
              <h2 className="text-xl font-semibold">Wallet</h2>
              <p><strong>Wallet Balance:</strong> ${wallet}</p>
            </div>
            <div className="mb-4">
              <h2 className="text-xl font-semibold">Redeem Points</h2>
              <form onSubmit={handleRedeemPoints} className="flex flex-col gap-4">
                <div>
                  <label htmlFor="pointsToRedeem" className="block text-sm font-medium text-gray-700">
                    Points to Redeem (multiple of 10,000)
                  </label>
                  <input
                    type="text"
                    id="pointsToRedeem"
                    value={pointsToRedeem}
                    onChange={(e) => setPointsToRedeem(e.target.value)}
                    className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 w-full"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="bg-blue-500 text-white rounded-lg p-2 mt-4 hover:bg-blue-700"
                >
                  Redeem Points
                </button>
              </form>
            </div>
          </div>
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
              />
            </div>
            <div>
              <label htmlFor="nationality" className="block text-sm font-medium text-gray-700">
                Nationality
              </label>
              <input
                type="text"
                id="nationality"
                value={nationality}
                onChange={(e) => setNationality(e.target.value)}
                className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 w-full"
              />
            </div>
            <div>
              <label htmlFor="dob" className="block text-sm font-medium text-gray-700">
                Date of Birth
              </label>
              <input
                type="date"
                id="dob"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 w-full"
                readOnly
              />
            </div>
            <div>
              <label htmlFor="job" className="block text-sm font-medium text-gray-700">
                Job
              </label>
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
        ) : activeTab === 'changePassword' && (
          <ChangePassword baseUrl='http://localhost:3000/api/tourist' />
        )}
      </div>
    </div>
  );
};

export default ProfileView;