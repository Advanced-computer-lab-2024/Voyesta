// frontend/src/components/InteractiveVacationGuide.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

const InteractiveVacationGuide = ({ userType }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [userData, setUserData] = useState({
    username: '',
    email: '',
    password: '',
    nationality: '',
    dob: '',
    jobOrStudent: ''
  });
  const [preferences, setPreferences] = useState([]);
  const [signupComplete, setSignupComplete] = useState(false);
  const navigate = useNavigate();

  const steps = [
    {
      id: 'welcome',
      title: "Welcome to Your Journey!",
      component: WelcomeStep,
    },
    {
      id: 'signup',
      title: "Let's Get Started",
      component: SignupStep,
    },
    {
      id: 'preferences',
      title: "What Do You Like?",
      component: PreferencesStep,
    },
    {
      id: 'accommodation',
      title: "Where Would You Like to Stay?",
      component: AccommodationStep,
    },
    {
      id: 'activities',
      title: "Choose Your Adventures",
      component: ActivitiesStep,
    }
  ];

  const handleSignup = async () => {
    try {
      const response = await axios.post('http://localhost:3000/api/tourist/add', userData);
      if (response.data) {
        localStorage.setItem('token', response.data.token);
        setSignupComplete(true);
        handleNext();
      }
    } catch (error) {
      console.error('Signup failed:', error);
    }
  };

  const handleNext = () => {
    setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-4xl mx-auto p-6">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="h-2 bg-gray-200 rounded-full">
            <div 
              className="h-full bg-blue-500 rounded-full transition-all duration-500"
              style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
            />
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-xl shadow-lg p-8"
          >
            {React.createElement(steps[currentStep].component, {
              onNext: handleNext,
              onBack: handleBack,
              userData,
              setUserData,
              preferences,
              setPreferences,
              onSignup: handleSignup,
              signupComplete,
            })}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

// Step Components
const WelcomeStep = ({ onNext }) => (
  <motion.div className="text-center space-y-6">
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ delay: 0.2 }}
      className="text-6xl mb-4"
    >
      🌎
    </motion.div>
    <h1 className="text-3xl font-bold">Welcome to Your Next Adventure!</h1>
    <p className="text-gray-600">
      Let's plan your perfect vacation together. We'll help you every step of the way.
    </p>
    <button
      onClick={onNext}
      className="bg-blue-500 text-white px-8 py-3 rounded-full hover:bg-blue-600 transition-colors"
    >
      Start Planning
    </button>
  </motion.div>
);

const SignupStep = ({ onNext, userData, setUserData, onSignup }) => (
  <div className="space-y-6">
    <h2 className="text-2xl font-bold text-center">Create Your Account</h2>
    <div className="space-y-4">
      <input
        type="text"
        placeholder="Username"
        className="w-full p-3 border rounded-lg"
        value={userData.username}
        onChange={(e) => setUserData({...userData, username: e.target.value})}
      />
      <input
        type="email"
        placeholder="Email"
        className="w-full p-3 border rounded-lg"
        value={userData.email}
        onChange={(e) => setUserData({...userData, email: e.target.value})}
      />
      <input
        type="password"
        placeholder="Password"
        className="w-full p-3 border rounded-lg"
        value={userData.password}
        onChange={(e) => setUserData({...userData, password: e.target.value})}
      />
      <button
        onClick={onSignup}
        className="w-full bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600"
      >
        Sign Up
      </button>
    </div>
  </div>
);

const PreferencesStep = ({ onNext, preferences, setPreferences }) => {
  const [availablePreferences, setAvailablePreferences] = useState([]);

  useEffect(() => {
    // Fetch preferences from backend
    axios.get('http://localhost:3000/api/tourist/getTags')
      .then(response => setAvailablePreferences(response.data))
      .catch(error => console.error('Error fetching preferences:', error));
  }, []);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-center">What interests you?</h2>
      <div className="grid grid-cols-3 gap-4">
        {availablePreferences.map((pref) => (
          <button
            key={pref._id}
            onClick={() => {
              if (preferences.includes(pref._id)) {
                setPreferences(preferences.filter(id => id !== pref._id));
              } else {
                setPreferences([...preferences, pref._id]);
              }
            }}
            className={`p-3 rounded-lg border transition-colors ${
              preferences.includes(pref._id) 
                ? 'bg-blue-500 text-white' 
                : 'bg-white hover:bg-gray-50'
            }`}
          >
            {pref.name}
          </button>
        ))}
      </div>
      <button
        onClick={onNext}
        className="w-full bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600"
      >
        Continue
      </button>
    </div>
  );
};

const AccommodationStep = ({ onNext }) => (
  <div className="space-y-6">
    <h2 className="text-2xl font-bold text-center">Find Your Perfect Stay</h2>
    <div className="grid grid-cols-2 gap-4">
      <motion.div
        whileHover={{ scale: 1.05 }}
        className="p-4 border rounded-lg cursor-pointer"
        onClick={() => navigate('/tourist/hotel')}
      >
        <h3 className="text-xl font-semibold">Hotels</h3>
        <p className="text-gray-600">Find comfortable hotels in your destination</p>
      </motion.div>
      {/* Add more accommodation options */}
    </div>
    <button
      onClick={onNext}
      className="w-full bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600"
    >
      Continue to Activities
    </button>
  </div>
);

const ActivitiesStep = ({ onNext }) => (
  <div className="space-y-6">
    <h2 className="text-2xl font-bold text-center">Discover Experiences</h2>
    <div className="grid grid-cols-2 gap-4">
      <motion.div
        whileHover={{ scale: 1.05 }}
        className="p-4 border rounded-lg cursor-pointer"
        onClick={() => navigate('/tourist/activities')}
      >
        <h3 className="text-xl font-semibold">Activities</h3>
        <p className="text-gray-600">Explore local experiences and adventures</p>
      </motion.div>
      <motion.div
        whileHover={{ scale: 1.05 }}
        className="p-4 border rounded-lg cursor-pointer"
        onClick={() => navigate('/tourist/itineraries')}
      >
        <h3 className="text-xl font-semibold">Guided Tours</h3>
        <p className="text-gray-600">Join expert-led tours and itineraries</p>
      </motion.div>
    </div>
  </div>
);

export default InteractiveVacationGuide;