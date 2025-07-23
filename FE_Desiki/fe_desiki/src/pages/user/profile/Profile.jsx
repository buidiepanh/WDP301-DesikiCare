import React, { useState } from "react";
import { Layout } from "antd";
import {
  UserOutlined,
  LockOutlined,
  ShoppingOutlined,
  GiftOutlined,
  EnvironmentOutlined,
} from "@ant-design/icons";

import PersonalInfo from "./components/PersonalInfo";
import ChangePassword from "./components/ChangePassword";
import OrderHistory from "./components/OrderHistory";
import GameRewardHistory from "./components/GameRewardHistory";
import ShippingAddresses from "./components/ShippingAddresses";

import "./Profile.css"; 

const { Content } = Layout;

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
      console.log("ALo: ", res);
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
        return null;
    }
  };

  return (
    <div className="profile-container">
      <div className="profile-content">
        <div className="profile-layout">
          <div className="profile-left">
            <div className="profile-menu">
              <div
                className={`profile-menu-item ${
                  selectedKey === "1" ? "active" : ""
                }`}
                onClick={() => setSelectedKey("1")}
              >
                <UserOutlined />
                <span>Thông tin cá nhân</span>
              </div>
              <div
                className={`profile-menu-item ${
                  selectedKey === "2" ? "active" : ""
                }`}
                onClick={() => setSelectedKey("2")}
              >
                <LockOutlined />
                <span>Đổi mật khẩu</span>
              </div>
              <div
                className={`profile-menu-item ${
                  selectedKey === "3" ? "active" : ""
                }`}
                onClick={() => setSelectedKey("3")}
              >
                <ShoppingOutlined />
                <span>Lịch sử đơn hàng</span>
              </div>
              <div
                className={`profile-menu-item ${
                  selectedKey === "4" ? "active" : ""
                }`}
                onClick={() => setSelectedKey("4")}
              >
                <GiftOutlined />
                <span>Phần thưởng sự kiện</span>
              </div>
              <div
                className={`profile-menu-item ${
                  selectedKey === "5" ? "active" : ""
                }`}
                onClick={() => setSelectedKey("5")}
              >
                <EnvironmentOutlined />
                <span>Địa chỉ giao hàng</span>
              </div>
            </div>
          </div>

          <div className="profile-right">{renderContent()}</div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
