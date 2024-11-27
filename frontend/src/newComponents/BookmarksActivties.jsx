import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ActivitiesList from './ActivitiesList';
import PriceFilterBar from './PriceFilterBar';
import CategoryFilter from './CategoryFilter';
import RatingFilter from './RatingFilter';
import DateRangeFilter from './DateRangeFilter';
import CurrencyConverter from './CurrencyConverter';

const BookmarkedActivities = ({ baseUrl, role }) => {
    const [activities, setActivities] = useState([]);
    const [filteredActivities, setFilteredActivities] = useState([]);
    const [message, setMessage] = useState(null);
    const [category, setCategory] = useState('');
    const [rating, setRating] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [sortOption, setSortOption] = useState('');
    const [prices, setPrices] = useState([]);
    const [convertedPrices, setConvertedPrices] = useState([]);
    const [targetCurrency, setTargetCurrency] = useState('USD');

    useEffect(() => {
        fetchBookmarkedActivities();
    }, []);

    const fetchBookmarkedActivities = async () => {
        try {
            const response = await axios.get(`${baseUrl}/bookmarked-activities`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            setActivities(response.data);
            setFilteredActivities(response.data);
            setPrices(response.data.map(activity => activity.price));
        } catch (error) {
            console.error('Error fetching bookmarked activities:', error);
            setMessage("Error fetching bookmarked activities.");
        }
    };

   


    return (
        <div className="flex">
            <div className="relative text-center bg-white shadow rounded p-3 w-2/5 mx-auto">
                <h1 className="text-2xl text-gray-600 font-bold mb-3">Bookmarked Activities</h1>
                {message && <div className="text-red-500 mb-4">{message}</div>}
                <ActivitiesList fetchActivities={fetchBookmarkedActivities} baseUrl={baseUrl} activities={filteredActivities} role={role} convertedPrices={convertedPrices} targetCurrency={targetCurrency} />
            </div>
        </div>
    );
};

export default BookmarkedActivities;