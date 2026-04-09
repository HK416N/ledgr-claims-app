const Category = require('../models/Category');

const getCategories = async (req,res) => {

    try {
        const category = await Category.find({ userId: req.user._id })
        .select('_id name')

        res.json({ 
            success: true,
            data: category,
        })
    } catch (err) {
        res.status(500).json({
            success: false,
            error: err.message,
            code: 'SERVER_ERROR',
        });
    }
}

module.exports = { getCategories};