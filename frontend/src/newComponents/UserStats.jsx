import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Pie, Line } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, LineElement, PointElement, LinearScale, Title, Tooltip, Legend, CategoryScale } from 'chart.js';

ChartJS.register(ArcElement, LineElement, PointElement, LinearScale, Title, Tooltip, Legend, CategoryScale);

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

  const generatePieChartData = (roleStats) => {
    return {
      labels: ['Tourists', 'Advertisers', 'Sellers', 'Tour Guides'],
      datasets: [
        {
          label: '# of Users',
          data: [
            roleStats.tourists,
            roleStats.advertisers,
            roleStats.sellers,
            roleStats.tourGuides
          ],
          backgroundColor: [
            'rgba(255, 99, 132, 0.6)',
            'rgba(54, 162, 235, 0.6)',
            'rgba(255, 206, 86, 0.6)',
            'rgba(75, 192, 192, 0.6)'
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)'
          ],
          borderWidth: 1
        }
      ]
    };
  };

  const generateLineChartData = (monthlyStats, label) => {
    const labels = monthlyStats.map(stat => `${stat.year}-${stat.month}`);
    const data = monthlyStats.map(stat => stat.count);

    return {
      labels,
      datasets: [
        {
          label,
          data,
          fill: false,
          backgroundColor: 'rgba(54, 162, 235, 0.6)',
          borderColor: 'rgba(54, 162, 235, 1)',
          tension: 0.1
        }
      ]
    };
  };

  const pieChartOptions = {
    plugins: {
      legend: {
        display: true,
        position: 'bottom'
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            const label = context.label || '';
            const value = context.raw || 0;
            return `${label}: ${value}`;
          }
        }
      }
    }
  };

  const lineChartOptions = {
    plugins: {
      legend: {
        display: true,
        position: 'bottom'
      }
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Year-Month'
        }
      },
      y: {
        title: {
          display: true,
          text: 'Count'
        }
      }
    }
  };

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
          <div className="flex justify-center mb-10">
            <div style={{ width: '300px', height: '300px' }}>
              <Pie data={generatePieChartData(stats.roleStats)} options={pieChartOptions} />
            </div>
          </div>
          <h4 className="text-lg font-semibold text-center mb-4">Monthly Stats:</h4>
          <div className="flex flex-wrap justify-center mb-10">
            <div className="w-1/2 p-4">
              <h5 className="text-md font-semibold text-center mb-2">Tourists:</h5>
              <div style={{ width: '100%', height: '400px' }}>
                <Line data={generateLineChartData(stats.monthlyStats.tourists, 'Tourists')} options={lineChartOptions} />
              </div>
            </div>
            <div className="w-1/2 p-4">
              <h5 className="text-md font-semibold text-center mb-2">Advertisers:</h5>
              <div style={{ width: '100%', height: '400px' }}>
                <Line data={generateLineChartData(stats.monthlyStats.advertisers, 'Advertisers')} options={lineChartOptions} />
              </div>
            </div>
            <div className="w-1/2 p-4">
              <h5 className="text-md font-semibold text-center mb-2">Sellers:</h5>
              <div style={{ width: '100%', height: '400px' }}>
                <Line data={generateLineChartData(stats.monthlyStats.sellers, 'Sellers')} options={lineChartOptions} />
              </div>
            </div>
            <div className="w-1/2 p-4">
              <h5 className="text-md font-semibold text-center mb-2">Tour Guides:</h5>
              <div style={{ width: '100%', height: '400px' }}>
                <Line data={generateLineChartData(stats.monthlyStats.tourGuides, 'Tour Guides')} options={lineChartOptions} />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserStats;