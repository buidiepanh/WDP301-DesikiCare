import React from "react";
import { Typography, Box, Container } from "@mui/material";
import { Input, Card, Row, Col } from "antd";
import HeaderSkincare from "../../../components/HeaderSkincare";
import FooterSkincare from "../../../components/FooterSkincare";
import CategoryBar from "../../../components/HomePage/CategoryBar";
import PromoCarousel from "../../../components/HomePage/PromoCarousel";
const { Search } = Input;
const { Meta } = Card;

const products = [
  {
    id: 1,
    name: "Kem dưỡng da A",
    price: "350,000₫",
    image: "https://achaumedia.vn/wp-content/uploads/2020/05/dich-v%E1%BB%A5-chup-anh-san-pham-my-pham-1.jpg",
  },
  {
    id: 2,
    name: "Serum B",
    price: "420,000₫",
    image: "https://achaumedia.vn/wp-content/uploads/2020/05/dich-v%E1%BB%A5-chup-anh-san-pham-my-pham-1.jpg",
  },
  {
    id: 3,
    name: "Sữa rửa mặt C",
    price: "150,000₫",
    image: "https://achaumedia.vn/wp-content/uploads/2020/05/dich-v%E1%BB%A5-chup-anh-san-pham-my-pham-1.jpg",
  },
  {
    id: 4,
    name: "Mặt nạ D",
    price: "250,000₫",
    image: "https://achaumedia.vn/wp-content/uploads/2020/05/dich-v%E1%BB%A5-chup-anh-san-pham-my-pham-1.jpg",
  },
];

export default function App() {
  return (
    <>
      {/* Custom Header */}
      <HeaderSkincare />

      {/* Banner + CategoryBar */}
       <Box sx={{ backgroundColor: "#e6f9f2", marginTop: 10, padding:1 }}>
          <CategoryBar />
           
        </Box>
      <Box
      
        // sx={{
        //   height: 300,
        //   backAZZZZgroundImage:
        //     'url("https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1350&q=80")',
        //   backgroundSize: "cover",
        //   backgroundPosition: "center",
        //   display: "flex",
        //   flexDirection: "column",
        //   justifyContent: "center",
        //   color: "white",
        //   textShadow: "2px 2px 4px rgba(0,0,0,0.7)",
        //   mb: 6,
        // }}
        
      >
    
        {/* <Typography
          sx={{
            fontWeight: "bold",
            fontSize: "3rem",
            textAlign: "center",
            mb: 2,
          }}
        >
          Chăm sóc da hoàn hảo
       
        </Typography> */}

        {/* Category Bar nằm trong Box này */}
         <PromoCarousel />
      </Box>

      {/* Danh sách sản phẩm */}
      <Container>
        <Typography variant="h4" gutterBottom fontWeight="bold">
          Sản phẩm nổi bật
        </Typography>
        <Row gutter={[16, 16]}>
          {products.map((product) => (
            <Col key={product.id} xs={24} sm={12} md={8} lg={6}>
              <Card
                hoverable
                cover={<img alt={product.name} src={product.image} />}
              >
                <Meta title={product.name} description={product.price} />
              </Card>
            </Col>
          ))}
        </Row>
      </Container>

      {/* Footer */}
      <FooterSkincare />
    </>
  );
}
