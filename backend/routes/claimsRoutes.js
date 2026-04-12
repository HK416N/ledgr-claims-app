const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/verifyToken');
const { getAllClaims, getClaimById } = require('../controllers/claimsController');

router.get('/', verifyToken, getAllClaims);
router.get('/:id', verifyToken, getClaimById);

module.exports = router;