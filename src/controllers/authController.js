const passport = require('passport');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

exports.postSignUp = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      const error = new Error('Please fill all fields!');
      error.status = 400;
      throw error;
    }

    if (await User.findOne({ email })) {
      const error = new Error('Email registered!');
      error.status = 400;
      throw error;
    }

    const newUser = {
      name: name,
      email: email,
      password: password
    };

    const user = await User.create(newUser);

    return res.status(201).json({
      message: 'User created!',
      userId: user._id.toString()
    });
  } catch (error) {
    next(error);
  }
};

exports.postLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      const error = new Error('Please fill all fields!');
      error.status = 400;
      throw error;
    }

    const user = await User.findOne({ email: email });

    if (!user) {
      const error = new Error('User not found!');
      error.status = 404;
      throw error;
    }

    const isEqual = await user.comparePassword(password);

    if (!isEqual) {
      const error = new Error('Bad password!');
      error.status = 400;
      throw error;
    }

    await passport.authenticate(password);
    const payload = { _id: user._id.toString() };
    const token = jwt.sign(payload, process.env.SECRET_OR_KEY, {
      expiresIn: '1h'
    });
    return res.status(200).json({ userId: payload._id, token: token });
  } catch (error) {
    next(error);
  }
};

exports.getUser = async (req, res, next) => {
  return res.json({ user: req.user });
};
