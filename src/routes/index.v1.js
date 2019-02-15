const express = require('express');
const router = express.Router();

const auth = require('./v1/authRoutes');

router.use('/auth', auth);

module.exports = router;
