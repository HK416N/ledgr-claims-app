const express = require('express');

const Receipt = require('../models/Receipt');

const getAllClaims = async (req, res) => {
    try {
        const claims = await (await Receipt.find({ userId: req.user._id })).sort({ createdAt: -1 }).lean().exec(); //https://mongoosejs.com/docs/api/query.html#Query.prototype.sort()


    } catch (err) {
        res.status(500).json({ err: err.message });
    }
} //wip
