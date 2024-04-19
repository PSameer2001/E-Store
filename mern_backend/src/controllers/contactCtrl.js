const Contact = require("../models/contactModel");
const User = require("../models/userModel");

// Add Ticket
const addTicket = async (req, res) => {
  try {
    const { email, subject, message } = req.body;

    const findUser = await User.findOne({ email });
    const userId = findUser._id;

    var content = [
      {
        name: findUser.name,
        email: email,
        adminStatus: findUser.isAdmin,
        content: message,
        date: new Date(),
      },
    ];

    const contactDetail = new Contact({
      user_id: userId,
      email,
      name: findUser.name,
      subject,
      chats: content,
    });

    await contactDetail.save();
    return res.status(201).json({ message: "success" });
  } catch (error) {
    return res.json({ message: error });
  }
};

// get active ticket
const getactiveTicketData = async (req, res) => {
  const { email } = req.query;

  const ContactData = await Contact.findOne({ email: email, status: "0" });

  if (ContactData) {
    return res.json({ message: true });
  } else {
    return res.json({ message: false });
  }
};

// get user ticket
const getuserTicketData = async (req, res) => {
  const { email } = req.query;

  const ContactData = await Contact.find({ email: email });
  const contactData = [];

  ContactData.forEach(async (data) => {
    var arr = {
      id: data._id,
      createdAt: data.createdAt,
      subject: data.subject,
      status: data.status,
    };

    contactData.push(arr);
  });

  const ascendingSortedArray = contactData
    .slice()
    .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

  return res.json(ascendingSortedArray);
};

// get all ticket
const getallTicketData = async (req, res) => {
  const ContactData = await Contact.find({});
  const contactData = [];

  ContactData.forEach(async (data) => {
    var arr = {
      id: data._id,
      createdAt: data.createdAt,
      subject: data.subject,
      status: data.status,
      email: data.email,
      user_id: data.user_id,
      name: data.name,
      content: data.chats,
    };

    contactData.push(arr);
  });

  const ascendingSortedArray = contactData
    .slice()
    .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

  return res.json(ascendingSortedArray);
};

// Update Ticket
const updateTicketStatus = async (req, res) => {
  try {
    const { editId, editStatus } = req.body;
    const findTicket = await Contact.findOne({ _id: editId });

    const update = await Contact.findOneAndUpdate(
      { _id: findTicket.id },
      { $set: { status: editStatus } }
    );

    if (update) {
      return res.json({ message: "success" });
    }
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  addTicket,
  getactiveTicketData,
  getuserTicketData,
  getallTicketData,
  updateTicketStatus,
};
