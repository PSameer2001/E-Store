const Coupon = require("../models/couponModel");

// Add Coupon
const addCoupon = async (req, res) => {
  try {
    const { name, min_amount, coupon_amount } = req.body;

    const CouponData = await Coupon.find({ name });

    if (!CouponData) {
      const CouponDetail = new Coupon({
        name,
        min_amount,
        coupon_amount,
      });

      await CouponDetail.save();
      return res.status(201).json({ message: "success" });
    } else {
      return res.status(201).json({ message: "Already Exists" });
    }
  } catch (error) {
    return res.json({ message: error });
  }
};

// Get Coupon
const getallCouponData = async (req, res) => {
  try {
    const CouponData = await Coupon.find({});
    const coupondata = [];

    CouponData.forEach((data) => {
      var couponsData = {
        id: data._id,
        name: data.name,
        min_amount: data.min_amount,
        coupon_amount: data.coupon_amount,
      };

      coupondata.push(couponsData);
    });

    return res.json(coupondata);
  } catch (error) {
    return res.json({ message: error });
  }
};

// Delete Coupon
const deleteCoupon = async (req, res) => {
  const { id } = req.body;

  Coupon.deleteOne({ _id: id })
    .then(function () {
      return res.status(201).json({ message: "success" });
    })
    .catch(function (error) {
      return res.status(201).json({ message: error.message });
    });
};

// Update Coupon
const editCoupon = async (req, res) => {
  try {
    const { name, min_amount, coupon_amount, editId } = req.body;
    const findCoupon = await Coupon.findOne({ _id: editId });

    if (name === findCoupon.name) {
      await Coupon.findOneAndUpdate(
        { _id: findCoupon._id },
        {
          $set: {
            min_amount,
            coupon_amount,
          },
        }
      );
      return res.json({ message: "success" });
    } else {
      const CouponData = await Coupon.findOne({ name });

      if (!CouponData) {
        await Coupon.findOneAndUpdate(
          { _id: findCoupon._id },
          {
            $set: {
              name,
              min_amount,
              coupon_amount,
            },
          }
        );
        return res.json({ message: "success" });
      }else{
        return res.json({ message: "Name Already Exists" });
      }
    }
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  getallCouponData,
  addCoupon,
  deleteCoupon,
  editCoupon,
};
