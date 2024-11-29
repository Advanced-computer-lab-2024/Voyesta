import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ActivitiesList from './ActivitiesList';
import ItinerariesList from './ItinerariesList';

const BookmarkedActivities = ({ baseUrl, role }) => {
    const [activities, setActivities] = useState([]);
    const [itineraries, setItineraries] = useState([]);
    const [convertedPrices, setConvertedPrices] = useState([]);
    const [targetCurrency, setTargetCurrency] = useState('USD'); // Default currency
    const [message, setMessage] = useState(null);

    useEffect(() => {
        fetchBookmarkedItems();
    }, []);

    const fetchBookmarkedItems = async () => {
        try {
            const response = await axios.get(`${baseUrl}/bookmarked-items`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            setActivities(response.data.activities);
            setItineraries(response.data.itineraries);
        } catch (error) {
            console.error('Error fetching bookmarked items:', error);
            setMessage("Error fetching bookmarked items.");
        }
    };

    return (
        <div className="flex">
            <div className="relative text-center bg-white shadow rounded p-3 w-2/5 mx-auto">
                <h1 className="text-2xl text-gray-600 font-bold mb-3">Bookmarked Items</h1>
                {message && <div className="text-red-500 mb-4">{message}</div>}
                <h2 className="text-xl text-gray-600 font-bold mb-3">Activities</h2>
                <ActivitiesList fetchActivities={fetchBookmarkedItems} baseUrl={baseUrl} activities={activities} role={role} />
                <h2 className="text-xl text-gray-600 font-bold mb-3">Itineraries</h2>
                <ItinerariesList fetchItineraries={fetchBookmarkedItems} baseUrl={baseUrl} itineraries={itineraries} role={role} convertedPrices={convertedPrices} targetCurrency={targetCurrency} />
            </div>
        </div>
    );
};

export default BookmarkedActivities;