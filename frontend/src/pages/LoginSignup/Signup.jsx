import React, { useState } from 'react';
import TouristSignup from './TouristSignUp';
import axios from 'axios';
import { Navigate } from 'react-router-dom';
import TourGuideNavbar from '../../components/tourGuideComponents/TourGuideNavbar';
import { useNavigate } from 'react-router-dom';

function Signup() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [signedUp, setSignedUp] = useState(false);   
  const [userType, setUserType] = useState('');

  const navigate = useNavigate();

  const validate = () => {
    const errors = {};
    if (username.trim() === '') {
      errors.username = 'Username is required';
    }
    if (email.trim() === '') {
      errors.email = 'Email is required';
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email)) {
      errors.email = 'Invalid email address';
    }
    if (password.trim() === '') {
      errors.password = 'Password is required';
    } else if (password.length < 8) {
      errors.password = 'Password must be at least 8 characters long';
    }
    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (validate()) {
      // Call API to create new user
      console.log('Create new user:', { username, email, password });
      setSignedUp(true);
    }
  };

  const handleTouristSignup = ()=>{

  }

  const handleTourGuideSignup = ()=>{
    setUserType("tourGuide");
    axios.post('http://localhost:3000/api/tourGuide/add', { username, email, password })
    .then(res =>{
      console.log(res);
      const token = res.data.token;
      localStorage.setItem('token', token);
      navigate("/tourGuide");
    });
  }

  const handleSellerSignup = ()=>{

  }
  

  const handleAdvertiserSignup = ()=>{

  }


  return (
    <>
    {(!signedUp) ?
      <div className="relative text-center bg-white shadow rounded p-3 w-2/5 mx-auto">
        <h1 className="text-2xl text-gray-600 font-bold mb-3">Signup</h1>
        <form onSubmit={handleSubmit}className="flex flex-col gap-4">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700">
              Username
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 w-full"
              placeholder="Enter your username"
            />
            {errors.username && (
              <div className="text-red-500 text-xs">{errors.username}</div>
            )}
          </div>
          
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 w-full"
                placeholder="Enter your email"
            />
            {errors.email && (
                <div className="text-red-500 text-xs">{errors.email}</div>
            )}
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 w-full"
              placeholder="Enter your password"
            />
            {errors.password && (
              <div className="text-red-500 text-xs">{errors.password}</div>
            )}
          </div>

          <button
            type="submit"
            className="bg-blue-500 text-white rounded-lg p-2 mt-4 hover:bg-blue-700"
          >
            Signup
          </button>

          <div className='text-gray-500 flex flex-row justify-center text-sm gap-1 cursor-default'>
            <p>Already have an account? </p>
            <p 
              className='font-bold cursor-pointer text-gray-800'
              onClick={() => {console.log("navigate to Login");}}
            >
              Login
            </p>
          </div>
        </form>
      </div> :

      (userType === "")?
      
      <div className="relative text-center bg-white shadow rounded p-3 w-2/5 mx-auto">
        <h1 className="text-2xl text-gray-600 font-bold mb-3">What am I?</h1>
        <div className='flex flex-col gap-2'>
          <div className='flex flex-row gap-2'>
            <div 
              className='mb-2 w-1/2 p-5 mx-auto bg-blue-500 hover:bg-blue-700 text-white rounded-lg text-2xl'
              onClick={() => setUserType("tourist")}
            >
              Tourist
            </div>
            <div 
              className='mb-2 w-1/2 p-5 mx-auto bg-blue-500 hover:bg-blue-700 text-white rounded-lg text-2xl'
              onClick={() => handleTourGuideSignup()}
            >
                Tour Guide
            </div>
          </div>
          <div className='flex flex-row gap-2'>
            <div 
              className='mb-2 w-1/2 p-5 mx-auto bg-blue-500 hover:bg-blue-700 text-white rounded-lg text-2xl'
              onClick={() => setUserType("seller")}
            >
              Seller
            </div>
            <div 
              className='mb-2 w-1/2 p-5 mx-auto bg-blue-500 hover:bg-blue-700 text-white rounded-lg text-2xl'
              onClick={() => setUserType("advertiser")}
            >
              Advertiser
            </div>
          </div>
        </div>
      </div> :
      <>
        {userType === "tourist" ?
            <TouristSignup username={username} password={password} email={email}/> :
            userType === "tourGuide" ? <TourGuideNavbar username={username} password={password} email={email} /> :
            null
        }
      </>
    }
    </>
  );
}

export default Signup;
