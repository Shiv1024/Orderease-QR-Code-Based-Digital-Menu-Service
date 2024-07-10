const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const FoodSchema = new Schema({
  id: { type: Number, required: true },
  name: { type: String, required: true },
  price: { type: String, required: true },
  image: { type: String, required: true },
  description: { type: String, required: true },
  nutrients: { type: String, required: true }
});

const CartItemSchema = new Schema({
  dish: { type: FoodSchema, required: true },
  amount: { type: Number, required: true },
  userId: { type: String, required: true }
});


const Food = mongoose.model('Food', FoodSchema);
const CartItem = mongoose.model('CartItem', CartItemSchema);
// const Cart = mongoose.model('Cart', CartSchema);

module.exports = { Food, CartItem };
