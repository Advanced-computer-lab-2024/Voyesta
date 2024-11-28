import React, { useEffect, useState } from 'react';
import axios from 'axios';

function RevenueSalesView({ userType }) {
  const [salesData, setSalesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getAuthHeaders = () => {
    return {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    }
  };
  
  useEffect(() => {
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
  }, [userType]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="revenue-sales-view">
      <h2 className="text-lg font-bold text-center p-10">Revenue and Sales View</h2>
      <table className="min-w-full bg-gray-100 shadow rounded">
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
    </div>
  );
}

export default RevenueSalesView;