const { Router } = require('express');
const category = require('../controllers/categoryCtrl');
const { verifyAdminToken } = require('../middlewares/adminAuthMiddleware');
const { storeImage } = require('../components/imageStorage');

const categoryRouter = Router();
// storeImage('category').single('imageUrl')
// Post method
categoryRouter.post("/api/addCategory",verifyAdminToken, category.addCategory);
categoryRouter.post("/api/editCategory",verifyAdminToken, category.editCategory);
categoryRouter.post("/api/deleteCategory", verifyAdminToken, category.deleteCategory);


// get method
categoryRouter.get("/api/getallCategoryData", category.getallCategoryData);


module.exports = categoryRouter;