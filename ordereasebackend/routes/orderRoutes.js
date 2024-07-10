const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

// Create an Order
router.post('/', orderController.createOrder);

// Delete an Order by userId
router.delete('/:userId', orderController.deleteOrder);

// Update an Order by userId
router.patch('/:orderId', orderController.updateOrder);

router.get('/', orderController.getAllOrders);
module.exports = router;