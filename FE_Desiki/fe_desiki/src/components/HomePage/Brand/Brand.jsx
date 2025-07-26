import React from "react";
import { Carousel, Card, Row, Col } from "antd";
import "./styles.css";

const brandList = [
  { name: "La Roche-Posay", color: "#E3F2FD", image: "/images/brands/br1.png" },
  { name: "Vichy", color: "#FFF3E0", image: "/images/brands/br2.webp" },
  { name: "Bioderma", color: "#FCE4EC", image: "/images/brands/br3.png" },
  { name: "Avene", color: "#E8F5E9", image: "/images/brands/br4.png" },
  { name: "Eucerin", color: "#F3E5F5", image: "/images/brands/br5.jpg" },
  { name: "Cetaphil", color: "#FFEBEE", image: "/images/brands/br6.png" },
  {
    name: "Paula's Choice",
    color: "#E0F7FA",
    image: "/images/brands/br7.webp",
  },
  { name: "The Ordinary", color: "#F9FBE7", image: "/images/brands/br8.jpg" },
  { name: "Obagi", color: "#EDE7F6", image: "/images/brands/br9.jpg" },
];

const groupIntoChunks = (array, chunkSize) => {
  const result = [];
  for (let i = 0; i < array.length; i += chunkSize) {
    result.push(array.slice(i, i + chunkSize));
  }
  return result;
};

function Brand() {
  const groupedBrands = groupIntoChunks(brandList, 3);

  return (
    <div className="brand-section">
      <div className="brand-title">
        <h2>Thương hiệu Dược Mỹ Phẩm Uy Tín</h2>
        <p className="brand-subtitle">
          Khám phá những thương hiệu dược mỹ phẩm hàng đầu thế giới được tin
          tưởng bởi hàng triệu người
        </p>
      </div>

      <div className="brand-carousel">
        <Carousel
          autoplay
          dots={true}
          arrows={true}
          autoplaySpeed={3000}
          speed={800}
          effect="fade"
        >
          {groupedBrands.map((group, index) => (
            <div key={index} className="brand-slide">
              <Row gutter={[24, 24]} justify="center">
                {group.map((brand, idx) => (
                  <Col key={idx} xs={24} sm={12} md={8}>
                    <Card className="brand-card" bodyStyle={{ padding: 0 }}>
                      <div className="brand-badge">Premium</div>
                      <div className="brand-image-container">
                        <img
                          src={brand.image}
                          alt={brand.name}
                          className="brand-image"
                        />
                      </div>
                      <div className="brand-info">
                        <h3 className="brand-name">{brand.name}</h3>
                      </div>
                    </Card>
                  </Col>
                ))}
              </Row>
            </div>
          ))}
        </Carousel>
      </div>
    </div>
  );
}

export default Brand;
