import React from "react";
import { Layout, Form, Input, Button, Typography, Divider, Space } from "antd";
import {
  UserOutlined,
  LockOutlined,
  GoogleOutlined,
  FacebookFilled,
} from "@ant-design/icons";

const { Title, Text, Link } = Typography;
const { Content } = Layout;

const Login = () => {
  const onFinish = (values) => {
    console.log("Login success:", values);
  };

  return (
    <Layout style={{ minHeight: "100vh", flexDirection: "row" }}>
      {/* Left Side - Cosmetic Image */}
      <Content
        style={{
          flex: 1,
          background: "linear-gradient(135deg, #fde2e4, #f9d5ec)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          padding: "40px",
        }}
      >
        <img
          src="https://images.unsplash.com/photo-1600180758890-6a482df16b22?auto=format&fit=crop&w=700&q=80"
          alt="Cosmetic banner"
          style={{
            borderRadius: "24px",
            width: "80%",
            maxWidth: "500px",
            marginBottom: "30px",
            boxShadow: "0 12px 32px rgba(0, 0, 0, 0.15)",
          }}
        />
        <Title style={{ color: "#c2185b", textAlign: "center", marginTop: 0 }}>
          Desiki Care
        </Title>
        <Text
          style={{
            textAlign: "center",
            color: "#6a1b9a",
            maxWidth: "360px",
            fontSize: "16px",
            lineHeight: 1.5,
          }}
        >
          Professional skincare & medical-grade cosmetics, crafted for your
          beauty and wellness.
        </Text>
      </Content>

      {/* Right Side - Login Form */}
      <Content
        style={{
          flex: 1,
          background: "#fff",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "40px",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: "400px",
            padding: "40px",
            borderRadius: "16px",
            boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
            border: "1px solid #f3c6d3",
            display: "flex",
            flexDirection: "column",
            gap: "16px",
          }}
        >
          {/* Logo */}
          <div style={{ textAlign: "center" }}>
            <img
              src="https://cdn-icons-png.flaticon.com/512/3771/3771541.png"
              alt="logo"
              style={{ width: "60px", marginBottom: "10px" }}
            />
          </div>

          <Title
            level={2}
            style={{ color: "#c2185b", textAlign: "center", marginBottom: 0 }}
          >
            Sign In
          </Title>
          <Text
            type="secondary"
            style={{ textAlign: "center", fontSize: "14px" }}
          >
            Welcome back! Please login to your account.
          </Text>

          <Form layout="vertical" name="loginForm" onFinish={onFinish}>
            <Form.Item
              label="Email"
              name="email"
              rules={[
                { required: true, message: "Please enter your email!" },
                { type: "email", message: "Invalid email format!" },
              ]}
            >
              <Input
                prefix={<UserOutlined />}
                placeholder="Enter your email"
                size="large"
              />
            </Form.Item>

            <Form.Item
              label="Password"
              name="password"
              rules={[
                { required: true, message: "Please enter your password!" },
              ]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="Enter your password"
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
                Login
              </Button>
            </Form.Item>

            <Text style={{ display: "block", textAlign: "center" }}>
              Don’t have an account?{" "}
              <Link href="/register" style={{ color: "#c2185b" }}>
                Create one
              </Link>
            </Text>

            <Divider style={{ borderColor: "#f0f0f0" }}>or</Divider>

            <Space direction="vertical" style={{ width: "100%" }}>
              <Button icon={<GoogleOutlined />} block>
                Sign in with Google
              </Button>
              <Button
                icon={<FacebookFilled />}
                block
                style={{ backgroundColor: "#3b5998", color: "#fff" }}
              >
                Sign in with Facebook
              </Button>
            </Space>
          </Form>

          <Text
            style={{
              textAlign: "center",
              fontSize: "12px",
              color: "#aaa",
              marginTop: "20px",
            }}
          >
            © 2025 BeautyCare. All rights reserved.
          </Text>
        </div>
      </Content>
    </Layout>
  );
};

export default Login;
