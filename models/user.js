// схема пользователя:
const mongoose = require('mongoose');
const { isEmail, isURL } = require('validator');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  about: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  avatar: {
    type: String,
    required: true,
    validate: {
      validator: function(link) {
        return isURL(link);
      },
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: function(email) {
        return isEmail(email);
      },
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
  },

});

module.exports = mongoose.model('user', userSchema);
