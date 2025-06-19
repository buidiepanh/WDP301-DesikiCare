import React, { useEffect, useState } from "react";
import {
  Layout,
  Typography,
  Form,
  Input,
  Button,
  Divider,
  List,
  message,
  Popconfirm,
  Avatar,
  Table,
  Modal,
  DatePicker,
  Select,
  Upload,
  Image,
  Tag,
} from "antd";
import {
  getMe,
  updateAccount,
  addAddress,
  setDefaultAddress,
  deleteAddress,
  getAllOrders,
  getOrderDetail,
} from "../../../services/apiServices";
import { UserOutlined, UploadOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import toast from "react-hot-toast";
import "./Profile.css";

const { Content } = Layout;
const { Title } = Typography;
const { Option } = Select;

const Profile = () => {
  const [form] = Form.useForm();
  const [passwordForm] = Form.useForm();
  const [addressForm] = Form.useForm();
  const [user, setUser] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [orders, setOrders] = useState([]);
  const [orderDetail, setOrderDetail] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [avatarBase64, setAvatarBase64] = useState("");
  const [previewAvatar, setPreviewAvatar] = useState("");

  const fetchProfile = async () => {
    try {
      const res = await getMe();
      const acc = res.account;

      form.setFieldsValue({
        fullName: acc.fullName || "",
        email: acc.email || "",
        phoneNumber: acc.phoneNumber || "",
        gender: acc.gender || "",
        dob: acc.dob ? dayjs(acc.dob) : null,
      });

      setUser(acc);
      setAddresses(res.deliveryAddresses || []);
      setAvatarBase64(acc.imageBase64 || "");
      setPreviewAvatar("");
    } catch (err) {
      message.error("Không thể tải thông tin người dùng.");
    }
  };

  const fetchOrders = async () => {
    try {
      const res = await getAllOrders();
      setOrders(res);
    } catch {
      message.error("Không thể tải danh sách đơn hàng.");
    }
  };

  const handleUploadAvatar = (file) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      setAvatarBase64(reader.result);
      setPreviewAvatar(reader.result);
    };
    return false;
  };

  const handleUpdate = async (values) => {
    try {
      const payload = {
        account: {
          ...values,
          dob: values.dob ? values.dob.toISOString() : null,
          email: user.email,
          password: "",
          roleId: user.roleId,
          imageBase64: avatarBase64 || user.imageBase64 || "",
        },
      };

      await updateAccount(user._id, payload);
      toast.success("Cập nhật thông tin thành công!");
      fetchProfile();
    } catch {
      toast.error("Cập nhật thất bại.");
    }
  };

  const handleChangePassword = async (values) => {
    const { currentPassword, newPassword, confirmPassword } = values;
    if (newPassword !== confirmPassword) {
      toast.error("Mật khẩu xác nhận không khớp.");
      return;
    }

    try {
      const payload = {
        account: {
          fullName: user.fullName,
          email: user.email,
          phoneNumber: user.phoneNumber,
          gender: user.gender,
          dob: user.dob,
          roleId: user.roleId,
          imageBase64: avatarBase64 || "",
          password: newPassword,
        },
      };

      await updateAccount(user._id, payload);
      toast.success("Đổi mật khẩu thành công!");
      passwordForm.resetFields();
    } catch (err) {
      console.error("Lỗi đổi mật khẩu:", err);
      toast.error("Đổi mật khẩu thất bại.");
    }
  };

  const handleAddAddress = async (values) => {
    try {
      await addAddress(user._id, values);
      toast.success("Thêm địa chỉ thành công!");
      addressForm.resetFields();
      fetchProfile();
    } catch {
      toast.error("Thêm địa chỉ thất bại.");
    }
  };

  const handleSetDefault = async (id) => {
    try {
      await setDefaultAddress(id);
      toast.success("Đã đặt làm mặc định.");
      fetchProfile();
    } catch {
      toast.error("Thất bại khi đặt địa chỉ mặc định.");
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteAddress(id);
      toast.success("Xoá địa chỉ thành công!");
      fetchProfile();
    } catch {
      toast.error("Không thể xoá địa chỉ.");
    }
  };

  const handleViewDetail = async (orderId) => {
    try {
      const detail = await getOrderDetail(orderId);
      setOrderDetail(detail);
      setModalVisible(true);
    } catch {
      message.error("Không thể tải chi tiết đơn hàng.");
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

  const getPaymentStatusColor = (isPaid) => {
    return isPaid ? "green" : "red";
  };

  useEffect(() => {
    fetchProfile();
    fetchOrders();
  }, []);

  return (
    <Layout className="profile-container">
      <Content className="profile-content">
        <div className="profile-layout">
          <div className="profile-left">
            <div className="profile-avatar">
              <Avatar
                size={96}
                src={previewAvatar || avatarBase64 || user?.imageUrl}
                icon={<UserOutlined />}
                style={{ border: "2px solid #e0e0e0", backgroundColor: "#f0f0f0" }}
              />

              <Upload
                showUploadList={false}
                beforeUpload={handleUploadAvatar}
                accept="image/*"
              >
                <Button icon={<UploadOutlined />} style={{ marginTop: 8 }}>
                  Chọn ảnh đại diện
                </Button>
              </Upload>
              <Avatar size={96} src={user?.imageUrl} icon={<UserOutlined />} />
              <Title level={4} style={{ marginTop: 12 }}>
                Thông tin cá nhân
              </Title>
            </div>

            <Form layout="vertical" form={form} onFinish={handleUpdate}>
              <Form.Item label="Họ tên" name="fullName">
                <Input size="large" />
              </Form.Item>
              <Form.Item label="Email" name="email">
                <Input size="large" disabled />
              </Form.Item>
              <Form.Item label="Số điện thoại" name="phoneNumber">
                <Input size="large" />
              </Form.Item>
              <Form.Item label="Ngày sinh" name="dob">
                <DatePicker format="DD/MM/YYYY" style={{ width: "100%" }} />
              </Form.Item>
              <Form.Item label="Giới tính" name="gender">
                <Select size="large" placeholder="Chọn giới tính">
                  <Option value="male">Nam</Option>
                  <Option value="female">Nữ</Option>
                </Select>
              </Form.Item>
              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  size="large"
                  style={{ backgroundColor: "#ec407a", borderColor: "#ec407a" }}
                  block
                >
                  Cập nhật
                </Button>
              </Form.Item>
            </Form>

            <Divider />

            <Title level={5}>Đổi mật khẩu</Title>
            <Form layout="vertical" form={passwordForm} onFinish={handleChangePassword}>
              <Form.Item label="Mật khẩu hiện tại" name="currentPassword" rules={[{ required: true }]}>
            <Form
              layout="vertical"
              form={passwordForm}
              onFinish={handleChangePassword}
            >
              <Form.Item
                label="Mật khẩu hiện tại"
                name="currentPassword"
                rules={[{ required: true }]}
              >
                <Input.Password size="large" />
              </Form.Item>
              <Form.Item label="Mật khẩu mới" name="newPassword" rules={[{ required: true }]}>
              <Form.Item
                label="Mật khẩu mới"
                name="newPassword"
                rules={[{ required: true }]}
              >
                <Input.Password size="large" />
              </Form.Item>
              <Form.Item label="Xác nhận mật khẩu mới" name="confirmPassword" rules={[{ required: true }]}>
              <Form.Item
                label="Xác nhận mật khẩu mới"
                name="confirmPassword"
                rules={[{ required: true }]}
              >
                <Input.Password size="large" />
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit" block>
                  Đổi mật khẩu
                </Button>
                <Button type="primary" htmlType="submit" block>
                  Đổi mật khẩu
                </Button>
              </Form.Item>
            </Form>

            <Divider />

            <Title level={5}>Địa chỉ giao hàng</Title>
            <Form
              layout="vertical"
              form={addressForm}
              onFinish={handleAddAddress}
            >
              <Form.Item label="Địa chỉ mới" name="address">
                <Input size="large" />
              </Form.Item>
              <Form.Item>
                <Button type="dashed" htmlType="submit" size="large" block>
                  Thêm địa chỉ
                </Button>
              </Form.Item>
            </Form>

            <List
              bordered
              dataSource={addresses}
              className="address-list"
              locale={{ emptyText: "Chưa có địa chỉ nào." }}
              renderItem={(item) => (
                <List.Item
                  actions={[
                    item.isDefault ? (
                      <span style={{ color: "green" }}>Mặc định</span>
                    ) : (
                      <Button type="link" onClick={() => handleSetDefault(item.id)}>
                        Đặt mặc định
                      </Button>
                      <Button
                        type="link"
                        onClick={() => handleSetDefault(item.id)}
                      >
                        Đặt mặc định
                      </Button>
                    ),
                    <Popconfirm title="Xoá địa chỉ?" onConfirm={() => handleDelete(item.id)}>
                      <Button type="link" danger>
                        Xoá
                      </Button>
                    <Popconfirm
                      title="Xoá địa chỉ?"
                      onConfirm={() => handleDelete(item.id)}
                    >
                      <Button type="link" danger>
                        Xoá
                      </Button>
                    </Popconfirm>,
                  ]}
                >
                  {item.address}
                </List.Item>
              )}
            />
          </div>

          <div className="profile-right">
            <Title level={4}>Lịch sử đơn hàng</Title>
            <Table
              dataSource={Array.isArray(orders) ? orders : []}
              rowKey={(record) => record.order._id}
              bordered
              pagination={{ pageSize: 5 }}
              size="middle"
              scroll={{ x: 800 }}
              columns={[
                {
                  title: "Mã đơn hàng",
                  dataIndex: ["order", "_id"],
                  key: "orderId",
                  width: 200,
                  render: (id) => (
                    <span style={{ fontFamily: "monospace", fontSize: "12px" }}>
                      {id.slice(-8)}
                    </span>
                  ),
                },
                {
                  title: "Ngày đặt",
                  dataIndex: ["order", "createdAt"],
                  key: "createdAt",
                  width: 120,
                  render: (date) => new Date(date).toLocaleDateString("vi-VN"),
                },
                {
                  title: "Tổng tiền",
                  dataIndex: ["order", "totalPrice"],
                  key: "totalPrice",
                  width: 120,
                  render: (price) => (
                    <span style={{ fontWeight: "bold", color: "#ec407a" }}>
                      {price?.toLocaleString("vi-VN")}₫
                    </span>
                  ),
                },
                {
                  title: "Trạng thái đơn hàng",
                  dataIndex: ["orderStatus", "name"],
                  key: "orderStatus",
                  width: 140,
                  render: (status) => (
                    <Tag color={getStatusColor(status)}>{status}</Tag>
                  ),
                },
                {
                  title: "Thanh toán",
                  dataIndex: ["order", "isPaid"],
                  key: "isPaid",
                  width: 120,
                  render: (isPaid) => (
                    <Tag color={getPaymentStatusColor(isPaid)}>
                      {isPaid ? "Đã thanh toán" : "Chưa thanh toán"}
                    </Tag>
                  ),
                },
                {
                  title: "Số sản phẩm",
                  dataIndex: "orderItems",
                  key: "itemCount",
                  width: 100,
                  render: (orderItems) => (
                    <span>{orderItems?.length || 0} sản phẩm</span>
                  ),
                },
                {
                  title: "Hành động",
                  key: "action",
                  width: 120,
                  fixed: "right",
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
              ]}
            />
            <Modal
              title={`Chi tiết đơn hàng ${
                orderDetail?.order?.order?._id?.slice(-8) || ""
              }`}
              open={modalVisible}
              onCancel={() => setModalVisible(false)}
              footer={[
                <Button key="close" onClick={() => setModalVisible(false)}>
                  Đóng
                </Button>,
              ]}
              width={800}
            >
              {orderDetail ? (
                <div>
                  {/* Thông tin đơn hàng */}
                  <div style={{ marginBottom: 16 }}>
                    <Title level={5}>Thông tin đơn hàng</Title>
                    <p>
                      <strong>Mã đơn hàng:</strong>{" "}
                      {orderDetail.order.order._id}
                    </p>
                    <p>
                      <strong>Ngày đặt:</strong>{" "}
                      {new Date(
                        orderDetail.order.order.createdAt
                      ).toLocaleString("vi-VN")}
                    </p>
                    <p>
                      <strong>Trạng thái:</strong>{" "}
                      <Tag
                        color={getStatusColor(
                          orderDetail.order.orderStatus?.name
                        )}
                      >
                        {orderDetail.order.orderStatus?.name}
                      </Tag>
                    </p>
                    <p>
                      <strong>Thanh toán:</strong>{" "}
                      <Tag
                        color={getPaymentStatusColor(
                          orderDetail.order.order.isPaid
                        )}
                      >
                        {orderDetail.order.order.isPaid
                          ? "Đã thanh toán"
                          : "Chưa thanh toán"}
                      </Tag>
                    </p>
                    <p>
                      <strong>Điểm sử dụng:</strong>{" "}
                      {orderDetail.order.order.pointUsed} điểm
                    </p>
                  </div>

                  <Divider />

                  <Title level={5}>Chi tiết sản phẩm</Title>
                  <Table
                    dataSource={orderDetail.order.orderItems}
                    rowKey={(record) => record.orderItem._id}
                    pagination={false}
                    size="small"
                    columns={[
                      {
                        title: "Hình ảnh",
                        dataIndex: ["product", "imageUrl"],
                        key: "image",
                        width: 80,
                        render: (imageUrl, record) => (
                          <img
                            src={imageUrl}
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
                            <div style={{ fontSize: "12px", color: "#666" }}>
                              Dung tích: {record.product.volume}ml
                            </div>
                          </div>
                        ),
                      },
                      {
                        title: "Số lượng",
                        dataIndex: ["orderItem", "quantity"],
                        key: "quantity",
                        width: 80,
                        align: "center",
                      },
                      {
                        title: "Đơn giá",
                        dataIndex: ["orderItem", "unitPrice"],
                        key: "unitPrice",
                        width: 120,
                        render: (price) => `${price?.toLocaleString("vi-VN")}₫`,
                      },
                      {
                        title: "Thành tiền",
                        key: "totalPrice",
                        width: 120,
                        render: (_, record) => {
                          const total =
                            record.orderItem.quantity *
                            record.orderItem.unitPrice;
                          return (
                            <span
                              style={{ fontWeight: "bold", color: "#ec407a" }}
                            >
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
                      {orderDetail.order.order.totalPrice?.toLocaleString(
                        "vi-VN"
                      )}
                      ₫
                    </Title>
                  </div>
                </div>
              ) : (
                <div style={{ textAlign: "center", padding: 20 }}>
                  <p>Đang tải chi tiết đơn hàng...</p>
                </div>
              )}
            </Modal>
          </div>
        </div>
      </Content>
    </Layout>
  );
};

export default Profile;
