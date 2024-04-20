import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import "../css/myOrderDetail.css";
import appicon from "../components/images/appicon.png";
import axios from "axios";
import ProgressBar from "react-bootstrap/ProgressBar";
import toast from "react-hot-toast";

const MyOrderDetail = (props) => {
  const authUser = props.authUser;
  const user = authUser.state;

  const { orderid } = useParams();

  const [orders, setOrders] = useState({});
  const [productData, setProductData] = useState([]);
  const [productReview, setProductReview] = useState("");
  const [progressdata, setProgressData] = useState(0);
  const [productAmount, setproductAmount] = useState(0);

  const getOrders = async (orderid) => {
    const res = await axios.get("/getOrders/" + orderid);
    const orderdata = res.data;
    setOrders(orderdata);

    if (orderdata.deliveryStatus === "Not Delivered") {
      setProgressData(25);
    } else if (orderdata.deliveryStatus === "Dispatch") {
      setProgressData(50);
    } else if (orderdata.deliveryStatus === "Out for Delievery") {
      setProgressData(75);
    } else if (orderdata.deliveryStatus === "Delivered") {
      setProgressData(100);
    }
  };

  const getOrderProducts = async (orderid) => {
    const res = await axios.get(`/getOrderProducts/` + orderid);
    const productdata = res.data;
    setProductData(productdata);

    const totalPrice = productdata.reduce(
      (acc, obj) => acc + Number(obj.price),
      0
    );
    setproductAmount(totalPrice);
  };

  const handleSubmitReview = async (id) => {
    const res = await axios.post(`/addReview`, {
      id,
      productReview,
      email: user.email,
    });
    const message = res.data.message;

    if (message === "success") {
      toast.success("Review Added Successfully", { duration: 1000 });
      setProductReview("");
      getOrders(orderid);
      getOrderProducts(orderid);
    }
  };

  useEffect(() => {
    getOrders(orderid);
    getOrderProducts(orderid);
  }, [orderid]);

  return (
    <>
      <div className="myorder_detail">
        <div className="title">
          <Link to="/myorder" className="previous" replace={true}>
            Back
          </Link>
          <h2 className="font-weight-bold"> Order Details</h2>
        </div>
        <hr />
        <div className="container-fluid my-5  d-flex  justify-content-center">
          <div className="card card-1">
            <div className="card-header bg-white">
              <div className="media flex-sm-row flex-column-reverse justify-content-between  ">
                <div className="col my-auto">
                  {" "}
                  <h4 className="mb-0">
                    Your Order ,{" "}
                    <span className="change-color">{user.name}</span> !
                  </h4>{" "}
                </div>
                <div className="col-auto text-center  my-auto pl-0 pt-sm-4">
                  {" "}
                  <img
                    className="img-fluid my-auto align-items-center mb-0"
                    src={appicon}
                    alt="E-Store"
                    width="150px"
                    height="150px"
                  />{" "}
                  <h3 className="mb-4 pt-0 icon">Store For Everyone</h3>{" "}
                </div>
              </div>
            </div>

            <div className="card-body">
              <div className="row justify-content-between mb-3">
                <div className="col-auto">
                  {" "}
                  <h5 className="color-1 mb-2 change-color">
                    Order Id : <span className="orderid">{orders.id}</span>
                  </h5>
                </div>
                <div className="col-auto  ">
                  {" "}
                  <h5 className="change-color">
                    Payment Receipt :{" "}
                    <span className="orderid">
                      {orders.razorpay_payment_id}
                    </span>
                  </h5>{" "}
                </div>
              </div>

              {orders.deliveryStatus !== "Delivered" && (
                <div className="row justify-content-between mb-3">
                  <h5 className="color-1 mb-2 change-color">
                    Your Delivery OTP :
                    <span className="orderid">{orders.deliveryOtp}</span>
                  </h5>
                </div>
              )}

              {productData.map((data) => {
                return (
                  <div className="row mb-4" key={data.id}>
                    <div className="col">
                      <div className="card card-2">
                        <div className="card-body">
                          <div className="media">
                            <div className="sq align-self-center ">
                              <Link
                                to={`/product_detail/${data.category_id}/${data.id}`}
                              >
                                <img
                                  className="img-fluid  my-auto align-self-center mr-2 mr-md-4 pl-0 p-0 m-0"
                                  src={`${process.env.IMAGE_URL}/products/${data.image_src}`}
                                  alt={data.name}
                                  width="135"
                                  height="135"
                                />
                              </Link>
                            </div>
                            <div className="media-body my-auto text-right">
                              <div className="row  my-auto flex-column flex-md-row">
                                <div className="col my-auto">
                                  <h6>{data.name}</h6>
                                </div>
                                <div className="col my-auto">
                                  <h6>Category : {data.category}</h6>
                                </div>
                                <div className="col my-auto">
                                  <h6>Brand : {data.brand}</h6>
                                </div>
                                <div className="col my-auto">
                                  <h6>Qty : {data.quantity}</h6>
                                </div>
                                <div className="col my-auto">
                                  <h6 className="mb-0">
                                    Price : &#8377;
                                    {new Intl.NumberFormat().format(data.price)}
                                  </h6>
                                </div>
                              </div>
                            </div>
                          </div>
                          <hr className="my-3 " />
                          <div className="row">
                            <div className="col-md-2 mb-3">
                              {" "}
                              <small> Track Order </small>{" "}
                            </div>
                            <div className="col mt-auto">
                              <ProgressBar animated now={progressdata} />
                              <div className="media row justify-content-between ">
                                <div className="flex-col">
                                  <span>
                                    <small className="text-right mr-sm-2">
                                      Delivery Status :{" "}
                                      <span style={{ color: "blue" }}>
                                        {orders.deliveryStatus}
                                      </span>
                                    </small>
                                    <i className="fa fa-circle active"></i>
                                  </span>
                                </div>
                                <div className="col-auto flex-col-auto">
                                  <small className="text-right mr-sm-2">
                                    {orders.deliveryStatus !== "Delivered" && (
                                      <span>
                                        Expected Delivery :{" "}
                                        {orders.expectedDelivery.todaydate} -{" "}
                                        {orders.expectedDelivery.nextdate}
                                      </span>
                                    )}
                                  </small>
                                </div>
                              </div>
                            </div>
                          </div>

                          {orders.deliveryStatus === "Delivered" && (
                            <div className="row mt-4">
                              <div className="product_review">
                                <label htmlFor="review">
                                  Write a Review ({data.name})
                                </label>
                                <br />
                                <textarea
                                  onChange={(e) =>
                                    setProductReview(e.target.value)
                                  }
                                  cols="110"
                                  rows="4"
                                  style={{
                                    resize: "none",
                                    border: "1px solid",
                                    borderRadius: "10px",
                                  }}
                                ></textarea>
                                <br />
                                <button
                                  className="btn btn-primary"
                                  onClick={() => handleSubmitReview(data.id)}
                                >
                                  Submit
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}

              <div className="row mt-4">
                <h4>Order Summary</h4>
                <div className="col">
                  <div className="row justify-content-between">
                    <div className="flex-sm-col text-right col">
                      <p className="mb-1">
                        <b>Total Product Price</b>
                      </p>
                    </div>
                    <div className="flex-sm-col col-auto">
                      <p className="mb-1">&#8377;{productAmount}</p>
                    </div>
                  </div>
                  <div className="row justify-content-between">
                    <div className="flex-sm-col text-right col">
                      <p className="mb-1">
                        <b>Coupon Applied</b>
                      </p>
                    </div>
                    <div className="flex-sm-col col-auto">
                      <p className="mb-1">{orders.coupon_name}</p>
                    </div>
                  </div>
                  <div className="row justify-content-between">
                    <div className="flex-sm-col text-right col">
                      <p className="mb-1">
                        <b>Discount</b>
                      </p>
                    </div>
                    <div className="flex-sm-col col-auto">
                      <p className="mb-1">- &#8377;{orders.coupon_amount}</p>
                    </div>
                  </div>
                  <div className="row justify-content-between">
                    <div className="flex-sm-col text-right col">
                      <p className="mb-1">
                        <b>Delivery Charges</b>
                      </p>
                    </div>
                    <div className="flex-sm-col col-auto">
                      <p className="mb-1">&#8377;{orders.shippingAmount}</p>
                    </div>
                  </div>
                  <div className="row justify-content-between">
                    <div className="flex-sm-col text-right col">
                      <p className="mb-1">
                        <b>Total Price</b>
                      </p>
                    </div>
                    <div className="flex-sm-col col-auto">
                      <p className="mb-1">&#8377;{orders.finalAmount}</p>
                    </div>
                  </div>
                </div>
              </div>
              {orders.deliveryStatus === "Delivered" && (
                <div className="row invoice">
                  <div className="col">
                    <p className="mb-1">
                      {" "}
                      Invoice Id : #{orders.razorpay_order_id}
                    </p>
                    <p className="mb-1">Invoice Date : {orders.deliverydate}</p>
                  </div>
                </div>
              )}
            </div>
            {/* <div className="card-footer">
              <div className="jumbotron-fluid">
                <div className="row justify-content-between ">
                  <div className="col-sm-auto col-auto my-auto">
                    <img
                      className="img-fluid my-auto align-self-center "
                      src="https://i.imgur.com/7q7gIzR.png"
                      width="115"
                      height="115"
                    />
                  </div>
                  <div className="col-auto my-auto ">
                    <h2 className="mb-0 font-weight-bold">TOTAL PAID</h2>
                  </div>
                  <div className="col-auto my-auto ml-auto">
                    <h1 className="display-3 ">&#8377; 5,528</h1>
                  </div>
                </div>
                <div className="row mb-3 mt-3 mt-md-0">
                  <div className="col-auto border-line">
                    {" "}
                    <small className="text-white">PAN:AA02hDW7E</small>
                  </div>
                  <div className="col-auto border-line">
                    {" "}
                    <small className="text-white">CIN:UMMC20PTC </small>
                  </div>
                  <div className="col-auto ">
                    <small className="text-white">GSTN:268FD07EXX </small>{" "}
                  </div>
                </div>
              </div>
            </div> */}
          </div>
        </div>
      </div>
    </>
  );
};

export default MyOrderDetail;
