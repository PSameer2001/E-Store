const { Router } = require('express');
const category = require('../controllers/categoryCtrl');
const { verifyAdminToken } = require('../middlewares/adminAuthMiddleware');
const { storeImage } = require('../components/imageStorage');

const categoryRouter = Router();

// Post method
categoryRouter.post("/addCategory", verifyAdminToken, storeImage('category').single('imageUrl'), category.addCategory);
categoryRouter.post("/editCategory", verifyAdminToken, storeImage('category').single('imageUrl'), category.editCategory);
categoryRouter.post("/deleteCategory", verifyAdminToken, category.deleteCategory);


// get method
categoryRouter.get("/getallCategoryData", category.getallCategoryData);


module.exports = categoryRouter;