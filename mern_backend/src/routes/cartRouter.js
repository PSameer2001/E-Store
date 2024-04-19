const { Router } = require('express');
const cart = require('../controllers/cartCtrl');
const { verifyToken } = require('../middlewares/authMiddleware');

const cartRouter = Router();

// Post method
cartRouter.post("/addtoCart",verifyToken, cart.addtoCart);
cartRouter.post("/getCartData", cart.getCartData);
cartRouter.post("/removeFromCart",verifyToken, cart.removeFromCart);
cartRouter.post("/updateQuantityofProduct",verifyToken, cart.updateQuantityofProduct);
cartRouter.post("/getUserCouponData", cart.getUserCouponData);
cartRouter.post("/applyCoupon", cart.applyCoupon);
cartRouter.post("/removeCoupon", cart.removeCoupon);


module.exports = cartRouter;