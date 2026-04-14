const mongoose = require('mongoose');

const Receipt = require('../models/Receipt');
const category = require('../models/Category')

const newClaim = async (req, res) => {
    try { 
        req.body.userId = req.user._id; // Set userId from the authenticated user
        const reciept = await Receipt.create(req.body);
        reciept._doc.userId = req.user // Ensure userId is included in the response
        res.status(201).json({ success: true, data: reciept });
    } catch (err) {
        res.status(500).json({
            success: false,
            error: err.message,
            code: 'SERVER_ERROR',
        });
    }
}

const getAllClaims = async (req, res) => {
    try {
        const receipts = await Receipt.find({ userId: req.user._id })
            .populate('categoryId')
            .sort({ createdAt: -1 }) //https://mongoosejs.com/docs/api/query.html#Query.prototype.sort()
            .lean()
            .exec();

        const claims = receipts.map((receipt) => {
            return {
                _id: receipt._id,
                receiptNumber: receipt.receiptNumber,
                date: receipt.date.toISOString().slice(0, -1), //remove Z refer to Date section of README
                description: receipt.description,
                totalOriginal: receipt.totalOriginal,
                currencyOriginal: receipt.currencyOriginal,
                tax: receipt.tax,
                //flatten exchange
                fxRate: receipt.exchange.fxRate,
                fxSource: receipt.exchange.fxSource,
                totalSGD: receipt.exchange.convertedAmount,
                location: receipt.location,
                status: receipt.status,
                category: receipt.categoryId?.name || 'Uncategorized',
                categoryId: receipt.categoryId?._id || null,
                imageUrl: receipt.imageUrl,
                createdAt: receipt.createdAt,
            };
        });

        res.json({ success: true, data: claims });

    } catch (err) {
        res.status(500).json({
            success: false,
            error: err.message,
            code: 'SERVER_ERROR',
        });
    }
}

const getClaimById = async (req, res) => {

    try {
        const claimId = new mongoose.Types.ObjectId(req.params.id);

        const receipt = await Receipt.findById(claimId)
            .populate('categoryId')
            .lean()
            .exec();

        if (!receipt) {
            return res.status(404)
                .json({
                    success: false,
                    error: 'Claim not found',
                    code: 'CLAIM_NOT_FOUND',
                });
        }

        if (receipt.userId.toString() !== req.user._id) {
            return res.status(403)
                .json({
                    success: false,
                    error: 'Forbidden',
                    code: 'FORBIDDEN',
                })
        }

        const claim = {
            _id: receipt._id,
            receiptNumber: receipt.receiptNumber,
            date: receipt.date.toISOString().slice(0, -1), //remove Z refer to Date section of README
            description: receipt.description,
            totalOriginal: receipt.totalOriginal,
            currencyOriginal: receipt.currencyOriginal,
            tax: receipt.tax,
            //flatten exchange
            fxRate: receipt.exchange.fxRate,
            fxSource: receipt.exchange.fxSource,
            totalSGD: receipt.exchange.convertedAmount,
            location: receipt.location,
            status: receipt.status,
            category: receipt.categoryId?.name || 'Uncategorized',
            categoryId: receipt.categoryId?._id || null,
            imageUrl: receipt.imageUrl,
            createdAt: receipt.createdAt,
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

const updateClaim = async (req, res) => {
    try {
        const claim = await Receipt.findById(req.params.id);

        if (!claim) {
            return res.status(404).json({
                success: false,
                error: 'Claim not found',
                code: 'CLAIM_NOT_FOUND',
            });
        }

        if (claim.userId.toString() !== req.user._id) {
            return res.status(403).json({
                success: false,
                error: 'Forbidden',
                code: 'FORBIDDEN',
            });
        }
        
        const updatedClaim = await Receipt.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        ).populate('categoryId');

        res.json({
            success: true,
            data: updatedClaim,
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            error: err.message,
            code: 'SERVER_ERROR',
        });
    }
}
        
const deleteClaim = async (req, res) => {
    try {
        const claim = await Receipt.findById(req.params.id);

        if (!claim) {
            return res.status(404).json({
                success: false,
                error: 'Claim not found',
                code: 'CLAIM_NOT_FOUND',
            });
        }

        if (claim.userId.toString() !== req.user._id) {
            return res.status(403).json({
                success: false,
                error: 'Forbidden',
                code: 'FORBIDDEN',
            });
        }

        await Receipt.findByIdAndDelete(req.params.id);

        res.json({
            success: true,
            message: 'Claim deleted successfully',
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            error: err.message,
            code: 'SERVER_ERROR',
        });
    }
}
        


module.exports = { getAllClaims, getClaimById, newClaim, updateClaim, deleteClaim };