const userController = require('../controllers/user.controller');
const express = require('express');
const router = express.Router();

/* User Routes */
router.post('/users/register', userController.createUser);
router.post('/users/login', userController.loginUser);
router.get('/logout', userController.logoutUser);

/* Additional routes for user management can be added here */

module.exports = router;