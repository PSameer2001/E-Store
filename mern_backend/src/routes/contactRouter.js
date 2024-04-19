const { Router } = require('express');
const contact = require('../controllers/contactCtrl');
const { verifyToken } = require('../middlewares/authMiddleware');

const contactRouter = Router();

// Post method
contactRouter.post("/createTicket",verifyToken, contact.addTicket);
contactRouter.post("/updateTicketStatus",verifyToken, contact.updateTicketStatus);

// get method
contactRouter.get("/getactiveTicketData",verifyToken, contact.getactiveTicketData);
contactRouter.get("/getuserTicketData",verifyToken, contact.getuserTicketData);
contactRouter.get("/getallTicketData", contact.getallTicketData);

module.exports = contactRouter;