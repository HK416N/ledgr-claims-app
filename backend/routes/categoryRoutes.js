const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/verifyToken');
const { getCategories, createCategory, deleteCategory } = require('../controllers/categoryController');

router.get('/', verifyToken, getCategories);
router.post('/', verifyToken, createCategory);
router.delete('/:id', verifyToken, deleteCategory);

module.exports = router;