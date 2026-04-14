const mongoose = require('mongoose');

const Receipt = require('../models/Receipt');
const calculateSGD = require('../utils/calculateSGD');

//renamed newClaim to createClaim, added sgd calculations
//expect flat request from frontend 
const createClaim = async (req, res) => {
    try {
        //ensure all required fields are filled - important fields date, 
        // location, currencyOriginal, amount (totalOriginal), fxRate (api/manual it must be filled for calc) 
        if (!req.body.date || !req.body.location || !req.body.currencyOriginal || !req.body.totalOriginal || !req.body.fxRate) {
            return res.status(400).json({ success: false, error: 'Missing required fields' })
        }

        //calculate SGD for receipt
        const totalSGD = calculateSGD(req.body.totalOriginal, req.body.fxRate);

        //create receipt from flat body - match model
        const receipt = await Receipt.create({
            userId: req.user._id,
            receiptNumber: req.body.receiptNumber || '',
            date: req.body.date,
            description: req.body.description || '',
            location: req.body.location,
            currencyOriginal: req.body.currencyOriginal,
            totalOriginal: req.body.totalOriginal,
            tax: req.body.tax || 0,
            categoryId: req.body.categoryId || null,
            //embedded obj
            exchange: {
                fxRate: req.body.fxRate,
                convertedAmount: totalSGD,
                fxSource: req.body.fxSource || 'MANUAL',
                conversionDate: new Date(),
            },
        });

        res.status(201).json({
            success: true,
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message,
            code: 'SERVER_ERROR',
        });
    };
}

const getAllClaims = async (req, res) => {
    try {
        const receipts = await Receipt.find({ userId: req.user._id })
            .populate('categoryId')
            .sort({ createdAt: -1 }) //https://mongoosejs.com/docs/api/query.html#Query.prototype.sort()
            .lean()
            .exec();

        //flatten for frontend
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

    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message,
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

        //flatten for frontend
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

    } catch (error) {

        res.status(500).json({
            success: false,
            error: error.message,
            code: 'SERVER_ERROR',
        });
    };
};

const updateClaim = async (req, res) => {
    try {
        const claim = await Receipt.findById(req.params.id);

        if (!claim) {
            return res.status(404).json({
                success: false,
                error: 'Claim not found',
                code: 'CLAIM_NOT_FOUND',
            });
        };

        if (claim.userId.toString() !== req.user._id) {
            return res.status(403).json({
                success: false,
                error: 'Forbidden',
                code: 'FORBIDDEN',
            });
        };

        //added completed claims case
        if(claim.status === 'COMPLETE') {
            return res.status(403).json({
                success: false,
                error: 'Claim is complete',
            });
        };

        //edit individual fields without PUT deleting all fields that the user did not enter anything into
        if(receiptNumber !== undefined) {claim.receiptNumber = req.body.receiptNumber};
        if(date !== undefined) {claim.date = req.body.date};
        if(description !== undefined) {claim.description = req.body.description};
        if(location !== undefined) {claim.location = req.body.location};
        if(currencyOriginal !== undefined) {claim.currencyOriginal = req.body.currencyOriginal};
        if(totalOriginal !== undefined) {claim.totalOriginal = req.body.totalOriginal};
        if(tax !== undefined) {claim.tax = req.body.tax};
        if(categoryId !== undefined) {claim.categoryId = req.body.categoryId};
        if(status !== undefined) {claim.status = req.body.status};

        
        //defaults to API fx values
        if (fxRate !== undefined) {
            receipt.exchange.fxRate = fxRate;
            receipt.exchange.fxSource = fxSource || receipt.exchange.fxSource;
            receipt.exchange.convertedAmount = calculateSGD(receipt.totalOriginal, fxRate);
            receipt.exchange.conversionDate = new Date();
        }

        await receipt.save();

        res.json({ success: true });

    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message,
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

        //fix: cannot delete claim if completed - for record, audit
        if (receipt.status === 'COMPLETE') {
            return res.status(403).json({
                success: false,
                error:'Claim is complete',
                code: 'CLAIM_IS_COMPLETE',
            });
        };

        await Receipt.findByIdAndDelete(req.params.id);

        res.json({
            success: true,
            message: 'Claim deleted successfully',
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message,
            code: 'SERVER_ERROR',
        });
    }
}



module.exports = { getAllClaims, getClaimById, createClaim, updateClaim, deleteClaim };