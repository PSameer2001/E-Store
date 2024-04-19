const ProductImageModel = require("../models/productImageModel");
const Product = require("../models/productModel");
const User = require("../models/userModel");
const Order = require("../models/orderModel");
const fs = require("fs");

// Add Product
const addProduct = async (req, res) => {
  try {
    const imageUrl = req.files;
    const imageArr = [];

    imageUrl.forEach((file) => {
      imageArr.push(file.filename);
    });

    const { name, brand, description, category, oldprice, price } = JSON.parse(
      req.body.data
    );

    const productDetail = new Product({
      name,
      brand,
      description,
      category,
      oldprice,
      price,
    });

    await productDetail.save().then((savedDoc) => {
      var id = savedDoc.id;

      imageArr.forEach(async (img) => {
        await new ProductImageModel({
          product_id: id,
          imageUrl: img,
        }).save();
      });
    });
    return res.status(201).json({ message: "success" });
  } catch (error) {
    return res.json({ message: error.message });
  }
};

// Add Product Image
const addProductImage = async (req, res) => {
  try {
    const { Id } = req.body;
    const imageUrl = req.files;
    const imageArr = [];

    imageUrl.forEach((file) => {
      imageArr.push(file.filename);
    });

    imageArr.forEach(async (img) => {
      await new ProductImageModel({
        product_id: Id,
        imageUrl: img,
      }).save();
    });
    return res.status(201).json({ message: "success" });
  } catch (error) {
    return res.json({ message: error.message });
  }
};

// Get All Product
const getallProductData = async (req, res) => {
  const { category_id } = req.params;
  try {
    Product.find({ category: category_id })
      .sort({
        name: -1,
      })
      .then(async (data) => {
        const productdata = [];
        await Promise.all(
          data.map(async (data) => {
            var image_src = "";
            var productImage = await ProductImageModel.findOne({
              product_id: data._id,
            });

            var defaultImage = await ProductImageModel.findOne({
              product_id: data._id,
              selected_img: "1",
            });

            if (defaultImage) {
              image_src = defaultImage.imageUrl;
            } else if (productImage) {
              image_src = productImage.imageUrl;
            }

            var product_quantity = 0;
            var OrderData = await Order.find({
              "product_data.product_id": data._id.toString(),
            });

            if (OrderData) {
              OrderData.map((result) => {
                const productData = result.product_data.find(
                  (data2) => data2.product_id === String(data._id)
                );
                const quantity = productData ? productData.quantity : 0;
                product_quantity = product_quantity + quantity;
              });
            } else {
              console.log(`Product ID: ${data._id} not found`);
            }

            var productsData = {
              id: data._id,
              name: data.name,
              brand: data.brand,
              description: data.description,
              category: data.category,
              oldprice: data.oldprice,
              price: data.price,
              image_src: image_src,
              orderCount: product_quantity,
            };
            productdata.push(productsData);
          })
        );
        return productdata;
      })
      .then((productdata) => {
        return res.json(productdata);
      });
  } catch (error) {
    return res.json({ message: error });
  }
};

// Get Product
const getProductData = async (req, res) => {
  const { product_id } = req.params;
  try {
    const productData = await Product.find({ _id: product_id });
    const productdata = [];

    productData.forEach(async (data) => {
      var productsData = {
        id: data._id,
        name: data.name,
        brand: data.brand,
        description: data.description,
        category: data.category,
        oldprice: data.oldprice,
        price: data.price,
      };
      productdata.push(productsData);
    });

    return res.json(productdata);
  } catch (error) {
    return res.json({ message: error });
  }
};

// Get ProductImage Data
const getallImageProductData = async (req, res) => {
  const { product_id } = req.params;

  try {
    const ProductImageData = await ProductImageModel.find({ product_id });

    const productimagedata = [];

    ProductImageData.forEach((data) => {
      var productsImageData = {
        id: data._id,
        product_id: data.product_id,
        imageUrl: data.imageUrl,
        selected_img: data.selected_img,
      };

      productimagedata.push(productsImageData);
    });

    return res.json(productimagedata);
  } catch (error) {
    return res.json({ message: error });
  }
};

// Delete Product
const deleteProduct = async (req, res) => {
  const { id } = req.body;

  const dir = "../mern_frontend/public/products";

  const productImageData = await ProductImageModel.find({ product_id: id });
  await ProductImageModel.deleteMany({ product_id: id });

  productImageData.forEach((data) => {
    if (fs.existsSync(dir + "/" + data.imageUrl)) {
      fs.unlinkSync(dir + "/" + data.imageUrl);
    }
  });

  Product.deleteOne({ _id: id })
    .then(function () {
      return res.status(201).json({ message: "success" });
    })
    .catch(function (error) {
      return res.status(201).json({ message: error.message });
    });
};

