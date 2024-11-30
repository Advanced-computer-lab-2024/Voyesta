import React, { useState } from 'react';
import { useLocation , useNavigate } from 'react-router-dom';
import axios from 'axios';
const CheckOutPage = ({baseUrl}) => {
  const location = useLocation();
  const { total } = location.state || { total: 0 };

  const taxRate = 0.10;
  const tax = total * taxRate;
  const grandTotal = total + tax;

  // State for form fields
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    city: '',
    state: '',
    zip: '',
  });

  const getAuthHeaders = () => {
    return {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    }
  };

  // Handle input change
  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = `${baseUrl}/createAddress`;
      const response = await axios.post(url, formData, getAuthHeaders());
      if (response.status !== 201) {
        throw new Error('Failed to create address');
      }
      const result = response.data;
      console.log('Address created successfully:', result);
       // Navigate to PaymentPage with necessary information
       navigate('/payment', {
        state: {
          total: grandTotal,
          address: formData,
        }
      });
      // Optionally reset form or navigate to another page
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <section className="bg-blue-100 py-8 antialiased dark:bg-gray-900 md:py-16">
      <form onSubmit={handleSubmit} className="mx-auto max-w-screen-xl px-4 2xl:px-0">
        <ol className="items-center flex w-full max-w-2xl text-center text-sm font-medium text-gray-500 dark:text-gray-400 sm:text-base">
          <li className="after:border-1 flex items-center text-blue-700 after:mx-6 after:hidden after:h-1 after:w-full after:border-b after:border-gray-200 dark:text-blue-500 dark:after:border-gray-700 sm:after:inline-block sm:after:content-[''] md:w-full xl:after:mx-10">
            <span className="flex items-center after:mx-2 after:text-gray-200 after:content-['/'] dark:after:text-gray-500 sm:after:hidden">
              <svg className="me-2 h-4 w-4 sm:h-5 sm:w-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.5 11.5 11 14l4-4m6 2a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
              </svg>
              Cart
            </span>
          </li>

          <li className="after:border-1 flex items-center text-blue-700 after:mx-6 after:hidden after:h-1 after:w-full after:border-b after:border-gray-200 dark:text-blue-500 dark:after:border-gray-700 sm:after:inline-block sm:after:content-[''] md:w-full xl:after:mx-10">
            <span className="flex items-center after:mx-2 after:text-gray-200 after:content-['/'] dark:after:text-gray-500 sm:after:hidden">
              <svg className="me-2 h-4 w-4 sm:h-5 sm:w-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.5 11.5 11 14l4-4m6 2a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
              </svg>
              Checkout
            </span>
          </li>

          <li className="flex shrink-0 items-center">
            <svg className="me-2 h-4 w-4 sm:h-5 sm:w-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.5 11.5 11 14l4-4m6 2a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>
            Order Summary
          </li>
        </ol>
        <div className="flex flex-col lg:flex-row lg:items-start lg:gap-12 xl:gap-16">
          <div className="min-w-0 flex-1 space-y-8">
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Delivery Details</h3>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {['name', 'email', 'address', 'city', 'state', 'zip'].map((field) => (
                  <div key={field}>
                    <label
                      htmlFor={field}
                      className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                    >
                      {field.charAt(0).toUpperCase() + field.slice(1)}
                    </label>
                    <input
                      type="text"
                      id={field}
                      value={formData[field]}
                      onChange={handleChange}
                      className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                      required
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="mt-6 w-full space-y-6 lg:mt-0 lg:max-w-xs xl:max-w-md">
            <div className="flow-root">
              <div className="-my-3 divide-y divide-gray-200 dark:divide-gray-800">
                <dl className="flex items-center justify-between gap-4 py-3">
                  <dt className="text-base font-normal text-gray-500 dark:text-gray-400">Subtotal</dt>
                  <dd className="text-base font-medium text-gray-900 dark:text-white">${total.toFixed(2)}</dd>
                </dl>
                <dl className="flex items-center justify-between gap-4 py-3">
                  <dt className="text-base font-normal text-gray-500 dark:text-gray-400">Tax (10%)</dt>
                  <dd className="text-base font-medium text-gray-900 dark:text-white">${tax.toFixed(2)}</dd>
                </dl>
                <dl className="flex items-center justify-between gap-4 py-3">
                  <dt className="text-base font-bold text-gray-900 dark:text-white">Total</dt>
                  <dd className="text-base font-bold text-gray-900 dark:text-white">${grandTotal.toFixed(2)}</dd>
                </dl>
              </div>
            </div>
            <div className="space-y-3">
              <button type="submit" className="flex w-full items-center justify-center rounded-lg bg-blue-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                Proceed to Payment
              </button>
              <p className="text-sm font-normal text-gray-500 dark:text-gray-400">
                One or more items in your cart require an account. <a href="#" title="" className="font-medium text-blue-700 underline hover:no-underline dark:text-blue-500">Sign in or create an account now.</a>.
              </p>
            </div>
          </div>
        </div>
      </form>
    </section>
  );
};

export default CheckOutPage;
