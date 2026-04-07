const express = require ('express');
const router = express.Router();
const verifyToken = require('../middleware/verify-token');

router.get('/latest', verifyToken, (req, res) => {
    res.json({ success : true, data: {} });
});

module.exports = router;
