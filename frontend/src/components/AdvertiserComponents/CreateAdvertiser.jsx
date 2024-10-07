import { useState } from "react";
import axios from "axios";

function AdvertiserProfileCreation(props) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [website, setWebsite] = useState("");
  const [hotline, setHotline] = useState("");
  const [companyProfile, setCompanyProfile] = useState("");
  const [servicesOffered, setServicesOffered] = useState("");
  const [message, setMessage] = useState(null);

  // Function to handle the creation of advertiser profile
  const handleCreateProfile = async (e) => {
    e.preventDefault();

    // URL for the POST request
    const url = props.baseUrl + "/add";

    // Send the profile data
    try {
      const response = await axios.post(url, {
        username,
        email,
        password, // In production, ensure to hash the password
        website,
        hotline,
        companyProfile,
        servicesOffered,
      });

      setMessage("Advertiser profile created successfully!"); // Success message

      // Reset the form fields after success
      setUsername("");
      setEmail("");
      setPassword("");
      setWebsite("");
      setHotline("");
      setCompanyProfile("");
      setServicesOffered("");
    } catch (error) {
      console.error("Error creating profile:", error);
      setMessage(error.response?.data?.message || "Failed to create profile.");
    }
  };

  return (
    <div className="relative text-center bg-white shadow rounded p-3 w-2/5 mx-auto">
      <h1 className="text-2xl text-gray-600 font-bold mb-3">Create Advertiser Profile</h1>
      <form onSubmit={handleCreateProfile} className="flex flex-col gap-4">
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
          <label htmlFor="website" className="block text-sm font-medium text-gray-700">
            Website
          </label>
          <input
            type="url"
            id="website"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
            className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 w-full"
            placeholder="https://example.com"
            required
          />
        </div>

        <div>
          <label htmlFor="hotline" className="block text-sm font-medium text-gray-700">
            Hotline
          </label>
          <input
            type="tel"
            id="hotline"
            value={hotline}
            onChange={(e) => setHotline(e.target.value)}
            className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 w-full"
            placeholder="+1-800-123-4567"
            required
          />
        </div>

        <div>
          <label htmlFor="companyProfile" className="block text-sm font-medium text-gray-700">
            Company Profile
          </label>
          <textarea
            id="companyProfile"
            value={companyProfile}
            onChange={(e) => setCompanyProfile(e.target.value)}
            className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 w-full"
            rows="4"
            placeholder="Describe your company..."
            required
          />
        </div>

        <div>
          <label htmlFor="servicesOffered" className="block text-sm font-medium text-gray-700">
            Services Offered
          </label>
          <textarea
            id="servicesOffered"
            value={servicesOffered}
            onChange={(e) => setServicesOffered(e.target.value)}
            className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 w-full"
            rows="4"
            placeholder="List the services you offer..."
            required
          />
        </div>

        <button
          type="submit"
          className="bg-blue-500 text-white rounded-lg p-2 mt-4 hover:bg-blue-700"
        >
          Submit
        </button>

        {message && (
          <p className={`mt-2 ${message.includes("successfully") ? "text-green-500" : "text-red-500"}`}>
            {message}
          </p>
        )}
      </form>
    </div>
  );
}

export default AdvertiserProfileCreation;
