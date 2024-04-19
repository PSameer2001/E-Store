import React, { useEffect, useState } from "react";
import ReactPlayer from "react-player";
import Carousel from "react-bootstrap/Carousel";
import vid1 from "../components/videos/iphone.mp4";
import vid2 from "../components/videos/redmi.mp4";
import vid3 from "../components/videos/redmi1.mp4";
import vid4 from "../components/videos/redmi2.mp4";
import "../css/VideoCarousel.css";

const VideoCarousel = () => {
  const videos = [
    {
      id: 1,
      src: vid1,
      interval: 13000,
    },
    {
      id: 2,
      src: vid2,
      interval: 24000,
    },
    {
      id: 3,
      src: vid3,
      interval: 22000,
    },
    {
      id: 4,
      src: vid4,
      interval: 18000,
    },
  ];
  const [playing, setplaying] = useState(false);

  useEffect(() => {
    setplaying(true);
  }, []);

  return (
    <>
      <div className="videoCarousel">
        <Carousel fade controls={false}>
          {videos.map((video) => {
            return (
              <Carousel.Item key={video.id} interval={video.interval}>
                <ReactPlayer
                  className="react-player"
                  url={video.src}
                  width="100%"
                  height="80vh"
                  playing={playing}
                  loop={playing}
                  muted={playing}
                  playsinline={playing}
                />
              </Carousel.Item>
            );
          })}
        </Carousel>
      </div>
    </>
  );
};

export default VideoCarousel;
