import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ItinerariesList from './ItinerariesList';
import CreateItinerary from './CreateItinerary';

const ItineraryView = ({ baseUrl, role }) => {
  const [itineraries, setItineraries] = useState([]);
  const [message, setMessage] = useState(null);
  const [activeTab, setActiveTab] = useState('viewItineraries');

  useEffect(() => {
    fetchItineraries();
  }, [activeTab]);

  const fetchItineraries = async () => {
    try {
      const response = await axios.get(`${baseUrl}/getItinerary`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setItineraries(response.data);
    } catch (error) {
      console.error('Error fetching itineraries:', error);
      setMessage("Error fetching itineraries.");
    }
  };

  const getAuthHeaders = () => {
    return {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    };
  };

  return (
    <div className="relative text-center bg-white shadow rounded p-3 w-2/5 mx-auto">
      <h1 className="text-2xl text-gray-600 font-bold mb-3">Available Itineraries</h1>

      {message && <div className="text-red-500 mb-4">{message}</div>}

      {role === 'tourGuide' && (
        <>
          {/* Sub-navbar for tourGuide */}
          <div className="flex justify-around border-b mb-4">
            <button
              className={`p-2 ${activeTab === 'viewItineraries' ? 'border-b-2 border-blue-500' : ''}`}
              onClick={() => setActiveTab('viewItineraries')}
            >
              View Itineraries
            </button>
            <button
              className={`p-2 ${activeTab === 'createItinerary' ? 'border-b-2 border-blue-500' : ''}`}
              onClick={() => setActiveTab('createItinerary')}
            >
              Create Itinerary
            </button>
          </div>

          {/* Content based on Active Tab */}
          {activeTab === 'viewItineraries' ? (
            <ItinerariesList fetchItineraries={fetchItineraries} baseUrl={baseUrl} itineraries={itineraries} role={role} />
          ) : activeTab === 'createItinerary' && (
            <CreateItinerary getAuthHeaders={getAuthHeaders} />
          )}
        </>
      )}

      {role !== 'tourGuide' && (
        <ItinerariesList fetchItineraries={fetchItineraries} baseUrl={baseUrl} itineraries={itineraries} role={role} />
      )}
    </div>
  );
};

export default ItineraryView;