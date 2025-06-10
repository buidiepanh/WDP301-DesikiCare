import React from "react";
import { Layout, Form, Input, Button, Typography, Divider, Space } from "antd";
import {
  UserOutlined,
  LockOutlined,
  GoogleOutlined,
  FacebookFilled,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import image2 from "../../../assets/authen/authen_background2.jpg";
import "./Login.css";
import { loginFunction } from "../../../services/apiServices";
import axios from "axios";

const { Title, Text, Link } = Typography;
const { Content } = Layout;

const Login = () => {
  const navigate = useNavigate();

  const onFinish = async (values) => {
    try {
      const response = await loginFunction(values.email, values.password);
      const { token } = response;
      sessionStorage.setItem("accessToken", token);

      const user = {
        fullName: values.email.split("@")[0],
        email: values.email,
      };
      sessionStorage.setItem("user", JSON.stringify(user));
      window.dispatchEvent(new Event("userChanged"));

      toast.success("Đăng nhập thành công!");
      navigate("/");
    } catch (error) {
      toast.error("Đăng nhập thất bại!");
      console.error(error);
    }
  };

  return (
    <Layout className="login-layout">
      <Content
        className="login-left"
        style={{ backgroundImage: `url(${image2})` }}
      >
        <div className="login-overlay" />
        <div className="login-left-content">
          <Title style={{ color: "#fff", marginTop: 0 }}>DESIKI CARE</Title>
          <Text
            style={{
              color: "#eee",
              maxWidth: "360px",
              fontSize: "16px",
              lineHeight: 1.5,
              marginTop: "16px",
            }}
          >
            Chào mừng bạn quay trở lại với Desiki Care. Hãy đăng nhập để khám
            phá hành trình chăm sóc làn da khỏe mạnh và tỏa sáng.
          </Text>
        </div>
      </Content>

      <Content className="login-right">
        <div className="login-form-container">
          <div style={{ textAlign: "center" }}>
            <img
              src="https://cdn-icons-png.flaticon.com/512/3771/3771541.png"
              alt="logo"
              className="login-logo"
            />
          </div>

          <Title
            level={2}
            style={{ color: "#c2185b", textAlign: "center", marginBottom: 0 }}
          >
            Đăng nhập
          </Title>
          <Text
            type="secondary"
            style={{ textAlign: "center", fontSize: "14px" }}
          >
            Chào mừng quay trở lại! Vui lòng đăng nhập tài khoản của bạn.
          </Text>

          <Form layout="vertical" name="loginForm" onFinish={onFinish}>
            <Form.Item
              label="Email"
              name="email"
              rules={[
                { required: true, message: "Vui lòng nhập email!" },
                { type: "email", message: "Email không hợp lệ!" },
              ]}
            >
              <Input
                prefix={<UserOutlined />}
                placeholder="Vui lòng nhập email"
                size="large"
              />
            </Form.Item>

            <Form.Item
              label="Mật khẩu"
              name="password"
              rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="Vui lòng nhập mật khẩu"
                size="large"
              />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                size="large"
                block
                style={{
                  backgroundColor: "#ec407a",
                  borderColor: "#ec407a",
                }}
              >
                Đăng nhập
              </Button>
            </Form.Item>

            <Text className="login-register-text">
              Chưa có tài khoản?{" "}
              <Link href="/register" style={{ color: "#c2185b" }}>
                Đăng ký ngay
              </Link>
            </Text>

            <Divider style={{ borderColor: "#f0f0f0" }}>hoặc</Divider>

            <Space direction="vertical" style={{ width: "100%" }}>
              <Button icon={<GoogleOutlined />} block>
                Đăng nhập với Google
              </Button>
              <Button
                icon={<FacebookFilled />}
                block
                style={{ backgroundColor: "#3b5998", color: "#fff" }}
              >
                Đăng nhập với Facebook
              </Button>
            </Space>
          </Form>

          <Text className="login-footer">
            © 2025 Desiki Care. Đã đăng ký bản quyền.
          </Text>
        </div>
      </Content>
    </Layout>
  );
};

export default Login;
