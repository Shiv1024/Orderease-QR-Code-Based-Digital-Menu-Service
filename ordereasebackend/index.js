const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

// index.js file 

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'https://ordereasefrontend.vercel.app'); // Allow your frontend URL
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Credentials', 'true'); // Allow credentials if necessary
  if (req.method === 'OPTIONS') {
    return res.sendStatus(204); // Respond with no content for preflight
  }
  next();
});


const Offer = require("./models/Offer");
const authRoutes = require("./routes/authRoutes");
const dishRoutes = require("./routes/dishRoutes");
const cartRoutes = require("./routes/cartRoutes");
const paymentRoutes = require('./routes/paymentRoutes');
const userRoutes = require('./routes/userRoutes');
const webhookRoutes = require('./routes/webhookRoutes');
const orderRoutes = require('./routes/orderRoutes');
app.use("/auth", authRoutes);
app.use("/menu", dishRoutes);
app.use("/cart", cartRoutes);
app.use('/', paymentRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/webhook', webhookRoutes);
app.use('/orders', orderRoutes);
app.use(userRoutes);
app.use("/offers", async (req, res) => {
  try {
    const offers = await Offer.find();
    res.status(200).json(offers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log(`${err} did not connect as expected `));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
