const express = require('express');
const router = express.Router();

const { registerUser, loginUser, getUserProfile, logoutUser, logoutAllDevices, UpdatePassword, GetAllUsers} = require('../controllers/authController');

const { AuthMiddleware, AuthorizeRoles  } = require('../middleware/AuthMiddleware');

//No authentication required
router.route('/register').post(registerUser);
router.route('/user/login').post(loginUser);


//Authenticated routes
router.route('/me').get(AuthMiddleware, getUserProfile );
router.route('/user/logout').post(AuthMiddleware, logoutUser);
router.route('/user/logoutAll').post(AuthMiddleware, logoutAllDevices);
router.route('/password/update').put(AuthMiddleware, UpdatePassword);

//Admin
router.get('/admin/users', AuthMiddleware, AuthorizeRoles('admin'), GetAllUsers)





module.exports = router
