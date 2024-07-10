const express = require('express');
const User = require('../models/User'); 
const router = express.Router();

// Update user data
router.patch('/users/:userId', async (req, res) => {
  const { userId } = req.params;
  const userData = req.body;
  console.log("123",req.body);
  try {
    const updatedUser = await User.findByIdAndUpdate(userId, userData, { new: true });
    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Error updating user data' });
  }
});

module.exports = router;