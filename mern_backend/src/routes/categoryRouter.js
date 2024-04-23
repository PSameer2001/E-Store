const { Router } = require('express');
const category = require('../controllers/categoryCtrl');
const { verifyAdminToken } = require('../middlewares/adminAuthMiddleware');
const { storeImage } = require('../components/imageStorage');

const categoryRouter = Router();
// storeImage('category').single('imageUrl')
// Post method
categoryRouter.post("/addCategory",verifyAdminToken, category.addCategory);
categoryRouter.post("/editCategory",verifyAdminToken, category.editCategory);
categoryRouter.post("/deleteCategory", verifyAdminToken, category.deleteCategory);


// get method
categoryRouter.get("/getallCategoryData", category.getallCategoryData);


module.exports = categoryRouter;