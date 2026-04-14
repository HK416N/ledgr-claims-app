const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/verifyToken');
const { getAllClaims, getClaimById, createClaim, updateClaim, deleteClaim } = require('../controllers/claimsController');

router.get('/', verifyToken, getAllClaims);
router.get('/:id', verifyToken, getClaimById);
router.post('/', verifyToken, createClaim);
router.put('/:id', verifyToken, updateClaim);
router.delete('/:id', verifyToken, deleteClaim);

module.exports = router;