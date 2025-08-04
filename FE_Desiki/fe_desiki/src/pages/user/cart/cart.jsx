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
  Modal,
  Input,
  Form,
} from "antd";
import { ShoppingOutlined, DeleteOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import {
  addNewOrder,
  changeQuantity,
  checkProductQuantity,
  deleteCartItem,
  getAuthenitcatedUserCart,
  getMe,
  getPaymentUrlForCart,
} from "../../../services/apiServices";
import toast from "react-hot-toast";
const { Title, Text } = Typography;
const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [user, setUser] = useState(null);
  const [deliveryAddresses, setDeliveryAddresses] = useState([]);
  const [isPointModalVisible, setIsPointModalVisible] = useState(false);
  const [pointsToUse, setPointsToUse] = useState(0);
  const [form] = Form.useForm();
  const navigate = useNavigate();
  useEffect(() => {
    fetchAuthenticatedUser();
    fetchAuthenticatedUserCart();
  }, []);
  const fetchAuthenticatedUser = async () => {
    try {
      const result = await getMe();
      setUser(result.account);
      setDeliveryAddresses(result.deliveryAddresses || []);
    } catch (error) {
      console.log(error);
    }
  };
  const fetchAuthenticatedUserCart = async () => {
    try {
      const result = await getAuthenitcatedUserCart();
      const transformed = result?.cartItems.map((item) => ({
        id: item.cartItem._id,
        productId: item.product._id,
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
        toast.error("Xóa sản phẩm thất bại!");
      }
    } catch (error) {
      console.log(error);
    }
  };
  const handlePayment = async () => {
    const defaultAddress = deliveryAddresses.find((addr) => addr.isDefault);
    if (!defaultAddress) {
      toast.error("Vui lòng đặt một địa chỉ giao hàng mặc định.");
      return;
    }
    try {
      // Kiểm tra quantity của từng sản phẩm trong giỏ hàng
      const unavailableProducts = [];
      for (const item of cartItems) {
        const availableQuantity = await checkProductQuantity(item.productId);
        // Kiểm tra nếu sản phẩm hết hàng hoặc không đủ số lượng
        if (availableQuantity <= 0) {
          unavailableProducts.push({
            name: item.name,
            reason: "hết hàng",
          });
        } else if (availableQuantity < item.quantity) {
          unavailableProducts.push({
            name: item.name,
            reason: `chỉ còn ${availableQuantity} sản phẩm`,
            requested: item.quantity,
            available: availableQuantity,
          });
        }
      }
      // Nếu có sản phẩm không khả dụng, hiển thị lỗi
      if (unavailableProducts.length > 0) {
        const errorMessages = unavailableProducts.map((product) => {
          if (product.reason === "hết hàng") {
            return `🚫 ${product.name}: ${product.reason}`;
          } else {
            return `⚠️ ${product.name}: ${product.reason} (bạn đang chọn ${product.requested})`;
          }
        });
        toast.error(
          <div style={{ lineHeight: "1.6" }}>
            <div
              style={{
                fontWeight: "bold",
                fontSize: "16px",
                marginBottom: "12px",
                color: "#d32f2f",
              }}
            >
              ❌ Không thể thanh toán
            </div>
            <div
              style={{
                fontSize: "14px",
                marginBottom: "12px",
                color: "#666",
              }}
            >
              Các sản phẩm sau có vấn đề:
            </div>
            <div
              style={{
                fontSize: "13px",
                backgroundColor: "#fff3cd",
                padding: "8px 12px",
                borderRadius: "6px",
                border: "1px solid #ffeaa7",
                marginBottom: "12px",
                fontFamily: "monospace",
              }}
            >
              {errorMessages.map((msg, index) => (
                <div key={index} style={{ marginBottom: "4px" }}>
                  {msg}
                </div>
              ))}
            </div>
            <div
              style={{
                fontSize: "13px",
                fontStyle: "italic",
                color: "#555",
              }}
            >
              💡 Vui lòng cập nhật số lượng hoặc xóa sản phẩm khỏi giỏ hàng
            </div>
          </div>,
          {
            duration: 5000,
            style: {
              maxWidth: "500px",
              padding: "20px",
              borderRadius: "12px",
              boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
              border: "2px solid #ffcdd2",
            },
          }
        );
        return;
      }
      // Nếu tất cả sản phẩm đều khả dụng, mở modal để chọn điểm
      setPointsToUse(0);
      form.setFieldsValue({ points: 0 });
      setIsPointModalVisible(true);
    } catch (error) {
      toast.error("Thanh toán thất bại.");
      console.log(error);
    }
  };
  const handleConfirmPayment = async () => {
    try {
      const defaultAddress = deliveryAddresses.find((addr) => addr.isDefault);
      const result = await getPaymentUrlForCart(
        pointsToUse,
        defaultAddress._id
      );
      debugger;
      window.location.href = result.paymentLink;
    } catch (error) {
      toast.error("Thanh toán thất bại.");
      console.log(error);
    }
  };
  const handlePointsChange = (value) => {
    const maxUsablePoints = Math.min(user?.points || 0, total - 10000);
    const validPoints = Math.max(0, Math.min(value || 0, maxUsablePoints));
    setPointsToUse(validPoints);
    form.setFieldsValue({ points: validPoints });
  };
  const handleAddNewOrder = async () => {
    const defaultAddress = deliveryAddresses.find((addr) => addr.isDefault);
    if (!defaultAddress) {
      toast.error("Vui lòng đặt một địa chỉ giao hàng mặc định.");
      return;
    }
    try {
      const result = await addNewOrder(user?.points || 0, defaultAddress._id);
      if (result) {
        toast.success("Tạo đơn hàng thành công!");
        navigate("/");
      } else {
        toast.error("Tạo đơn hàng thất bại!");
      }
    } catch (error) {
      toast.error("Lỗi khi tạo đơn hàng.");
      console.log(error);
    }
  };
  const total = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  const maxUsablePoints = Math.min(user?.points || 0, total - 10000);
  const finalTotal = total - pointsToUse;
  return (
    <div style={{ padding: "24px" }}>
      <Title level={2} style={{ color: "#ec407a" }}>
        Giỏ hàng của bạn
      </Title>
      <Divider />
      {/* Modal chọn điểm */}
      <Modal
        title={
          <div
            style={{ fontSize: "18px", fontWeight: "bold", color: "#ec407a" }}
          >
            💰 Sử dụng điểm tích lũy
          </div>
        }
        open={isPointModalVisible}
        onCancel={() => setIsPointModalVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setIsPointModalVisible(false)}>
            Hủy
          </Button>,
          <Button
            key="confirm"
            type="primary"
            style={{ backgroundColor: "#ec407a", borderColor: "#ec407a" }}
            onClick={() => {
              setIsPointModalVisible(false);
              handleConfirmPayment();
            }}
          >
            Xác nhận thanh toán
          </Button>,
        ]}
        width={500}
      >
        <div style={{ padding: "20px 0" }}>
          <div
            style={{
              marginBottom: "20px",
              padding: "15px",
              backgroundColor: "#f8f9fa",
              borderRadius: "8px",
            }}
          >
            <div
              style={{
                fontSize: "16px",
                fontWeight: "bold",
                marginBottom: "10px",
              }}
            >
              📊 Thông tin đơn hàng
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "8px",
              }}
            >
              <span>Tổng tiền hàng:</span>
              <span style={{ fontWeight: "bold" }}>
                {total.toLocaleString()} đ
              </span>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "8px",
              }}
            >
              <span>Điểm sử dụng:</span>
              <span style={{ color: "#ec407a", fontWeight: "bold" }}>
                -{pointsToUse.toLocaleString()} đ
              </span>
            </div>
            <Divider style={{ margin: "10px 0" }} />
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: "18px",
                fontWeight: "bold",
              }}
            >
              <span>Tổng thanh toán:</span>
              <span style={{ color: "#ec407a" }}>
                {finalTotal.toLocaleString()} đ
              </span>
            </div>
          </div>
          <Form form={form} layout="vertical">
            <Form.Item
              label={
                <span style={{ fontSize: "16px", fontWeight: "500" }}>
                  🎯 Số điểm muốn sử dụng
                </span>
              }
              name="points"
            >
              <div
                style={{ display: "flex", gap: "8px", alignItems: "center" }}
              >
                <InputNumber
                  style={{ flex: 1, height: "45px" }}
                  min={0}
                  max={maxUsablePoints}
                  value={pointsToUse}
                  onChange={handlePointsChange}
                  formatter={(value) =>
                    `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  }
                  parser={(value) => value?.replace(/,/g, "") || 0}
                  placeholder="Nhập số điểm..."
                />
                <Button
                  type="primary"
                  ghost
                  style={{
                    borderColor: "#ec407a",
                    color: "white",
                    height: "45px",
                    fontWeight: "600",
                    minWidth: "90px",
                  }}
                  onClick={() => handlePointsChange(maxUsablePoints)}
                  disabled={maxUsablePoints <= 0}
                >
                  🔥 Use Max
                </Button>
              </div>
            </Form.Item>
          </Form>
          <div
            style={{
              padding: "15px",
              backgroundColor: "#e8f5e8",
              borderRadius: "8px",
              marginTop: "15px",
            }}
          >
            <div style={{ fontSize: "14px", marginBottom: "8px" }}>
              <strong>💳 Điểm khả dụng:</strong>{" "}
              {(user?.points || 0).toLocaleString()} điểm
            </div>
            <div style={{ fontSize: "14px", marginBottom: "8px" }}>
              <strong>🔢 Điểm có thể dùng tối đa:</strong>{" "}
              {maxUsablePoints.toLocaleString()} điểm
            </div>
            <div
              style={{ fontSize: "13px", color: "#666", fontStyle: "italic" }}
            >
              ⚠️ Lưu ý: Tổng thanh toán phải ít nhất 10,000đ sau khi trừ điểm
            </div>
          </div>
        </div>
      </Modal>
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
                style={{ backgroundColor: "#ec407a", borderColor: "#ec407a" }}
                onClick={handlePayment}
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