const express = require('express');
const { signup, login,fetchUserById } = require('../controllers/authcontroller.js');
const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.get('/users/:userId', fetchUserById);

module.exports = router;
