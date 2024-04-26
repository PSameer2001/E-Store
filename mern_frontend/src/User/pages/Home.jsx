/* eslint-disable */
import { useState, useEffect } from "react";
import CategorySwiper from "../components/Swiper/CategorySwiper";
// import ImageCarousel from "../components/ImageCarousel";
import VideoCarousel from "../components/VideoCarousel";
import "../css/Home.css";

import service1 from "../components/images/service-1.png";
import service2 from "../components/images/service-2.png";
import service3 from "../components/images/service-3.png";
import ContentSwiper from "../components/Swiper/ContentSwiper";

import Contact from "../components/Contact";
import Gadgets from "../components/Gadgets";
import CustomerReviewSwiper from "../components/Swiper/CustomerReviewSwiper";
import axios from "axios";

const Home = (props) => {
  const authUser = props.authUser;
  const user = authUser.state;

  const [sectiondata, setSectionData] = useState([]);

  const getallSectionData = async () => {
    const res = await axios.get(`${process.env.REACT_APP_SERVER_URL}/api/getallSectionData`);
    const data = res.data;
    setSectionData(data);
  };

  useEffect(() => {
    getallSectionData();
  }, []);


  return (
    <>
      {/* Carousel */}
      <section className="homecarousel">
        {/* <ImageCarousel /> */}
        <VideoCarousel />
      </section>

      {/* Categories */}
      <section className="categories">
        <CategorySwiper />
      </section>

      {/* Gadgets */}
      <section className="gadgets" id="gadgets">
        {/* <Gadgets /> */}
      </section>

      {/* Contents */}
      {sectiondata.map((section) => {
        return (
          <section className="contents" key={section.id}>
            {section.type === "1" && (
              <ContentSwiper section={section} authUser={user} />
            )}
          </section>
        );
      })}

      {/* Services */}
      <section className="services">
        <div className="heading">
          <h1>Our Service</h1>
          <p>A way to see everyone with perfect </p>
        </div>

        <div className="service">
          <div className="box">
            <img src={service1} alt="" />
            <h3>Free Shipping</h3>
            <p>Get FREE delivery on all orders above 1K!</p>
          </div>

          <div className="box">
            <img src={service2} alt="" />
            <h3>Secure Payment</h3>
            <p>Accepting online payments on Our business website</p>
          </div>

          <div className="box">
            <img src={service3} alt="" />
            <h3>24/7 Support</h3>
            <p>Chat support or call Support available 24/7.</p>
          </div>
        </div>
      </section>

      {/* Customer Review */}
      <section className="customerReviews">
        <CustomerReviewSwiper />
      </section>

      {/* Contact */}
      {user.name && (
        <section className="contact" id="contact">
          <Contact user={user} />
        </section>
      )}
    </>
  );
};

export default Home;
