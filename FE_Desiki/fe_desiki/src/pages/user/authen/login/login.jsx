import React from "react";
import {
  Layout,
  Form,
  Input,
  Button,
  Typography,
  Divider,
  Space,
  message,
} from "antd";
import {
  UserOutlined,
  LockOutlined,
  GoogleOutlined,
  FacebookFilled,
} from "@ant-design/icons";
import image2 from "../../../../assets/authen_background2.jpg";
import { useNavigate } from "react-router-dom";
import { auth, provider } from "../../../../config/firebase";
import {
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";

const { Title, Text, Link } = Typography;
const { Content } = Layout;

const Login = () => {
  const navigate = useNavigate();

  const onFinish = async (values) => {
    const { email, password } = values;
    try {
      await signInWithEmailAndPassword(auth, email, password);
      message.success("Login successful!");
      navigate("/home");
    } catch (error) {
      console.error("Login error:", error);
      message.error(error.message);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      message.success(`Welcome ${result.user.displayName}`);
      navigate("/home");
    } catch (error) {
      console.error("Google login error:", error);
      message.error(error.message);
    }
  };

  return (
    <Layout style={{ minHeight: "100vh", flexDirection: "row" }}>
      <Content
        style={{
          flex: 1.5,
          backgroundImage: `url(${image2})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          padding: "40px",
          color: "#fff",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.4)",
            zIndex: 1,
          }}
        />
        <div style={{ position: "relative", zIndex: 2, textAlign: "center" }}>
          <Title style={{ color: "#fff", marginTop: 0 }}>Desiki Care</Title>
          <Text
            style={{
              color: "#eee",
              maxWidth: "360px",
              fontSize: "16px",
              lineHeight: 1.5,
              marginTop: "16px",
            }}
          >
            Welcome back to Desiki Care, where your journey to radiant, healthy
            skin continues. Our commitment to blending professional skincare
            with medical-grade cosmetics ensures you receive only the best in
            beauty and wellness. Log in to access personalized skincare
            solutions, exclusive offers, and expert advice tailored just for
            you.
          </Text>
        </div>
      </Content>

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
              <Button
                icon={<GoogleOutlined />}
                block
                onClick={handleGoogleLogin}
              >
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
            © 2025 Desiki Care. All rights reserved.
          </Text>
        </div>
      </Content>
    </Layout>
  );
};

export default Login;
