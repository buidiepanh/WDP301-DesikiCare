// src/pages/user/payment-return/paymentReturn.jsx
import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Spin, Button, Card, Alert } from "antd";
import {
  LoadingOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  WarningOutlined,
} from "@ant-design/icons";
import { addNewOrder } from "../../../services/apiServices";

function PaymentReturn() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const confirmPayment = async () => {
      try {
        const status = searchParams.get("status");
        const newOrderId = searchParams.get("newOrderId");
        const pointUsed = parseInt(searchParams.get("pointUsed")) || 0;
        const deliveryAddressId = searchParams.get("deliveryAddressId");

        if (!newOrderId || !deliveryAddressId) {
          setError("Thiếu thông tin đơn hàng. Vui lòng thử lại!");
          return;
        }

        if (status !== "PAID") {
          setError("Bạn đã hủy thanh toán!");
          return;
        }

        const orderResult = await addNewOrder(pointUsed, deliveryAddressId, newOrderId);
        if (orderResult) {
          setResult(orderResult);
        } else {
          setError("Có lỗi xảy ra khi tạo đơn hàng!");
        }
      } catch (err) {
        console.error(err);
        setError("Có lỗi xảy ra khi xử lý thanh toán!");
      } finally {
        setLoading(false);
      }
    };

    confirmPayment();
  }, [searchParams]);

  const handleViewOrder = () => {
    if (result?.newOrderId) {
      navigate("/profile");
    }
  };

  const handleContinueShopping = () => {
    navigate("/");
  };

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          padding: "20px",
        }}
      >
        <Spin indicator={<LoadingOutlined spin />} size="large" />
        <p style={{ marginTop: "20px", fontSize: "16px" }}>
          Đang xử lý thanh toán...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "20px",
        }}
      >
        <Card style={{ width: "100%", maxWidth: "600px" }}>
          <div style={{ textAlign: "center" }}>
            <CloseCircleOutlined
              style={{ fontSize: "64px", color: "#ff4d4f", marginBottom: "20px" }}
            />
            <h2 style={{ color: "#ff4d4f" }}>Thanh toán thất bại</h2>
            <p style={{ fontSize: "16px", marginBottom: "30px" }}>{error}</p>
            <Button type="primary" size="large" onClick={handleContinueShopping}>
              Quay lại trang chủ
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  if (
    result &&
    result.outOfStockProducts &&
    result.outOfStockProducts.length > 0 &&
    !result.newOrderId
  ) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "20px",
        }}
      >
        <Card style={{ width: "100%", maxWidth: "800px" }}>
          <div style={{ textAlign: "center", marginBottom: "30px" }}>
            <WarningOutlined
              style={{ fontSize: "64px", color: "#faad14", marginBottom: "20px" }}
            />
            <h2 style={{ color: "#faad14" }}>Một số sản phẩm đã hết hàng</h2>
          </div>
          <Alert
            message="Thông tin sản phẩm hết hàng"
            description={
              <div>
                {result.outOfStockProducts.map((item, index) => (
                  <div key={index} style={{ marginBottom: "10px" }}>
                    <strong>{item.product.name}</strong> - Bạn đặt: {item.requestedQuantity}, Còn lại: {item.availableQuantity}
                  </div>
                ))}
                <div style={{ marginTop: "15px" }}>
                  <strong>
                    Chúng tôi đã hoàn lại cho bạn {result.refundPoints} điểm để tiếp tục mua sắm cho các lần sau.
                  </strong>
                  <br />
                  Chân thành xin lỗi vì sự bất tiện này!
                </div>
              </div>
            }
            type="warning"
            showIcon
            style={{ marginBottom: "30px" }}
          />
          <div style={{ textAlign: "center" }}>
            <Button type="primary" size="large" onClick={handleContinueShopping}>
              Tiếp tục mua sắm
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  if (result && result.newOrderId) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "20px",
        }}
      >
        <Card style={{ width: "100%", maxWidth: "600px" }}>
          <div style={{ textAlign: "center" }}>
            <CheckCircleOutlined
              style={{ fontSize: "64px", color: "#52c41a", marginBottom: "20px" }}
            />
            <h2 style={{ color: "#52c41a" }}>Đặt hàng thành công!</h2>
            <p style={{ fontSize: "16px", marginBottom: "20px" }}>
              Đơn hàng của bạn đã được tạo thành công.
            </p>
            {result.gameTicketReward > 0 && (
              <p style={{ fontSize: "14px", color: "#1890ff", marginBottom: "20px" }}>
                🎉 Bạn đã nhận được {result.gameTicketReward} lượt chơi game!
              </p>
            )}
            <div
              style={{
                display: "flex",
                gap: "15px",
                justifyContent: "center",
                marginTop: "30px",
                flexWrap: "wrap",
              }}
            >
              <Button type="primary" size="large" onClick={handleViewOrder}>
                Kiểm tra đơn hàng
              </Button>
              <Button size="large" onClick={handleContinueShopping}>
                Tiếp tục mua sắm
              </Button>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return null;
}

export default PaymentReturn;