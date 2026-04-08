const express = require ('express');
const router = express.Router();
const verifyToken = require('../middleware/verifyToken');

router.get('/latest', verifyToken, (req, res) => {
    res.json({ 
        success : true, 
        data: {} 
    });
});

module.exports = router;
