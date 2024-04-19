const { Router } = require("express");
const admin = require("../controllers/adminCtrl");
const { verifyAdminToken } = require("../middlewares/adminAuthMiddleware");

const adminRouter = Router();

// Post Method
adminRouter.post("/adminlogin", admin.loginAdmin);
adminRouter.post("/adminlogout", admin.logOutAdmin);
adminRouter.post("/addAdmin", verifyAdminToken, admin.addAdmin);
adminRouter.post("/deleteAdmin", verifyAdminToken, admin.deleteAdmin);
adminRouter.post("/editAdmin", verifyAdminToken, admin.editAdmin);
adminRouter.post("/deleteUser", verifyAdminToken, admin.deleteUser);

// Get Method
adminRouter.get("/getAdminData", verifyAdminToken, admin.getAdminData);
adminRouter.get("/getallUserData", verifyAdminToken, admin.getallUserData);
adminRouter.get("/getallAdminData", verifyAdminToken, admin.getallAdminData);
adminRouter.get("/getdashBoardData", verifyAdminToken, admin.getdashBoardData);

module.exports = adminRouter;
