const { Router } = require('express');
const user = require('../controllers/userCtrl');
const { verifyToken } = require('../middlewares/authMiddleware');
const { storeImage } = require('../components/imageStorage');

const userRouter = Router();

// Post method
userRouter.post('/api/signup', user.addUser);
userRouter.post('/api/signin', user.loginUser);
userRouter.post('/api/logout', user.logOut);
userRouter.post('/api/SendOtp', user.SendOtp);
userRouter.post('/api/forgetPassword', user.forgetPassword);
userRouter.post('/api/sendVerificationLink', user.SendEmailVerification);
userRouter.post('/api/updateUser', user.updateUser);
userRouter.post('/api/updateProfilePhoto', user.updateProfilePhoto);
userRouter.post('/api/updatePassword', user.updatePassword);

// Get method
userRouter.get('/api/getUserData', user.getUserData);
userRouter.get('/api/verify/:email/:Id', user.verifyEmail);

module.exports = userRouter;