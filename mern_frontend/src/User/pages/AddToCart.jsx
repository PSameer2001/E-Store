import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/AddToCart.css";
import Collapse from "react-bootstrap/Collapse";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import toast from "react-hot-toast";
import appicon from "../components/images/appicon.png";

const AddToCart = (props) => {
  const [isCollapse, SetIsCollapse] = useState(false);

  const handleCollapse = () => {
    SetIsCollapse((collapse) => !collapse);
  };

  const navigate = useNavigate();

  const authUser = props.authUser;
  const user = authUser.state;

  const [cart, setCart] = useState([]);
  const [cartId, setCartId] = useState("");
  const [cartQuantity, setCartQuantity] = useState(0);
  const [address, setAddress] = useState(user.address);
  const [productAmount, setproductAmount] = useState(0);
  const [shippingAmount, setshippingAmount] = useState(0);
  const [finalAmount, setfinalAmount] = useState(0);

  // const [allcoupon, setAllCoupon] = useState([]);
  const [coupon, setCoupon] = useState([]);
  const [couponApplied, setcouponApplied] = useState({});
  const [couponSelect, setcouponSelect] = useState({
    coupon_id: "",
    coupon_text: "",
    coupon_min_amount: "",
    coupon_amount: "",
  });
  const [couponAmount, setcouponAmount] = useState(0);

  const getCartData = async (email) => {
    const res = await axios.post(`/getCartData`, {
      email: email,
    });
    const data = res.data;
    setCart(data);

    const totalPrice = data.reduce((acc, obj) => acc + Number(obj.amount), 0);
    setproductAmount(totalPrice);

    const shipping_price = totalPrice < 1000 ? 150 : 0;
    setshippingAmount(shipping_price);

    const couponData = data[0];
    var coup_amnt;
    if (couponData && couponData.coupon_id !== "") {
      setcouponApplied({
        id: couponData.coupon_id,
        name: couponData.coupon_name,
        coupon_amount: couponData.coupon_amount,
        min_amount: couponData.min_amount,
      });
      setcouponAmount(couponData.coupon_amount);
      coup_amnt = couponData.coupon_amount;
    } else {
      coup_amnt = 0;
    }

    var finalAmount = totalPrice + shipping_price - coup_amnt;
    setfinalAmount(finalAmount);
  };

  const getUserCouponData = async (email) => {
    const res = await axios.post(`/getUserCouponData`, {
      email: email,
    });
    const data = res.data;
    setCoupon(data);
  };

  // const getallCouponData = async () => {
  //   const res = await axios.get(`/getallCouponData`);
  //   const data = res.data;
  //   setAllCoupon(data);
  // };

  const removeFromCart = async (id) => {
    try {
      removeCoupon();
      const res = await axios.post(`/removeFromCart`, { id });
      const data = await res.data.message;
      if (data === "success") {
        toast.success("Removed Successful", { duration: 1000 });
        getCartData(user.email);
        // getallCouponData();
        getUserCouponData(user.email);
      } else {
        toast.error(data, { duration: 1000 });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleChangeQuantity = async (id, quantity) => {
    const currentIndex = cart.findIndex((c) => c.id === id);
    const updatedcart = { ...cart[currentIndex], quantity: quantity };
    const newcart = [
      ...cart.slice(0, currentIndex),
      updatedcart,
      ...cart.slice(currentIndex + 1),
    ];
    setCart(newcart);

    setCartId(id);
    setCartQuantity(quantity);

    if (couponAmount !== 0) {
      await axios.post(`/removeCoupon`, {
        email: user.email,
      });

      setcouponApplied({});
      setcouponAmount(0);
    }
  };

  useEffect(() => {
    if (cartId !== "" && cartQuantity !== 0) {
      const timer = setTimeout(async () => {
        const res = await axios.post(`/updateQuantityofProduct`, {
          id: cartId,
          quantity: cartQuantity,
        });

        const data = await res.data.message;
        if (data === "success") {
          getCartData(user.email);
          getUserCouponData(user.email);
          // getallCouponData();
        } else {
          toast.error(data, { duration: 1000 });
        }
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [cartId, cartQuantity, user]);

  const selectCoupon = (coupon) => {
    setcouponSelect({
      coupon_id: coupon.id,
      coupon_text: coupon.name,
      coupon_min_amount: coupon.min_amount,
      coupon_amount: coupon.coupon_amount,
    });
  };

  const removeCoupon = async () => {
    try {
      const res = await axios.post(`/removeCoupon`, {
        email: user.email,
      });

      const data = await res.data.message;
      if (data === "success") {
        setcouponApplied({});
        setcouponAmount(0);
        getCartData(user.email);
        getUserCouponData(user.email);
        // getallCouponData();
      } else {
        toast.error(data, { duration: 1000 });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const applyCoupon = async () => {
    try {
      if (couponSelect.coupon_id === "") {
        toast.error("Coupon Not Selected", { duration: 1500 });
        return false;
      }

      if (parseInt(finalAmount) < parseInt(couponSelect.coupon_min_amount)) {
        toast.error(
          "Minimum Amount should be " +
            couponSelect.coupon_min_amount +
            ",  Add more product",
          { duration: 3000 }
        );
        return false;
      }

      const res = await axios.post(`/applyCoupon`, {
        coupon_id: couponSelect.coupon_id,
        couponText: couponSelect.coupon_text,
        email: user.email,
      });

      const data = await res.data.message;
      if (data === "success") {
        toast.success("Applied Successful", { duration: 1000 });
        getCartData(user.email);
        getUserCouponData(user.email);
        // getallCouponData();
      } else {
        toast.error(data, { duration: 1000 });
      }
    } catch (error) {
      console.log(error);
    }
  };

  function formatDate(date) {
    const options = { day: "2-digit", month: "long", year: "numeric" };
    return date.toLocaleDateString("en-GB", options);
  }

  const todaydate = formatDate(new Date());
  const afterSevenDays = new Date();
  afterSevenDays.setDate(afterSevenDays.getDate() + 7);
  const nextdate = formatDate(afterSevenDays);

  useEffect(() => {
    getCartData(user.email);
    getUserCouponData(user.email);
    // getallCouponData();
  }, [user]);

  // Checkout

  const initPay = (data) => {
    const options = {
      key: process.env.RAZOR_KEY_Id,
      amount: data.amount,
      currency: data.currency,
      name: "E-Store",
      description: "Test",
      image: { appicon },
      order_id: data.id,
      handler: async (response) => {
        try {
          const res = await axios.post(`/verifyPayment`, {
            response,
            cart,
            finalAmount,
            phone: user.phone,
            address,
            email: user.email,
            couponApplied,
            shippingAmount,
            expectedDelivery: { todaydate, nextdate },
          });
          const message = res.data.message;

          setcouponApplied({});
          setcouponAmount(0);
          setCartId("");
          setCartQuantity(0);
          getCartData(user.email);
          getUserCouponData(user.email);

          if (message === "success") {
            toast.success("Order Placed Successfully", { duration: 1000 });
            setTimeout(() => {
              navigate("/myorder");
            }, 1000);
          } else {
            toast.error("Payment Failed", { duration: 1000 });
          }
          // console.log(data);
        } catch (error) {
          console.log(error);
        }
      },
      theme: {
        color: "#3399cc",
      },
      notes: {
        address: "Razorpay Corporate Office",
      },
    };
    const rzp1 = new window.Razorpay(options);
    rzp1.open();
  };

  const checkoutProduct = async () => {
    try {
      const { data } = await axios.post(`/checkoutProduct`, {
        finalAmount,
      });
      // console.log(data);
      initPay(data.data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <section className="cartbox">
        {cart.length !== 0 ? (
          <div className="container-fluid">
            <div className="row">
              <div className="col-md-10 col-12 mx-auto">
                <div className="row mt-2 gx-3">
                  <div className="card1">
                    <h2 className="font-weight-bold">Cart ({cart.length})</h2>
                  </div>
                  <div
                    className="col-md-12 col-lg-8 col-11 mx-auto main_cart mb-lg-0 mb-5"
                    style={{ height: "41.5rem", overflow: "auto" }}
                  >
                    {cart.map((prod) => {
                      return (
                        <div
                          className="prodcart col-md-12 col-lg-12 col-12 main1_cart mb-lg-0 mb-5"
                          key={prod.id}
                        >
                          <div className="row">
                            <div className="imgbox1 col-md-3 col-sm-4 col-11 d-flex justify-content-center align-items-center shadow product_img">
                              <img
                                src={`${process.env.PUBLIC_URL}/products/${prod.image_src}`}
                                className="img-fluid"
                                alt="cart img"
                              />
                            </div>

                            <div className="prodetail col-md-7 col-sm-6 col-11">
                              <div className="row">
                                <div className="col-10 card-title">
                                  <h1 className="mb-1 product_name">
                                    {prod.name}
                                  </h1>
                                  <p className="mb-1">Brand : {prod.brand}</p>
                                  <p className="mb-1">Color: Black</p>
                                  <p className="mb-2">
                                    Category: {prod.category}
                                  </p>
                                </div>

                                <div className="col-2">
                                  <ul className="pagination justify-content-end set_quantity">
                                    <li className="page-item">
                                      <input
                                        type="number"
                                        name="quantity"
                                        className="page-link"
                                        id={`quant${prod.id}`}
                                        value={prod.quantity}
                                        min={1}
                                        onKeyDown={(e) => e.preventDefault()}
                                        onChange={(e) =>
                                          handleChangeQuantity(
                                            prod.id,
                                            e.target.value
                                          )
                                        }
                                      />
                                    </li>
                                  </ul>
                                </div>
                              </div>

                              <div className="row">
                                <div className="col-7 d-flex justify-content-between remove_wish">
                                  <span onClick={() => removeFromCart(prod.id)}>
                                    <p>
                                      <FontAwesomeIcon icon={faTrashAlt} />{" "}
                                      REMOVE ITEM
                                    </p>
                                  </span>
                                </div>

                                <div className="col-4 d-flex justify-content-end price_money">
                                  <h3>
                                    Rs.<span id="itemval">{prod.amount} </span>
                                  </h3>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="col-md-12 col-lg-4 col-11 mx-auto mt-lg-0 mt-md-5">
                    <div className="right_side p-2 bg-white">
                      <div className="mt-2">
                        <p id="addclint" className="text-dark mt-2">
                          Address
                        </p>
                        <textarea
                          type="text"
                          name="address"
                          id="textclint"
                          className="form-control"
                          rows="3"
                          placeholder="Enter the Address"
                          required
                          onChange={(e) => setAddress(e.target.value)}
                          value={address}
                        ></textarea>
                      </div>
                      <div className="mt-2">
                        <p id="addclint" className="text-dark mt-2">
                          Contact Number
                        </p>
                        <input
                          type="text"
                          name="contact"
                          id="textclint"
                          className="form-control"
                          value={user.phone}
                          readOnly
                        />
                      </div>
                      {/* <div className="mt-2">
                        <p id="addclint" className="text-dark mt-2">
                          Whatsapp Number
                        </p>
                        <input
                          type="text"
                          name="customer_wcontact"
                          id="textclint"
                          className="form-control font-weight-bold"
                          placeholder="Enter the Number"
                        />
                      </div> */}
                    </div>

                    <div className="right_side p-2 mt-2 bg-white">
                      <h2 className="product_name mb-3">The Total Amount Of</h2>
                      <div className="price_indiv d-flex justify-content-between">
                        <p>Product amount</p>
                        <p>
                          &#8377;
                          <span id="product_total_amt">{productAmount}</span>
                        </p>
                      </div>
                      <div className="price_indiv d-flex justify-content-between">
                        <p>Shipping Charge</p>
                        <p>
                          &#8377;
                          <span id="shipping_charge">{shippingAmount}</span>
                        </p>
                      </div>

                      <div className="price_indiv d-flex justify-content-between">
                        <p>Coupon</p>
                        <p>
                          - <span id="couponAmount">{couponAmount}</span>
                        </p>
                      </div>

                      <hr />

                      <div className="total-amt d-flex justify-content-between font-weight-bold">
                        <p>Checkout Price :</p>
                        <p>
                          &#8377;<span id="total_cart_amt">{finalAmount}</span>
                        </p>
                      </div>

                      <button
                        id="appbtn"
                        name="submit"
                        type="button"
                        className="btn btn-primary text-uppercase"
                        onClick={checkoutProduct}
                      >
                        Checkout
                      </button>
                    </div>

                    <div className="discount_code mt-2">
                      <div className="card2">
                        <div className="carrd-body">
                          <span
                            className="d-flex"
                            aria-expanded={isCollapse}
                            aria-controls="collapseExample"
                            onClick={handleCollapse}
                          >
                            Add a discount code (optional)
                            <span>
                              <FontAwesomeIcon icon={faChevronDown} />
                            </span>
                          </span>
                          <Collapse in={isCollapse}>
                            <div id="collapseExample">
                              {JSON.stringify(couponApplied) !== "{}" ? (
                                <div>
                                  <div className="outer_coupon">
                                    <span className="coupon_list">
                                      {couponApplied.name}
                                    </span>
                                    <button
                                      className="coupon_btn"
                                      onClick={() =>
                                        removeCoupon(
                                          couponApplied.id,
                                          couponApplied.name
                                        )
                                      }
                                    >
                                      Remove
                                    </button>
                                  </div>
                                </div>
                              ) : (
                                <div>
                                  <div className="mt-1">
                                    <input
                                      type="text"
                                      name="coupon"
                                      id="discount_code1"
                                      className="form-control font-weight-bold"
                                      value={couponSelect.coupon_text}
                                      readOnly
                                    />
                                  </div>
                                  <button
                                    id="appbtn"
                                    className="btn btn-primary btn-sm mt-2"
                                    onClick={applyCoupon}
                                  >
                                    Apply
                                  </button>

                                  <div id="coupons_div">
                                    {coupon.map((coupon) => {
                                      return (
                                        <div
                                          key={coupon.id}
                                          className="outer_coupon"
                                        >
                                          <span className="coupon_list">
                                            {coupon.name}
                                          </span>
                                          <button
                                            className="coupon_btn"
                                            onClick={() => selectCoupon(coupon)}
                                          >
                                            Select
                                          </button>
                                        </div>
                                      );
                                    })}
                                  </div>
                                </div>
                              )}
                            </div>
                          </Collapse>
                        </div>
                      </div>
                    </div>

                    <div className="mt-2 p-2 delivery">
                      <div className="pt-1">
                        <h5 className="mb-2">Expected delivery date</h5>
                        <p>
                          {todaydate} - {nextdate}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="empty_cartbox">
            <div className="container-fluid">
              <div className="row">
                <div className="col-md-12 col-12 mx-auto">
                  <div className="row mt-5 gx-3">
                    <div className="col-md-10 col-lg-10 col-11 mx-auto main_cart mb-lg-0 mb-5">
                      <div className="card1">
                        <h2 className="font-weight-bold">Cart (0)</h2>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>
    </>
  );
};

export default AddToCart;
