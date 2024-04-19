const Cart = require("../models/cartModel");
const User = require("../models/userModel");
const ProductImageModel = require("../models/productImageModel");
const Product = require("../models/productModel");
const Category = require("../models/categoryModel");
const Coupon = require("../models/couponModel");
const Order = require("../models/orderModel");
const Razorpay = require("razorpay");
const crypto = require("crypto");
const { sendEmail } = require("../components/VerificationAuth/sendEmail");
const path = require("path");

// checkout and initialize razorpay
const checkoutProduct = async (req, res) => {
  try {
    const { finalAmount } = req.body;

    const instance = new Razorpay({
      key_id: process.env.RAZOR_KEY_Id,
      key_secret: process.env.RAZOR_KEY_SECRET,
    });

    const options = {
      amount: finalAmount * 100,
      currency: "INR",
      receipt: crypto.randomBytes(10).toString("hex"),
    };
    instance.orders.create(options, (error, order) => {
      if (error) {
        console.log(error);
        return res.status(500).json({ message: "Something Went Wrong!" });
      }
      res.status(200).json({ data: order });
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error!" });
  }
};

// verify and insert order
const verifyPayment = async (req, res) => {
  try {
    const {
      response,
      cart,
      finalAmount,
      phone,
      address,
      email,
      couponApplied,
      expectedDelivery,
      shippingAmount,
    } = req.body;

    const findUser = await User.findOne({ email });
    const user_id = findUser._id;

    const product_arr = [];
    const cartid = [];
    cart.forEach((cart) => {
      var arr = {
        product_id: cart.product_id,
        quantity: cart.quantity,
      };
      product_arr.push(arr);
      cartid.push(cart.id);
    });

    const OrderData = new Order({
      user_id,
      product_data: product_arr,
      coupon_id: couponApplied.id,
      coupon_amount: couponApplied.coupon_amount,
      finalAmount,
      shippingAmount,
      shippingAddress: address,
      ContactNo: phone,
      expectedDelivery: {
        todaydate: expectedDelivery.todaydate,
        nextdate: expectedDelivery.nextdate,
      },
      paymentInitialize: "1",
      razorpay_order_id: response.razorpay_order_id,
      razorpay_payment_id: response.razorpay_payment_id,
      razorpay_signature: response.razorpay_signature,
    });

    await OrderData.save();

    await Cart.deleteMany({ _id: { $in: cartid } });

    const sign =
      response.razorpay_order_id + "|" + response.razorpay_payment_id;
    const resultSign = crypto
      .createHmac("sha256", process.env.RAZOR_KEY_SECRET)
      .update(sign.toString())
      .digest("hex");

    if (response.razorpay_signature == resultSign) {
      var min = 100000;
      var max = 999999;
      const randomOTP = Math.floor(Math.random() * (max - min + 1)) + min;

      const pathname = path.join(__dirname, "../views/sendDeliveryOtp.ejs");
      sendEmail(
        email,
        randomOTP,
        findUser.name,
        "Verify Delivery OTP",
        "Welcome",
        pathname
      );

      await Order.findByIdAndUpdate(OrderData._id, {
        paymentStatus: "Paid",
        deliveryOtp: randomOTP,
      });
      return res.status(200).json({ message: "success" });
    } else {
      await Order.findByIdAndUpdate(OrderData._id, {
        paymentStatus: "Failed",
        expectedDelivery: {
          todaydate: "",
          nextdate: "",
        },
        deliveryStatus: "Cancelled",
      });
      return res.status(200).json({ message: "failed" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error!" });
  }
};

// get all user order
const getAllUserOrders = async (req, res) => {
  try {
    const { email } = req.body;

    const findUser = await User.findOne({ email });
    const user_id = findUser._id;

    const OrderData = await Order.find({ user_id });
    const orderdata = [];

    OrderData.forEach((data) => {
      var total_quantity = data.product_data.reduce(
        (acc, obj) => acc + obj.quantity,
        0
      );
      var ordersData = {
        id: data._id,
        product_count: data.product_data.length,
        total_amount: data.finalAmount,
        paymentStatus: data.paymentStatus,
        deliveryStatus: data.deliveryStatus,
        total_quantity: total_quantity,
        createdAt: data.createdAt,
      };

      orderdata.push(ordersData);
    });

    const ascendingSortedArray = orderdata
      .slice()
      .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

    return res.json(ascendingSortedArray);
  } catch (error) {
    return res.json({ message: error });
  }
};

// get particular product orderdetails
const getOrderProducts = async (req, res) => {
  try {
    const { orderid } = req.params;

    const OrderData = await Order.findOne({ _id: orderid });

    var productdata = [];

    if (OrderData) {
      Order.findOne({ _id: orderid })
        .then(async (order) => {
          const productdata = [];
          await Promise.all(
            order.product_data.map(async (data) => {
              var ProductData = await Product.findOne({ _id: data.product_id });

              var image_src = "";
              var productImage = await ProductImageModel.findOne({
                product_id: ProductData._id,
              });

              var defaultImage = await ProductImageModel.findOne({
                product_id: ProductData._id,
                selected_img: "1",
              });

              if (defaultImage) {
                image_src = defaultImage.imageUrl;
              } else if (productImage) {
                image_src = productImage.imageUrl;
              }

              var CategoryData = await Category.findOne({
                _id: ProductData.category,
              });

              var prod_data = {
                id: data.product_id,
                quantity: data.quantity,
                name: ProductData.name,
                brand: ProductData.brand,
                description: ProductData.description,
                oldprice: ProductData.oldprice,
                price: ProductData.price,
                image_src: image_src,
                category: CategoryData.name,
                category_id: ProductData.category,
              };

              productdata.push(prod_data);
            })
          );
          return productdata;
        })
        .then((productdata) => {
          return res.json(productdata);
        });
    } else {
      return res.json(productdata);
    }
  } catch (error) {
    return res.json({ message: error });
  }
};

// get particular orderdetails
const getOrders = async (req, res) => {
  try {
    const { orderid } = req.params;

    const OrderData = await Order.findOne({ _id: orderid });
    var orderdata = {};

    if (OrderData) {
      if (OrderData.coupon_id != "") {
        var CouponData = await Coupon.findOne({ _id: OrderData.coupon_id });
        var coupon_amount = CouponData.coupon_amount;
        var min_amount = CouponData.min_amount;
        var coupon_name = CouponData.name;
      } else {
        var coupon_amount = 0;
        var min_amount = "";
        var coupon_name = "";
      }

      const date = new Date(OrderData.deliverydate);
      const day = date.getDate();
      const month = date.toLocaleString("default", { month: "long" });
      const year = date.getFullYear();
      const formattedDate = `${day} ${month} ${year}`;

      var orderdata = {
        id: OrderData._id,
        coupon_name: coupon_name,
        coupon_amount: coupon_amount,
        min_amount: min_amount,
        finalAmount: OrderData.finalAmount,
        shippingAmount: OrderData.shippingAmount,
        shippingAddress: OrderData.shippingAddress,
        ContactNo: OrderData.ContactNo,
        expectedDelivery: OrderData.expectedDelivery,
        paymentInitialize: OrderData.paymentInitialize,
        deliveryOtp: OrderData.deliveryOtp,
        razorpay_order_id: OrderData.razorpay_order_id,
        razorpay_payment_id: OrderData.razorpay_payment_id,
        paymentStatus: OrderData.paymentStatus,
        deliveryStatus: OrderData.deliveryStatus,
        createdAt: OrderData.createdAt,
        deliverydate: formattedDate,
      };
    }

    return res.json(orderdata);
  } catch (error) {
    return res.json({ message: error });
  }
};

// get all user order
const getAllOrders = async (req, res) => {
  try {
    Order.find({})
      .then(async (order) => {
        const orderdata = [];

        await Promise.all(
          order.map(async (data) => {
            var total_quantity = data.product_data.reduce(
              (acc, obj) => acc + obj.quantity,
              0
            );

            if (data.coupon_id != "") {
              var CouponData = await Coupon.findOne({ _id: data.coupon_id });
              var coupon_amount = CouponData.coupon_amount;
              var min_amount = CouponData.min_amount;
              var coupon_name = CouponData.name;
            } else {
              var coupon_amount = 0;
              var min_amount = "";
              var coupon_name = "";
            }

            var ordersData = {
              id: data._id,
              coupon_name: coupon_name,
              coupon_amount: coupon_amount,
              min_amount: min_amount,
              finalAmount: data.finalAmount,
              shippingAmount: data.shippingAmount,
              shippingAddress: data.shippingAddress,
              ContactNo: data.ContactNo,
              expectedDelivery: data.expectedDelivery,
              paymentInitialize: data.paymentInitialize,
              deliveryOtp: data.deliveryOtp,
              razorpay_order_id: data.razorpay_order_id,
              razorpay_payment_id: data.razorpay_payment_id,
              paymentStatus: data.paymentStatus,
              deliveryStatus: data.deliveryStatus,
              product_count: data.product_data.length,
              total_quantity: total_quantity,
              createdAt: data.createdAt,
            };

            orderdata.push(ordersData);
          })
        );
        const ascendingSortedArray = orderdata
          .slice()
          .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        return ascendingSortedArray;
      })
      .then((ascendingSortedArray) => {
        return res.json(ascendingSortedArray);
      });
  } catch (error) {
    return res.json({ message: error });
  }
};

// edit order
const editOrder = async (req, res) => {
  try {
    const {
      shippingAddress,
      ContactNo,
      nextdate,
      deliveryStatus,
      expectedDelivery,
      editId,
    } = req.body;
    const findOrder = await Order.findOne({ _id: editId });

    const date = new Date(nextdate);

    const day = date.getDate();
    const month = date.toLocaleString("default", { month: "long" });
    const year = date.getFullYear();

    const formattedDate = `${day} ${month} ${year}`;

    const update = await Order.findOneAndUpdate(
      { _id: findOrder._id },
      {
        $set: {
          shippingAddress,
          ContactNo,
          deliveryStatus,
          expectedDelivery: {
            todaydate: expectedDelivery.todaydate,
            nextdate: formattedDate,
          },
          deliverydate: Date.now(),
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

// Add review
const addReview = async (req, res) => {
  try {
    const { id, productReview, email } = req.body;

    const findUser = await User.findOne({ email });
    const user_id = findUser._id;

    const findProduct = await Product.findOne({ _id: id });

    const date = new Date();

    const day = date.getDate();
    const month = date.toLocaleString("default", { month: "long" });
    const year = date.getFullYear();

    const formattedDate = `${day} ${month} ${year}`;

    var prod_review = [];

    findProduct.review.forEach((data) => {
      prod_review.push(data);
    });

    var arr = {
      user_id: user_id.toString(),
      email: email,
      name: findUser.name,
      review: productReview,
      date: formattedDate,
      createdAt: new Date(),
    };
    prod_review.push(arr);

    const update = await Product.findOneAndUpdate(
      { _id: findProduct._id },
      {
        $set: {
          review: prod_review,
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

// get recent user order
const getRecentOrders = async (req, res) => {
  try {
    Order.find({})
      .sort({ createdAt: -1 })
      .limit(5)
      .then(async (order) => {
        const orderdata = [];

        await Promise.all(
          order.map(async (data) => {
            var total_quantity = data.product_data.reduce(
              (acc, obj) => acc + obj.quantity,
              0
            );

            const findUser = await User.findOne({ _id: data.user_id });

            const date = new Date(data.createdAt);
            const day = date.getDate();
            const month = date.toLocaleString("default", { month: "long" });
            const year = date.getFullYear();
            const formattedDate = `${day} ${month} ${year}`;

            var ordersData = {
              id: data._id,
              name: findUser.name,
              finalAmount: data.finalAmount,
              shippingAddress: data.shippingAddress,
              ContactNo: data.ContactNo,
              expectedDelivery: data.expectedDelivery,
              deliveryStatus: data.deliveryStatus,
              product_count: data.product_data.length,
              total_quantity: total_quantity,
              createdAt: formattedDate,
            };

            orderdata.push(ordersData);
          })
        );
        const ascendingSortedArray = orderdata
          .slice()
          .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        return ascendingSortedArray;
      })
      .then((ascendingSortedArray) => {
        return res.json(ascendingSortedArray);
      });
  } catch (error) {
    return res.json({ message: error });
  }
};

module.exports = {
  checkoutProduct,
  verifyPayment,
  getAllUserOrders,
  getOrders,
  getOrderProducts,
  getAllOrders,
  editOrder,
  addReview,
  getRecentOrders,
};
