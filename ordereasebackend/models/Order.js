const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', 
    required: true,
  },
  userEmail: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  food: {
    type: String,
    required: true,
  },
  orderType: {
    type: String,
    required: true,
  },
  selectedAddress: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  tableNo: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    default: 'created', // Initial status
  },
  orderStatus: {
    type: String,
    default: 'Pending', // Initial status
  },
  paymentIntentId: {
    type: String,
    required: true,
  },
  items: {
    type: [mongoose.Schema.Types.Mixed],
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});


module.exports = mongoose.models['Order'] || mongoose.model('Order', orderSchema)