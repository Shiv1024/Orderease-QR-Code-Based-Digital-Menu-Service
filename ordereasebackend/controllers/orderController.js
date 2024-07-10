const Order = require('../models/Order');

// Create an Order
exports.createOrder = async (req, res) => {
  const { amount, currency, userId, userEmail, food, items } = req.body;

  try {
    const newOrder = new Order({ amount, currency, userId, userEmail, food, items });
    const savedOrder = await newOrder.save();
    res.status(201).json(savedOrder);
  } catch (error) {
    res.status(500).json({ message: 'Error creating order', error });
  }
};

exports.getAllOrders = async (req, res) => {
    try {
      const orders = await Order.find();
      res.status(200).json(orders);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching orders', error });
    }
  };

// Delete an Order by userId
exports.deleteOrder = async (req, res) => {
  const { userId } = req.params;

  try {
    const deletedOrder = await Order.findOneAndDelete({ userId });

    if (!deletedOrder) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.status(200).json({ message: 'Order deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting order', error });
  }
};

// Update an Order by userId
exports.updateOrder = async (req, res) => {
  const { orderId } = req.params;
  console.log(req.body);
  try {
    const updatedOrder = await Order.findOneAndUpdate(
      { _id: orderId },
      { $set: req.body},
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.status(200).json(updatedOrder);
  } catch (error) {
    res.status(500).json({ message: 'Error updating order', error });
  }
};