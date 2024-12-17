import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function TouristSignup({user}) {

    const [mobileNumber, setMobileNumber] = useState(''); // Add a state variable for mobile number
    const [nationality, setNationality] = useState(''); // Add a state variable for nationality
    const [dob, setDob] = useState(''); // Add a state variable for date of birth
    const [jobStudent, setJobStudent] = useState('');
    const [errors, setErrors] = useState({});

    console.log(user);
    
    const navigate = useNavigate();

    const handleSubmit = (event) => {
      event.preventDefault();
      if (validate()) {
        axios.post('http://localhost:3000/api/tourist/add',{
          username: user.username, 
          email: user.email, 
          password: user.password, 
          Number: mobileNumber, 
          Nationality: nationality, 
          DOB: dob, 
          Job: jobStudent
        })
        .then(res =>{
          console.log(res);
          const token = res.data.token;
          localStorage.setItem('token', token);
          navigate("/tourist");
        })
        .catch(e => console.log(e));
      }
      
    };

    const validate = () => {
      const newErrors = {};
      let isValid = true;
  
      if (!mobileNumber) {
        newErrors.mobileNumber = 'Mobile number is required';
        isValid = false;
      } else if (!/^\d{10}$/.test(mobileNumber)) {
        newErrors.mobileNumber = 'Invalid mobile number';
        isValid = false;
      }
  
      if (!nationality) {
        newErrors.nationality = 'Nationality is required';
        isValid = false;
      }
  
      if (!dob) {
        newErrors.dob = 'Date of birth is required';
        isValid = false;
      } else if (!/^\d{4}-\d{2}-\d{2}$/.test(dob)) {
        newErrors.dob = 'Invalid date of birth';
        isValid = false;
      }
  
      if (!jobStudent) {
        newErrors.jobStudent = 'Job/Student is required';
        isValid = false;
      }
  
      setErrors(newErrors);
      return isValid;
    };

    return(
        <div className="relative text-center bg-white shadow rounded p-3 w-2/5 mx-auto">
        <h1 className="text-2xl text-gray-600 font-bold mb-3">Additional Info</h1>
        <form onSubmit={handleSubmit}className="flex flex-col gap-4">
          <div>
            <label htmlFor="mobileNumber" className="block text-sm font-medium text-gray-700">
              Mobile number
            </label>
            <input
              type="tel"
              id="mobileNumber"
              value={mobileNumber}
              onChange={(e) => {setErrors({});setMobileNumber(e.target.value)}}
              className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 w-full"
              placeholder="Enter your mobile number"
            />
            {errors.mobileNumber && (
              <div className="text-red-500 text-xs">{errors.mobileNumber}</div>
            )}
          </div>
          
          <div>
            <label htmlFor="nationality" className="block text-sm font-medium text-gray-700">
              Nationality
            </label>
            <input
                type="text"
                id="nationality"
                value={nationality}
                onChange={(e) => {setErrors({});setNationality(e.target.value)}}
                className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 w-full"
                placeholder="Enter your nationality"
            />
            {errors.nationality && (
                <div className="text-red-500 text-xs">{errors.nationality}</div>
            )}
          </div>

          <div>
            <label htmlFor="dob" className="block text-sm font-medium text-gray-700">
              Date of birthd
            </label>
            <input
              type="date"
              id="dob"
              value={dob}
              onChange={(e) =>{setErrors({}); setDob(e.target.value)}}
              className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 w-full"
              placeholder="Enter your date of birth"
            />
            {errors.dob && (
              <div className="text-red-500 text-xs">{errors.dob}</div>
            )}
          </div>

          <div>
            <label htmlFor="jobStudent" className="block text-sm font-medium text-gray-700">
              Job/Student
            </label>
            <input
              type="text"
              id="jobStudent"
              value={jobStudent}
              onChange={(e) =>{setErrors({});setJobStudent(e.target.value)}}
              className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 w-full"
              placeholder="Enter your job/student"
            />
            {errors.jobStudent && (
              <div className="text-red-500 text-xs">{errors.jobStudent}</div>
            )}
          </div>

          <button
            type="submit"
            className="bg-blue-500 text-white rounded-lg p-2 mt-4 hover:bg-blue-700"
          >
            Signup
          </button>
          <div className="flex justify-center text-sm text-gray-500">
          <a href="" onClick={() => navigate('/')} className="text-blue-500 hover:underline">
               Back to Home
          </a>
        </div>

        </form>
      </div>
    );
}

export default TouristSignup;
