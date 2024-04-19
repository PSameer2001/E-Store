const Section = require("../models/sectionModel");

// Add Section
const addSection = async (req, res) => {
  try {
    const { category_id, sequence, type } = req.body;
    const SectionDetail = new Section({
      category_id,
      sequence,
      type,
    });

    await SectionDetail.save();
    return res.status(201).json({ message: "success" });
  } catch (error) {
    return res.json({ message: error });
  }
};

// Get Section
const getallSectionData = async (req, res) => {
  try {
    const SectionData = await Section.find({}).sort({
      sequence: 1,
    });
    const sectiondata = [];

    SectionData.forEach((data) => {
      var sectionsData = {
        id: data._id,
        sequence: data.sequence,
        type: data.type,
        category_id: data.category_id,
      };

      sectiondata.push(sectionsData);
    });

    return res.json(sectiondata);
  } catch (error) {
    return res.json({ message: error });
  }
};

// Delete Section
const deleteSection = async (req, res) => {
  const { id } = req.body;

  Section.deleteOne({ _id: id })
    .then(function () {
      return res.status(201).json({ message: "success" });
    })
    .catch(function (error) {
      return res.status(201).json({ message: error.message });
    });
};

// Update Section
const editSection = async (req, res) => {
  try {
    const { category_id, sequence, type, editId } = req.body;
    const findSection = await Section.findOne({ _id: editId });

    const update = await Section.findOneAndUpdate(
      { _id: findSection._id },
      {
        $set: {
            category_id, sequence, type 
        },
      }
    );

    if (update) {
      return res.json({ message: "success" });
    }
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  getallSectionData,
  addSection,
  deleteSection,
  editSection
};
