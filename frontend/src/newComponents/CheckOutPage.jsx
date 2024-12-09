// Desc: Checkout page for the tourist to enter delivery details and proceed to payment
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const CheckOutPage = ({ baseUrl }) => {
  const location = useLocation();
  const { total, details, cartItems } = location.state || { total: 0, details: [] };
  const { bookingId } = location.state || { bookingId: '' };
  const previousPage = location.state?.from || 'unknown'; // can be 'bookings' or 'cart'
  // console.log('Checkout page from:', previousPage);
  const taxRate = 0.10;
  const tax = total * taxRate;
  // const grandTotal = total + tax;
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    city: '',
    state: '',
    zip: '',
  });

  const [savedAddresses, setSavedAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState('');
  const [isDuplicateAddress, setIsDuplicateAddress] = useState(false);
  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [grandTotal, setGrandTotal] = useState(total + tax);
  const [newTotal, setNewTotal] = useState(grandTotal);

  const getAuthHeaders = () => ({
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

  const fetchSavedAddresses = async () => {
    try {
      const response = await axios.get(`${baseUrl}/getAddresses`, getAuthHeaders());
      if (response.status === 200) {
        setSavedAddresses(response.data);
      }
    } catch (error) {
      console.error('Error fetching saved addresses:', error);
    }
  };

  useEffect(() => {
    fetchSavedAddresses();
  }, []);

  

  const handleChange =  (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => {
      const newFormData = { ...prevData, [id]: value };
      checkForDuplicateAddress(newFormData);
      return newFormData;
    });
  };


  const checkForDuplicateAddress =  (newFormData) => {
    const isDuplicate = savedAddresses.some((address) =>
      address.name === newFormData.name &&
      address.email === newFormData.email &&
      address.address === newFormData.address &&
      address.city === newFormData.city &&
      address.state === newFormData.state &&
      address.zip === newFormData.zip
    );
    console.log('Checking for duplicate address:', newFormData, 'Duplicate found:', isDuplicate);
    setIsDuplicateAddress(isDuplicate);
  };





  const handleAddressSelect = (id) => {
    setSelectedAddressId(id);
    const selectedAddress = savedAddresses.find((address) => address._id === id);
    if (selectedAddress) {
      setFormData({
        name: selectedAddress.name,
        email: selectedAddress.email,
        address: selectedAddress.address,
        city: selectedAddress.city,
        state: selectedAddress.state,
        zip: selectedAddress.zip,
      });
      setIsDuplicateAddress(true); // Set to true to prevent adding duplicate address
    }
    // window.location.reload();
    // window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAddNewAddress = async () => {
    if (isDuplicateAddress) {
      console.log('Duplicate address found. Cannot add new address.');
      return;
    }

    // Check if any field is empty
    for (const field in formData) {
      if (!formData[field]) {
        alert('Please fill in all fields');
        return;
      }
    }
  
    // Check for duplicates manually
    const isDuplicate = savedAddresses.some((address) =>
      address.name === formData.name &&
      address.email === formData.email &&
      address.address === formData.address &&
      address.city === formData.city &&
      address.state === formData.state &&
      address.zip === formData.zip
    );
  
    if (isDuplicate) {
      setIsDuplicateAddress(true);
      console.log('Duplicate address found. Cannot add new address.');
      return;
    }
  
    try {
      const url = `${baseUrl}/createAddress`;
      const response = await axios.post(url, formData, getAuthHeaders());
      if (response.status === 201) {
        console.log('Address created successfully:', response.data);
        fetchSavedAddresses(); // Refresh the address list
        setIsDuplicateAddress(false); // Reset duplicate check after success
      }
    } catch (error) {
      console.error('Error adding new address:', error);
    }
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (previousPage === 'bookings') {
      navigate('/tourist/payment', {
        state: {
          from: 'bookings',
          total: grandTotal,
          address: formData,
          bookingId: bookingId,
        },
      });
        

    } else {
      navigate('/tourist/payment', {
        state: {
          from: 'cart',
          total: grandTotal,
          address: formData,
          details: details,
          cartItems: cartItems,
        },
      });
    }
  };

  const handleApplyPromoCode = async () => {
    try {
      const response = await axios.post('http://localhost:3000/api/tourist/redeemPromoCode', { code: promoCode }, getAuthHeaders());
      if (response.data && response.data.discount) {
        const discountAmount = (grandTotal * response.data.discount) / 100;
        const updatedTotal = grandTotal - discountAmount;
        setDiscount(discountAmount);
        setNewTotal(updatedTotal);
        setGrandTotal(updatedTotal); // Update the grand total
      } else {
        // Handle case where promo code is invalid or no discount is returned
        alert('Invalid promo code or no discount available');
      }
    } catch (error) {
      console.error('Error applying promo code:', error);
      alert('Error applying promo code');
    }
  };

  return (
    <section className="bg-blue-100 py-8 antialiased dark:bg-gray-900 md:py-16">
      <form onSubmit={handleSubmit} className="mx-auto flex max-w-screen-xl flex-col gap-8 px-4 lg:flex-row 2xl:px-0">
        {/* Left Section: Form */}
        <div className="flex-1 space-y-8">
          <div className="space-y-4">
             <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{previousPage === 'bookings' ? 'Billing Details' : 'Delivery Details'}</h3> {/*this */}
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
          <div className="flex items-center justify-between gap-4">
            <div className="w-1/2">
              <label htmlFor="savedAddress" className="block text-sm font-medium text-gray-900 dark:text-white">
                Saved Addresses
              </label>
              <select
                id="savedAddress"
                value={selectedAddressId}
                onChange={(e) => handleAddressSelect(e.target.value)}
                className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
              >
                <option value="" disabled selected>Select a saved address</option> 
                {savedAddresses.length > 0 ? (
                  savedAddresses.map((address) => (
                    <option key={address._id} value={address._id}>
                      {address.address}, {address.city}, {address.state}, {address.zip}
                    </option>
                  ))
                ) : (
                  <option value="" disabled>No saved addresses found</option>
                )}
              </select>
            </div>
            <button
                 type="button"
                 onClick={handleAddNewAddress}
                 className={`mt-4 w-1/2 rounded-lg py-2 px-4 text-sm font-semibold shadow-md transition duration-200 
                     ${isDuplicateAddress ? 'bg-gray-400 cursor-not-allowed' : 'bg-gray-600 text-white hover:bg-gray-700'}`}
                 disabled={isDuplicateAddress} // Disable the button if duplicate
            >
           Add New Address
          </button>

          </div>
        </div>

    {/* Right Section: Payment Summary */}
<div className="mt-6 w-full space-y-6 lg:mt-20 lg:max-w-xs xl:max-w-md">
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
      {discount > 0 && (
        <dl className="flex items-center justify-between gap-4 py-3">
            <dt className="text-base font-normal text-gray-500 dark:text-gray-400">Discount:</dt> 
            <dd className="text-base font-medium text-gray-900 dark:text-white">${discount.toFixed(2)}</dd>
        </dl>
      )}
      <dl className="flex items-center justify-between gap-4 py-3">
        <dt className="text-base font-bold text-gray-900 dark:text-white">Total</dt>
        <dd className="text-base font-bold text-gray-900 dark:text-white">${grandTotal.toFixed(2)}</dd>
      </dl>
    </div>
  </div>

{/* Promo Code Input with Button Inside */}
<div>
  <label
    htmlFor="promoCode"
    className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
  >
    Promo Code
  </label>
  <div className="relative">
    <input
      type="text"
      id="promoCode"
      value={promoCode}
      onChange={(e) => setPromoCode(e.target.value)}
      placeholder="Enter your promo code"
      className="w-full rounded-lg bg-gray-50 p-2.5 pr-20 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:ring-blue-500"
    />
    <button
      type="button"
      onClick={handleApplyPromoCode}
      className="absolute right-2 top-1/2 -translate-y-1/2 bg-transparent px-4 py-1 text-sm font-semibold text-blue-600 hover:text-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
    >
      Apply
    </button>
  </div>
</div>



  {/* Proceed to Payment Button */}
  <button
    type="submit"
    className="w-full rounded-lg bg-blue-600 py-3 text-sm font-semibold text-white shadow-md transition duration-200 hover:bg-blue-700"
  >
    Proceed to Payment
  </button>
</div>

      </form>
    </section>
  );
};

export default CheckOutPage;
