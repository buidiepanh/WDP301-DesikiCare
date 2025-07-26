import React, { useEffect, useState } from "react";

import ProductCard from "../ProductCard/ProductCard";
import { Button, Row, Col } from "antd";
import { getAllProducts } from "../../../services/apiServices";
import { useNavigate } from "react-router";

const ProductGrid = () => {
  const [visibleCount, setVisibleCount] = useState(4);
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchAllProducts();
  }, []);

  const handleLoadMore = () => {
    navigate("/products-page");
  };

  const fetchAllProducts = async () => {
    try {
      const result = await getAllProducts();
      setProducts(result);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Row gutter={[16, 16]}>
        {products?.slice(0, visibleCount).map((product, index) => (
          <Col xs={24} sm={12} md={8} lg={6} key={index}>
            <ProductCard product={product} />
          </Col>
        ))}
      </Row>

      {visibleCount < products?.length && (
        <div style={{ textAlign: "center", marginTop: 24 }}>
          <Button onClick={handleLoadMore} type="primary">
            Xem thêm
          </Button>
        </div>
      )}
    </>
  );
};

export default ProductGrid;
