const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/verify-token');

router.get('/', verifyToken, (req, res) => {
    res.json({ success: true, data: [] }); //placeholder, remember to add error case
});

module.exports = router;