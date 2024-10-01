const config = require('../config/config');
const stripe = require('stripe')(config.stripeSecretKey);
const Order = require('../models/Order');

exports.createPaymentIntent = async (req, res) => {
  try {
    const { orderId } = req.body;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to make payment for this order' });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: order.price * 100, // Stripe expects amount in cents
      currency: 'usd',
      metadata: { orderId: order._id.toString() }
    });

    res.json({
      success: true,
      clientSecret: paymentIntent.client_secret
    });
  } catch (error) {
    res.status(500).json({ message: 'Error creating payment intent', error: error.message });
  }
};