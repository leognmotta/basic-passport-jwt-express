const mongoose = require('mongoose');

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  }
});

UserSchema.pre('save', async function(next) {
  const hash = await bcrypt.hash(this.password, 10);
  this.password = hash;

  next();
});

UserSchema.methods.comparePassword = async function(password) {
  const isEqual = await bcrypt.compare(password, this.password);
  return isEqual;
};

UserSchema.methods.getToken = function() {
  return jwt.sign({ userId: this._id }, process.env.SECRET_OR_KEY, {
    expiresIn: '5h'
  });
};

module.exports = mongoose.model('User', UserSchema);
