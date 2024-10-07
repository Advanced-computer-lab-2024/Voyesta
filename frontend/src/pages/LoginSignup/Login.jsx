import axios from "axios";
import React, {useState, useEffect} from "react";
import { useNavigate } from "react-router-dom";

function Login(){
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState({});
    const [userType, setUserType] = useState("");

    const navigate = useNavigate();

    const handleSubmit = (event) => {
        event.preventDefault();
        if (validate()) {
          // Call API to create new user
            console.log('Create new user:', { username, password });

            axios.post("http://localhost:3000/api/login",{
                username,
                password
            }).then(res =>{
                const token = res.data.token;
                console.log(res.data);
                setUserType(res.data.userType);
                
                if(res.data.userType === "admin"){
                    navigate("/admin");
                }else if(res.data.userType === "tourismGovernor"){
                    navigate("/tourismGovernor");
                }
                
                localStorage.setItem('token', token);
            }).catch(err => console.log(err));


        }

        

    };

    const validate = () => {
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

    return(
        <div className="relative text-center bg-white shadow rounded p-3 w-2/5 mx-auto">
        <h1 className="text-2xl text-gray-600 font-bold mb-3">Login</h1>
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
            Login
          </button>

          {/* <div className='text-gray-500 flex flex-row justify-center text-sm gap-1 cursor-default'>
            <p>Already have an account? </p>
            <p 
              className='font-bold cursor-pointer text-gray-800'
              onClick={() => {console.log("navigate to Login");}}
            >
              Login
            </p>
          </div> */}
        </form>
      </div>
    );
}

export  default Login;
