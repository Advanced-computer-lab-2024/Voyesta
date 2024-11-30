import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import GoogleMaps from './GoogleMaps';

const CheckOutPage1 = () => {
  const location = useLocation();
  const { total } = location.state || { total: 0 };
  const [address, setAddress] = useState('');

  const taxRate = 0.10;
  const tax = total * taxRate;
  const grandTotal = total + tax;

  return (
    <div>
      <h2>Checkout</h2>
      <p>Total: ${total.toFixed(2)}</p>
      <p>Tax: ${tax.toFixed(2)}</p>
      <p>Grand Total: ${grandTotal.toFixed(2)}</p>

      <div className="mt-4">
        <label htmlFor="address" className="block text-sm font-medium text-gray-700">Delivery Address</label>
        <input
          type="text"
          id="address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>
      <GoogleMaps setAddress={setAddress} />
    </div>
  );
};

export default CheckOutPage1;