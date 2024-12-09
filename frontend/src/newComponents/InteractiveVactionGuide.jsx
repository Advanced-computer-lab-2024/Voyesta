// frontend/src/components/InteractiveVacationGuide.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

const InteractiveVacationGuide = ({ userType }) => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(() => {
    return parseInt(localStorage.getItem('guideStep') || '0')
  });
  
  const [formData, setFormData] = useState(() => {
    return JSON.parse(localStorage.getItem('guideFormData') || JSON.stringify({
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      mobileNumber: '',
      nationality: '',
      dob: '',
      jobOrStudent: '',
      preferences: []
    }));
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [availablePreferences, setAvailablePreferences] = useState([]);

  // Add to main component
   useEffect(() => {
    const returnToGuide = new URLSearchParams(window.location.search).get('returnToGuide');
    const savedStep = localStorage.getItem('guideStep');
    
    if (returnToGuide && savedStep) {
      setCurrentStep(parseInt(savedStep));
    }
  }, []);
  
  
  useEffect(() => {
    localStorage.setItem('guideStep', currentStep);
    localStorage.setItem('guideFormData', JSON.stringify(formData));
  }, [currentStep, formData]);

  const validateForm = (step) => {
    const newErrors = {};
    
    switch(step) {
      case 1: // Signup validation
        if (!formData.username) newErrors.username = 'Username is required';
        if (!formData.email) newErrors.email = 'Email is required';
        else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email';
        if (!formData.password) newErrors.password = 'Password is required';
        else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
        if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
        if (!formData.mobileNumber) newErrors.mobileNumber = 'Mobile number is required';
        if (!formData.nationality) newErrors.nationality = 'Nationality is required';
        if (!formData.dob) newErrors.dob = 'Date of birth is required';
        if (!formData.jobOrStudent) newErrors.jobOrStudent = 'Occupation is required';
        break;
      case 2: // Preferences validation
        if (formData.preferences.length === 0) newErrors.preferences = 'Select at least one preference';
        break;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = async () => {
    if (validateForm(currentStep)) {
      // If completing preferences step (step 2), switch to tourist route
      if (currentStep === 2) {
        setCurrentStep(currentStep + 1);
        setTimeout(() => {
            navigate('/tourist/guide', { replace: true });
        }, 500); // route change delay 
        
        
      } else {
        setCurrentStep(currentStep + 1);
      }
    }
  };

  const steps = [
    {
      id: 'welcome',
      component: WelcomeStep,
    },
    {
      id: 'signup',
      component: SignupStep,
    },
    {
      id: 'preferences',
      component: PreferencesStep,
    },
    {
      id: 'accommodation',
      component: AccommodationStep,
    },
    {
      id: 'activities',
      component: ActivitiesStep,
    },
    {
        id: 'complete',
        component: CompleteProfileStep,
      },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-4xl mx-auto p-6">
        <div className="mb-8">
          <div className="h-2 bg-gray-200 rounded-full">
            <motion.div 
              className="h-full bg-blue-500 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
              transition={{ duration: 0.5 }}
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
              formData,
              setFormData,
              errors,
              setErrors,
              loading,
              setLoading,
              onNext: handleNext,
              availablePreferences,
              setAvailablePreferences,
              navigate
            })}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

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

const SignupStep = ({ formData, setFormData, errors, loading, onNext ,navigate,setErrors,setLoading}) => {
    // const [loading, setLoading] = useState(true);
    // const[errors, setErrors] = useState({});
    const handleSignup = async () => {
        try {
          setLoading(true);
          const response = await axios.post('http://localhost:3000/api/tourist/add', {
            ...formData,
            Number: formData.mobileNumber,
            DOB: formData.dob,
            Job: formData.jobOrStudent
          });
          
          localStorage.setItem('token', response.data.token);
          localStorage.setItem('userType', 'tourist');
          localStorage.setItem('guideInProgress', 'true');
          onNext();
            
          // Then navigate to tourist dashboard with a query parameter
        //   navigate('/tourist/dashboard?returnToGuide=true');
          
        } catch (error) {
          setErrors({ submit: error.response?.data?.error || 'Signup failed' });
        } finally {
          setLoading(false);
        }
      };
  
  return (<div className="space-y-6">
    <h2 className="text-2xl font-bold text-center">Create Your Account</h2>
    <div className="grid grid-cols-2 gap-4">
      <div>
        <input
          type="text"
          placeholder="Username"
          className={`w-full p-3 border rounded-lg ${errors.username ? 'border-red-500' : ''}`}
          value={formData.username}
          onChange={(e) => setFormData({...formData, username: e.target.value})}
        />
        {errors.username && <p className="text-red-500 text-sm mt-1">{errors.username}</p>}
      </div>

      <div>
        <input
          type="email"
          placeholder="Email"
          className={`w-full p-3 border rounded-lg ${errors.email ? 'border-red-500' : ''}`}
          value={formData.email}
          onChange={(e) => setFormData({...formData, email: e.target.value})}
        />
        {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
      </div>

      <div>
        <input
          type="password"
          placeholder="Password"
          className={`w-full p-3 border rounded-lg ${errors.password ? 'border-red-500' : ''}`}
          value={formData.password}
          onChange={(e) => setFormData({...formData, password: e.target.value})}
        />
        {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
      </div>

      <div>
        <input
          type="password"
          placeholder="Confirm Password"
          className={`w-full p-3 border rounded-lg ${errors.confirmPassword ? 'border-red-500' : ''}`}
          value={formData.confirmPassword}
          onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
        />
        {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
      </div>

      <div>
        <input
          type="tel"
          placeholder="Mobile Number"
          className={`w-full p-3 border rounded-lg ${errors.mobileNumber ? 'border-red-500' : ''}`}
          value={formData.mobileNumber}
          onChange={(e) => setFormData({...formData, mobileNumber: e.target.value})}
        />
        {errors.mobileNumber && <p className="text-red-500 text-sm mt-1">{errors.mobileNumber}</p>}
      </div>

      <div>
        <input
          type="text"
          placeholder="Nationality"
          className={`w-full p-3 border rounded-lg ${errors.nationality ? 'border-red-500' : ''}`}
          value={formData.nationality}
          onChange={(e) => setFormData({...formData, nationality: e.target.value})}
        />
        {errors.nationality && <p className="text-red-500 text-sm mt-1">{errors.nationality}</p>}
      </div>

      <div>
        <input
          type="date"
          placeholder="Date of Birth"
          className={`w-full p-3 border rounded-lg ${errors.dob ? 'border-red-500' : ''}`}
          value={formData.dob}
          onChange={(e) => setFormData({...formData, dob: e.target.value})}
        />
        {errors.dob && <p className="text-red-500 text-sm mt-1">{errors.dob}</p>}
      </div>

      

      <div>
        <input
          type="text"
          placeholder="Job/Student"
          className={`w-full p-3 border rounded-lg ${errors.jobOrStudent ? 'border-red-500' : ''}`}
          value={formData.jobOrStudent}
          onChange={(e) => setFormData({...formData, jobOrStudent: e.target.value})}
        />
        {errors.jobOrStudent && <p className="text-red-500 text-sm mt-1">{errors.jobOrStudent}</p>}
      </div>
    </div>

    {errors.submit && (
      <div className="text-red-500 text-center">{errors.submit}</div>
    )}

    <button
      onClick={handleSignup}
      disabled={loading}
      className="w-full bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 disabled:bg-blue-300"
    >
      {loading ? 'Creating Account...' : 'Continue'}
    </button>
  </div>
);
};

// Updated PreferencesStep
const PreferencesStep = ({ formData, setFormData, errors, onNext }) => {
    const [availablePreferences, setAvailablePreferences] = useState([]);
    const [loading, setLoading] = useState(true);
  
    useEffect(() => {
        const token = localStorage.getItem('token');
        
        axios.get('http://localhost:3000/api/tourist/getTags', {
          headers: { Authorization: `Bearer ${token}` }
        })
          .then(response => {
            setAvailablePreferences(response.data);
            setLoading(false);
          })
          .catch(error => {
            console.error('Error fetching preferences:', error);
            setLoading(false);
          });
      }, []);
    
      const handlePreferenceSelect = async (prefId) => {
        const newPreferences = formData.preferences.includes(prefId)
          ? formData.preferences.filter(id => id !== prefId)
          : [...formData.preferences, prefId];
    
        setFormData({ ...formData, preferences: newPreferences });
    
        // Update tourist preferences in backend
        try {
          const token = localStorage.getItem('token');
          await axios.put('http://localhost:3000/api/tourist/update', 
            { preferences: newPreferences },
            { headers: { Authorization: `Bearer ${token}` }}
          );
        } catch (error) {
          console.error('Error updating preferences:', error);
        }
      };
    
  
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-center">What interests you?</h2>
        {loading ? (
          <div className="text-center">Loading preferences...</div>
        ) : (
          <div className="grid grid-cols-3 gap-4">
            {availablePreferences.map((pref) => (
              <button
                key={pref._id}
                onClick={() => {
                  const newPreferences = formData.preferences.includes(pref._id)
                    ? formData.preferences.filter(id => id !== pref._id)
                    : [...formData.preferences, pref._id];
                  setFormData({ ...formData, preferences: newPreferences });
                }}
                className={`p-3 rounded-lg border transition-colors ${
                  formData.preferences.includes(pref._id)
                    ? 'bg-blue-500 text-white'
                    : 'bg-white hover:bg-gray-50'
                }`}
              >
                {pref.Name}
              </button>
            ))}
          </div>
        )}
        {errors.preferences && (
          <p className="text-red-500 text-center">{errors.preferences}</p>
        )}
        <button
          onClick={() => { onNext(); handlePreferenceSelect(); }}
          className="w-full bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600"
        >
          Continue
        </button>
      </div>
    );
  };
  
  // Updated AccommodationStep
  const AccommodationStep = ({ onNext, navigate }) => {
   // Add to Accommodation and Activities steps
    // const [isBookingComplete, setIsBookingComplete] = useState(false);
    const handleSelection = (type) => {
        // Set these after navigation to prevent immediate redirect
        navigate(`/tourist/${type}`);
        setTimeout(() => {
            localStorage.setItem('selectedAccommodation', type);
            localStorage.setItem('returnToGuide', 'true');
            localStorage.setItem('guideStep', '3');
        }, 100);
    };
    
      useEffect(() => {
        // Check if returning from booking
        const completedBooking = localStorage.getItem('completedBooking');
        if (completedBooking) {
          localStorage.removeItem('completedBooking');
          onNext(); // Move to next step
        }
      }, []);
    
  
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-center">Find Your Perfect Stay</h2>
        <div className="grid grid-cols-2 gap-4">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="p-6 border rounded-lg cursor-pointer hover:shadow-lg"
            onClick={() => handleSelection('hotel')}
          >
            <div className="text-3xl mb-2">🏨</div>
            <h3 className="text-xl font-semibold">Hotels</h3>
            <p className="text-gray-600">Find comfortable hotels in your destination</p>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="p-6 border rounded-lg cursor-pointer hover:shadow-lg"
            onClick={() => handleSelection('flight')}
          >
            <div className="text-3xl mb-2">✈️</div>
            <h3 className="text-xl font-semibold">Flights</h3>
            <p className="text-gray-600">Book your travel arrangements</p>
          </motion.div>
        </div>
        <button
          onClick={onNext}
          className="w-full bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600"
        >
          Skip to Activities
        </button>
      </div>
    );
  };
  
  // Updated ActivitiesStep
  const ActivitiesStep = ({ onNext, navigate }) => {
    // Add to Accommodation and Activities steps
    const handleSelection = (type) => {
        // Set these after navigation to prevent immediate redirect
        navigate(`/tourist/${type}`);
        setTimeout(() => {
            localStorage.setItem('selectedAccommodation', type);
            localStorage.setItem('returnToGuide', 'true');
            localStorage.setItem('guideStep', '4');
        }, 100);
    };


      useEffect(() => {
        const completedBooking = localStorage.getItem('completedBooking');
        if (completedBooking) {
          localStorage.removeItem('completedBooking');
          onNext();
        }
      }, []);

  
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-center">Discover Experiences</h2>
        <div className="grid grid-cols-2 gap-4">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="p-6 border rounded-lg cursor-pointer hover:shadow-lg"
            onClick={() => handleSelection('activities')}
          >
            <div className="text-3xl mb-2">🎯</div>
            <h3 className="text-xl font-semibold">Activities</h3>
            <p className="text-gray-600">Explore local experiences and adventures</p>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="p-6 border rounded-lg cursor-pointer hover:shadow-lg"
            onClick={() => handleSelection('itineraries')}
          >
            <div className="text-3xl mb-2">🗺️</div>
            <h3 className="text-xl font-semibold">Guided Tours</h3>
            <p className="text-gray-600">Join expert-led tours and itineraries</p>
          </motion.div>
        </div>

        <button
      onClick={onNext}
      className="w-full bg-green-500 text-white p-3 rounded-lg hover:bg-green-600"
    >
      Continue to Complete Profile
    </button>

      </div>
    );
  };


  const CompleteProfileStep = ({ onNext, navigate }) => {
    const handleComplete = () => {
      // Clear guide-related localStorage
      localStorage.removeItem('guideStep');
      localStorage.removeItem('guideFormData');
      localStorage.removeItem('selectedAccommodation');
      localStorage.removeItem('selectedActivity');
      localStorage.removeItem('guideInProgress');
      
      navigate('/tourist');
    };

    const handleCompleteAndVeiw = () => {
        // Clear guide-related localStorage
        localStorage.removeItem('guideStep');
        localStorage.removeItem('guideFormData');
        localStorage.removeItem('selectedAccommodation');
        localStorage.removeItem('selectedActivity');
        localStorage.removeItem('guideInProgress');
        
        navigate('/tourist/bookings');
      };
  
    return (
      <div className="space-y-6 text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="text-6xl mb-4"
        >
          🎉
        </motion.div>
        <h2 className="text-2xl font-bold">Your Journey Begins!</h2>
        <p className="text-gray-600">
          Your profile is all set up and your preferences are saved. 
          Ready to start exploring?
        </p>
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={handleCompleteAndVeiw}
            className="w-full bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600"
          >
            View My Bookings
          </button>
          <button
            onClick={handleComplete}
            className="w-full bg-green-500 text-white p-3 rounded-lg hover:bg-green-600"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  };
  



export default InteractiveVacationGuide;