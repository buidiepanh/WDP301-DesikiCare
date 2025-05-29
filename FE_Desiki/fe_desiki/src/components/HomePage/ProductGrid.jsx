import React, { useState } from 'react';

import ProductCard from './ProductCard';
import { Button, Row, Col } from 'antd';
const products = [
  {
    img: "https://image.hsv-tech.io/600x600/bbx/common/ced0c2df-afd0-44ef-bc6c-9924cc24e600.webp",
    name: "Nước Tẩy Trang L'Oreal Làm Sạch Sâu Trang Điểm 400ml",
    price: 158000,
    oldPrice: 279000,
    discount: 43,
    sold: 65,
  },
  {
    img: "https://image.hsv-tech.io/600x600/bbx/common/ced0c2df-afd0-44ef-bc6c-9924cc24e600.webp",
    name: "Sữa Rửa Mặt Simple Giúp Da Sạch Thoáng 150ml",
    price: 81000,
    oldPrice: 132000,
    discount: 39,
    sold: 48,
  },
  {
    img: "https://image.hsv-tech.io/600x600/bbx/common/ced0c2df-afd0-44ef-bc6c-9924cc24e600.webp",
    name: "Tẩy Da Chết Cocoon Cà Phê Đắk Lắk 200ml",
    price: 66000,
    oldPrice: 125000,
    discount: 47,
    sold: 83,
  },
  {
    img: "https://image.hsv-tech.io/600x600/bbx/common/ced0c2df-afd0-44ef-bc6c-9924cc24e600.webp",
    name: "Combo 2 Nước Tẩy Trang Bí Đao Cocoon 310ml",
    price: 338000,
    oldPrice: 590000,
    discount: 43,
    sold: 79,
  },
  {
    img: "https://image.hsv-tech.io/600x600/bbx/common/ced0c2df-afd0-44ef-bc6c-9924cc24e600.webp",
    name: "Phấn Phủ Carslan Dạng Nén Màu Tím 8g",
    price: 221000,
    oldPrice: 540000,
    discount: 59,
    sold: 52,
  },
  {
    img: "https://image.hsv-tech.io/600x600/bbx/common/ced0c2df-afd0-44ef-bc6c-9924cc24e600.webp",
    name: "Tẩy Da Chết Smoothie Hương Lựu Đỏ 298g",
    price: 119000,
    oldPrice: 189000,
    discount: 37,
    sold: 64,
  },
  {
    img: "https://image.hsv-tech.io/600x600/bbx/common/ced0c2df-afd0-44ef-bc6c-9924cc24e600.webp",
    name: "Sữa Rửa Mặt Cetaphil Cho Da Nhạy Cảm 500ml",
    price: 320000,
    oldPrice: 445000,
    discount: 28,
    sold: 51,
  },
  {
    img: "https://image.hsv-tech.io/600x600/bbx/common/ced0c2df-afd0-44ef-bc6c-9924cc24e600.webp",
    name: "Kem Chống Nắng Anessa Perfect UV 60ml",
    price: 423000,
    oldPrice: 715000,
    discount: 41,
    sold: 88,
  },
  {
    img: "https://image.hsv-tech.io/600x600/bbx/common/ced0c2df-afd0-44ef-bc6c-9924cc24e600.webp",
    name: "Nước Tẩy Trang Bioderma Sensibio H2O 500ml",
    price: 318000,
    oldPrice: 546000,
    discount: 42,
    sold: 76,
  },
  {
    img: "https://image.hsv-tech.io/600x600/bbx/common/ced0c2df-afd0-44ef-bc6c-9924cc24e600.webp",
    name: "Sữa Rửa Mặt CeraVe Foaming Cleanser 326ml",
    price: 318000,
    oldPrice: 475000,
    discount: 33,
    sold: 72,
  },
   {
    img: "https://image.hsv-tech.io/600x600/bbx/common/ced0c2df-afd0-44ef-bc6c-9924cc24e600.webp",
    name: "Nước Tẩy Trang L'Oreal Làm Sạch Sâu Trang Điểm 400ml",
    price: 158000,
    oldPrice: 279000,
    discount: 43,
    sold: 65,
  },
  {
    img: "https://image.hsv-tech.io/600x600/bbx/common/ced0c2df-afd0-44ef-bc6c-9924cc24e600.webp",
    name: "Sữa Rửa Mặt Simple Giúp Da Sạch Thoáng 150ml",
    price: 81000,
    oldPrice: 132000,
    discount: 39,
    sold: 48,
  },
  {
    img: "https://image.hsv-tech.io/600x600/bbx/common/ced0c2df-afd0-44ef-bc6c-9924cc24e600.webp",
    name: "Tẩy Da Chết Cocoon Cà Phê Đắk Lắk 200ml",
    price: 66000,
    oldPrice: 125000,
    discount: 47,
    sold: 83,
  },
  {
    img: "https://image.hsv-tech.io/600x600/bbx/common/ced0c2df-afd0-44ef-bc6c-9924cc24e600.webp",
    name: "Combo 2 Nước Tẩy Trang Bí Đao Cocoon 310ml",
    price: 338000,
    oldPrice: 590000,
    discount: 43,
    sold: 79,
  },
  {
    img: "https://image.hsv-tech.io/600x600/bbx/common/ced0c2df-afd0-44ef-bc6c-9924cc24e600.webp",
    name: "Phấn Phủ Carslan Dạng Nén Màu Tím 8g",
    price: 221000,
    oldPrice: 540000,
    discount: 59,
    sold: 52,
  },
  {
    img: "https://image.hsv-tech.io/600x600/bbx/common/ced0c2df-afd0-44ef-bc6c-9924cc24e600.webp",
    name: "Tẩy Da Chết Smoothie Hương Lựu Đỏ 298g",
    price: 119000,
    oldPrice: 189000,
    discount: 37,
    sold: 64,
  },
  {
    img: "https://image.hsv-tech.io/600x600/bbx/common/ced0c2df-afd0-44ef-bc6c-9924cc24e600.webp",
    name: "Sữa Rửa Mặt Cetaphil Cho Da Nhạy Cảm 500ml",
    price: 320000,
    oldPrice: 445000,
    discount: 28,
    sold: 51,
  },
  {
    img: "https://image.hsv-tech.io/600x600/bbx/common/ced0c2df-afd0-44ef-bc6c-9924cc24e600.webp",
    name: "Kem Chống Nắng Anessa Perfect UV 60ml",
    price: 423000,
    oldPrice: 715000,
    discount: 41,
    sold: 88,
  },
  {
    img: "https://image.hsv-tech.io/600x600/bbx/common/ced0c2df-afd0-44ef-bc6c-9924cc24e600.webp",
    name: "Nước Tẩy Trang Bioderma Sensibio H2O 500ml",
    price: 318000,
    oldPrice: 546000,
    discount: 42,
    sold: 76,
  },
  {
    img: "https://image.hsv-tech.io/600x600/bbx/common/ced0c2df-afd0-44ef-bc6c-9924cc24e600.webp",
    name: "Sữa Rửa Mặt CeraVe Foaming Cleanser 326ml",
    price: 318000,
    oldPrice: 475000,
    discount: 33,
    sold: 72,
  },
   {
    img: "https://image.hsv-tech.io/600x600/bbx/common/ced0c2df-afd0-44ef-bc6c-9924cc24e600.webp",
    name: "Nước Tẩy Trang L'Oreal Làm Sạch Sâu Trang Điểm 400ml",
    price: 158000,
    oldPrice: 279000,
    discount: 43,
    sold: 65,
  },
  {
    img: "https://image.hsv-tech.io/600x600/bbx/common/ced0c2df-afd0-44ef-bc6c-9924cc24e600.webp",
    name: "Sữa Rửa Mặt Simple Giúp Da Sạch Thoáng 150ml",
    price: 81000,
    oldPrice: 132000,
    discount: 39,
    sold: 48,
  },
  {
    img: "https://image.hsv-tech.io/600x600/bbx/common/ced0c2df-afd0-44ef-bc6c-9924cc24e600.webp",
    name: "Tẩy Da Chết Cocoon Cà Phê Đắk Lắk 200ml",
    price: 66000,
    oldPrice: 125000,
    discount: 47,
    sold: 83,
  },
  {
    img: "https://image.hsv-tech.io/600x600/bbx/common/ced0c2df-afd0-44ef-bc6c-9924cc24e600.webp",
    name: "Combo 2 Nước Tẩy Trang Bí Đao Cocoon 310ml",
    price: 338000,
    oldPrice: 590000,
    discount: 43,
    sold: 79,
  },
  {
    img: "https://image.hsv-tech.io/600x600/bbx/common/ced0c2df-afd0-44ef-bc6c-9924cc24e600.webp",
    name: "Phấn Phủ Carslan Dạng Nén Màu Tím 8g",
    price: 221000,
    oldPrice: 540000,
    discount: 59,
    sold: 52,
  },
  {
    img: "https://image.hsv-tech.io/600x600/bbx/common/ced0c2df-afd0-44ef-bc6c-9924cc24e600.webp",
    name: "Tẩy Da Chết Smoothie Hương Lựu Đỏ 298g",
    price: 119000,
    oldPrice: 189000,
    discount: 37,
    sold: 64,
  },
  {
    img: "https://image.hsv-tech.io/600x600/bbx/common/ced0c2df-afd0-44ef-bc6c-9924cc24e600.webp",
    name: "Sữa Rửa Mặt Cetaphil Cho Da Nhạy Cảm 500ml",
    price: 320000,
    oldPrice: 445000,
    discount: 28,
    sold: 51,
  },
  {
    img: "https://image.hsv-tech.io/600x600/bbx/common/ced0c2df-afd0-44ef-bc6c-9924cc24e600.webp",
    name: "Kem Chống Nắng Anessa Perfect UV 60ml",
    price: 423000,
    oldPrice: 715000,
    discount: 41,
    sold: 88,
  },
  {
    img: "https://image.hsv-tech.io/600x600/bbx/common/ced0c2df-afd0-44ef-bc6c-9924cc24e600.webp",
    name: "Nước Tẩy Trang Bioderma Sensibio H2O 500ml",
    price: 318000,
    oldPrice: 546000,
    discount: 42,
    sold: 76,
  },
  {
    img: "https://image.hsv-tech.io/600x600/bbx/common/ced0c2df-afd0-44ef-bc6c-9924cc24e600.webp",
    name: "Sữa Rửa Mặt CeraVe Foaming Cleanser 326ml",
    price: 318000,
    oldPrice: 475000,
    discount: 33,
    sold: 72,
  },
 
];



const ProductGrid = () => {
  const [visibleCount, setVisibleCount] = useState(8);

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 8);
  };

  return (
    <>
      <Row gutter={[16, 16]}>
        {products.slice(0, visibleCount).map((product, index) => (
          <Col xs={24} sm={12} md={8} lg={6} key={index}>
            <ProductCard product={product} />
          </Col>
        ))}
      </Row>

      {visibleCount < products.length && (
        <div style={{ textAlign: 'center', marginTop: 24 }}>
          <Button onClick={handleLoadMore} type="primary">
            Xem thêm
          </Button>
        </div>
      )}
    </>
  );
};

export default ProductGrid;
