const { Dish, Category } = require('../models/Category'); 

const addDish = async (req, res) => {
  const { categoryId, id, name, price, image, description, nutrients } = req.body;
  let categoryIdDish;
  if(categoryId === 'Indian'){
    categoryIdDish = 5;
  }else if(categoryId === 'Chinese'){
    categoryIdDish = 12;
  }else if(categoryId === 'Italian'){
    categoryIdDish = 15;
  }
  console.log(categoryIdDish);
  try {
    const category = await Category.findOne({categoryId: +categoryIdDish});
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    const newDish = new Dish({ id, name, price, image, description, nutrients });
    category.dishes.push(newDish);
    await category.save();

    res.status(201).json(newDish);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find().populate('dishes');
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteDish = async (req, res) => {
  const { dishId } = req.params;
  console.log(dishId);
   
  try {
    // Find the category that contains the dish
    const category = await Category.findOne({ 'dishes.id': dishId });
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    // Find the index of the dish within the category
    const dishIndex = category.dishes.findIndex(dish => dish.id === +dishId);
    if (dishIndex === -1) {
      return res.status(404).json({ message: 'Dish not found' });
    }

    // Remove the dish from the category
    category.dishes.splice(dishIndex, 1);
    await category.save();

    res.status(200).json({ message: 'Dish deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// const deleteDish = async (req, res) => {
//   const { dishId } = req.params;

//   try {
//     // Find the category that contains the dish
//     const category = await Category.findOne({ 'dishes.id': dishId });
//     if (!category) {
//       return res.status(404).json({ message: 'Category not found' });
//     }

//     // Find the dish within the category
//     const dish = category.dishes.id(dishId);
//     if (!dish) {
//       return res.status(404).json({ message: 'Dish not found' });
//     }

//     // Remove the dish from the category
//     dish.remove();
//     await category.save();

//     res.status(200).json({ message: 'Dish deleted successfully' });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// const deleteDish = async (req, res) => {
  
//   const { dishId } = req.params;
//   try {
//     const category1 = await Category.findOne({ 'dishes.id': dishId });
//     if (!category1) {
//       return res.status(404).json({ message: 'Category not found' });
//     }
//     const categoryId = category1.categoryId;
//     const category = await Category.findOne({ categoryId });
//     if (!category) {
//       return res.status(404).json({ message: 'Category not found' });
//     }
//     const dish = category.dishes.id(dishId);
//     if (!dish) {
//       return res.status(404).json({ message: 'Dish not found' });
//     }
//     dish.remove();
//     await category.save();
//     res.status(200).json(dish);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// }
// const deleteDish = async (req, res) => {

//   const { dishId } = req.params;
//   try {
//     const category = await Category.findOne({ 'dishes.id': dishId });
//     if (!category) {
//       return res.status(404).json({ message: 'Category not found' });
//     }
//     console.log(category);
//     category.dishes = category.dishes.filter(dish => dish.id !== dishId);
//     await category.save();

//     res.status(200).json({ message: 'Dish deleted successfully' });
//   }
//   catch (error) {
//     res.status(500).json({ message: error.message });
//   }

// }

module.exports = { addDish, getAllCategories, deleteDish};
