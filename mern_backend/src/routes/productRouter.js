const { Router } = require('express');
const product = require('../controllers/productCtrl');
const { verifyAdminToken } = require('../middlewares/adminAuthMiddleware');
const { storeImage } = require('../components/imageStorage');

const productRouter = Router();

// Post method
productRouter.post("/api/addProduct",verifyAdminToken, product.addProduct);
productRouter.post("/api/addProductImage", verifyAdminToken, product.addProductImage);
productRouter.post("/api/editProduct", verifyAdminToken, product.editProduct);
productRouter.post("/api/deleteProduct", verifyAdminToken, product.deleteProduct);
productRouter.post("/api/deleteImageProduct", verifyAdminToken, product.deleteImageProduct);

// get method
productRouter.get("/api/getallProductData/:category_id", product.getallProductData);
productRouter.get("/api/getProductData/:product_id", product.getProductData);
productRouter.get("/api/getallImageProductData/:product_id", product.getallImageProductData);
productRouter.get("/api/getProductReviewData/:product_id", product.getProductReviewData);
productRouter.get("/api/getEveryProduct", product.getAllProduct);
productRouter.get("/api/makeDefaultImageProduct/:defaultProductImage_Id/:product_id", verifyAdminToken, product.makeDefaultImageProduct);


module.exports = productRouter;