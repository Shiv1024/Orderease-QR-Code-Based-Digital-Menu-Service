const express = require('express');
const { addDish, getAllCategories,deleteDish } = require('../controllers/categoryController');

const router = express.Router();

router.post('/add-dish', addDish);
router.get('/categories', getAllCategories);
router.delete('/categories/delete/:dishId', deleteDish);

module.exports = router;
