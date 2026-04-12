const express = require ('express');
const router = express.Router();
const verifyToken = require('../middleware/verifyToken');
const {getLatestRates} = require('../controllers/fxController');

router.get('/latest', verifyToken, getLatestRates);

module.exports = router;
