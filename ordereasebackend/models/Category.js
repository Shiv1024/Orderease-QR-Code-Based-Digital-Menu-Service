const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const DishSchema = new Schema({
  id: { type: Number, required: true },
  name: { type: String, required: true },
  price: { type: String, required: true },
  image: { type: String, required: true },
  description: { type: String, required: true },
  nutrients: { type: String, required: true }
});

const CategorySchema = new Schema({
  categoryId: { type: Number, required: true },
  name: { type: String, required: true },
  dishes: { type: [DishSchema], required: true }
});

const Dish = mongoose.model('Dish', DishSchema);
const Category = mongoose.model('Category', CategorySchema);

module.exports = { Dish, Category };
