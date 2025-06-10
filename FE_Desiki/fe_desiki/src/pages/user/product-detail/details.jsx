import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import {
  Row,
  Col,
  Typography,
  Button,
  InputNumber,
  Card,
  Divider,
  Image,
  Tag,
  Space,
  Spin,
} from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { getAllProducts } from "../../../services/apiServices";
import dayjs from "dayjs";

const { Title, Text, Paragraph } = Typography;

function Details() {
  const { productId } = useParams();
  const [productData, setProductData] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProductDetails();
  }, []);

  const fetchProductDetails = async () => {
    try {
      setLoading(true);
      const result = await getAllProducts();
      const foundProduct = result.find(
        (item) => productId === item.product._id
      );
      setProductData(foundProduct);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: "center", paddingTop: 100 }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!productData) return null;

  const {
    product,
    category,
    shipmentProducts,
    productSkinTypes,
    productSkinStatuses,
  } = productData;

  const totalQuantity = shipmentProducts.reduce(
    (sum, item) => sum + (item.shipmentProduct.quantity || 0),
    0
  );

  return (
    <div style={{ padding: "24px", background: "#fff" }}>
      <Button
        type="link"
        icon={<ArrowLeftOutlined />}
        onClick={() => navigate(-1)}
        style={{ marginBottom: 24, color: "#ec407a" }}
      >
        Quay lại
      </Button>

      <Row gutter={[32, 32]}>
        <Col xs={24} md={10}>
          <Card
            bordered={false}
            style={{ background: "#fff0f5", padding: "16px", borderRadius: 8 }}
          >
            <Image
              width="100%"
              src={product.imageUrl}
              alt={product.name}
              style={{ borderRadius: 8 }}
              fallback="https://via.placeholder.com/400x400"
            />
          </Card>
        </Col>

        {/* Product Info */}
        <Col xs={24} md={14}>
          <Title level={3} style={{ marginBottom: 0, color: "#ec407a" }}>
            {product.name}
          </Title>
          <Text type="secondary">{category?.name}</Text>

          <div style={{ marginTop: 12 }}>
            <Text strong style={{ fontSize: 20, color: "#ec407a" }}>
              {product.salePrice.toLocaleString()} đ
            </Text>
          </div>

          <Divider />

          <Paragraph>
            <Text strong>Mô tả: </Text>
            {product.description}
          </Paragraph>

          <Paragraph>
            <Text strong>Thể tích: </Text>
            {product.volume} ml
          </Paragraph>

          <Paragraph>
            <Text strong>Loại da phù hợp: </Text>
            <Space wrap>
              {productSkinTypes.map((skin) => (
                <Tag key={skin._id} color="blue">
                  {skin.name}
                </Tag>
              ))}
            </Space>
          </Paragraph>

          <Paragraph>
            <Text strong>Tình trạng da: </Text>
            <Space wrap>
              {productSkinStatuses.map((status) => (
                <Tag key={status._id} color="red">
                  {status.name}
                </Tag>
              ))}
            </Space>
          </Paragraph>

          <Row gutter={16} align="middle" style={{ marginTop: 12 }}>
            <Col>
              <Text strong>Số lượng còn lại:</Text>
            </Col>
            <Col>
              <InputNumber min={1} value={totalQuantity} disabled />
            </Col>
          </Row>

          <Button
            type="primary"
            size="large"
            style={{
              marginTop: 24,
              backgroundColor: "#ec407a",
              borderColor: "#ec407a",
              borderRadius: 6,
            }}
          >
            Thêm vào giỏ hàng
          </Button>
        </Col>
      </Row>

      {/* Extra Info */}
      <Divider />

      <Title level={4}>Lô hàng gần nhất</Title>
      {shipmentProducts.length > 0 ? (
        <div>
          {shipmentProducts.map(({ shipmentProduct, shipment }) => (
            <Card key={shipmentProduct._id} style={{ marginBottom: 16 }}>
              <Row gutter={16}>
                <Col span={12}>
                  <Text strong>Ngày sản xuất:</Text>{" "}
                  {dayjs(shipmentProduct.manufacturingDate).format(
                    "DD/MM/YYYY"
                  )}
                </Col>
                <Col span={12}>
                  <Text strong>Hạn sử dụng:</Text>{" "}
                  {dayjs(shipmentProduct.expiryDate).format("DD/MM/YYYY")}
                </Col>
              </Row>
              <Row gutter={16} style={{ marginTop: 8 }}>
                <Col span={12}>
                  <Text strong>Giá nhập:</Text>{" "}
                  {shipmentProduct.buyPrice.toLocaleString()} đ
                </Col>
                <Col span={12}>
                  <Text strong>Số lượng:</Text> {shipmentProduct.quantity}
                </Col>
              </Row>
            </Card>
          ))}
        </div>
      ) : (
        <Text type="secondary">Chưa có thông tin lô hàng</Text>
      )}
    </div>
  );
}

export default Details;
