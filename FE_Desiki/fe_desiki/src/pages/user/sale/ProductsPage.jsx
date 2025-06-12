import React, { useEffect, useState } from "react";
import { Typography, Card, Row, Col, Tag, Spin } from "antd";
import { useNavigate } from "react-router-dom";
import "./ProductsPage.css";
import CategoryBar from "../../../components/HomePage/CategoryBar/CategoryBar";
import { getAllProducts } from "../../../services/apiServices";

const { Text } = Typography;

const ProductsPage = () => {
  const navigation = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAllProducts();
  }, []);

  const fetchAllProducts = async () => {
    try {
      setLoading(true);
      const result = await getAllProducts();
      const transformed = result.map((item) => ({
        _id: item.product._id,
        name: item.product.name,
        image: item.product.imageurl,
        price: item.product.salePrice,
        skinStatuses: item.productSkinStatuses.map((status) => status.name),
        skinTypes: item.productSkinTypes.map((type) => type.name),
        volume: item.product.volume,
      }));
      setProducts(transformed);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flashsale">
      <CategoryBar />
      <div className="flash-deal-sale">
        <div className="flash-sale-header">
          <Text className="flash-sale-title">
            Các sản phẩm của DesikiCare 🔥
          </Text>
        </div>

        <Spin spinning={loading} size="large">
          <Row gutter={[16, 16]} justify="center">
            {products.map((p, idx) => (
              <Col xs={24} sm={12} md={8} lg={6} xl={4} key={idx}>
                <Card
                  onClick={() => navigation(`/products/${p._id}`)}
                  className="product-card"
                  hoverable
                  style={{ width: "100%" }}
                >
                  <img
                    src={p.image || "/default-image.jpg"}
                    alt={p.name}
                    className="product-img"
                    style={{
                      height: 180,
                      objectFit: "cover",
                      borderRadius: 8,
                      marginBottom: 10,
                    }}
                  />
                  <div className="product-info">
                    <Text
                      strong
                      className="product-name"
                      style={{ display: "block", marginBottom: 5 }}
                    >
                      {p.name}
                    </Text>

                    <Text
                      className="product-price"
                      style={{ color: "#f97316", fontWeight: 600 }}
                    >
                      {new Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      }).format(p.price)}
                    </Text>

                    <Text
                      type="secondary"
                      style={{ display: "block", marginTop: 5 }}
                    >
                      Dung tích: {p.volume}ml
                    </Text>

                    <div style={{ marginTop: 8 }}>
                      <Text type="secondary">Loại da:</Text>
                      <div style={{ marginTop: 4 }}>
                        {p.skinTypes.map((type, index) => (
                          <Tag color="blue" key={index}>
                            {type}
                          </Tag>
                        ))}
                      </div>
                    </div>

                    <div style={{ marginTop: 8 }}>
                      <Text type="secondary">Tình trạng da:</Text>
                      <div style={{ marginTop: 4 }}>
                        {p.skinStatuses.map((status, index) => (
                          <Tag color="green" key={index}>
                            {status}
                          </Tag>
                        ))}
                      </div>
                    </div>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        </Spin>
      </div>
    </div>
  );
};

export default ProductsPage;
