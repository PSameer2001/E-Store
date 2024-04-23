const { Router } = require('express');
const order = require('../controllers/orderCtrl');
const { verifyToken } = require('../middlewares/authMiddleware');

const orderRouter = Router();

// Post method
orderRouter.post("/api/checkoutProduct",verifyToken, order.checkoutProduct);
orderRouter.post("/api/verifyPayment",verifyToken, order.verifyPayment);
orderRouter.post("/api/getAllUserOrders",verifyToken, order.getAllUserOrders);
orderRouter.post("/api/editOrder",verifyToken, order.editOrder);
orderRouter.post("/api/addReview",verifyToken, order.addReview);

// get method
orderRouter.get("/api/getOrders/:orderid", order.getOrders);
orderRouter.get("/api/getAllOrders", order.getAllOrders);
orderRouter.get("/api/getRecentOrders", order.getRecentOrders);
orderRouter.get("/api/getOrderProducts/:orderid", order.getOrderProducts);

module.exports = orderRouter