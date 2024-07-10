const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const generateToken = (user) => {
  return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });
};

exports.signup = async (req, res) => {
  const { email, password, role,name,address,number } = req.body;
  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }
    const user = new User({ email, password, role,name,address:[address],number });
    await user.save();
    const token = generateToken(user);
    res.status(201).json({ token: user._id});
  } catch (error) {
    res.status(500).json({ message: 'Error creating user' });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    const token = generateToken(user);
    res.status(200).json({token: user._id});
  } catch (error) {
    res.status(500).json({ message: 'Error logging in' });
  }
};

exports.fetchUserById = async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);
  }
  catch (error) {
    res.status(500).json({ message: 'Error fetching user data' });
  }
}

