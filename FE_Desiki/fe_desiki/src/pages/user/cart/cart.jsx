import React, { useEffect, useState } from "react";
import {
  Card,
  Button,
  InputNumber,
  Row,
  Col,
  Typography,
  Divider,
  Popconfirm,
  Empty,
  Checkbox,
} from "antd";
import { ShoppingOutlined, DeleteOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import {
  changeQuantity,
  deleteCartItem,
  getAuthenitcatedUserCart,
  getMe,
  getPaymentUrlForCart,
} from "../../../services/apiServices";
import toast from "react-hot-toast";

const { Title, Text } = Typography;

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetchAuthenticatedUserCart();
    fetchAuthenticatedUser();
  }, []);

  const fetchAuthenticatedUser = async () => {
    try {
      const result = await getMe();
      setUser(result);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchAuthenticatedUserCart = async () => {
    try {
      const result = await getAuthenitcatedUserCart();
      const transformed = result?.cartItems.map((item) => ({
        id: item.cartItem._id,
        name: item.product.name,
        quantity: item.cartItem.quantity,
        image: item.product.image,
        price: item.product.salePrice,
        volume: item.product.volume,
      }));
      setCartItems(transformed);
    } catch (error) {
      console.log(error);
    }
  };

  const handleQuantityChange = async (id, value) => {
    try {
      const result = await changeQuantity(id, value);

      if (result) {
        toast.success("Cập nhật số lượng thành công!");
        fetchAuthenticatedUserCart();
      } else {
        toast.error("Cập nhật số lượng thất bại!");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteItem = async (id) => {
    try {
      const result = await deleteCartItem(id);

      if (result) {
        toast.success("Xóa sản phẩm khỏi giỏ hàng thành công!");
        fetchAuthenticatedUserCart();
      } else {
        toast.error("Xóa sản phẩm khỏi giỏ hàng thất bại!");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handlePayment = async (point, address) => {
    try {
      const result = await getPaymentUrlForCart(point, address);
      window.location.href = result.paymentLink;
    } catch (error) {
      console.log(error);
    }
  };

  const total = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  return (
    <div style={{ padding: "24px" }}>
      <Title level={2} style={{ color: "#ec407a" }}>
        Giỏ hàng của bạn
      </Title>

      <Divider />

      {cartItems?.length === 0 ? (
        <div style={{ textAlign: "center", padding: "40px 0" }}>
          <Empty
            image={
              <ShoppingOutlined style={{ fontSize: 60, color: "#ec407a" }} />
            }
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
          {cartItems?.map((item) => (
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
                  <div
                    style={{
                      width: 100,
                      height: 100,
                      borderRadius: 8,
                      overflow: "hidden",
                      backgroundColor: "#f5f5f5",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  </div>
                </Col>

                <Col flex="auto">
                  <Title level={4} style={{ margin: 0 }}>
                    {item.name}
                  </Title>
                  <Text type="secondary">Dung tích: {item.volume} ml</Text>
                  <br />
                  <Text>{item.price?.toLocaleString()} đ</Text>
                  <br />
                  <Text>Số lượng: </Text>
                  <InputNumber
                    min={1}
                    value={item.quantity}
                    onChange={(value) => handleQuantityChange(item.id, value)}
                  />
                </Col>
                <Col>
                  <Popconfirm
                    title="Xóa sản phẩm này?"
                    okText="Xóa"
                    cancelText="Hủy"
                    onConfirm={() => handleDeleteItem(item.id)}
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
                disabled={cartItems.length === 0}
                style={{ backgroundColor: "#ec407a", borderColor: "#ec407a" }}
                onClick={() =>
                  handlePayment(
                    user?.account?.points,
                    user?.deliveryAddresses[0]?._id
                  )
                }
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
