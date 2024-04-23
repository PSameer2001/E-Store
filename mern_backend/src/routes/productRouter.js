const { Router } = require('express');
const product = require('../controllers/productCtrl');
const { verifyAdminToken } = require('../middlewares/adminAuthMiddleware');
const { storeImage } = require('../components/imageStorage');

const productRouter = Router();

// Post method
productRouter.post("/addProduct",verifyAdminToken, product.addProduct);
productRouter.post("/addProductImage", verifyAdminToken, product.addProductImage);
productRouter.post("/editProduct", verifyAdminToken, product.editProduct);
productRouter.post("/deleteProduct", verifyAdminToken, product.deleteProduct);
productRouter.post("/deleteImageProduct", verifyAdminToken, product.deleteImageProduct);
productRouter.post("/makeDefaultImageProduct/:defaultProductImage_Id/:product_id", verifyAdminToken, product.makeDefaultImageProduct);

// get method
productRouter.get("/getallProductData/:category_id", product.getallProductData);
productRouter.get("/getProductData/:product_id", product.getProductData);
productRouter.get("/getallImageProductData/:product_id", product.getallImageProductData);
productRouter.get("/getProductReviewData/:product_id", product.getProductReviewData);
productRouter.get("/getEveryProduct", product.getAllProduct);


module.exports = productRouter;