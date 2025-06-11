import React, { useEffect, useState } from "react";

import ProductCard from "../ProductCard/ProductCard";
import { Button, Row, Col } from "antd";
import { getAllProducts } from "../../../services/apiServices";

const ProductGrid = () => {
  const [visibleCount, setVisibleCount] = useState(8);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchAllProducts();
  }, []);

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 8);
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
