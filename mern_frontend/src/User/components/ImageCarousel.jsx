import React from "react";
import Image from "react-bootstrap/Image";
import "../css/ImageCarousel.css";
import Carousel from "react-bootstrap/Carousel";

const ImageCarousel = () => {
  // const [backgroundImg, setbackgroundImg] = useState({});
  const images = [
    {
      id: 1,
      title: "Vivo",
      src: "https://www.91-cdn.com/hub/wp-content/uploads/2023/02/Upcoming-Vivo-phones-in-2023.png",
      description: "Vivi V20",
      interval: 2000,
      color: "white",
    },
    {
      id: 2,
      title: "Redmi",
      src: "https://www.91-cdn.com/hub/wp-content/uploads/2023/12/Redmi-Note-13-Pro-6-768x432.jpg?tr=q-100",
      description: "Redmi-Note-13-Pro-6",
      interval: 2000,
      color: "black",
    },
    {
      id: 3,
      title: "Realme",
      src: "https://www.91-cdn.com/hub/wp-content/uploads/2023/12/realme-xmas-sale.jpg",
      description: "Realme X",
      interval: 2000,
      color: "black",
    },
  ];

  // const handleSelect = (eventKey) => {
  //   let src = images[eventKey].src;
  //   var divImage = {
  //     backgroundImage : "url(" + src + ")"
  //   };
  //   setbackgroundImg(divImage);
  // }

  return (
    <>
      <div className="imgCarousel">
        {/* <div className="ImageBackgroundDiv" style={backgroundImg}> */}
        <Carousel controls={false} pause={false}>
          {images.map((img) => {
            return (
              <Carousel.Item interval={img.interval} key={img.id}>
                <Image src={img.src} className="carouselImg" />
                <Carousel.Caption>
                  <h3 style={{ color: img.color }}>{img.title} </h3>
                  <p style={{ color: img.color }}>{img.description}</p>
                </Carousel.Caption>
              </Carousel.Item>
            );
          })}
        </Carousel>
        {/* </div> */}
      </div>
    </>
  );
};

export default ImageCarousel;
