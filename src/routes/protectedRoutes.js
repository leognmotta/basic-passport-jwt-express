const express = require('express');

const isAuth = require('../middlewares/isAuth');
const protectedController = require('../controllers/protectedController');

const router = express.Router();

router.get('/protected', isAuth, protectedController.getProtectedMessage);

module.exports = router;
