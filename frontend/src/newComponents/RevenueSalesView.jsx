import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DateRangeFilter from './DateRangeFilter';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';

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
    <div className="revenue-sales-view px-12 ">
      <h2 className="text-lg font-bold text-center p-10">Revenue and Sales View</h2>
      <div className="mb-4 ">
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
          <div id="date-range-picker" date-rangepicker className="flex items-center mb-4">
  <div className="relative">
    <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
      <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
        <path d="M20 4a2 2 0 0 0-2-2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v2h20V4ZM0 18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8H0v10Zm5-8h10a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2Z"/>
      </svg>
    </div>
    <input id="datepicker-range-start" name="start" type="text" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Select date start" />
  </div>
  <span className="mx-4 text-gray-500">to</span>
  <div className="relative">
    <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
      <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
        <path d="M20 4a2 2 0 0 0-2-2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v2h20V4ZM0 18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8H0v10Zm5-8h10a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2Z"/>
      </svg>
    </div>
    <input id="datepicker-range-end" name="end" type="text" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Select date end" />
  </div>
</div>
<button onClick={applyFilters} className="w-full p-2 bg-blue-500 text-white rounded mt-4">
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
              <th className="py-2">Revenue Stats</th>
            </tr>
          </thead>
          <tbody>
            {salesData.map((item, index) => (
              <React.Fragment key={index}>
{userType === 'admin' && (
  <div className="w-full bg-white rounded-lg shadow dark:bg-gray-800 p-4 md:p-6">
    <div className="flex justify-between">
      <div>
        <h5 className="leading-none text-3xl font-bold text-gray-900 dark:text-white pb-2">${item.totalRevenue || 0}</h5>
        <p className="text-base font-normal text-gray-500 dark:text-gray-400">Total Revenue</p>
      </div>
      <div className="flex items-center px-2.5 py-0.5 text-base font-semibold text-green-500 dark:text-green-500 text-center">
        23%
        <svg className="w-3 h-3 ms-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 14">
          <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13V1m0 0L1 5m4-4 4 4"/>
        </svg>
      </div>
    </div>
    <div id="data-series-chart" className="w-full h-96">
      <Bar
        data={{
          labels: ['Product Revenue', 'Activity Revenue', 'Itinerary Revenue', 'Admin Revenue', 'Total Revenue'],
          datasets: [
            {
              label: 'Revenue',
              data: [
                item.productRevenue || 0,
                item.activityRevenue || 0,
                item.itineraryRevenue || 0,
                item.adminRevenue || 0,
                item.totalRevenue || 0,
              ],
              backgroundColor: [
                'rgba(75, 192, 192, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
              ],
              borderColor: [
                'rgba(75, 192, 192, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
              ],
              borderWidth: 1,
            },
          ],
        }}
        options={{
          maintainAspectRatio: false,
          scales: {
            y: {
              type: 'logarithmic',
              beginAtZero: true,
              ticks: {
                callback: function(value, index, values) {
                  return Number(value.toString());
                }
              }
            }
          }
        }}
      />
    </div>
  </div>
)}

{userType === 'seller' && (
  <div className="w-full bg-white rounded-lg shadow dark:bg-gray-800 p-4 md:p-6">
    <div className="flex justify-between">
      <div>
        <h5 className="leading-none text-3xl font-bold text-gray-900 dark:text-white pb-2">${item.productRevenue || 0}</h5>
        <p className="text-base font-normal text-gray-500 dark:text-gray-400">Product Revenue</p>
      </div>
    </div>
    <div id="product-revenue-chart" className="w-full h-96">
      <Bar
        data={{
          labels: ['Product Revenue'],
          datasets: [
            {
              label: 'Revenue',
              data: [item.productRevenue || 0],
              backgroundColor: 'rgba(75, 192, 192, 0.2)',
              borderColor: 'rgba(75, 192, 192, 1)',
              borderWidth: 1,
            },
          ],
        }}
        options={{
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                callback: function(value) {
                  return Number(value.toString());
                }
              }
            }
          }
        }}
      />
    </div>
  </div>
)}
                {userType === 'advertiser' && (
  <div className="w-full bg-white rounded-lg shadow dark:bg-gray-800 p-4 md:p-6">
    <div className="flex justify-between">
      <div>
        <h5 className="leading-none text-3xl font-bold text-gray-900 dark:text-white pb-2">${item.activityRevenue || 0}</h5>
        <p className="text-base font-normal text-gray-500 dark:text-gray-400">Activity Revenue</p>
      </div>
    </div>
    <div id="activity-revenue-chart" className="w-full h-96">
      <Bar
        data={{
          labels: ['Activity Revenue'],
          datasets: [
            {
              label: 'Revenue',
              data: [item.activityRevenue || 0],
              backgroundColor: 'rgba(54, 162, 235, 0.2)',
              borderColor: 'rgba(54, 162, 235, 1)',
              borderWidth: 1,
            },
          ],
        }}
        options={{
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                callback: function(value) {
                  return Number(value.toString());
                }
              }
            }
          }
        }}
      />
    </div>
  </div>
)}
{userType === 'tourGuide' && (
  <div className="w-full bg-white rounded-lg shadow dark:bg-gray-800 p-4 md:p-6">
    <div className="flex justify-between">
      <div>
        <h5 className="leading-none text-3xl font-bold text-gray-900 dark:text-white pb-2">${item.itineraryRevenue || 0}</h5>
        <p className="text-base font-normal text-gray-500 dark:text-gray-400">Itinerary Revenue</p>
      </div>
    </div>
    <div id="itinerary-revenue-chart" className="w-full h-96">
      <Bar
        data={{
          labels: ['Itinerary Revenue'],
          datasets: [
            {
              label: 'Revenue',
              data: [item.itineraryRevenue || 0],
              backgroundColor: 'rgba(255, 206, 86, 0.2)',
              borderColor: 'rgba(255, 206, 86, 1)',
              borderWidth: 1,
            },
          ],
        }}
        options={{
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                callback: function(value) {
                  return Number(value.toString());
                }
              }
            }
          }
        }}
      />
    </div>
  </div>
)}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      ) : (
        <table className="min-w-full bg-gray-100 shadow rounded mt-4">
          <thead>
          </thead>
          <tbody>
            {bookingsData.map((item, index) => (
              <React.Fragment key={index}>
               {userType === 'advertiser' && (
  <div className="max-w-sm w-full bg-white rounded-lg shadow dark:bg-gray-800 p-4 md:p-6">
    <div className="flex justify-between">
      <div>
        <h5 className="leading-none text-3xl font-bold text-gray-900 dark:text-white pb-2">{item.activityBookings || 0}</h5>
        <p className="text-base font-normal text-gray-500 dark:text-gray-400">Activity Bookings</p>
      </div>
    </div>
    <div id="activity-bookings-chart">
      <Bar
        data={{
          labels: ['Activity Bookings'],
          datasets: [
            {
              label: 'Bookings',
              data: [item.activityBookings || 0],
              backgroundColor: 'rgba(54, 162, 235, 0.2)',
              borderColor: 'rgba(54, 162, 235, 1)',
              borderWidth: 1,
            },
          ],
        }}
        options={{
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                callback: function(value) {
                  return Number(value.toString());
                }
              }
            }
          }
        }}
      />
    </div>
  </div>
)}
{userType === 'tourGuide' && (
  <div className="w-full bg-white rounded-lg shadow dark:bg-gray-800 p-4 md:p-6">
    <div className="flex justify-between">
      <div>
        <h5 className="leading-none text-3xl font-bold text-gray-900 dark:text-white pb-2">{item.itineraryBookings || 0}</h5>
        <p className="text-base font-normal text-gray-500 dark:text-gray-400">Itinerary Bookings</p>
      </div>
    </div>
    <div id="itinerary-bookings-chart" className="w-full h-96">
      <Bar
        data={{
          labels: ['Itinerary Bookings'],
          datasets: [
            {
              label: 'Bookings',
              data: [item.itineraryBookings || 0],
              backgroundColor: 'rgba(255, 206, 86, 0.2)',
              borderColor: 'rgba(255, 206, 86, 1)',
              borderWidth: 1,
            },
          ],
        }}
        options={{
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                callback: function(value) {
                  return Number(value.toString());
                }
              }
            }
          }
        }}
      />
    </div>
  </div>
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