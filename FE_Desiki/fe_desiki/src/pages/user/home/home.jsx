import React from "react";
import { Typography, Box, Container } from "@mui/material";
import { Input, Card, Row, Col } from "antd";
import CategoryBar from "../../../components/HomePage/CategoryBar/CategoryBar";
import PromoCarousel from "../../../components/HomePage/Carousel/PromoCarousel";
import ProductGrid from "../../../components/HomePage/Grid/ProductGrid";
import Brand from "../../../components/HomePage/Brand/Brand";
const { Search } = Input;
const { Meta } = Card;

export default function App() {
  return (
    <>
      {/* Banner + CategoryBar */}
      <Box
        sx={{
          backgroundColor: "#e6f9f2",
          marginTop: 10,
          padding: 1,
          overflow: "hidden",
          borderRadius: 2,
          boxShadow: 2,
        }}
      >
        <CategoryBar />
      </Box>
      <Box
        sx={{
          overflow: "hidden",
          borderRadius: 2,

          backgroundColor: "#fff",
        }}
      >
        <PromoCarousel />
      </Box>
      <Box
        sx={{
          padding: 2,
          textAlign: "center",
          overflow: "hidden",
          borderRadius: 2,

          backgroundColor: "#fff",
        }}
      >
        <Brand />
      </Box>
      {/* Danh sách sản phẩm */}
      <Container>
        <Typography variant="h4" gutterBottom fontWeight="bold">
          Sản phẩm nổi bật
        </Typography>
        <ProductGrid />
      </Container>
    </>
  );
}
