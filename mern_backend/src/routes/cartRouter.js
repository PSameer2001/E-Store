const { Router } = require('express');
const cart = require('../controllers/cartCtrl');
const { verifyToken } = require('../middlewares/authMiddleware');

const cartRouter = Router();

// Post method
cartRouter.post("/api/addtoCart",verifyToken, cart.addtoCart);
cartRouter.post("/api/getCartData", cart.getCartData);
cartRouter.post("/api/removeFromCart",verifyToken, cart.removeFromCart);
cartRouter.post("/api/updateQuantityofProduct",verifyToken, cart.updateQuantityofProduct);
cartRouter.post("/api/getUserCouponData", cart.getUserCouponData);
cartRouter.post("/api/applyCoupon", cart.applyCoupon);
cartRouter.post("/api/removeCoupon", cart.removeCoupon);


module.exports = cartRouter;