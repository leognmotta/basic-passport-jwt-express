const express = require('express');

const authController = require('../controllers/authController');

const router = express.Router();

router.post('/signup', authController.postSignUp);

router.post('/login', authController.postLogin);

module.exports = router;
