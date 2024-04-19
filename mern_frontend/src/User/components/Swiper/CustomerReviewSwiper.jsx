import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import callsuport from "../images/callsuport.png";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import { Autoplay } from "swiper/modules";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar, faStarHalfAlt } from "@fortawesome/free-solid-svg-icons";

const CustomerReviewSwiper = () => {
  const reviews = [
    {
      id: 1,
      name: "Aditya Patel",
      desc: "Excellent service, vast selection. Competitive prices, occasional product issues quickly resolved. Knowledgeable staff. Recommended for tech enthusiasts seeking variety and quality products.",
    },
    {
      id: 2,
      name: "Neha Reddy",
      desc: "Friendly staff, good prices. Easy to find what I needed. Product quality satisfactory, minor issues resolved promptly. Would recommend to others for their tech needs.",
    },
    {
      id: 3,
      name: "Aarav Gupta",
      desc: "Knowledgeable staff, helpful service. Competitive prices, wide selection. No major issues with products. Highly recommended for all electronic needs. Overall, a satisfying shopping experience.",
    },
    {
      id: 4,
      name: "Pooja Singh",
      desc: "Prompt service, fair prices. Staff knowledgeable about products. Found everything I needed. No complaints about product quality. Satisfying shopping experience, would recommend to friends and family.",
    },
    {
      id: 5,
      name: "Riya Sharma",
      desc: "Great customer service. Wide range of products available. Prices could be more competitive, but product quality is satisfactory. Overall, a decent experience shopping here for electronics.",
    },
    {
      id: 6,
      name: "Vivek Joshi",
      desc: "Quick service, fair prices. Helpful staff, though lacking in-depth product knowledge. Most items found without issue. Some minor product issues encountered but resolved satisfactorily.",
    },
    {
      id: 7,
      name: "Ananya Das",
      desc: "Friendly staff, average prices. Limited selection compared to larger stores. Product quality acceptable, no major issues encountered. Decent shopping experience overall, suitable for basic electronic needs.",
    },
  ];

  return (
    <>
      <div className="heading">
        <h1>Customer Reviews</h1>
        <p>Our Happy Clients Say About Our Service</p>
      </div>

      <Swiper
        slidesPerView={"auto"}
        spaceBetween={30}
        loop={true}
        modules={[Autoplay]}
        className="CR_Swiper"
      >
        {reviews.map((review) => {
          return (
            <SwiperSlide key={review.id}>
              <div className="reviews">
                <div className="stars">
                  <FontAwesomeIcon icon={faStar} className="stars" />
                  <FontAwesomeIcon icon={faStar} className="stars" />
                  <FontAwesomeIcon icon={faStar} className="stars" />
                  <FontAwesomeIcon icon={faStar} className="stars" />
                  <FontAwesomeIcon icon={faStarHalfAlt} className="stars" />
                </div>
                <p>{review.desc}</p>
                <div className="customer">
                  <img src={callsuport} className="img-fluid" alt="cart img" />
                  <div className="customer_name">
                    <h5>{review.name}</h5>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </>
  );
};

export default CustomerReviewSwiper;
