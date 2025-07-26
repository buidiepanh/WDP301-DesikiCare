import React, { useState, useEffect } from "react";
import { Avatar, Form, Input, Button, DatePicker, Select, Typography, message } from "antd";
import { UserOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import toast from "react-hot-toast";
import { getMe, updateAccount } from "../../../../services/apiServices";

const { Title } = Typography;
const { Option } = Select;

const AvatarAndInfo = () => {
  const [form] = Form.useForm();
  const [user, setUser] = useState(null);
  const [avatarBase64, setAvatarBase64] = useState("");
  const [previewAvatar, setPreviewAvatar] = useState("");

  const fetchProfile = async () => {
    try {
      const res = await getMe();
      const acc = res.account;
      setUser(acc);
      form.setFieldsValue({
        fullName: acc.fullName || "",
        email: acc.email || "",
        phoneNumber: acc.phoneNumber || "",
        gender: acc.gender || "",
        dob: acc.dob ? dayjs(acc.dob) : null,
      });
      setPreviewAvatar(acc.imageUrl || "");
      setAvatarBase64("");
    } catch {
      message.error("Không thể tải thông tin người dùng.");
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

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

  return (
    <div className="profile-section">
      <div style={{ textAlign: "center", marginBottom: 24 }}>
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
          onChange={e => handleUploadAvatar(e.target.files[0])}
          style={{ marginTop: 8, fontSize: "13px", border: "none" }}
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
    </div>
  );
};

export default AvatarAndInfo;
