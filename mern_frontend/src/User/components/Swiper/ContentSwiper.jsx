import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/pagination";

import { Autoplay, Pagination } from "swiper/modules";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCartShopping,
  faShare,
  faStar,
  faStarHalfAlt,
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

const ContentSwiper = (props) => {
  const section = props.section;
  const authUser = props.authUser;

  const [productdata, setProductData] = useState([]);
  const [category, setCategory] = useState([]);

  const getallProductData = async (category_id) => {
    const res = await axios.get(`/getallProductData/${category_id}`);
    const data = res.data;
    setProductData(data);
  };

  const getallCategoryData = async (category_id) => {
    const res = await axios.get(`/getallCategoryData`);
    const data = res.data;
    const category = data.filter((data) => data.id === category_id)[0];
    setCategory(category);
  };

  useEffect(() => {
    getallProductData(section.category_id);
    getallCategoryData(section.category_id);
  }, [section]);

  const handleCart = async (productid) => {
    try {
      const res = await axios.post(`/addtoCart`, {
        email: authUser.email,
        address: authUser.address,
        quantity: 1,
        product_id: productid,
      });
      let message = res.data.message;

      if (message === "success") {
        toast.success("Added to Cart", { duration: 1500 });
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className="swiper_container" key={section.category_id}>
        <div className="swiper_header_div">
          <h1>{category.name}</h1>
        </div>

        <Swiper
          slidesPerView={"auto"}
          spaceBetween={30}
          pagination={{
            clickable: true,
          }}
          loop={true}
          modules={[Pagination, Autoplay]}
          className="contentSwiper"
          key={section.category_id}
        >
          {productdata.map((data) => {
            var discount = parseInt(
              ((parseFloat(data.oldprice) - parseFloat(data.price)) * 100) /
                parseFloat(data.oldprice)
            );
            return (
              <SwiperSlide key={data.id}>
                <span className="discount">-{discount}%</span>

                <div className="images">
                  <Link
                    to={`/product_detail/${section.category_id}/${data.id}`}
                  >
                    <img
                      src={`${data.image_src}`}
                      alt=""
                    />
                  </Link>

                  <div className="icons">
                    {authUser.name && (
                      <span onClick={() => handleCart(data.id)}>
                        <FontAwesomeIcon icon={faCartShopping} />
                      </span>
                    )}
                    <span>
                      <FontAwesomeIcon icon={faShare} />
                    </span>
                  </div>
                </div>

                <div className="content">
                  <div className="stars">
                    <FontAwesomeIcon icon={faStar} className="stars" />
                    <FontAwesomeIcon icon={faStar} className="stars" />
                    <FontAwesomeIcon icon={faStar} className="stars" />
                    <FontAwesomeIcon icon={faStar} className="stars" />
                    <FontAwesomeIcon icon={faStarHalfAlt} className="stars" />
                  </div>
                  <p>{data.name}</p>
                  <div className="price">
                    Rs. {data.price}
                    <span>Rs. {data.oldprice}</span>
                  </div>
                </div>
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>
    </>
  );
};

export default ContentSwiper;