// Update Product
const editProduct = async (req, res) => {
  try {
    const { name, brand, description, category, oldprice, price, editId } =
      req.body;
    const findProduct = await Product.findOne({ _id: editId });

    const update = await Product.findOneAndUpdate(
      { _id: findProduct._id },
      {
        $set: {
          name,
          brand,
          description,
          category,
          oldprice,
          price,
        },
      }
    );

    // if (req.file) {
    //   await Category.findOneAndUpdate(
    //     { _id: findCategory._id },
    //     {
    //       $set: {
    //         imageUrl: req.file.filename,
    //       },
    //     }
    //   );
    // }

    if (update) {
      return res.json({ message: "success" });
    }
  } catch (error) {
    console.log(error);
  }
};

// Delete Image
const deleteImageProduct = async (req, res) => {
  const { id } = req.body;
  const dir = "../mern_frontend/public/products";

  const productImageData = await ProductImageModel.findOne({ _id: id });

  if (fs.existsSync(dir + "/" + productImageData["imageUrl"])) {
    fs.unlinkSync(dir + "/" + productImageData["imageUrl"]);
  }
  ProductImageModel.deleteOne({ _id: id })
    .then(function () {
      return res.status(201).json({ message: "success" });
    })
    .catch(function (error) {
      return res.status(201).json({ message: error.message });
    });
};

// Update Default Image
const makeDefaultImageProduct = async (req, res) => {
  const { defaultProductImage_Id, product_id } = req.params;

  await ProductImageModel.updateMany(
    { product_id: product_id },
    { $set: { selected_img: "0" } }
  );

  const findProductImage = await ProductImageModel.findOne({
    _id: defaultProductImage_Id,
  });

  const update = await ProductImageModel.findOneAndUpdate(
    { _id: findProductImage.id },
    {
      $set: {
        selected_img: "1",
      },
    }
  );

  if (update) {
    return res.json({ message: "success" });
  } else {
    console.log("error");
  }
};

// Get Product Review
const getProductReviewData = async (req, res) => {
  const { product_id } = req.params;
  try {
    Product.findOne({ _id: product_id }).then(async (data) => {
      const productdata = [];
      await Promise.all(
        data.review.map(async (data) => {
          var findUser = await User.findOne({ _id: data.user_id });

          var productsData = {
            user_id: data.user_id,
            email: data.email,
            name: data.name,
            review: data.review,
            date: data.date,
            image_src: findUser.imageUrl,
          };
          productdata.push(productsData);
        })
      );

      return productdata;
    }).then((productreview) => {
      return res.json(productreview);
    })
  } catch (error) {
    console.log(error);
    return res.json({ message: error });
  }
};

// get every product
const getAllProduct = async (req, res) => {
  try {
    Product.find({ })
      .sort({
        name: -1,
      })
      .then(async (data) => {
        const productdata = [];
        await Promise.all(
          data.map(async (data) => {
            var image_src = "";
            var productImage = await ProductImageModel.findOne({
              product_id: data._id,
            });

            var defaultImage = await ProductImageModel.findOne({
              product_id: data._id,
              selected_img: "1",
            });

            if (defaultImage) {
              image_src = defaultImage.imageUrl;
            } else if (productImage) {
              image_src = productImage.imageUrl;
            }

            var product_quantity = 0;
            var OrderData = await Order.find({
              "product_data.product_id": data._id.toString(),
            });

            if (OrderData) {
              OrderData.map((result) => {
                const productData = result.product_data.find(
                  (data2) => data2.product_id === String(data._id)
                );
                const quantity = productData ? productData.quantity : 0;
                product_quantity = product_quantity + quantity;
              });
            } 

            var productsData = {
              id: data._id,
              name: data.name,
              brand: data.brand,
              description: data.description,
              category: data.category,
              oldprice: data.oldprice,
              price: data.price,
              image_src: image_src,
              orderCount: product_quantity,
            };
            productdata.push(productsData);
          })
        );
        return productdata;
      })
      .then((productdata) => {
        return res.json(productdata);
      });
  } catch (error) {
    return res.json({ message: error });
  }
}

module.exports = {
  addProduct,
  getallProductData,
  deleteProduct,
  editProduct,
  getallImageProductData,
  addProductImage,
  deleteImageProduct,
  makeDefaultImageProduct,
  getProductData,
  getProductReviewData,
  getAllProduct
};
