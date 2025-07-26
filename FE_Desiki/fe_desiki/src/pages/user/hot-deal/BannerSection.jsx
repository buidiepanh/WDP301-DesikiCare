import React from "react";
import { Image } from "antd";
import "./BannerSection.css"; // CSS riêng
import CategoryBar from "../../../components/HomePage/CategoryBar/CategoryBar";
const banners = [
  {
    img: "https://media.hcdn.vn/hsk/campaign/1-6-sale-to-dau-thang-640x240-1748595039.jpg",
    alt: "1.6 Sale To Đầu Tháng",
  },
  {
    img: "https://media.hcdn.vn/hsk/campaign/640x240-1748829693.jpg",
    alt: "Khai trương chi nhánh Cần Thơ",
  },
  {
    img: "https://media.hcdn.vn/hsk/campaign/wap1698114601.jpg",
    alt: "Ưu đãi trải nghiệm làm đẹp hơn 60%",
  },
  {
    img: "https://media.hcdn.vn/hsk/campaign/UnileverSIScovermobile640x2401700822403.png",
    alt: "Unilever Nâng Niu Nét Đẹp Toàn Diện",
  },
  {
    img: "https://media.hcdn.vn/hsk/campaign/640x240-1747906730.jpg",
    alt: "Dược Mỹ Phẩm Giải Pháp Cho Mọi Làn Da",
  },
  {
    img: "https://media.hcdn.vn/hsk/campaign/640x240-1747906730.jpg",
    alt: "Full đồ du lịch",
  },
  {
    img: "https://media.hcdn.vn/hsk/campaign/640-x-240---166-1747905601.jpg",
    alt: "Mẹ Make-up chốt deal hời",
  },
  {
    img: "https://media.hcdn.vn/hsk/campaign/640-x-240---166-1747905601.jpg",
    alt: "Siêu Sale Phái Mạnh",
  },
];

const BannerSection = () => {
  return (
    <div>
      <CategoryBar />

      <div className="banner-container">
        {banners.map((banner, index) => (
          <div className="banner-item" key={index} style={{ textAlign: "center" }}>
            <Image src={banner.img} alt={banner.alt} preview={false} />
            <div className="banner-caption" style={{ marginTop: 8, fontSize: 14, color: "#333" }}>
              {banner.alt}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};


export default BannerSection;
