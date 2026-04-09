const mongoose = require ('mongoose');

const Receipt = require('../models/Receipt');
const category = require('../models/Category')

const getAllClaims = async (req, res) => {
    try {
        const claims = await Receipt.find({ userId: req.user._id })
            .populate('categoryId')
            .sort({ createdAt: -1 }) //https://mongoosejs.com/docs/api/query.html#Query.prototype.sort()
            .lean()
            .exec();
            
            console.log('claims: ', claims);
            
        res.json({ success: true, data: claims });

    } catch (err) {
        res.status(500).json({
            success: false,
            error: err.message,
            code: 'SERVER_ERROR',
        });
    }
} //wip

const getClaimById = async (req, res) => {

    try {
        const claimId = new mongoose.Types.ObjectId(req.params.id); //?

        const claim = await Receipt.findById(claimId) //?
            .populate('categoryId');

        if (!claim) {
            return res.status(404)
                .json({
                    success: false,
                    error: 'Claim not found',
                    code: 'CLAIM_NOT_FOUND',
                });
        }

        if (claim.userId.toString() !== req.user._id) {
            return res.status(403)
                .json({
                    success: false,
                    error: 'Forbidden',
                    code: 'FORBIDDEN',
                })
        }

        res.json({ 
            success: true,
            data: claim,
        })

    } catch (err) {

        res.status(500).json({
            success: false,
            error: err.message,
            code: 'SERVER_ERROR',
        });
    }
}

module.exports = { getAllClaims, getClaimById };