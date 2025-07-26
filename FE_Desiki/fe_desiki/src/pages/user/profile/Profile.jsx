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
  Tag,
  Upload,
  Checkbox,
  InputNumber,
} from "antd";
import {
  getMe,
  updateAccount,
  addAddress,
  setDefaultAddress,
  deleteAddress,
  getAllOrders,
  getOrderDetail,
  changePassword,
  getPaymentUrlForOrder,
  getPointHistory,
  getProvince,
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
  const [history, setHistory] = useState([]);
  const [provinceList, setProvinceList] = useState([]);
  const [districtList, setDistrictList] = useState([]);
  const [wardList, setWardList] = useState([]);

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

      setPreviewAvatar(acc.imageUrl || "");
      setAvatarBase64("");
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

  const fetchPointsHistory = async () => {
    try {
      const res = await getPointHistory();
      const formatted = res.gameEventRewardResults.map((item) => {
        return {
          points: item.gameEventRewardResult?.points,
          createdAt: item.gameEventRewardResult?.createdAt,
          gameEvent: {
            eventName: item.gameEvent?.eventName,
            gameName: item.gameEvent?.gameName,
          },
        };
      });
      setHistory(formatted);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchProvince = async () => {
    try {
      const res = await getProvince();
      setProvinceList(res);
    } catch (error) {
      console.log(error);
    }
  };

  const handleProvinceChange = (provinceCode) => {
    const selectedProvince = provinceList.find(
      (item) => item.code === provinceCode
    );
    setDistrictList(selectedProvince?.districts || []);
    addressForm.setFieldsValue({ districtCode: null, wardCode: null });
    setWardList([]);
  };

  const handleDistrictChange = (districtCode) => {
    const selectedDistrict = districtList.find(
      (item) => item.code === districtCode
    );
    setWardList(selectedDistrict?.wards || []);
    addressForm.setFieldsValue({ wardCode: null });
  };

  const handleUpdate = async (values) => {
    try {
      const payload = {
        account: {
          fullName: values.fullName,
          phoneNumber: values.phoneNumber,
          gender: values.gender,
          dob: values.dob ? values.dob.toISOString() : null,
          email: user.email,
          roleId: user.roleId,
          imageBase64: avatarBase64 || user.imageBase64 || "",
          isDeactivated: user.isDeactivated || false,
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
      await changePassword(user._id, currentPassword, newPassword);
      toast.success("Đổi mật khẩu thành công!");
      passwordForm.resetFields();
    } catch (error) {
      toast.error(error.message || "Đổi mật khẩu thất bại.");
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

  const handleAddAddress = async (values) => {
    try {
      const payload = {
        deliveryAddress: {
          provinceCode: Number(values.provinceCode),
          districtCode: Number(values.districtCode),
          wardCode: Number(values.wardCode),
          addressDetailDescription: values.addressDetailDescription,
          receiverName: values.receiverName,
          receiverPhone: values.receiverPhone,
          isDefault: values.isDefault || false,
        },
      };

      await addAddress(user._id, payload);
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

  const handleOrderPayment = async (orderId) => {
    try {
      const result = await getPaymentUrlForOrder(orderId);
      window.location.href = result.paymentLink;
    } catch (error) {
      console.log(error);
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

  const pointHistoryColumns = [
    {
      title: "Thời gian nhận",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (value) => dayjs(value).format("HH:mm DD/MM/YYYY"),
    },
    {
      title: "Số điểm nhận",
      dataIndex: "points",
      key: "points",
      render: (points) => (
        <span style={{ color: "#2e7d32", fontWeight: "bold" }}>
          {points} điểm
        </span>
      ),
    },
    {
      title: "Tên game",
      key: "gameName",
      render: (_, record) => (
        <div>
          <div style={{ fontWeight: "bold" }}>
            {record?.gameEvent?.gameName}
          </div>
          <div style={{ color: "#888", fontSize: 12 }}>
            {record?.gameEvent?.eventName}
          </div>
        </div>
      ),
    },
  ];

  useEffect(() => {
    fetchProfile();
    fetchOrders();
    fetchPointsHistory();
    fetchProvince();
  }, []);

  return (
    <Layout className="profile-container">
      <Content className="profile-content">
        <div className="profile-layout">
          <div className="profile-left">
            <div
              className="profile-avatar"
              style={{ textAlign: "center", marginBottom: 24 }}
            >
              <Avatar
                size={120}
                src={previewAvatar || user?.imageUrl}
                icon={<UserOutlined />}
                style={{
                  marginBottom: 12,
                  border: "3px solid #ec407a",
                  boxShadow: "0 0 8px rgba(0,0,0,0.1)",
                }}
              />
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleUploadAvatar(e.target.files[0])}
                style={{
                  display: "inline-block",
                  marginTop: 8,
                  fontSize: "13px",
                  border: "none",
                }}
              />
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
              <Form.Item
                label="Mật khẩu mới"
                name="newPassword"
                rules={[{ required: true }]}
              >
                <Input.Password size="large" />
              </Form.Item>
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
              </Form.Item>
            </Form>
            <Divider />

            <Title level={4} style={{ marginBottom: 20 }}>
              Địa chỉ giao hàng
            </Title>

            <Form
              layout="vertical"
              form={addressForm}
              onFinish={handleAddAddress}
            >
              <Form.Item
                label="Tỉnh/Thành phố"
                name="provinceCode"
                rules={[
                  { required: true, message: "Vui lòng chọn tỉnh/thành phố" },
                ]}
              >
                <Select
                  placeholder="Chọn tỉnh/thành phố"
                  onChange={handleProvinceChange}
                  showSearch
                  optionFilterProp="children"
                >
                  {provinceList.map((province) => (
                    <Option key={province.code} value={province.code}>
                      {province.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item
                label="Quận/Huyện"
                name="districtCode"
                rules={[
                  { required: true, message: "Vui lòng chọn quận/huyện" },
                ]}
              >
                <Select
                  placeholder="Chọn quận/huyện"
                  onChange={handleDistrictChange}
                  showSearch
                  optionFilterProp="children"
                  disabled={districtList.length === 0}
                >
                  {districtList.map((district) => (
                    <Option key={district.code} value={district.code}>
                      {district.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item
                label="Phường/Xã"
                name="wardCode"
                rules={[{ required: true, message: "Vui lòng chọn phường/xã" }]}
              >
                <Select
                  placeholder="Chọn phường/xã"
                  showSearch
                  optionFilterProp="children"
                  disabled={wardList.length === 0}
                >
                  {wardList.map((ward) => (
                    <Option key={ward.code} value={ward.code}>
                      {ward.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item
                label="Địa chỉ chi tiết"
                name="addressDetailDescription"
                rules={[
                  { required: true, message: "Vui lòng nhập địa chỉ chi tiết" },
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                label="Người nhận"
                name="receiverName"
                rules={[
                  { required: true, message: "Vui lòng nhập tên người nhận" },
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                label="SĐT người nhận"
                name="receiverPhone"
                rules={[
                  { required: true, message: "Vui lòng nhập SĐT người nhận" },
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item name="isDefault" valuePropName="checked">
                <Checkbox>Đặt làm mặc định</Checkbox>
              </Form.Item>

              <Form.Item>
                <Button type="dashed" htmlType="submit" block>
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
                      <Button
                        type="link"
                        onClick={() => handleSetDefault(item._id)}
                      >
                        Đặt mặc định
                      </Button>
                    ),
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
                  <div>
                    <div>
                      <strong>{item.receiverName}</strong> ({item.receiverPhone}
                      )
                    </div>
                    <div>
                      {item.addressDetailDescription}, {item.wardCode},{" "}
                      {item.districtCode}, {item.provinceCode}
                    </div>
                  </div>
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
                !orderDetail?.order?.order?.isPaid && (
                  <Button
                    key="pay"
                    type="primary"
                    style={{
                      backgroundColor: "#ec407a",
                      borderColor: "#ec407a",
                    }}
                    onClick={() =>
                      handleOrderPayment(orderDetail?.order?.order._id)
                    }
                  >
                    Thanh toán
                  </Button>
                ),
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
                    <p
                      style={{ display: "flex", alignItems: "center", gap: 8 }}
                    >
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
            <Divider />
            <Title level={4}>Lịch sử nhận điểm Minigame</Title>
            <Table
              dataSource={history}
              rowKey={(record) => record._id}
              columns={pointHistoryColumns}
              bordered
              size="middle"
              pagination={{ pageSize: 5 }}
              locale={{ emptyText: "Chưa có lịch sử nhận điểm." }}
            />
          </div>
        </div>
      </Content>
    </Layout>
  );
};

export default Profile;
