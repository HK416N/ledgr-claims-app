const mongoose = require ('mongoose');
const { Schema, model } = mongoose;
const User = require('./User');

const categorySchema = new Schema ({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    }
}, { timestamps: true });

categorySchema.set('toJSON', {
    transform: (doc, ret) => {
        delete ret.userId;
        delete ret.__v;
    }
})

const Category = model('Category',  categorySchema);

module.exports = Category;
