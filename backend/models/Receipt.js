const mongoose = require('mongoose');

const { Schema, model } = mongoose;

// Exchange data model moved here for embedding
const exchangeSchema = new Schema({
    fxRate: {
        type: Number,
        required: true,
    },
    convertedAmount: {
        type: Number,
        required: true,
    },
    fxSource: {
        type: String,
        enum: ['API','MANUAL'], //https://mongoosejs.com/docs/validation.html
        default: ['API']
    }, 
    conversionDate: {
        type: Date,
        required: true,
    }
}, { _id: false }); //https://mongoosejs.com/docs/guide.html "Mongoose also adds an _id property to subdocuments. You can disable the _id property on your subdocuments as follows. Mongoose does allow saving subdocuments without an _id property."

const receiptSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    imageUrl: {
        type: String,
        default: null,
    },
    receiptNumber: {
        type: String,
        default: '',
    },
    date: {
        type: Date,
        required: true,
    },
    totalOriginal: {
        type: Number,
        required: true,
    },
    currencyOriginal: {
        type: String,
        required: true,
    },
    tax: {
        type: Number,
        default: 0,
    },
    description: {
        type: String,
        default: '',
    },
    location: {
        type: String,
        enum: ['OVERSEAS', 'SINGAPORE'],
        default: 'SINGAPORE',
    },
    status: {
        type: String,
        enum: [ 'PENDING', 'COMPLETE'],
        default: 'PENDING', 
    },
    exchange: exchangeSchema,
    categoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        default: "null",
    }
}, { timestamps: true }); //https://mongoosejs.com/docs/api/schema.html look at options

//flatten



const Receipt = model('Receipt', receiptSchema);

module.exports = Receipt;