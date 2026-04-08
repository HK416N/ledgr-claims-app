const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/verifyToken');

router.get('/', verifyToken, (req, res) => {
    res.json({
        success: true,
        data: []
    }); //placeholder, remember to add error case, pass data
});

router.get('/:id', verifyToken, (req, res) => {
    res.json({
        success: true,
        data: {},        
    })
});

module.exports = router;