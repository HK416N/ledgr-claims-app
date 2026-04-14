const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/verifyToken');
const { getAllClaims, getClaimById, newClaim, updateClaim, deleteClaim } = require('../controllers/claimsController');

router.get('/', verifyToken, getAllClaims);
router.post('/new', verifyToken, newClaim);
router.get('/:id', verifyToken, getClaimById);
router.put('/:id/update', verifyToken, updateClaim);
router.delete('/:id/delete', verifyToken, deleteClaim);

module.exports = router;