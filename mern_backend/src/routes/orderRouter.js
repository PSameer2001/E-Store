const { Router } = require('express');
const order = require('../controllers/orderCtrl');
const { verifyToken } = require('../middlewares/authMiddleware');

const orderRouter = Router();

// Post method
orderRouter.post("/checkoutProduct",verifyToken, order.checkoutProduct);
orderRouter.post("/verifyPayment",verifyToken, order.verifyPayment);
orderRouter.post("/getAllUserOrders",verifyToken, order.getAllUserOrders);
orderRouter.post("/editOrder",verifyToken, order.editOrder);
orderRouter.post("/addReview",verifyToken, order.addReview);

// get method
orderRouter.get("/getOrders/:orderid", order.getOrders);
orderRouter.get("/getAllOrders", order.getAllOrders);
orderRouter.get("/getRecentOrders", order.getRecentOrders);
orderRouter.get("/getOrderProducts/:orderid", order.getOrderProducts);

module.exports = orderRouter