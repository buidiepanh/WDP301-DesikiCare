import React from "react";
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
} from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";

const { Title, Text, Paragraph } = Typography;

function Details() {
  const { productId } = useParams();
  const navigate = useNavigate();

  return (
    <div style={{ padding: "24px" }}>
      {/* Nút quay lại */}
      <Button
        type="link"
        icon={<ArrowLeftOutlined />}
        onClick={() => navigate(-1)}
        style={{ marginBottom: 16, color: "#ec407a" }}
      >
        Quay trở lại
      </Button>

      <Title level={2} style={{ color: "#ec407a" }}>
        Chi tiết sản phẩm
      </Title>

      <Divider />

      <Row gutter={32}>
        {/* Hình ảnh sản phẩm */}
        <Col xs={24} md={10}>
          <Card
            bordered={false}
            style={{ backgroundColor: "#fff0f5", padding: "16px" }}
          >
            <Image
              width="100%"
              src="https://via.placeholder.com/400x400"
              alt="Hình sản phẩm"
              style={{ borderRadius: "8px" }}
            />
          </Card>
        </Col>

        {/* Thông tin sản phẩm */}
        <Col xs={24} md={14}>
          <Title level={3}>Sữa rửa mặt dịu nhẹ</Title>
          <Text type="secondary">Loại: Chăm sóc da</Text>
          <br />
          <Text delete style={{ fontSize: 16 }}>
            150.000 đ
          </Text>{" "}
          <Text strong style={{ fontSize: 20, color: "#ec407a" }}>
            120.000 đ
          </Text>
          <Divider />
          <Paragraph>
            <Text strong>Mô tả: </Text>
            Sản phẩm sữa rửa mặt dịu nhẹ giúp làm sạch sâu, phù hợp với mọi loại
            da, đặc biệt là da nhạy cảm.
          </Paragraph>
          <Row align="middle" gutter={16} style={{ marginTop: 16 }}>
            <Col>
              <Text>Số lượng:</Text>
            </Col>
            <Col>
              <InputNumber min={1} defaultValue={100} disabled />
            </Col>
          </Row>
          <Button
            type="primary"
            size="large"
            style={{
              marginTop: 24,
              backgroundColor: "#ec407a",
              borderColor: "#ec407a",
            }}
          >
            Thêm vào giỏ hàng
          </Button>
        </Col>
      </Row>
    </div>
  );
}

export default Details;
