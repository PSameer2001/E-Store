const { Router } = require('express');
const contact = require('../controllers/contactCtrl');
const { verifyToken } = require('../middlewares/authMiddleware');

const contactRouter = Router();

// Post method
contactRouter.post("/api/createTicket",verifyToken, contact.addTicket);
contactRouter.post("/api/updateTicketStatus",verifyToken, contact.updateTicketStatus);

// get method
contactRouter.get("/api/getactiveTicketData",verifyToken, contact.getactiveTicketData);
contactRouter.get("/api/getuserTicketData",verifyToken, contact.getuserTicketData);
contactRouter.get("/api/getallTicketData", contact.getallTicketData);

module.exports = contactRouter;