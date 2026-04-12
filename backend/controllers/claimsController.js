const mongoose = require('mongoose');

const Receipt = require('../models/Receipt');
const category = require('../models/Category')

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

module.exports = { getAllClaims, getClaimById };