const { Router } = require('express');
const user = require('../controllers/userCtrl');
const { verifyToken } = require('../middlewares/authMiddleware');
const { storeImage } = require('../components/imageStorage');

const userRouter = Router();

// Post method
userRouter.post('/signup', user.addUser);
userRouter.post('/signin', user.loginUser);
userRouter.post('/logout', user.logOut);
userRouter.post('/SendOtp', user.SendOtp);
userRouter.post('/forgetPassword', user.forgetPassword);
userRouter.post('/sendVerificationLink', user.SendEmailVerification);
userRouter.post('/updateUser', user.updateUser);
userRouter.post('/updateProfilePhoto', user.updateProfilePhoto);
userRouter.post('/updatePassword', user.updatePassword);

// Get method
userRouter.get('/getUserData', user.getUserData);
userRouter.get('/verify/:email/:Id', user.verifyEmail);

module.exports = userRouter;