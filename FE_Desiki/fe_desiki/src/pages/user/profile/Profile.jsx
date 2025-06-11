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
import { UserOutlined } from "@ant-design/icons";
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
    } catch (err) {
      message.error("Không thể tải thông tin người dùng.");
    }
  };

  const fetchOrders = async () => {
    try {
      const res = await getAllOrders();
      setOrders(res.orders || []);
    } catch {
      message.error("Không thể tải danh sách đơn hàng.");
    }
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
          imageBase64: "",
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
          imageBase64: "",
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
              <Avatar size={96} src={user?.imageUrl} icon={<UserOutlined />} />
              <Title level={4} style={{ marginTop: 12 }}>Thông tin cá nhân</Title>
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
                <Input.Password size="large" />
              </Form.Item>
              <Form.Item label="Mật khẩu mới" name="newPassword" rules={[{ required: true }]}> 
                <Input.Password size="large" />
              </Form.Item>
              <Form.Item label="Xác nhận mật khẩu mới" name="confirmPassword" rules={[{ required: true }]}> 
                <Input.Password size="large" />
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit" block>Đổi mật khẩu</Button>
              </Form.Item>
            </Form>

            <Divider />

            <Title level={5}>Địa chỉ giao hàng</Title>
            <Form layout="vertical" form={addressForm} onFinish={handleAddAddress}>
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
                      <Button type="link" onClick={() => handleSetDefault(item.id)}>Đặt mặc định</Button>
                    ),
                    <Popconfirm title="Xoá địa chỉ?" onConfirm={() => handleDelete(item.id)}>
                      <Button type="link" danger>Xoá</Button>
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
              rowKey="_id"
              bordered
              pagination={{ pageSize: 5 }}
              size="middle"
              columns={[
                {
                  title: "Mã đơn",
                  dataIndex: "_id",
                },
                {
                  title: "Ngày đặt",
                  dataIndex: "createdAt",
                  render: (date) => new Date(date).toLocaleDateString("vi-VN"),
                },
                {
                  title: "Tổng tiền",
                  dataIndex: "totalAmount",
                  render: (val) => `${val?.toLocaleString()}₫`,
                },
                {
                  title: "Trạng thái",
                  dataIndex: "status",
                },
                {
                  title: "Hành động",
                  render: (_, record) => (
                    <Button type="link" onClick={() => handleViewDetail(record._id)}>
                      Xem chi tiết
                    </Button>
                  ),
                },
              ]}
            />

            <Modal
              title="Chi tiết đơn hàng"
              open={modalVisible}
              onCancel={() => setModalVisible(false)}
              footer={null}
              width={700}
            >
              {orderDetail ? (
                <Table
                  dataSource={orderDetail.orderItems}
                  rowKey="_id"
                  pagination={false}
                  columns={[
                    { title: "Sản phẩm", dataIndex: "productName" },
                    { title: "Số lượng", dataIndex: "quantity" },
                    {
                      title: "Đơn giá",
                      dataIndex: "price",
                      render: (val) => `${val?.toLocaleString()}₫`,
                    },
                  ]}
                />
              ) : (
                <p>Đang tải...</p>
              )}
            </Modal>
          </div>
        </div>
      </Content>
    </Layout>
  );
};

export default Profile;
