import React, { useEffect, useState } from "react";
import { Button, Modal, Table, Tag, Typography, Divider, Popconfirm } from "antd";
import { getAllOrders, getOrderDetail, getPaymentUrlForOrder } from "../../../../services/apiServices";
const { Title } = Typography;

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [orderDetail, setOrderDetail] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const fetchOrders = async () => {
    const data = await getAllOrders();
    setOrders(data || []);
  };

  const handleViewDetail = async (orderId) => {
    const detail = await getOrderDetail(orderId);
    setOrderDetail(detail);
    setModalVisible(true);
  };

  const handleOrderPayment = async (orderId) => {
    const result = await getPaymentUrlForOrder(orderId);
    if (result?.paymentUrl) window.location.href = result.paymentUrl;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Pending":
        return "orange";
      case "Delivered":
        return "green";
      case "Canceled":
        return "red";
      default:
        return "blue";
    }
  };

  const getPaymentStatusColor = (isPaid) => (isPaid ? "green" : "volcano");

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <>
      <Title level={4}>Lịch sử đơn hàng</Title>
      <Table
        dataSource={orders}
        rowKey={(record) => record.order._id}
        pagination={{ pageSize: 5 }}
        bordered
        scroll={{ x: 800 }}
        columns={[
          {
            title: "Mã đơn hàng",
            dataIndex: ["order", "_id"],
            render: (id) => <span style={{ fontFamily: "monospace" }}>{id.slice(-8)}</span>,
          },
          {
            title: "Ngày đặt",
            dataIndex: ["order", "createdAt"],
            render: (date) => new Date(date).toLocaleDateString("vi-VN"),
          },
          {
            title: "Tổng tiền",
            dataIndex: ["order", "totalPrice"],
            render: (price) => (
              <span style={{ fontWeight: "bold", color: "#ec407a" }}>
                {price?.toLocaleString("vi-VN")}₫
              </span>
            ),
          },
          {
            title: "Trạng thái",
            dataIndex: ["orderStatus", "name"],
            render: (status) => <Tag color={getStatusColor(status)}>{status}</Tag>,
          },
          {
            title: "Thanh toán",
            dataIndex: ["order", "isPaid"],
            render: (isPaid) => (
              <Tag color={getPaymentStatusColor(isPaid)}>
                {isPaid ? "Đã thanh toán" : "Chưa thanh toán"}
              </Tag>
            ),
          },
          {
            title: "Hành động",
            render: (_, record) => (
              <Button type="link" onClick={() => handleViewDetail(record.order._id)}>
                Xem chi tiết
              </Button>
            ),
          },
        ]}
      />

      <Modal
        title={`Chi tiết đơn hàng ${orderDetail?.order?.order?._id?.slice(-8) || ""}`}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        width={800}
        footer={[
          <Button key="close" onClick={() => setModalVisible(false)}>Đóng</Button>,
          !orderDetail?.order?.order?.isPaid && (
            <Button
              key="pay"
              type="primary"
              style={{ backgroundColor: "#ec407a", borderColor: "#ec407a" }}
              onClick={() => handleOrderPayment(orderDetail?.order?.order?._id)}
            >
              Thanh toán
            </Button>
          ),
        ]}
      >
        {orderDetail ? (
          <>
            <Title level={5}>Thông tin đơn hàng</Title>
            <p><strong>Ngày đặt:</strong> {new Date(orderDetail.order.order.createdAt).toLocaleString("vi-VN")}</p>
            <p><strong>Trạng thái:</strong> <Tag color={getStatusColor(orderDetail.order.orderStatus.name)}>{orderDetail.order.orderStatus.name}</Tag></p>
            <p><strong>Thanh toán:</strong> <Tag color={getPaymentStatusColor(orderDetail.order.order.isPaid)}>{orderDetail.order.order.isPaid ? "Đã thanh toán" : "Chưa thanh toán"}</Tag></p>

            <Divider />
            <Title level={5}>Chi tiết sản phẩm</Title>
            <Table
              dataSource={orderDetail.order.orderItems}
              pagination={false}
              rowKey={(r) => r.orderItem._id}
              columns={[
                {
                  title: "Tên sản phẩm",
                  dataIndex: ["product", "name"],
                },
                {
                  title: "Số lượng",
                  dataIndex: ["orderItem", "quantity"],
                  align: "center",
                },
                {
                  title: "Đơn giá",
                  dataIndex: ["orderItem", "unitPrice"],
                  render: (price) => `${price?.toLocaleString("vi-VN")}₫`,
                },
                {
                  title: "Thành tiền",
                  render: (_, record) =>
                    `${(record.orderItem.unitPrice * record.orderItem.quantity).toLocaleString("vi-VN")}₫`,
                },
              ]}
            />
          </>
        ) : (
          <p>Đang tải chi tiết đơn hàng...</p>
        )}
      </Modal>
    </>
  );
};

export default OrderHistory;
