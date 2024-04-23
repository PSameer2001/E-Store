const { Router } = require('express');
const section = require('../controllers/sectionCtrl');
const { verifyAdminToken } = require('../middlewares/adminAuthMiddleware');

const sectionRouter = Router();

// Post method
sectionRouter.post("/api/addSection", verifyAdminToken, section.addSection);
sectionRouter.post("/api/deleteSection", verifyAdminToken, section.deleteSection);
sectionRouter.post("/api/editSection", verifyAdminToken, section.editSection);

// get method
sectionRouter.get("/api/getallSectionData", section.getallSectionData);

module.exports = sectionRouter;