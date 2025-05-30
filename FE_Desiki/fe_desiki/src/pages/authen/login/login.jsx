import React from "react";
import {
  Layout,
  Form,
  Input,
  Button,
  Typography,
  Divider,
  Space,
} from "antd";
import {
  UserOutlined,
  LockOutlined,
  GoogleOutlined,
  FacebookFilled,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { auth, provider } from "../../../config/firebase";
import { signInWithPopup } from "firebase/auth";
import toast from "react-hot-toast";
import image2 from "../../../assets/authen/authen_background2.jpg";
import "./Login.css";

const { Title, Text, Link } = Typography;
const { Content } = Layout;

const Login = () => {
  const navigate = useNavigate();

  const onFinish = (values) => {
    const { email, password } = values;
    try {
      if (email === "buidiepanh@gmail.com" && password === "123") {
        toast.success("Đăng nhập thành công!");
        navigate("/");
      } else {
        toast.error("Email hoặc mật khẩu không đúng. Vui lòng thử lại!");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error(error.message);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      toast.success(`Chào mừng ${result.user.displayName}`);
      navigate("/");
    } catch (error) {
      console.error("Google login error:", error);
      toast.error(error.message);
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
          <Title style={{ color: "#fff", marginTop: 0 }}>Desiki Care</Title>
          <Text className="login-description">
            Chào mừng bạn quay trở lại với Desiki Care, nơi hành trình hướng tới
            làn da khỏe mạnh và rạng rỡ của bạn được tiếp nối. Chúng tôi cam kết
            kết hợp giữa chăm sóc da chuyên nghiệp và mỹ phẩm đạt chuẩn y khoa,
            mang đến cho bạn những gì tốt nhất trong lĩnh vực làm đẹp và chăm
            sóc sức khỏe.
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

          <Title level={2} className="login-title">
            Đăng nhập
          </Title>
          <Text className="login-subtext">
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
              label="Password"
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
                className="login-button"
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

            <Divider style={{ borderColor: "#f0f0f0" }}>or</Divider>

            <Space direction="vertical" style={{ width: "100%" }}>
              <Button
                icon={<GoogleOutlined />}
                block
                onClick={handleGoogleLogin}
              >
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
