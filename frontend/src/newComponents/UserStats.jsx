



import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Pie, Line } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, LineElement, PointElement, LinearScale, Title, Tooltip, Legend, CategoryScale } from 'chart.js';

ChartJS.register(ArcElement, LineElement, PointElement, LinearScale, Title, Tooltip, Legend, CategoryScale);

function UserStats() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedPieUserTypes, setSelectedPieUserTypes] = useState({
    tourists: true,
    advertisers: true,
    sellers: true,
    tourGuides: true
  });
  const [selectedLineUserTypes, setSelectedLineUserTypes] = useState({
    tourists: true,
    advertisers: true,
    sellers: true,
    tourGuides: true
  });

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
    const labels = [];
    const data = [];
    const backgroundColor = [];
    const borderColor = [];

    if (selectedPieUserTypes.tourists) {
      labels.push('Tourists');
      data.push(roleStats.tourists);
      backgroundColor.push('#FF6384');
      borderColor.push('#FF6384');
    }

    if (selectedPieUserTypes.advertisers) {
      labels.push('Advertisers');
      data.push(roleStats.advertisers);
      backgroundColor.push('#36A2EB');
      borderColor.push('#36A2EB');
    }

    if (selectedPieUserTypes.sellers) {
      labels.push('Sellers');
      data.push(roleStats.sellers);
      backgroundColor.push('#FFCE56');
      borderColor.push('#FFCE56');
    }

    if (selectedPieUserTypes.tourGuides) {
      labels.push('Tour Guides');
      data.push(roleStats.tourGuides);
      backgroundColor.push('#4BC0C0');
      borderColor.push('#4BC0C0');
    }

    return {
      labels,
      datasets: [
        {
          label: '# of Users',
          data,
          backgroundColor,
          borderColor,
          borderWidth: 1
        }
      ]
    };
  };

  const generateLineChartData = (monthlyStats) => {
    const labels = monthlyStats.tourists.map(stat => `${stat.year}-${stat.month}`);
    const datasets = [];

    if (selectedLineUserTypes.tourists) {
      datasets.push({
        label: 'Tourists',
        data: monthlyStats.tourists.map(stat => stat.count),
        fill: false,
        backgroundColor: 'rgba(255, 99, 132, 0.6)',
        borderColor: 'rgba(255, 99, 132, 1)',
        tension: 0.1
      });
    }

    if (selectedLineUserTypes.advertisers) {
      datasets.push({
        label: 'Advertisers',
        data: monthlyStats.advertisers.map(stat => stat.count),
        fill: false,
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
        borderColor: 'rgba(54, 162, 235, 1)',
        tension: 0.1
      });
    }

    if (selectedLineUserTypes.sellers) {
      datasets.push({
        label: 'Sellers',
        data: monthlyStats.sellers.map(stat => stat.count),
        fill: false,
        backgroundColor: 'rgba(255, 206, 86, 0.6)',
        borderColor: 'rgba(255, 206, 86, 1)',
        tension: 0.1
      });
    }

    if (selectedLineUserTypes.tourGuides) {
      datasets.push({
        label: 'Tour Guides',
        data: monthlyStats.tourGuides.map(stat => stat.count),
        fill: false,
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        tension: 0.1
      });
    }

    return {
      labels,
      datasets
    };
  };

  const handlePieCheckboxChange = (event) => {
    const { name, checked } = event.target;
    setSelectedPieUserTypes(prevState => ({
      ...prevState,
      [name]: checked
    }));
  };

  const handleLineCheckboxChange = (event) => {
    const { name, checked } = event.target;
    setSelectedLineUserTypes(prevState => ({
      ...prevState,
      [name]: checked
    }));
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
        <div className="space-y-10">
          <div className="text-center">
            <h3 className="text-xl font-semibold mb-6">Total Users: {stats.totalUsers}</h3>
            <h4 className="text-lg font-semibold mb-4">Role Stats:</h4>
            <div className="flex justify-center mb-4">
              <div className="flex flex-col items-center space-y-2">
                {['tourists', 'advertisers', 'sellers', 'tourGuides'].map((type, index) => (
                  <label key={type} className="flex items-center">
                    <input
                      type="checkbox"
                      name={type}
                      checked={selectedPieUserTypes[type]}
                      onChange={handlePieCheckboxChange}
                      className="mr-2"
                    />
                    <span className="w-4 h-4 inline-block mr-2" style={{ backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'][index] }}></span>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </label>
                ))}
              </div>
            </div>
            <div className="flex justify-center">
              <div style={{ width: '300px', height: '300px' }}>
                <Pie data={generatePieChartData(stats.roleStats)} options={pieChartOptions} />
              </div>
            </div>
          </div>
          <div className="text-center">
            <h4 className="text-lg font-semibold mb-4">Monthly Stats:</h4>
            <div className="flex justify-center mb-4">
              <div className="flex flex-col items-center space-y-2">
                {['tourists', 'advertisers', 'sellers', 'tourGuides'].map((type, index) => (
                  <label key={type} className="flex items-center">
                    <input
                      type="checkbox"
                      name={type}
                      checked={selectedLineUserTypes[type]}
                      onChange={handleLineCheckboxChange}
                      className="mr-2"
                    />
                    <span className="w-4 h-4 inline-block mr-2" style={{ backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'][index] }}></span>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </label>
                ))}
              </div>
            </div>
            <div className="flex justify-center">
              <div style={{ width: '80%', height: '400px' }}>
                <Line data={generateLineChartData(stats.monthlyStats)} options={lineChartOptions} />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserStats;