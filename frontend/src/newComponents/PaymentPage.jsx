import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe('pk_test_51QQE5lLqT0OYAIAtEKYXh2ZrCORwaaPa5mWlobi9P15dciDkJPoUK600T46RWNdhPdsRz8CexT7AFxYxCiL1I22Y00ez7Gjoxd');

const getAuthHeaders = () => {
  return {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`
    }
  };
};

const CheckoutForm = ({ baseUrl }) => {
  const stripe = useStripe();
  const elements = useElements();
  const location = useLocation();
  const { total, address } = location.state || { total: 0, address: {} };

  const [paymentMethod, setPaymentMethod] = useState('card');


  const handlePaymentMethodChange = (e) => {
    setPaymentMethod(e.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    try {
      const response = await axios.patch(`${baseUrl}/pay`, {
        total,
        paymentMethod,
        currency: 'usd'
      }, getAuthHeaders());

      if (response.status !== 201) {
        throw new Error('Payment initiation failed');
      }

      if (paymentMethod === 'card') {
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
          if (result.paymentIntent.status === 'succeeded') {
            console.log('Payment succeeded');
          }
        }
      } else if (paymentMethod === 'wallet') {
        console.log('Payment succeeded with wallet');
      } else if (paymentMethod === 'cash') {
        console.log('Cash on delivery selected');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="paymentMethod">Choose Payment Method:</label>
        <select id="paymentMethod" value={paymentMethod} onChange={handlePaymentMethodChange}>
          <option value="card">Card</option>
          <option value="wallet">Wallet</option>
          <option value="cash">Cash on Delivery</option>
        </select>
      </div>
      {paymentMethod === 'card' && <CardElement />}
      <button type="submit" disabled={!stripe}>Submit Payment</button>
    </form>
  );
};

const PaymentPage = ({ baseUrl }) => (
  <Elements stripe={stripePromise}>
    <CheckoutForm baseUrl={baseUrl} />
  </Elements>
);

export default PaymentPage;