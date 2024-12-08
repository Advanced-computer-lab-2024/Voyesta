import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCircle, faEnvelope, faPhone, faGlobe, faBuilding, faListAlt, faCamera } from '@fortawesome/free-solid-svg-icons';

function ProfileView({ userType, baseUrl, toggleUploadModal }) {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    axios.get(`${baseUrl}/get`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
    .then(response => setProfile(response.data))
    .catch(error => console.error('Error fetching profile:', error));
  }, [baseUrl]);

  if (!profile) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-full min-h-screen mx-auto bg-white rounded-lg overflow-hidden relative px-40 pb-40">
      <div className="md:flex shadow-mg rounded-lg">
        <div className="w-full p-4 text-left relative shadow-lg">
          <div className="flex justify-left relative">
            {profile.profilePicture ? (
              <>
                <img
                  src={profile.profilePicture}
                  alt="Profile"
                  className="w-24 h-24 rounded-full object-cover"
                />
                <FontAwesomeIcon
                  icon={faCamera}
                  className="absolute bottom-0 left-0 text-white bg-gray-800 rounded-full p-1 cursor-pointer"
                  onClick={toggleUploadModal}
                />
              </>
            ) : (
              <FontAwesomeIcon icon={faUserCircle} className="w-24 h-24 text-gray-400" />
            )}
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mt-4">
            {profile.name || profile.username}
          </h2>
          <div className="flex items-center mt-2 text-gray-600">
            <FontAwesomeIcon icon={faEnvelope} className="mr-2" />
            <span>{profile.email}</span>
          </div>
          {userType === 'tourGuide' && (
            <div className="flex items-center mt-2 text-gray-600">
              <FontAwesomeIcon icon={faPhone} className="mr-2" />
              <span>{profile.mobileNumber}</span>
            </div>
          )}
          {userType === 'advertiser' && (
            <>
              <div className="flex items-center mt-2 text-gray-600">
                <FontAwesomeIcon icon={faListAlt} className="mr-2" />
                <span>{profile.servicesOffered}</span>
              </div>
              <div className="flex items-center mt-2 text-gray-600">
                <FontAwesomeIcon icon={faBuilding} className="mr-2" />
                <span>{profile.companyProfile}</span>
              </div>
              <div className="flex items-center mt-2 text-gray-600">
                <FontAwesomeIcon icon={faPhone} className="mr-2" />
                <span>{profile.hotline}</span>
              </div>
              <div className="flex items-center mt-2 text-gray-600">
                <FontAwesomeIcon icon={faGlobe} className="mr-2" />
                <span>{profile.website}</span>
              </div>
            </>
          )}
          <p className="mt-2 text-gray-600">{profile.description}</p>
        </div>
      </div>
    </div>
  );
}

export default ProfileView;