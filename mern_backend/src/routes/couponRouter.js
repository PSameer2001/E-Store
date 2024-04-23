const { Router } = require('express');
const coupon = require('../controllers/couponCtrl');
const { verifyAdminToken } = require('../middlewares/adminAuthMiddleware');

const couponRouter = Router();

// Post method
couponRouter.post("/api/addCoupon", verifyAdminToken, coupon.addCoupon);
couponRouter.post("/api/deleteCoupon", verifyAdminToken, coupon.deleteCoupon);
couponRouter.post("/api/editCoupon", verifyAdminToken, coupon.editCoupon);

// get method
couponRouter.get("/api/getallCouponData", coupon.getallCouponData);

module.exports = couponRouter;