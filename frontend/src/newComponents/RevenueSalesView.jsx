import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DateRangeFilter from './DateRangeFilter';

function RevenueSalesView({ userType }) {
  const [salesData, setSalesData] = useState([]);
  const [bookingsData, setBookingsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [items, setItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [month, setMonth] = useState('');
  const [activeTab, setActiveTab] = useState('revenue');

  const getAuthHeaders = () => {
    return {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    }
  };

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const url = userType === 'advertiser' 
          ? `http://localhost:3000/api/advertiser/getActivity` 
          : userType === 'tourGuide'
          ? `http://localhost:3000/api/tourGuide/getItinerary`
          : userType === 'seller'
          ? `http://localhost:3000/api/seller/getMyProducts`
          : `http://localhost:3000/api/admin/getProducts`;
        const response = await axios.get(url, getAuthHeaders());
        console.log('Fetched items:', response.data); // Debug log
        if (userType === 'seller' || userType === 'admin') {
          setItems(response.data.data || []);
        } else
            setItems(response.data || []);
      } catch (error) {
        console.error('Error fetching items:', error);
        setItems([]);
      }
    };

    fetchItems();
  }, [userType]);

  useEffect(() => {
    const fetchInitialData = async () => {
      const url = `http://localhost:3000/api/${userType}/getRevenue`;

      axios.get(url, getAuthHeaders())
        .then(res => {
          setSalesData([res.data]);
          setLoading(false);
          console.log(res.data);
        })
        .catch(err => {
          setError(err.response ? err.response.data.message : err.message);
          setLoading(false);
        });
    };

    fetchInitialData();
  }, [userType]);

  useEffect(() => {
    if (activeTab === 'bookings') {
      const fetchBookingsData = async () => {
        const url = `http://localhost:3000/api/${userType}/getBookingsReport`;

        axios.get(url, {
          ...getAuthHeaders(),
          params: {
            activityId: userType === 'advertiser' ? selectedItem : undefined,
            itineraryId: userType === 'tourGuide' ? selectedItem : undefined,
            month
          }
        })
          .then(res => {
            setBookingsData([res.data]);
            setLoading(false);
            console.log(res.data);
          })
          .catch(err => {
            setError(err.response ? err.response.data.message : err.message);
            setLoading(false);
          });
      };

      fetchBookingsData();
    }
  }, [activeTab, userType, selectedItem, month]);

  const applyFilters = () => {
    const url = activeTab === 'revenue'
      ? `http://localhost:3000/api/${userType}/getRevenue`
      : `http://localhost:3000/api/${userType}/getBookingsReport`;

    axios.get(url, {
      ...getAuthHeaders(),
      params: {
        activityId: userType === 'advertiser' ? selectedItem : undefined,
        itineraryId: userType === 'tourGuide' ? selectedItem : undefined,
        productId: userType === 'admin' || userType === 'seller' ? selectedItem : undefined,
        startDate,
        endDate,
        month
      }
    })
      .then(res => {
        if (activeTab === 'revenue') {
          setSalesData([res.data]);
        } else {
          setBookingsData([res.data]);
        }
        setLoading(false);
        console.log(res.data);
      })
      .catch(err => {
        setError(err.response ? err.response.data.message : err.message);
        setLoading(false);
      });
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="revenue-sales-view">
      <h2 className="text-lg font-bold text-center p-10">Revenue and Sales View</h2>
      <div className="mb-4">
        <button
          className={`p-2 ${activeTab === 'revenue' ? 'border-b-2 border-blue-500' : ''}`}
          onClick={() => setActiveTab('revenue')}
        >
          Revenue Report
        </button>
        {(userType === 'advertiser' || userType === 'tourGuide') && (
          <button
            className={`p-2 ${activeTab === 'bookings' ? 'border-b-2 border-blue-500' : ''}`}
            onClick={() => setActiveTab('bookings')}
          >
            Bookings Report
          </button>
        )}
      </div>
      {(userType === 'advertiser' || userType === 'tourGuide' || userType === 'admin' || userType === 'seller') && (
        <div className="mb-4">
          <label className="block mb-2">Select {userType === 'advertiser' ? 'Activity' : userType === 'tourGuide' ? 'Itinerary' : 'Product'}</label>
          <select
            value={selectedItem}
            onChange={(e) => setSelectedItem(e.target.value)}
            className="w-full p-2 border"
          >
            <option value="">All {userType === 'advertiser' ? 'Activities' : userType === 'tourGuide' ? 'Itineraries' : 'Products'}</option>
            {Array.isArray(items) && items.map(item => (
              <option key={item._id} value={item._id}>
                {item.name}
              </option>
            ))}
          </select>
        </div>
      )}
      {activeTab === 'revenue' && (
        <>
          <DateRangeFilter setStartDate={setStartDate} setEndDate={setEndDate} />
          <button
            onClick={applyFilters}
            className="w-full p-2 bg-blue-500 text-white rounded mt-4"
          >
            Apply Filters
          </button>
        </>
      )}
      {activeTab === 'bookings' && (
        <>
          <div className="mb-4">
            <label className="block mb-2">Select Month</label>
            <input
              type="month"
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              className="w-full p-2 border"
            />
          </div>
          <button
            onClick={applyFilters}
            className="w-full p-2 bg-blue-500 text-white rounded mt-4"
          >
            Apply Filters
          </button>
        </>
      )}
      {activeTab === 'revenue' ? (
        <table className="min-w-full bg-gray-100 shadow rounded mt-4">
          <thead>
            <tr>
              <th className="py-2">Item Name</th>
              <th className="py-2">Revenue</th>
            </tr>
          </thead>
          <tbody>
            {salesData.map((item, index) => (
              <React.Fragment key={index}>
                {userType === 'admin' && (
                  <>
                    <tr className='text-center'>
                      <td className="py-2">Product Revenue</td>
                      <td className="py-2">{item.productRevenue || 0}</td>
                    </tr>
                    <tr className='text-center'>
                      <td className="py-2">Activity Revenue</td>
                      <td className="py-2">{item.activityRevenue || 0}</td>
                    </tr>
                    <tr className='text-center'>
                      <td className="py-2">Itinerary Revenue</td>
                      <td className="py-2">{item.itineraryRevenue || 0}</td>
                    </tr>
                    <tr className='text-center'>
                      <td className="py-2">Total Revenue</td>
                      <td className="py-2">{item.totalRevenue || 0}</td>
                    </tr>
                    <tr className='text-center'>
                      <td className="py-2">Admin Revenue</td>
                      <td className="py-2">{item.adminRevenue || 0}</td>
                    </tr>
                  </>
                )}
                {userType === 'seller' && (
                  <tr className='text-center'>
                    <td className="py-2">Product Revenue</td>
                    <td className="py-2">{item.productRevenue || 0}</td>
                  </tr>
                )}
                {userType === 'advertiser' && (
                  <tr className='text-center'>
                    <td className="py-2">Activity Revenue</td>
                    <td className="py-2">{item.activityRevenue || 0}</td>
                  </tr>
                )}
                {userType === 'tourGuide' && (
                  <tr className='text-center'>
                    <td className="py-2">Itinerary Revenue</td>
                    <td className="py-2">{item.itineraryRevenue || 0}</td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      ) : (
        <table className="min-w-full bg-gray-100 shadow rounded mt-4">
          <thead>
            <tr>
              <th className="py-2">Item Name</th>
              <th className="py-2">Number of Bookings</th>
            </tr>
          </thead>
          <tbody>
            {bookingsData.map((item, index) => (
              <React.Fragment key={index}>
                {userType === 'advertiser' && (
                  <tr className='text-center'>
                    <td className="py-2">Activity Bookings</td>
                    <td className="py-2">{item.activityBookings || 0}</td>
                  </tr>
                )}
                {userType === 'tourGuide' && (
                  <tr className='text-center'>
                    <td className="py-2">Itinerary Bookings</td>
                    <td className="py-2">{item.itineraryBookings || 0}</td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default RevenueSalesView;