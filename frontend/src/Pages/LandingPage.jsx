import React from 'react';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-lg text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Welcome to Voyesta</h1>
        <p className="text-gray-600 mb-8">
          Discover amazing activities, itineraries, and historical places. Join us today and start your adventure!
        </p>
        <div className="flex justify-center space-x-4">
          <button
            className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
            onClick={() => navigate('/signup')}
          >
            Sign Up
          </button>
          <button
            className="bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-700"
            onClick={() => navigate('/login')}
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;