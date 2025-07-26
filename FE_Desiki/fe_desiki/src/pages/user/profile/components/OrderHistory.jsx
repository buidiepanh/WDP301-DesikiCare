import React, { useState, useEffect } from "react";
import { Table, Button, Tag, Divider, Modal, Typography } from "antd";
import dayjs from "dayjs";
import toast from "react-hot-toast";
import {
  getAllOrders,
  getOrderDetail,
  getPaymentUrlForOrder,
} from "../../../../services/apiServices";

const { Title } = Typography;

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [orderDetail, setOrderDetail] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await getAllOrders();
        setOrders(res);
      } catch {
        toast.error("Không thể tải danh sách đơn hàng.");
      }
    };

    fetchOrders();
  }, []);

  const handleViewDetail = async (orderId) => {
    try {
      const detail = await getOrderDetail(orderId);
      setOrderDetail(detail);
      setModalVisible(true);
    } catch {
      toast.error("Không thể tải chi tiết đơn hàng.");
    }
  };

  const handleOrderPayment = async (orderId) => {
    try {
      const result = await getPaymentUrlForOrder(orderId);
      window.location.href = result.paymentLink;
    } catch {
      toast.error("Không thể thanh toán.");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Chờ xử lí":
        return "orange";
      case "Đang xử lý":
        return "blue";
      case "Đang giao":
        return "cyan";
      case "Đã giao":
        return "green";
      case "Đã hủy":
        return "red";
      default:
        return "default";
    }
  };

  const getPaymentStatusColor = (isPaid) => (isPaid ? "green" : "red");

  const columns = [
    {
      title: "Mã đơn hàng",
      dataIndex: ["order", "_id"],
      key: "orderId",
      render: (id) => (
        <span style={{ fontFamily: "monospace", fontSize: 12 }}>
          {id?.slice(-8)}
        </span>
      ),
    },
    {
      title: "Ngày đặt",
      dataIndex: ["order", "createdAt"],
      key: "createdAt",
      render: (date) => dayjs(date).format("DD/MM/YYYY"),
    },
    {
      title: "Tổng tiền",
      dataIndex: ["order", "totalPrice"],
      key: "totalPrice",
      render: (price) => (
        <span style={{ fontWeight: "bold", color: "#ec407a" }}>
          {price?.toLocaleString("vi-VN")}₫
        </span>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: ["orderStatus", "name"],
      key: "orderStatus",
      render: (status) => <Tag color={getStatusColor(status)}>{status}</Tag>,
    },
    {
      title: "Thanh toán",
      dataIndex: ["order", "isPaid"],
      key: "isPaid",
      render: (paid) => (
        <Tag color={getPaymentStatusColor(paid)}>
          {paid ? "Đã thanh toán" : "Chưa thanh toán"}
        </Tag>
      ),
    },
    {
      title: "Số sản phẩm",
      dataIndex: "orderItems",
      key: "itemCount",
      render: (items) => <span>{items?.length || 0} sản phẩm</span>,
    },
    {
      title: "Hành động",
      key: "action",
      render: (_, record) => (
        <Button
          type="link"
          size="small"
          onClick={() => handleViewDetail(record.order._id)}
        >
          Xem chi tiết
        </Button>
      ),
    },
  ];

  const currentOrder = orderDetail?.order?.order || {};
  const currentItems = orderDetail?.order?.orderItems || [];
  const currentStatus = orderDetail?.order?.orderStatus;

  return (
    <div className="profile-section">
      <Title level={4}>Lịch sử đơn hàng</Title>

      <Table
        dataSource={orders}
        columns={columns}
        rowKey={(r) => r.order._id}
        pagination={{ pageSize: 5 }}
        scroll={{ x: 800 }}
        bordered
        size="middle"
      />

      <Modal
        title={`Chi tiết đơn ${currentOrder._id?.slice(-8) || ""}`}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setModalVisible(false)}>
            Đóng
          </Button>,
          !currentOrder.isPaid && (
            <Button
              key="pay"
              type="primary"
              style={{ backgroundColor: "#ec407a", borderColor: "#ec407a" }}
              onClick={() => handleOrderPayment(currentOrder._id)}
            >
              Thanh toán
            </Button>
          ),
        ]}
        width={800}
      >
        {orderDetail ? (
          <div>
            <Title level={5}>Thông tin đơn hàng</Title>
            <p>
              <strong>Mã đơn hàng:</strong> {currentOrder._id}
            </p>
            <p>
              <strong>Ngày đặt:</strong>{" "}
              {dayjs(currentOrder.createdAt).format("HH:mm DD/MM/YYYY")}
            </p>
            <p>
              <strong>Trạng thái:</strong>{" "}
              <Tag color={getStatusColor(currentStatus?.name)}>
                {currentStatus?.name}
              </Tag>
            </p>
            <p>
              <strong>Thanh toán:</strong>{" "}
              <Tag color={getPaymentStatusColor(currentOrder.isPaid)}>
                {currentOrder.isPaid ? "Đã thanh toán" : "Chưa thanh toán"}
              </Tag>
            </p>
            <p>
              <strong>Điểm sử dụng:</strong> {currentOrder.pointUsed || 0} điểm
            </p>

            <Divider />
            <Title level={5}>Chi tiết sản phẩm</Title>
            <Table
              dataSource={currentItems}
              rowKey={(r) => r.orderItem._id}
              pagination={false}
              size="small"
              columns={[
                {
                  title: "Hình ảnh",
                  dataIndex: ["product", "imageUrl"],
                  key: "image",
                  render: (img, record) => (
                    <img
                      src={img}
                      alt={record.product.name}
                      style={{
                        width: 50,
                        height: 50,
                        objectFit: "cover",
                        borderRadius: 4,
                      }}
                      onError={(e) => {
                        e.target.src =
                          "https://via.placeholder.com/50x50?text=No+Image";
                      }}
                    />
                  ),
                },
                {
                  title: "Tên sản phẩm",
                  dataIndex: ["product", "name"],
                  key: "productName",
                  render: (name, record) => (
                    <div>
                      <div style={{ fontWeight: "bold" }}>{name}</div>
                      <div style={{ fontSize: 12, color: "#666" }}>
                        Dung tích: {record.product.volume}ml
                      </div>
                    </div>
                  ),
                },
                {
                  title: "Số lượng",
                  dataIndex: ["orderItem", "quantity"],
                  key: "quantity",
                  align: "center",
                },
                {
                  title: "Đơn giá",
                  dataIndex: ["orderItem", "unitPrice"],
                  key: "unitPrice",
                  render: (price) =>
                    `${price?.toLocaleString("vi-VN") || 0}₫`,
                },
                {
                  title: "Thành tiền",
                  key: "totalPrice",
                  render: (_, record) => {
                    const total =
                      record.orderItem.quantity * record.orderItem.unitPrice;
                    return (
                      <span style={{ fontWeight: "bold", color: "#ec407a" }}>
                        {total.toLocaleString("vi-VN")}₫
                      </span>
                    );
                  },
                },
              ]}
            />

            <div style={{ marginTop: 16, textAlign: "right" }}>
              <Title level={4} style={{ color: "#ec407a" }}>
                Tổng cộng:{" "}
                {currentOrder.totalPrice?.toLocaleString("vi-VN") || 0}₫
              </Title>
            </div>
          </div>
        ) : (
          <p>Đang tải chi tiết đơn hàng...</p>
        )}
      </Modal>
    </div>
  );
};

export default OrderHistory;
