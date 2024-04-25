import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import "../css/ProductDetail.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCartShopping,
  faCircleCheck,
  faStar,
  faStarHalfAlt,
} from "@fortawesome/free-solid-svg-icons";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";

import Carousel from "react-bootstrap/Carousel";
import Loader from "../components/Loader";
import toast from "react-hot-toast";
import getUserCookie from "../Auth/getUserCookie";

const ProductDetail = (props) => {
  const authUser = props.authUser;
  const user = authUser.state;
  const location = useLocation();
  const params = useParams();
  const navigate = useNavigate();

  const product_id = params.product_id;
  const category_id = params.category_id;
  const userHeaders = getUserCookie();
  const [productDetail, setProductDetail] = useState([]);
  const [productReviewDetail, setProductReviewDetail] = useState([]);
  const [productImageData, setProductImageData] = useState([]);
  const [category, setCategory] = useState([]);

  const getallProductImageData = async (product_id) => {
    const res = await axios.get(
      `${process.env.REACT_APP_SERVER_URL}/api/getallImageProductData/${product_id}`,userHeaders
    );
    const data = res.data;
    if (data) {
      setProductImageData(data);
    }
  };

  const getProductData = async (product_id) => {
    const res = await axios.get(
      `${process.env.REACT_APP_SERVER_URL}/api/getProductData/${product_id}`,userHeaders
    );
    const data = res.data[0];

    if (data) {
      setProductDetail(data);
    }
  };

  const getProductReviewData = async (product_id) => {
    const res = await axios.get(
      `${process.env.REACT_APP_SERVER_URL}/api/getProductReviewData/${product_id}`,userHeaders
    );
    const data = res.data;

    if (data) {
      setProductReviewDetail(data);
    }
  };

  const getallCategoryData = async (category_id) => {
    const res = await axios.get(
      `${process.env.REACT_APP_SERVER_URL}/api/getallCategoryData`,userHeaders
    );
    const data = res.data;

    if (data) {
      const finalcategory = data.filter((data) => data.id === category_id)[0];

      if (finalcategory) {
        setCategory(finalcategory);
      }
    }
  };

  useEffect(() => {
    getallProductImageData(product_id);
    getProductData(product_id);
    getallCategoryData(category_id);
    getProductReviewData(product_id);
  }, [product_id, category_id]);

  const [quantity, setquantity] = useState(1);

  const handleCart = async () => {
    try {
      const res = await axios.post("/addtoCart", {
        email: user.email,
        address: user.address,
        quantity: quantity,
        product_id: productDetail.id,
      },userHeaders);
      let message = res.data.message;

      if (message === "success") {
        getallProductImageData(product_id);
        getProductData(product_id);
        getallCategoryData(category_id);
        toast.success("Added to Cart", { duration: 1500 });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleBuy = async () => {
    try {
      const res = await axios.post("/addtoCart", {
        email: user.email,
        address: user.address,
        quantity: quantity,
        product_id: productDetail.id,
      },userHeaders);
      let message = res.data.message;

      if (message === "success") {
        toast.success("Added to Cart", { duration: 1500 });
        navigate("/addtocart");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      {productDetail.length !== 0 ? (
        <section className="product">
          <div className="card-wrapper">
            <div className="card">
              <div className="product-imgs">
                <div className="img-select">
                  <div className="img-item">
                    <Carousel>
                      {productImageData.map((data) => {
                        return (
                          <Carousel.Item interval={3000} key={data.id}>
                            <img
                              src={`${data.imageUrl}`}
                              className="d-block w-100"
                              alt="..."
                            />
                          </Carousel.Item>
                        );
                      })}
                    </Carousel>
                  </div>
                </div>
              </div>

              <div className="product-content">
                <h2 className="product-title">{productDetail.name}</h2>
                <a href="/" className="product-link">
                  visit Store
                </a>
                <div className="product-rating">
                  <FontAwesomeIcon icon={faStar} className="stars" />
                  <FontAwesomeIcon icon={faStar} className="stars" />
                  <FontAwesomeIcon icon={faStar} className="stars" />
                  <FontAwesomeIcon icon={faStar} className="stars" />
                  <FontAwesomeIcon icon={faStarHalfAlt} className="stars" />
                  <span>4.7(21)</span>
                </div>

                <div className="product-price">
                  <p className="new-price">
                    Price:{" "}
                    <span>
                      Rs. {new Intl.NumberFormat().format(productDetail.price)}
                    </span>
                  </p>
                  <p className="last-price">
                    Old Price:{" "}
                    <span>
                      Rs.{" "}
                      {new Intl.NumberFormat().format(productDetail.oldprice)}
                    </span>
                  </p>
                </div>

                <div className="product-detail">
                  <h2>about this item: </h2>
                  <p>{productDetail.description}</p>
                  <ul>
                    <li>
                      <FontAwesomeIcon icon={faCircleCheck} />
                      Color: &nbsp;&nbsp;<span> Navy Blue </span>
                    </li>
                    <li>
                      <FontAwesomeIcon icon={faCircleCheck} />
                      Available: &nbsp;&nbsp;<span>In stock</span>
                    </li>
                    <li>
                      <FontAwesomeIcon icon={faCircleCheck} />
                      Category: &nbsp;&nbsp;<span>{category.name}</span>
                    </li>
                    <li>
                      <FontAwesomeIcon icon={faCircleCheck} />
                      Shipping Area: &nbsp;&nbsp;<span>Kurla, Andheri ...</span>
                    </li>
                    <li>
                      <FontAwesomeIcon icon={faCircleCheck} />
                      Shipping Fee: &nbsp;&nbsp;<span>Free</span>
                    </li>
                  </ul>
                </div>

                <div className="purchase-info">
                  <div className="val">
                    <label>Number of items: </label>
                    <input
                      type="number"
                      name="quantity"
                      value={quantity}
                      onKeyDown={(e) => e.preventDefault()}
                      onChange={(e) => setquantity(e.target.value)}
                      min={1}
                    />
                  </div>

                  {user.name ? (
                    <div className="buyButton">
                      <button type="button" className="btn" onClick={handleBuy}>
                        Buy
                        <FontAwesomeIcon icon={faCartShopping} />
                      </button>
                      <button
                        type="submit"
                        className="btn"
                        id="Orderrr"
                        onClick={handleCart}
                      >
                        Add to Cart <FontAwesomeIcon icon={faCartShopping} />
                      </button>
                    </div>
                  ) : (
                    <button type="btn" className="btn" id="login">
                      <Link
                        to="/login"
                        className="login_link"
                        state={{ path: location.pathname }}
                      >
                        Login
                      </Link>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-12">
              <div className="review_title">
                <h4>Product Reviews</h4>
              </div>
              {productReviewDetail.length !== 0 &&
                productReviewDetail.map((data, i) => {
                  return (
                    <div className="review_card" key={i}>
                      <div className="mw-md mw-lg-none mx-auto">
                        <div className="mb-12 pb-12 border-bottom border-dark-light">
                          <div className="d-flex mb-6 align-items-center">
                            <div className="me-4">
                              <img
                                className="img-fluid"
                                src={`${data.image_src}`}
                                alt="UserProfile"
                                style={{ width: "2rem", height: "2rem" }}
                              />
                            </div>
                            <div>
                              <span className="d-block fw-bold">
                                {data.name}
                              </span>
                              <span>
                                <FontAwesomeIcon
                                  icon={faStar}
                                  style={{ color: "rgb(223, 223, 77)" }}
                                />
                                <FontAwesomeIcon
                                  icon={faStar}
                                  style={{ color: "rgb(223, 223, 77)" }}
                                />
                                <FontAwesomeIcon
                                  icon={faStar}
                                  style={{ color: "rgb(223, 223, 77)" }}
                                />
                                <FontAwesomeIcon
                                  icon={faStar}
                                  style={{ color: "rgb(223, 223, 77)" }}
                                />
                              </span>
                            </div>
                          </div>
                          <p
                            className="text-muted mb-0"
                            style={{ paddingLeft: "3rem" }}
                          >
                            {data.review}
                          </p>
                          <h6
                            style={{
                              display: "flex",
                              justifyContent: "end",
                              fontSize: "12px",
                            }}
                          >
                            Date Posted : {data.date}
                          </h6>
                        </div>
                      </div>
                    </div>
                  );
                })}

              {productReviewDetail.length === 0 && (
                <div className="no_content">
                  <h4 className="font-weight-bold">No Reviews</h4>
                </div>
              )}
            </div>
          </div>
        </section>
      ) : (
        <div className="loader_div">
          <Loader />
        </div>
      )}
    </>
  );
};

export default ProductDetail;
