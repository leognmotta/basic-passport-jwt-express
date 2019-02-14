const express = require('express');

const isAuth = require('../middlewares/isAuth');
const authController = require('../controllers/authController');

const router = express.Router();

router.post('/signup', authController.postSignUp);

router.post('/login', authController.postLogin);

router.get('/getuser', isAuth, authController.getUser);

module.exports = router;
