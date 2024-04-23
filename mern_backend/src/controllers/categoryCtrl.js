const Category = require("../models/categoryModel");
const fs = require("fs");

// Add Category
const addCategory = async (req, res) => {
  try {
    const { name, imageUrl } = req.body;
    const categoryDetail = new Category({
      name: name,
      imageUrl: imageUrl,
    });

    await categoryDetail.save();
    return res.status(201).json({ message: "success" });
  } catch (error) {
    return res.json({ message: error });
  }
};

// Get Category
const getallCategoryData = async (req, res) => {
  try {
    const CategoryData = await Category.find({}).sort({
      name: -1,
    });
    const categorydata = [];

    CategoryData.forEach((data) => {
      var categoriesData = {
        id: data._id,
        name: data.name,
        imageUrl: data.imageUrl,
      };

      categorydata.push(categoriesData);
    });

    return res.json(categorydata);
  } catch (error) {
    return res.json({ message: error });
  }
};

// Delete Category
const deleteCategory = async (req, res) => {
  const { id } = req.body;

  Category.deleteOne({ _id: id })
    .then(function () {
      return res.status(201).json({ message: "success" });
    })
    .catch(function (error) {
      return res.status(201).json({ message: error.message });
    });
};

// Update Category
const editCategory = async (req, res) => {
  try {
    const { name, editId, imageUrl } = req.body;
    const findCategory = await Category.findOne({ _id: editId });

    const update = await Category.findOneAndUpdate(
      { _id: findCategory._id },
      {
        $set: {
          name: name,
        },
      }
    );

    if (imageUrl) {
      await Category.findOneAndUpdate(
        { _id: findCategory._id },
        {
          $set: {
            imageUrl: imageUrl,
          },
        }
      );
    }

    if (update) {
      return res.json({ message: "success" });
    }
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  addCategory,
  getallCategoryData,
  deleteCategory,
  editCategory,
};
