const mongoose = require('mongoose');

const { Schema, model } = mongoose;

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    set: v => v.toLowerCase(), //https://mongoosejs.com/docs/tutorials/getters-setters.html
  },
  hashedPassword: {
    type: String,
    required: true,
  },
});

//! remove hashedPassword and versionKey: https://medium.com/@mbasamahmad/hiding-mongooses-sensitive-data-with-tojson-in-node-js-6e90459ffb4e

userSchema.set('toJSON', {
  transform: (document, ret) => {
    delete ret.hashedPassword;
    delete ret.__v;

    return ret;
  }
});

const User = model('User', userSchema);

module.exports = User;
