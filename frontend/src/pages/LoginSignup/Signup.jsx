import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import TouristSignup from './TouristSignup';

function Signup() {
  const [user, setUser] = useState({ username: '', email: '', password: '', userType: '' });
  const [errors, setErrors] = useState({});
  const [signedUp, setSignedUp] = useState(false);
  const [touristSignup, setTouristSignup] = useState(false);

  const navigate = useNavigate();

  const validate = () => {
    const errors = {};
    if (user.username.trim() === '') {
      errors.username = 'Username is required';
    }
    if (user.email.trim() === '') {
      errors.email = 'Email is required';
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(user.email)) {
      errors.email = 'Invalid email address';
    }
    if (user.password.trim() === '') {
      errors.password = 'Password is required';
    } else if (user.password.length < 8) {
      errors.password = 'Password must be at least 8 characters long';
    }
    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!validate())
      return;

    if(user.userType === 'tourist') {
      setSignedUp(true);
      setTouristSignup(true);
    }
    else{
      handleOthersSignup();
    }
    
  };

  const handleOthersSignup = () => {
    setSignedUp(true);
    axios.post(`http://localhost:3000/api/${user.userType}/add`, { username: user.username, email: user.email, password: user.password })
    .then(res => {
      console.log(res);
      localStorage.setItem('token', res.data.token);
      navigate(`/${user.userType}`);
    })
    .catch(e => console.log(e));

  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  return (
    <>
      {!signedUp && <div className="relative text-center bg-white shadow rounded p-3 w-2/5 mx-auto">
        <h1 className="text-2xl text-gray-600 font-bold mb-3">Signup</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700">
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={user.username}
              onChange={handleInputChange}
              className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 w-full"
              required
            />
            {errors.username && <div className="text-red-500 text-xs">{errors.username}</div>}
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={user.email}
              onChange={handleInputChange}
              className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 w-full"
              required
            />
            {errors.email && <div className="text-red-500 text-xs">{errors.email}</div>}
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={user.password}
              onChange={handleInputChange}
              className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 w-full"
              required
            />
            {errors.password && <div className="text-red-500 text-xs">{errors.password}</div>}
            <div>
            <label htmlFor="userType" className="block text-sm font-medium text-gray-700">
              Signup as ?
            </label>
            <select
              id="userType"
              name="userType"
              value={user.userType}
              onChange={handleInputChange}
              className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 w-full"
              required
            >
              <option value="" disabled>Select user type</option>
              <option value="tourist">Tourist</option>
              <option value="tourGuide">Tour Guide</option>
              <option value="seller">Seller</option>
              <option value="advertiser">Advertiser</option>
            </select>
            {errors.userType && <div className="text-red-500 text-xs">{errors.userType}</div>}
            </div>
          </div>
          <button
            type="submit"
            className="bg-blue-500 text-white rounded-lg p-2 mt-4 hover:bg-blue-700"
          >
            Signup
          </button>
        </form>
      </div>}

      {
        touristSignup && <TouristSignup user={user} />
      }

      
    </>
  );
}

export default Signup;