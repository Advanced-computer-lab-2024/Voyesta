import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import TouristSignup from './TouristSignup';

function Signup() {
  const [user, setUser] = useState({ username: '', email: '', password: '', userType: '' });
  const [errors, setErrors] = useState({});
  let errorsDisplayed = '';
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

  const handleSubmit = async (event) => {
    errorsDisplayed = '';
    event.preventDefault();
    if (!validate()) return;
    try {
      setErrors({});
      const response = await axios.post('http://localhost:3000/api/check-user-exists', {
        username: user.username,
        email: user.email
      });

      if (response.data.message === 'Username or email already exists') {
        errorsDisplayed = 'Username or email already exists';
        return;
      }

      if (user.userType === 'tourist') {
        setSignedUp(true);
        setTouristSignup(true);
      } else {
        handleOthersSignup();
      }

    } catch (error) {
      console.error('There was an error checking the user!', error);
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
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  return (
    <>
      {!signedUp && (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
          <form onSubmit={handleSubmit} className="w-1/3 mx-auto p-8 space-y-6 bg-white rounded-lg shadow-md">
            <h1 className="text-2xl font-bold text-center text-gray-900">Signup</h1>
            <div className="mb-5">
              {console.log(errorsDisplayed)}
            {errorsDisplayed === 'Username or email already exists' ? (
            <>
              <label htmlFor="username-error" className="block mb-2 text-sm font-medium text-red-700 dark:text-red-500">Your name</label>
              <input
                type="text"
                id="username-error"
                name="username"
                value={user.username}
                onChange={handleInputChange}
                className="bg-red-50 border border-red-500 text-red-900 placeholder-red-700 text-sm rounded-lg focus:ring-red-500 dark:bg-gray-700 focus:border-red-500 block w-full p-2.5 dark:text-red-500 dark:placeholder-red-500 dark:border-red-500"
                placeholder="Bonnie Green"
              />
              <p className="mt-2 text-sm text-red-600 dark:text-red-500"><span className="font-medium">Oops!</span> Username already exists</p>
            </>
          ) : (
            <>
              <label htmlFor="username" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Username</label>
              <input
                type="text"
                id="username"
                name="username"
                value={user.username}
                onChange={handleInputChange}
                className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
                required
              />
            </>
          )}          
            </div>
            <div className="mb-5">
              <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={user.email}
                onChange={handleInputChange}
                className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
                required
              />
              {errors.email && <div className="text-xs text-red-500">{errors.email}</div>}
            </div>
            <div className="mb-5">
              <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={user.password}
                onChange={handleInputChange}
                className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
                required
              />
              {errors.password && <div className="text-xs text-red-500">{errors.password}</div>}
            </div>
            <div className="mb-5">
              <label htmlFor="userType" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Signup as?</label>
              <select
                id="userType"
                name="userType"
                value={user.userType}
                onChange={handleInputChange}
                className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
                required
              >
                <option value="" disabled>Select user type</option>
                <option value="tourist">Tourist</option>
                <option value="tourGuide">Tour Guide</option>
                <option value="seller">Seller</option>
                <option value="advertiser">Advertiser</option>
              </select>
              {errors.userType && <div className="text-xs text-red-500">{errors.userType}</div>}
            </div>
            <button
              type="submit"
              className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              Register New Account
            </button>
            <div className="flex justify-center text-sm text-gray-500">
              <p>Already have an account?</p>
              <p
                className="ml-1 font-bold text-gray-800 cursor-pointer"
                onClick={() => { navigate("/login"); }}
              >
                Log In
              </p>
            </div>
          </form>
        </div>
      )}

      {touristSignup && <TouristSignup user={user} />}
    </>
  );
}

export default Signup;
