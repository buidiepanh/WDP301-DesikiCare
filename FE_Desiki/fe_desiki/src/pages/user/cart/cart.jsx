import React, { useState } from "react";
import {
  Card,
  Button,
  InputNumber,
  Row,
  Col,
  Typography,
  Divider,
  Popconfirm,
  message,
  Empty,
} from "antd";
import {
  ShoppingOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const { Title, Text } = Typography;

const initialCartItems = [
  {
    id: 1,
    name: "Sữa rửa mặt dịu nhẹ",
    type: "Chăm sóc da",
    originalPrice: 150000,
    discountedPrice: 120000,
    quantity: 1,
    image: "/images/sua-rua-mat.jpg", 
  },
  {
    id: 2,
    name: "Kem dưỡng ẩm ban đêm",
    type: "Dưỡng ẩm",
    originalPrice: 300000,
    discountedPrice: 240000,
    quantity: 2,
    image: "/images/kem-duong.jpg", 
  },
];

const Cart = () => {
  const [cartItems, setCartItems] = useState(initialCartItems);
  const navigate = useNavigate();

  const handleQuantityChange = (value, id) => {
    setCartItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity: value } : item))
    );
  };

  const handleRemove = (id) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
    message.success("Đã xóa sản phẩm khỏi giỏ hàng");
  };

  const handleCheckout = () => {
    navigate("/payment");
  };

  const total = cartItems.reduce(
    (acc, item) => acc + item.discountedPrice * item.quantity,
    0
  );

  return (
    <div style={{ padding: "24px" }}>
      <Title level={2} style={{ color: "#ec407a" }}>
        Giỏ hàng của bạn
      </Title>

      <Divider />

      {cartItems.length === 0 ? (
        <div style={{ textAlign: "center", padding: "40px 0" }}>
          <Empty
            image={<ShoppingOutlined style={{ fontSize: 60, color: "#ec407a" }} />}
            description={
              <Text style={{ fontSize: 16, color: "#888" }}>
                Giỏ hàng của bạn đang trống
              </Text>
            }
          />
          <Button
            type="primary"
            style={{
              marginTop: 24,
              backgroundColor: "#ec407a",
              borderColor: "#ec407a",
            }}
            href="/"
          >
            Quay lại mua sắm
          </Button>
        </div>
      ) : (
        <>
          {cartItems.map((item) => (
            <Card
              key={item.id}
              style={{
                marginBottom: 16,
                backgroundColor: "#fff0f5",
                border: "1px solid #ec407a",
                borderRadius: 8,
              }}
              bodyStyle={{ padding: "16px" }}
            >
              <Row gutter={16} align="middle">
                <Col>
                  <img
                    src={item.image}
                    alt={item.name}
                    style={{ width: 100, height: 100, objectFit: "cover", borderRadius: 8 }}
                  />
                </Col>
                <Col flex="auto">
                  <Title level={4} style={{ margin: 0 }}>
                    {item.name}
                  </Title>
                  <Text type="secondary">Loại: {item.type}</Text>
                  <br />
                  <Text delete>{item.originalPrice.toLocaleString()} đ</Text>{" "}
                  <Text strong style={{ color: "#ec407a" }}>
                    {item.discountedPrice.toLocaleString()} đ
                  </Text>
                  <br />
                  <Text>Số lượng: </Text>
                  <InputNumber
                    min={1}
                    value={item.quantity}
                    onChange={(value) => handleQuantityChange(value, item.id)}
                  />
                </Col>
                <Col>
                  <Popconfirm
                    title="Xóa sản phẩm này?"
                    onConfirm={() => handleRemove(item.id)}
                    okText="Xóa"
                    cancelText="Hủy"
                  >
                    <Button type="text" danger icon={<DeleteOutlined />}>
                      Xóa
                    </Button>
                  </Popconfirm>
                </Col>
              </Row>
            </Card>
          ))}

          <Divider />

          <Row justify="end">
            <Col>
              <Title level={4} style={{ color: "#ec407a" }}>
                Tổng tiền: {total.toLocaleString()} đ
              </Title>
              <Button
                type="primary"
                size="large"
                style={{ backgroundColor: "#ec407a", borderColor: "#ec407a" }}
                onClick={handleCheckout}
              >
                Tiến hành thanh toán
              </Button>
            </Col>
          </Row>
        </>
      )}
    </div>
  );
};

export default Cart;
