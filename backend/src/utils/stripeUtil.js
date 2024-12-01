// utils/stripeUtil.js
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY); // Replace with your Stripe Secret Key

const createPaymentIntent = async (amount, currency) => {
    try {
        const paymentIntent = await stripe.paymentIntents.create({
            amount, // Amount in cents
            currency, // e.g., 'usd'
        });
        return { success: true, clientSecret: paymentIntent.client_secret };
    } catch (error) {
        return { success: false, error: error.message };
    }
};



module.exports = {
    createPaymentIntent,
};
