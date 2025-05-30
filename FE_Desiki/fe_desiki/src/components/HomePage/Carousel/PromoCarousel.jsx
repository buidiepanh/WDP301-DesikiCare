import React from "react";
import { Carousel } from "antd";
import "./PromoCarousel.css";
import banner1 from "../../../assets/carousel/banner1.webp";
import banner2 from "../../../assets/carousel/banner2.webp";
import banner3 from "../../../assets/carousel/banner3.webp";
import banner4 from "../../../assets/carousel/banner4.webp";

const contentStyle = {
  width: "100%",
  height: "100%",
  objectFit: "cover",
};

const PromoCarousel = () => {
  return (
    <div className="promo-container">
      <Carousel autoplay autoplaySpeed={5000} dotPosition="bottom">
        <div>
          <img src={banner1} alt="Banner 1" style={contentStyle} />
        </div>
        <div>
          <img src={banner2} alt="Banner 2" style={contentStyle} />
        </div>
        <div>
          <img src={banner3} alt="Banner 3" style={contentStyle} />
        </div>
        <div>
          <img src={banner4} alt="Banner 4" style={contentStyle} />
        </div>
      </Carousel>
    </div>
  );
};

export default PromoCarousel;
