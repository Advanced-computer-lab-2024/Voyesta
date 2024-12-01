import React, { useState, useEffect } from 'react';
import axios from 'axios';

function UserStats() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const getAuthHeaders = () => {
    return {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    };
  };

  useEffect(() => {
    axios.get('http://localhost:3000/api/admin/getUserStats', getAuthHeaders())
      .then(res => {
        setStats(res.data);
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to fetch user stats');
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <p className="text-center text-lg">Loading...</p>;
  }

  if (error) {
    return <p className="text-center text-lg text-red-500">Error: {error}</p>;
  }

  return (
    <div className="user-stats-view p-10">
      <h2 className="text-2xl font-bold text-center mb-10">User Statistics</h2>
      {stats && (
        <div>
          <h3 className="text-xl font-semibold text-center mb-6">Total Users: {stats.totalUsers}</h3>
          <h4 className="text-lg font-semibold text-center mb-4">Role Stats:</h4>
          <table className="min-w-full bg-white shadow-md rounded mb-10">
            <thead className="bg-gray-200">
              <tr>
                <th className="py-2 px-4 border-b">Role</th>
                <th className="py-2 px-4 border-b">Count</th>
              </tr>
            </thead>
            <tbody>
              <tr className='text-center'>
                <td className="py-2 px-4 border-b">Tourists</td>
                <td className="py-2 px-4 border-b">{stats.roleStats.tourists}</td>
              </tr>
              <tr className='text-center'>
                <td className="py-2 px-4 border-b">Advertisers</td>
                <td className="py-2 px-4 border-b">{stats.roleStats.advertisers}</td>
              </tr>
              <tr className='text-center'>
                <td className="py-2 px-4 border-b">Sellers</td>
                <td className="py-2 px-4 border-b">{stats.roleStats.sellers}</td>
              </tr>
              <tr className='text-center'>
                <td className="py-2 px-4 border-b">Tour Guides</td>
                <td className="py-2 px-4 border-b">{stats.roleStats.tourGuides}</td>
              </tr>
            </tbody>
          </table>
          <h4 className="text-lg font-semibold text-center mb-4">Monthly Stats:</h4>
          <div className="mb-10">
            <h5 className="text-md font-semibold text-center mb-2">Tourists:</h5>
            <table className="min-w-full bg-white shadow-md rounded mb-4">
              <thead className="bg-gray-200">
                <tr>
                  <th className="py-2 px-4 border-b">Year-Month</th>
                  <th className="py-2 px-4 border-b">Count</th>
                </tr>
              </thead>
              <tbody>
                {stats.monthlyStats.tourists.map(stat => (
                  <tr key={`${stat.year}-${stat.month}`} className='text-center'>
                    <td className="py-2 px-4 border-b">{stat.year}-{stat.month}</td>
                    <td className="py-2 px-4 border-b">{stat.count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <h5 className="text-md font-semibold text-center mb-2">Advertisers:</h5>
            <table className="min-w-full bg-white shadow-md rounded mb-4">
              <thead className="bg-gray-200">
                <tr>
                  <th className="py-2 px-4 border-b">Year-Month</th>
                  <th className="py-2 px-4 border-b">Count</th>
                </tr>
              </thead>
              <tbody>
                {stats.monthlyStats.advertisers.map(stat => (
                  <tr key={`${stat.year}-${stat.month}`} className='text-center'>
                    <td className="py-2 px-4 border-b">{stat.year}-{stat.month}</td>
                    <td className="py-2 px-4 border-b">{stat.count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <h5 className="text-md font-semibold text-center mb-2">Sellers:</h5>
            <table className="min-w-full bg-white shadow-md rounded mb-4">
              <thead className="bg-gray-200">
                <tr>
                  <th className="py-2 px-4 border-b">Year-Month</th>
                  <th className="py-2 px-4 border-b">Count</th>
                </tr>
              </thead>
              <tbody>
                {stats.monthlyStats.sellers.map(stat => (
                  <tr key={`${stat.year}-${stat.month}`} className='text-center'>
                    <td className="py-2 px-4 border-b">{stat.year}-{stat.month}</td>
                    <td className="py-2 px-4 border-b">{stat.count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <h5 className="text-md font-semibold text-center mb-2">Tour Guides:</h5>
            <table className="min-w-full bg-white shadow-md rounded mb-4">
              <thead className="bg-gray-200">
                <tr>
                  <th className="py-2 px-4 border-b">Year-Month</th>
                  <th className="py-2 px-4 border-b">Count</th>
                </tr>
              </thead>
              <tbody>
                {stats.monthlyStats.tourGuides.map(stat => (
                  <tr key={`${stat.year}-${stat.month}`} className='text-center'>
                    <td className="py-2 px-4 border-b">{stat.year}-{stat.month}</td>
                    <td className="py-2 px-4 border-b">{stat.count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserStats;