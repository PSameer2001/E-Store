const { Router } = require('express');
const section = require('../controllers/sectionCtrl');
const { verifyAdminToken } = require('../middlewares/adminAuthMiddleware');

const sectionRouter = Router();

// Post method
sectionRouter.post("/addSection", verifyAdminToken, section.addSection);
sectionRouter.post("/deleteSection", verifyAdminToken, section.deleteSection);
sectionRouter.post("/editSection", verifyAdminToken, section.editSection);

// get method
sectionRouter.get("/getallSectionData", section.getallSectionData);

module.exports = sectionRouter;