import React from "react";
import { Carousel, Card, Row, Col } from "antd";

const brandList = [
  { name: "La Roche-Posay", color: "#E3F2FD", image: "/images/brands/br1.png" },
  { name: "Vichy", color: "#FFF3E0", image: "/images/brands/br2.webp" },
  { name: "Bioderma", color: "#FCE4EC", image: "/images/brands/br3.png" },
  { name: "Avene", color: "#E8F5E9", image: "/images/brands/br4.png" },
  { name: "Eucerin", color: "#F3E5F5", image: "/images/brands/br5.jpg" },
  { name: "Cetaphil", color: "#FFEBEE", image: "/images/brands/br6.png" },
  { name: "Paula's Choice", color: "#E0F7FA", image: "/images/brands/br7.webp" },
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
    <div style={{ padding: "40px 24px", backgroundColor: "#fafafa" }}>
      <h2 style={{ textAlign: "center", color: "#1890ff", marginBottom: 32 }}>
        Thương hiệu Dược Mỹ Phẩm Uy Tín
      </h2>
      <Carousel autoplay dots={false} arrows>
        {groupedBrands.map((group, index) => (
          <div key={index}>
            <Row gutter={24} justify="center">
              {group.map((brand, idx) => (
                <Col key={idx} xs={22} sm={12} md={8}>
                  <Card
                    style={{
                      height: 180,
                      borderRadius: 16,
                      overflow: "hidden",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                      padding: 0,
                      backgroundColor: "transparent",
                    }}
                    bodyStyle={{ padding: 0 }}
                  >
                    <img
                      src={brand.image}
                      alt={brand.name}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        display: "block",
                      }}
                    />
                  </Card>
                </Col>
              ))}
            </Row>
          </div>
        ))}
      </Carousel>
    </div>
  );
}

export default Brand;
