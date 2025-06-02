import React, { useEffect, useRef, useState } from "react";
import { Typography, Button, Card, Progress } from "antd";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import "./FlashSale.css";
import { useNavigate } from "react-router";

// Dữ liệu gốc (không lặp lại)
const baseProducts = [
  {
    img: "https://bizweb.dktcdn.net/100/141/194/products/00502179-loreal-micellar-water-refreshing-400ml-nuoc-tay-trang-danh-cho-da-hon-hop-va-da-dau-2651-63db-large-f1207fa49a.jpg?v=1699015415277",
    name: "Nước Tẩy Trang LOreal Làm Sạch Sâu Trang Điểm 400ml",
    price: 158000,
    oldPrice: 279000,
    discount: 43,
    sold: 40,
  },
  {
    img: "https://img.lazcdn.com/g/p/e0e0b9a7f1299b712e7b883932509497.jpg_720x720q80.jpg",
    name: "Phấn Phủ Carslan Dạng Nén Vỏ Đen Màu Tím 8g",
    price: 221000,
    oldPrice: 540000,
    discount: 59,
    sold: 25,
  },
  {
    img: "https://product.hstatic.net/200000551679/product/tay-da-chet-toan-than-cocoon-tu_4141e9e2ed2c4de0bcea91c5d56125e9_1024x1024.jpg",
    name: "Tẩy Da Chết Toàn Thân Cocoon Cà Phê Đắk Lắk 200ml",
    price: 66000,
    oldPrice: 125000,
    discount: 47,
    sold: 83,
  },
  {
    img: "https://tunhalam.com/cdn/shop/files/image_b8cc9599-13fe-41dd-91ff-b3bedd5384d5.jpg?v=1684073642",
    name: "Sữa Rửa Mặt Cetaphil Dịu Lành Cho Da Nhạy Cảm 500ml",
    price: 320000,
    oldPrice: 445000,
    discount: 28,
    sold: 51,
  },
  {
    img: "https://vn-live-01.slatic.net/p/74a9eb2a023284e9c3fc2e04a38a1098.jpg",
    name: "Sữa Rửa Mặt Simple Giúp Da Sạch Thoáng 150ml",
    price: 81000,
    oldPrice: 132000,
    discount: 39,
    sold: 49,
  },
  {
    img: "https://product.hstatic.net/1000134629/product/z6116467131062_b30aa0c732c5a21ca3205460419a6e5a_281c75a206bf44199b15fc5ced09251a.jpg",
    name: "Smoothie Tẩy Da Chết Hương Lựu Đỏ 298g",
    price: 119000,
    oldPrice: 189000,
    discount: 64,
    sold: 64,
  },
];

const repeatProducts = (products, times) =>
  Array.from({ length: times }, () => products).flat();

const FlashSale = () => {
  const [timeLeft, setTimeLeft] = useState(7200); 
  const listRef = useRef(null);
  const navigation = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev <= 1 ? 7200 : prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds) => {
    const h = String(Math.floor(seconds / 3600)).padStart(2, "0");
    const m = String(Math.floor((seconds % 3600) / 60)).padStart(2, "0");
    const s = String(seconds % 60).padStart(2, "0");
    return `${h} : ${m} : ${s}`;
  };

  const scroll = (direction) => {
    const scrollAmount = 220;
    if (listRef.current) {
      listRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const mockProducts = repeatProducts(baseProducts, 2);

  return (
    <div className="flash-sale">
      <div className="flash-sale-header">
        <Typography.Text className="flash-sale-title">
          Flash Deals 🔥
        </Typography.Text>
        <Typography.Text className="flash-sale-timer">
          {formatTime(timeLeft)}
        </Typography.Text>
        <Button type="link" className="flash-sale-view-all" href="/flash-deal-sale">
          Xem tất cả
        </Button>
      </div>

      <div className="flash-sale-body">
        <Button className="nav-btn left" onClick={() => scroll("left")}>
          <LeftOutlined />
        </Button>
        <div className="product-list" ref={listRef}>
          {mockProducts.map((p, idx) => (
            <Card
              onClick={() => navigation(`/products/${p?.id}`)}
              key={idx}
              className="product-card"
              hoverable
              style={{ width: 210 }}
            >
              <div className="product-discount">-{p.discount}%</div>
              <img src={p.img} alt={p.name} className="product-img" />
              <div className="product-info">
                <Typography.Text className="product-name">
                  {p.name}
                </Typography.Text>
                <Typography.Text className="product-price">
                  {new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }).format(p.price)}
                </Typography.Text>
                <Typography.Text delete className="product-old-price">
                  {new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }).format(p.oldPrice)}
                </Typography.Text>
                <Progress
                  percent={p.sold}
                  showInfo={false}
                  strokeColor="#f97316"
                  trailColor="#fcd34d"
                />
                <Typography.Text className="product-sold">
                  {p.sold}% đã bán
                </Typography.Text>
              </div>
            </Card>
          ))}
        </div>
        <Button className="nav-btn right" onClick={() => scroll("right")}>
          <RightOutlined />
        </Button>
      </div>
    </div>
  );
};

export default FlashSale;
