const { Router } = require('express');
const coupon = require('../controllers/couponCtrl');
const { verifyAdminToken } = require('../middlewares/adminAuthMiddleware');

const couponRouter = Router();

// Post method
couponRouter.post("/addCoupon", verifyAdminToken, coupon.addCoupon);
couponRouter.post("/deleteCoupon", verifyAdminToken, coupon.deleteCoupon);
couponRouter.post("/editCoupon", verifyAdminToken, coupon.editCoupon);

// get method
couponRouter.get("/getallCouponData", coupon.getallCouponData);

module.exports = couponRouter;