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
import image2 from "../../../assets/authen/authen_background2.jpg";
import { useNavigate } from "react-router-dom";
import { auth, provider } from "../../../config/firebase";
import { signInWithPopup } from "firebase/auth";
import toast from "react-hot-toast";

const { Title, Text, Link } = Typography;
const { Content } = Layout;

const Login = () => {
  const navigate = useNavigate();

  const onFinish = (values) => {
    const { email, password } = values;
    try {
      // await signInWithEmailAndPassword(auth, email, password);
      if (email === "buidiepanh@gmail.com" && password === "123") {
        toast.success("Đăng nhập thành công!");
        navigate("/");
      } else {
        toast.error("Email hoặc mật khẩu đúng. Vui lòng thử lại!");
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
            Chào mừng bạn quay trở lại với Desiki Care, nơi hành trình hướng tới
            làn da khỏe mạnh và rạng rỡ của bạn được tiếp nối. Chúng tôi cam kết
            kết hợp giữa chăm sóc da chuyên nghiệp và mỹ phẩm đạt chuẩn y khoa,
            mang đến cho bạn những gì tốt nhất trong lĩnh vực làm đẹp và chăm
            sóc sức khỏe. Hãy đăng nhập để khám phá các giải pháp chăm sóc da cá
            nhân hóa, những ưu đãi độc quyền và lời khuyên chuyên sâu được thiết
            kế riêng dành cho bạn.
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
                style={{
                  backgroundColor: "#ec407a",
                  borderColor: "#ec407a",
                }}
              >
                Đăng nhập
              </Button>
            </Form.Item>

            <Text style={{ display: "block", textAlign: "center" }}>
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

          <Text
            style={{
              textAlign: "center",
              fontSize: "12px",
              color: "#aaa",
              marginTop: "20px",
            }}
          >
            © 2025 Desiki Care. Đã đăng ký bản quyền.
          </Text>
        </div>
      </Content>
    </Layout>
  );
};

export default Login;
