import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import '../css/payment.css';

import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe("pk_test_51QQE5lLqT0OYAIAtEKYXh2ZrCORwaaPa5mWlobi9P15dciDkJPoUK600T46RWNdhPdsRz8CexT7AFxYxCiL1I22Y00ez7Gjoxd");

const getAuthHeaders = () => {
  return {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  };
};

const CheckoutForm = ({ baseUrl }) => {
  const stripe = useStripe();
  const elements = useElements();
  const location = useLocation();
  const { total, address: passedAddress } = location.state || { total: 0, address: null };

  const [paymentMethod, setPaymentMethod] = useState("card");
  const [address, setAddress] = useState(
    passedAddress || {
      name: "",
      email: "",
      address: "",
      city: "",
      state: "",
      zip: "",
    }
  );
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAddress({ ...address, [name]: value });
  };

  const validateAddress = () => {
    const newErrors = {};
    if (!address.name) newErrors.name = "Name is required.";
    if (!address.email) newErrors.email = "Email is required.";
    if (!address.address) newErrors.address = "Address is required.";
    if (!address.city) newErrors.city = "City is required.";
    if (!address.state) newErrors.state = "State is required.";
    if (!address.zip) newErrors.zip = "ZIP code is required.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePaymentMethodChange = (e) => {
    setPaymentMethod(e.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (paymentMethod === "card" && !validateAddress()) {
      return;
    }

    if (!stripe || !elements) {
      return;
    }

    try {
      const response = await axios.patch(
        `${baseUrl}/pay`,
        {
          total,
          paymentMethod,
          currency: "usd",
        },
        getAuthHeaders()
      );

      if (response.status !== 201) {
        throw new Error("Payment initiation failed");
      }

      if (paymentMethod === "card") {
        const { clientSecret } = response.data;

        const result = await stripe.confirmCardPayment(clientSecret, {
          payment_method: {
            card: elements.getElement(CardElement),
            billing_details: {
              name: address.name,
              email: address.email,
              address: {
                line1: address.address,
                city: address.city,
                state: address.state,
                postal_code: address.zip,
              },
            },
          },
        });

        if (result.error) {
          console.error(result.error.message);
        } else {
          if (result.paymentIntent.status === "succeeded") {
            console.log("Payment succeeded");
          }
        }
      } else if (paymentMethod === "wallet") {
        console.log("Payment succeeded with wallet");
      } else if (paymentMethod === "cod") {
        console.log("Cash on delivery selected");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="checkout-form">
      <div className="form-section">
        <label htmlFor="paymentMethod">Choose Payment Method:</label>
        <select
          id="paymentMethod"
          value={paymentMethod}
          onChange={handlePaymentMethodChange}
          className="form-select"
        >
          <option value="card">Card</option>
          <option value="wallet">Wallet</option>
          <option value="cod">Cash on Delivery</option>
        </select>
      </div>

      {(paymentMethod === "card" || !passedAddress) && (
        <div className="form-section">
          <h3>Billing Address</h3>
          <div className="form-group">
            <label>Name</label>
            <input
              type="text"
              name="name"
              value={address.name}
              onChange={handleInputChange}
              className="form-input"
            />
            {errors.name && <small className="error">{errors.name}</small>}
          </div>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={address.email}
              onChange={handleInputChange}
              className="form-input"
            />
            {errors.email && <small className="error">{errors.email}</small>}
          </div>
          <div className="form-group">
            <label>Address</label>
            <input
              type="text"
              name="address"
              value={address.address}
              onChange={handleInputChange}
              className="form-input"
            />
            {errors.address && <small className="error">{errors.address}</small>}
          </div>
          <div className="form-group">
            <label>City</label>
            <input
              type="text"
              name="city"
              value={address.city}
              onChange={handleInputChange}
              className="form-input"
            />
            {errors.city && <small className="error">{errors.city}</small>}
          </div>
          <div className="form-group">
            <label>State</label>
            <input
              type="text"
              name="state"
              value={address.state}
              onChange={handleInputChange}
              className="form-input"
            />
            {errors.state && <small className="error">{errors.state}</small>}
          </div>
          <div className="form-group">
            <label>ZIP Code</label>
            <input
              type="text"
              name="zip"
              value={address.zip}
              onChange={handleInputChange}
              className="form-input"
            />
            {errors.zip && <small className="error">{errors.zip}</small>}
          </div>
        </div>
      )}

      {paymentMethod === "card" && (
        <div className="form-section">
          <h3>Card Details</h3>
          <CardElement className="card-element" />
        </div>
      )}

      <button type="submit" className="submit-button" disabled={!stripe}>
        Submit Payment
      </button>
    </form>
  );
};

const PaymentPage = ({ baseUrl }) => (
  <Elements stripe={stripePromise}>
    <CheckoutForm baseUrl={baseUrl} />
  </Elements>
);

export default PaymentPage;
