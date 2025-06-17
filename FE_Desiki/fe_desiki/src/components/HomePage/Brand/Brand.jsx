import React from "react";
import { Carousel, Card, Row, Col } from "antd";

const brandList = [
  { name: "La Roche-Posay", color: "#E3F2FD" },
  { name: "Vichy", color: "#FFF3E0" },
  { name: "Bioderma", color: "#FCE4EC" },
  { name: "Avene", color: "#E8F5E9" },
  { name: "Eucerin", color: "#F3E5F5" },
  { name: "Cetaphil", color: "#FFEBEE" },
  { name: "Paula's Choice", color: "#E0F7FA" },
  { name: "The Ordinary", color: "#F9FBE7" },
  { name: "Obagi", color: "#EDE7F6" },
];

// Group array into chunks of 3
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
      <Carousel autoplay dots={false}>
        {groupedBrands.map((group, index) => (
          <div key={index}>
            <Row gutter={24} justify="center">
              {group.map((brand, idx) => (
                <Col key={idx} xs={22} sm={12} md={8}>
                  <Card
                    style={{
                      height: 150,
                      backgroundColor: brand.color,
                      borderRadius: 16,
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      fontSize: 20,
                      fontWeight: "bold",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                    }}
                  >
                    {brand.name}
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
