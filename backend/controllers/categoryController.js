const Category = require('../models/Category');

const getCategories = async (req,res) => {

    try {
        const category = await Category.find({ userId: req.user._id })
        .select('_id name')

        res.json({ 
            success: true,
            data: category,
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message,
            code: 'SERVER_ERROR',
        });
    };
};

const createCategory = async (req,res) => {
    try {
        //check for input
        if(!req.body.name || !req.body.name.trim()) {
            return res.status(400)
            .json({
                success: false,
                error: 'Category name is required.'
            })
        };

        //check if current user has the category
        const existingCategory = await Category.findOne({ 
            userId: req.user._id,
            name: req.body.name.trim(), 
        });

        //check current user's categories for duplicates
        if (existingCategory) {
            return res.status(400).json({
                success:false,
                error:'Category already exists'
            });
        };
        
        const category = await Category.create({
            userId: req.user._id,
            name: req.body.name.trim()              
        });

        res.status(201).json({ 
            success: true, 
            data: { 
                _id: category._id, 
                name: category.name 
            } 
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message,
            code: 'SERVER_ERROR',
        });
    };
};

const deleteCategory = async (req,res) => {
    try {
        const category = Category.findById(req.params.id);

        if(!category) {
            return res.status(404).json({
                success:false,
                error:'Category not found.'
            });
        };
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message,
            code: 'SERVER_ERROR',
        });
    };
};

module.exports = { getCategories, createCategory, deleteCategory };