import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [userType, setUserType] = useState("");

  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    if (validate()) {
      axios.post("http://localhost:3000/api/login", { username, password })
        .then(res => {
          const token = res.data.token;
          setUserType(res.data.userType);
          if (res.data.userType === "admin") {
            navigate("/admin");
          } else if (res.data.userType === "tourismGovernor") {
            navigate("/tourismGovernor");
          } else if (res.data.userType === "seller") {
            navigate("/seller");
          } else if (res.data.userType === "tourGuide") {
            navigate("/tourGuide");
          } else if (res.data.userType === "advertiser") {
            navigate("/advertiser");
          } else if (res.data.userType === "tourist") {
            navigate("/tourist");
          }
          localStorage.setItem('token', token);
        }).catch(err => console.log(err));
    }
  };

  const validate = () => {
            axios.post("http://localhost:3000/api/login",{
                username,
                password
            }).then(res =>{
                const token = res.data.token;
                console.log(res.data);
                setUserType(res.data.userType);
                
                if(res.data.userType === "admin"){
                    navigate("/admin", {state: {user: res.data.userType}});
                }else if(res.data.userType === "tourismGovernor"){
                    navigate("/tourismGovernor", {state: {user: res.data.userType}});
                }else if(res.data.userType === "seller"){
                  navigate("/seller", {state: {user: res.data.userType}});
                }else if(res.data.userType === "tourGuide"){
                  navigate("/tourGuide", {state: {user: res.data.userType}});
                }else if(res.data.userType === "advertiser"){
                  navigate("/advertiser", {state: {user: res.data.userType}});
                }else if(res.data.userType === "tourist"){
                  navigate("/tourist", {state: {user: res.data.userType}});
                }
                
                localStorage.setItem('token', token);
            }).catch(err => console.log(err));


        }


    const validate1 = () => {
      const errors = {};
      if (username.trim() === '') {
        errors.username = 'Username is required';
      }
      if (password.trim() === '') {
        errors.password = 'Password is required';
      } else if (password.length < 8) {
        errors.password = 'Password must be at least 8 characters long';
      }
      setErrors(errors);
      return Object.keys(errors).length === 0;
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <form onSubmit={handleSubmit} className="w-1/3 mx-auto p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center text-gray-900">Login</h1>
        <div className="mb-5">
          <label htmlFor="username" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Username</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
            placeholder="Enter your username"
          />
          {errors.username && <div className="text-xs text-red-500">{errors.username}</div>}
        </div>
        <div className="mb-5">
          <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
            placeholder="Enter your password"
          />
          {errors.password && <div className="text-xs text-red-500">{errors.password}</div>}
        </div>
        <button
          type="submit"
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          Login
        </button>
        <div className="flex justify-center text-sm text-gray-500">
          <p>Don't have an account?</p>
          <p
            className="ml-1 font-bold text-gray-800 cursor-pointer"
            onClick={() => { navigate("/signup"); }}
          >
            Sign Up
          </p>
        </div>
        <div className="flex justify-center text-sm text-gray-500">
          <a href="#" onClick={() => navigate('/forgot-password')} className="text-blue-500 hover:underline">
            Forgot Password?
          </a>
        </div>
        <div className="flex justify-center text-sm text-gray-500">
            <a href="" onClick={() => navigate('/')} className="text-blue-500 hover:underline">
          Back to Home
            </a>
        </div>
      </form>
    </div>
  );
}

export default Login;
