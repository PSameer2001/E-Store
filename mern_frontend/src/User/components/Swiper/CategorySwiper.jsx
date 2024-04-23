import React, { useEffect, useState } from "react";

import { Swiper, SwiperSlide } from "swiper/react";
import {
  Autoplay,
  Pagination,
  Navigation,
  EffectCoverflow,
} from "swiper/modules";
import "swiper/css";
import axios from "axios";
import { Link } from "react-router-dom";

const CategorySwiper = () => {
  const [data, setData] = useState([]);

  const getallCategoryData = async () => {
    const res = await axios.get(`/getallCategoryData`);
    const resdata = res.data;
    setData(resdata);
  };

  useEffect(() => {
    getallCategoryData();
  }, []);

  return (
    <>
      <div className="swiper_container">
        <div className="swiper_header_div">
          <h1>Categories</h1>
        </div>
        {data && (
          <Swiper
            effect={"coverflow"}
            grabCursor={true}
            centeredSlides={true}
            slidesPerView={"auto"}
            loop={false}
            coverflowEffect={{
              rotate: 50,
              stretch: 0,
              depth: 100,
              modifier: 1,
              slideShadows: true,
            }}
            pagination={true}
            navigation={true}
            modules={[Autoplay, Pagination, Navigation, EffectCoverflow]}
            className="mySwiper"
          >
            {data.map((data) => {
              return (
                <SwiperSlide key={data.id}>
                  <Link to={`/category_product/${data.id}`}>
                    <img
                      src={`${data.imageUrl}`}
                      alt={data.name}
                    />
                  </Link>
                </SwiperSlide>
              );
            })}
          </Swiper>
        )}
      </div>
    </>
  );
};

export default CategorySwiper;
