// frontend/src/components/VacationGuide.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const VacationGuide = ({ userType }) => {
  const steps = [
    {
      title: '1. Choose Your Accommodations',
      description: 'Start by booking your hotel stay',
      link: `/${userType}/hotel`,
      icon: '🏨'
    },
    {
      title: '2. Plan Your Transportation', 
      description: 'Book flights or local transportation',
      link: `/${userType}/flight`,
      icon: '✈️'
    },
    {
      title: '3. Explore Activities',
      description: 'Browse available activities and tours',
      link: `/${userType}/activities`, 
      icon: '🎯'
    },
    {
      title: '4. Visit Cultural Sites',
      description: 'Discover museums and historical places',
      link: `/${userType}/museums`,
      icon: '🏛️'
    },
    {
      title: '5. Book Local Experiences',
      description: 'Find guided tours and local itineraries',
      link: `/${userType}/itineraries`,
      icon: '🗺️'
    }
  ];

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Start Your Vacation Journey</h1>
      <div className="space-y-6">
        {steps.map((step, index) => (
          <Link 
            key={index}
            to={step.link}
            className="block bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center">
              <span className="text-4xl mr-4">{step.icon}</span>
              <div>
                <h2 className="text-xl font-semibold">{step.title}</h2>
                <p className="text-gray-600">{step.description}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default VacationGuide;