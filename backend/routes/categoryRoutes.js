const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/verifyToken');
const { getCategories } = require('../controllers/categoryController');

router.get('/', verifyToken, getCategories);
// router.post('/', createCategory);
// router.delete('/:id', deleteCategory);

module.exports = router;