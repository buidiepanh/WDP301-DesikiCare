import React, { useState } from "react";
import {
  Layout,
  Form,
  Input,
  Button,
  Typography,
  DatePicker,
  Select,
  message,
  Divider,
  Space,
} from "antd";
import toast from "react-hot-toast";
import axios from "axios";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
import image1 from "../../../assets/authen/authen_background1.webp";
import "./Register.css";
import { registerFunction } from "../../../services/apiServices";

const { Title, Text, Link } = Typography;
const { Content } = Layout;
const { Option } = Select;

const Register = () => {
  const [form] = Form.useForm();
  const [imageBase64, setImageBase64] = useState("");
  const navigate = useNavigate();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setImageBase64(reader.result.split(",")[1]);
    };
    reader.readAsDataURL(file);
  };

  const onFinish = async (values) => {
    try {
      const payload = {
        account: {
          email: values.email,
          password: values.password,
          fullName: values.fullName,
          phoneNumber: values.phone,
          gender: values.gender,
          dob: values.dob.format("YYYY-MM-DD"),
          roleId: 3,
          imageBase64: imageBase64,
        },
      };

      const response = await registerFunction(payload);

      if (response?.message === "Register successfully") {
        form.resetFields();
        toast.success("Đăng ký thành công!");
        setTimeout(() => navigate("/login"), 1500);
      }
    } catch (error) {
      console.error("Registration error:", error);
      message.error(
        "Đăng ký thất bại: " +
          (error.response?.data?.message || "Lỗi không xác định")
      );
    }
  };

  return (
    <Layout className="register-layout">
      <Content
        className="register-left"
        style={{ backgroundImage: `url(${image1})` }}
      >
        <div className="register-overlay" />
        <div className="register-left-content">
          <Title level={1}>DESIKI CARE</Title>
          <Text className="register-description">
            Desiki Care là thương hiệu chăm sóc da tiên phong kết hợp giữa vẻ
            đẹp tự nhiên và khoa học hiện đại. Chúng tôi mang đến giải pháp làm
            đẹp an toàn và hiệu quả dài lâu.
          </Text>
        </div>
      </Content>

      <Content className="register-right">
        <div className="register-form-container">
          <div style={{ textAlign: "center" }}>
            <img
              src="https://cdn-icons-png.flaticon.com/512/3771/3771541.png"
              alt="logo"
              className="register-logo"
            />
          </div>

          <Title level={2} className="register-title">
            Đăng ký tài khoản
          </Title>

          <Form layout="vertical" form={form} onFinish={onFinish}>
            <Form.Item
              label="Họ và tên"
              name="fullName"
              rules={[{ required: true, message: "Vui lòng nhập họ tên!" }]}
            >
              <Input placeholder="Họ tên đầy đủ" />
            </Form.Item>

            <Form.Item
              label="Email"
              name="email"
              rules={[
                { required: true, message: "Vui lòng nhập email!" },
                { type: "email", message: "Email không hợp lệ!" },
              ]}
            >
              <Input placeholder="example@gmail.com" />
            </Form.Item>

            <Form.Item
              label="Mật khẩu"
              name="password"
              rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
            >
              <Input.Password placeholder="******" />
            </Form.Item>

            <Form.Item
              label="Số điện thoại"
              name="phone"
              rules={[
                { required: true, message: "Vui lòng nhập số điện thoại!" },
              ]}
            >
              <Input placeholder="0123456789" />
            </Form.Item>

            <Form.Item
              label="Giới tính"
              name="gender"
              rules={[{ required: true, message: "Vui lòng chọn giới tính!" }]}
            >
              <Select placeholder="Chọn giới tính">
                <Option value="Nam">Male</Option>
                <Option value="Nữ">Female</Option>
                <Option value="Khác">Other</Option>
              </Select>
            </Form.Item>

            <Form.Item
              label="Ngày sinh"
              name="dob"
              rules={[{ required: true, message: "Vui lòng chọn ngày sinh!" }]}
            >
              <DatePicker style={{ width: "100%" }} />
            </Form.Item>

            <Form.Item label="Ảnh đại diện">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />
              {imageBase64 && <Text type="secondary">Đã chọn ảnh ✅</Text>}
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                block
                className="register-button"
              >
                Đăng ký
              </Button>
            </Form.Item>

            <Text style={{ display: "block", textAlign: "center" }}>
              Đã có tài khoản?{" "}
              <Link href="/login" style={{ color: "#c2185b" }}>
                Đăng nhập ngay
              </Link>
            </Text>

            <Divider style={{ borderColor: "#f0f0f0" }}>hoặc</Divider>

            <Space direction="vertical" style={{ width: "100%" }}>
              <Button block disabled>
                Đăng ký với Google
              </Button>
              <Button
                block
                style={{ backgroundColor: "#3b5998", color: "#fff" }}
                disabled
              >
                Đăng ký với Facebook
              </Button>
            </Space>
          </Form>

          <Text className="register-footer">
            © 2025 Desiki Care. Đã đăng ký bản quyền.
          </Text>
        </div>
      </Content>
    </Layout>
  );
};

export default Register;
