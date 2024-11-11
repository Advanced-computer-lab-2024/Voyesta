import React, { useState } from 'react';
import axios from 'axios';

const AdditionalInfoForm = ({ userType, user, fetchUser}) => {
  const [errors, setErrors] = useState({});
  const [updatedUser, setUser] = useState(user);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    // console.log(name, value);
    setUser({ ...updatedUser, [name]: value });
  };

  const getAuthHeader = () => {
    return {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()){
      axios.put(`http://localhost:3000/api/${userType}/update`, updatedUser, getAuthHeader())
      .then(res => {console.log(res);fetchUser();})
      .catch(e => console.log(e));
    }

  }


  const validateForm = () => {
    let formErrors = {};
    let isValid = true;

    if (userType === 'tourGuide') {
      if (!updatedUser.mobileNumber) {
        isValid = false;
        formErrors.mobileNumber = 'Mobile Number is required';
      }
      if (!updatedUser.yearsOfExperience) {
        isValid = false;
        formErrors.yearsOfExperience = 'Years of Experience is required';
      }
    } else if (userType === 'seller') {
      if (!updatedUser.name) {
        isValid = false;
        formErrors.name = 'Name is required';
      }
      if (!updatedUser.description) {
        isValid = false;
        formErrors.description = 'Description is required';
      }
    } else if (userType === 'advertiser') {
      if (!updatedUser.website) {
        isValid = false;
        formErrors.website = 'Link to My Website is required';
      }
      if (!updatedUser.hotline) {
        isValid = false;
        formErrors.hotline = 'Hotline is required';
      }
      if (!updatedUser.companyProfile) {
        isValid = false;
        formErrors.companyProfile = 'Company Profile is required';
      }
    }

    setErrors(formErrors);
    return isValid;
  };

  const renderAdditionalFields = () => {
    switch (userType) {
      case 'tourGuide':
        return (
          <>
            <div>
              <label htmlFor="mobileNumber" className="block text-sm font-medium text-gray-700">Mobile Number</label>
              <input
                type="text"
                id="mobileNumber"
                name="mobileNumber"
                value={updatedUser.mobileNumber || ''}
                onChange={handleInputChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 w-full"
              />
              {errors.mobileNumber && <p className="text-red-500 text-xs">{errors.mobileNumber}</p>}
            </div>
            <div>
              <label htmlFor="yearsOfExperience" className="block text-sm font-medium text-gray-700">Years of Experience</label>
              <input
                type="number"
                id="yearsOfExperience"
                name="yearsOfExperience"
                value={updatedUser.yearsOfExperience || ''}
                onChange={handleInputChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 w-full"
              />
              {errors.yearsOfExperience && <p className="text-red-500 text-xs">{errors.yearsOfExperience}</p>}
            </div>
            <div>
              <label htmlFor="previousWork" className="block text-sm font-medium text-gray-700">Previous Work</label>
              <textarea
                id="previousWork"
                name="previousWork"
                value={updatedUser.previousWork || ''}
                onChange={handleInputChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 w-full"
              />
            </div>
          </>
        );
      case 'seller':
        return (
          <>
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={updatedUser.name || ''}
                onChange={handleInputChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 w-full"
              />
              {errors.name && <p className="text-red-500 text-xs">{errors.name}</p>}
            </div>
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                id="description"
                name="description"
                value={updatedUser.description || ''}
                onChange={handleInputChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 w-full"
              />
              {errors.description && <p className="text-red-500 text-xs">{errors.description}</p>}
            </div>
          </>
        );
      case 'advertiser':
        return (
          <>
            <div>
              <label htmlFor="website" className="block text-sm font-medium text-gray-700">Link to My Website</label>
              <input
                type="text"
                id="website"
                name="website"
                value={updatedUser.website || ''}
                onChange={handleInputChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 w-full"
              />
              {errors.website && <p className="text-red-500 text-xs">{errors.website}</p>}
            </div>
            <div>
              <label htmlFor="hotline" className="block text-sm font-medium text-gray-700">Hotline</label>
              <input
                type="text"
                id="hotline"
                name="hotline"
                value={updatedUser.hotline || ''}
                onChange={handleInputChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 w-full"
              />
              {errors.hotline && <p className="text-red-500 text-xs">{errors.hotline}</p>}
            </div>
            <div>
              <label htmlFor="companyProfile" className="block text-sm font-medium text-gray-700">Company Profile</label>
              <textarea
                id="companyProfile"
                name="companyProfile"
                value={updatedUser.companyProfile || ''}
                onChange={handleInputChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 w-full"
              />
              {errors.companyProfile && <p className="text-red-500 text-xs">{errors.companyProfile}</p>}
            </div>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <>
    (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
            <div className="bg-white shadow-lg rounded-lg p-8 max-w-lg text-center">
                <h1 className="text-4xl font-bold text-gray-800 mb-4">Additional Information</h1>
                <form onSubmit={handleSubmit} className="space-y-4">
                {renderAdditionalFields()}
                <button
                    type="submit"
                    className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
                >
                    Submit Info
                </button>
                </form>
                
            </div>
        </div>
    ) 
    </>
  );
};

export default AdditionalInfoForm;