const Cart = require("../models/cartModel");
const User = require("../models/userModel");
const ProductImageModel = require("../models/productImageModel");
const Product = require("../models/productModel");
const Category = require("../models/categoryModel");
const Coupon = require("../models/couponModel");
const Order = require("../models/orderModel");

// Add Cart
const addtoCart = async (req, res) => {
  try {
    const { email, address, quantity, product_id } = req.body;

    const findUser = await User.findOne({ email });
    const user_id = findUser._id;

    const ProductData = await Product.findOne({ _id: product_id });
    const CartData = await Cart.findOne({ product_id });

    if (!CartData) {
      const amount = Number(ProductData.price) * Number(quantity);
      const cartDetail = new Cart({
        user_id,
        address,
        quantity,
        product_id,
        amount,
      });
      await cartDetail.save();
    } else {
      const previous_quantity = CartData.quantity;
      const current_quantity = Number(previous_quantity) + Number(quantity);
      const amount = current_quantity * Number(ProductData.price);

      await Cart.findOneAndUpdate(
        { _id: CartData._id },
        { $set: { quantity: current_quantity, amount: amount } }
      );
    }

    return res.status(201).json({ message: "success" });
  } catch (error) {
    return res.json({ message: error });
  }
};

// get Cart
const getCartData = async (req, res) => {
  try {
    const { email } = req.body;

    const findUser = await User.findOne({ email });
    const user_id = findUser._id;

    Cart.find({ user_id })
      .sort({ createdAt: 1 })
      .then(async (cart) => {
        const cartdata = [];
        await Promise.all(
          cart.map(async (data) => {
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

            if(data.coupon_id != ""){
              var CouponData = await Coupon.findOne({_id : data.coupon_id});
              var coupon_amount = CouponData.coupon_amount;
              var min_amount = CouponData.min_amount;
              var coupon_name = CouponData.name;
              }else{
                var coupon_amount = 0;
                var min_amount = "";
                var coupon_name = "";
              }

            var cartData = {
              id: data._id,
              quantity: data.quantity,
              product_id: data.product_id,
              amount: data.amount,
              coupon_id: data.coupon_id,
              coupon_amount: coupon_amount,
              min_amount: min_amount,
              coupon_name: coupon_name,
              name: ProductData.name,
              brand: ProductData.brand,
              description: ProductData.description,
              category: ProductData.category,
              oldprice: ProductData.oldprice,
              price: ProductData.price,
              image_src: image_src,
              category: CategoryData.name,
              createdAt: data.createdAt,
            };

            cartdata.push(cartData);
          })
        );
        const ascendingSortedArray = cartdata
          .slice()
          .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        return ascendingSortedArray;
      })
      .then((cartdata) => {
        return res.json(cartdata);
      });
  } catch (error) {
    return res.json({ message: error });
  }
};

// remove from cart
const removeFromCart = async (req, res) => {
  const { id } = req.body;

  Cart.deleteOne({ _id: id })
    .then(function () {
      return res.status(201).json({ message: "success" });
    })
    .catch(function (error) {
      return res.status(201).json({ message: error.message });
    });
};

// Update Cart
const updateQuantityofProduct = async (req, res) => {
  try {
    const { id, quantity } = req.body;

    const CartData = await Cart.findOne({ _id: id });
    const ProductData = await Product.findOne({ _id: CartData.product_id });

    const amount = Number(quantity) * Number(ProductData.price);

    await Cart.findByIdAndUpdate(CartData._id, { quantity, amount });

    return res.status(201).json({ message: "success" });
  } catch (error) {
    return res.json({ message: error });
  }
};

// get User Coupon
const getUserCouponData = async (req, res) => {
  try {
    const { email } = req.body;

    const findUser = await User.findOne({ email });
    const user_id = findUser._id;

    const cartCoupon = await Cart.findOne({ user_id });

    const ordercoupon = [];
    const OrderCoupon = await Order.find({ user_id, paymentStatus: "Paid" });
    OrderCoupon.forEach((data) => {
      ordercoupon.push(data.coupon_id);
    });

    const coupondata = [];
    const CouponData = await Coupon.find({});

    CouponData.forEach((data) => {
      var couponsData = {
        id: data._id,
        name: data.name,
        min_amount: data.min_amount,
        coupon_amount: data.coupon_amount,
      };

      if (data._id !== cartCoupon.coupon_id && ordercoupon.indexOf(String(data._id)) === -1 ) {
        coupondata.push(couponsData);
      }
    });

    return res.json(coupondata);
  } catch (error) {
    return res.json({ message: error });
  }
};

// apply coupon
const applyCoupon = async (req, res) => {
  const { coupon_id, couponText, email } = req.body;

  const findUser = await User.findOne({ email });
  const user_id = findUser._id;

 const update =  await Cart.updateMany(
    { user_id },
    { $set: { coupon_id: coupon_id, coupon_text: couponText } }
  );

  if(update){
    return res.json({message : "success"});
  }else{
    return res.json({message : "Something went wrong"});
  }
};

// remove coupon
const removeCoupon = async (req, res) => {
  const { email } = req.body;

  const findUser = await User.findOne({ email });
  const user_id = findUser._id;

 const update =  await Cart.updateMany(
    { user_id },
    { $set: { coupon_id: "", coupon_text: "" } }
  );

  if(update){
    return res.json({message : "success"});
  }else{
    return res.json({message : "Something went wrong"});
  }
}

module.exports = {
  addtoCart,
  getCartData,
  removeFromCart,
  updateQuantityofProduct,
  getUserCouponData,
  applyCoupon,
  removeCoupon
};
