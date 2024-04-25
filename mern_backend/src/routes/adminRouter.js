const { Router } = require("express");
const admin = require("../controllers/adminCtrl");
const { verifyAdminToken } = require("../middlewares/adminAuthMiddleware");

const adminRouter = Router();

// Post Method
adminRouter.post("/api/adminlogin", admin.loginAdmin);
adminRouter.post("/api/adminlogout", admin.logOutAdmin);
adminRouter.post("/api/addAdmin", verifyAdminToken, admin.addAdmin);
adminRouter.post("/api/deleteAdmin", verifyAdminToken, admin.deleteAdmin);
adminRouter.post("/api/editAdmin", verifyAdminToken, admin.editAdmin);
adminRouter.post("/api/deleteUser", verifyAdminToken, admin.deleteUser);

// Get Method
adminRouter.get("/api/getAdminData", verifyAdminToken, admin.getAdminData);
adminRouter.get("/api/getallUserData", verifyAdminToken, admin.getallUserData);
adminRouter.get("/api/getallAdminData", verifyAdminToken, admin.getallAdminData);
adminRouter.get("/api/getdashBoardData", verifyAdminToken, admin.getdashBoardData);

module.exports = adminRouter;
