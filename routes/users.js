const express = require('express');
const router = express.Router();
const userController = require('../app/api/controllers/users');

router.post('/register', userController.create);

module.exports = router;