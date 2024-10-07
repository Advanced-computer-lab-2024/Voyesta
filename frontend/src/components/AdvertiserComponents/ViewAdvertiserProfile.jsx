import React, { useState, useEffect } from "react";
import axios from "axios";
import { assets } from "../../assets/assets"; // Adjust the path as necessary

function AdvertiserProfileView(props) {
  const [profiles, setProfiles] = useState([]); // State to hold the advertiser profiles
  const [error, setError] = useState(null); // State for error handling

  // Fetch advertiser profiles
  const fetchProfiles = () => {
    const url = props.baseUrl + "/getAdvertiser"; // Endpoint to get advertiser profiles
    axios
      .get(url)
      .then((res) => {
        setProfiles(res.data); // Set the fetched profiles in state
      })
      .catch((err) => {
        console.log(err);
        setError("Failed to fetch profiles."); // Set error message if fetching fails
      });
  };

  // Fetch profiles on mount
  useEffect(() => {
    fetchProfiles();
  }, [props.title]);

  return (
    <>
      <div className="relative text-center bg-white shadow rounded p-3 w-2/5 mx-auto">
        <h1 className="text-2xl text-gray-600 font-bold mb-3">{props.title}</h1>

        {error && <p className="text-red-500">{error}</p>} {/* Display error message if any */}

        <ul className="text-center">
          {profiles.map((profile) => (
            <li key={profile._id} className="border-b border-gray-200 last:border-0 p-2">
              <span className="text-lg font-medium text-gray-500">{profile.Name}</span>
              {/* You can add more profile details as necessary */}
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

export default AdvertiserProfileView;
