require("dotenv").config();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Order = require('../models/Order');

const createPaymentIntent = async (req, res) => {
  const { amount, currency, userId, userEmail, food,items,name,orderType,tableNo,selectedAddress,orderStatus } = req.body;
  console.log(req.body);

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
      receipt_email: userEmail,
      metadata: { userId },
    });

    // Create a new order in the database
    const newOrder = new Order({
      userId,
      userEmail,
      food,
      amount,
      items,
      name,
      orderType,
      tableNo: tableNo || 0,
      selectedAddress : selectedAddress || ' ',
      orderStatus,
      status: 'created', // Initial status
      paymentIntentId: paymentIntent.id, // Store payment intent ID
    });

    await newOrder.save();

    res.status(200).send({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    res.status(500).send({
      error: error.message,
    });
  }
};

module.exports = {
  createPaymentIntent,
};