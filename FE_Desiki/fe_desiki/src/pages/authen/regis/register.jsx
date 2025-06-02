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
import { EmailOutlined } from "@mui/icons-material";
import {
  createUserWithEmailAndPassword,
  updateProfile,
  signInWithPopup,
} from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { auth, provider } from "../../../config/firebase";
import image1 from "../../../assets/authen/authen_background1.webp";
import "./Register.css";

const { Title, Text, Link } = Typography;
const { Content } = Layout;

const Register = () => {
  const navigate = useNavigate();

  const onFinish = async (values) => {
    try {
      const { username, phone, password } = values;
      const email = `${phone}@desiki.com`;
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      await updateProfile(userCredential.user, {
        displayName: username,
      });
      message.success("Account created successfully!");
      navigate("/home");
    } catch (error) {
      console.error("Registration error:", error);
      message.error(error.message);
    }
  };

  const handleGoogleSignup = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      message.success(`Welcome ${result.user.displayName}`);
      navigate("/home");
    } catch (error) {
      console.error("Google signup error:", error);
      message.error(error.message);
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
          <Title level={1}>Desiki Care</Title>
          <Text className="register-description">
            Desiki Care là thương hiệu chăm sóc da tiên phong kết hợp hài hòa giữa
            vẻ đẹp tự nhiên và khoa học hiện đại. Chúng tôi cam kết mang đến các
            sản phẩm an toàn và hiệu quả, giúp nuôi dưỡng làn da từ sâu bên trong
            và thúc đẩy sức khỏe lâu dài.
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
          <Text type="secondary" className="register-subtext">
            Tham gia Desiki Care để mở ra hành trình làm đẹp của riêng bạn.
          </Text>

          <Form layout="vertical" name="registerForm" onFinish={onFinish}>
            <Form.Item
              label="Tên người dùng"
              name="username"
              rules={[
                { required: true, message: "Vui lòng nhập tên của bạn!" },
              ]}
            >
              <Input
                prefix={<UserOutlined />}
                placeholder="Vui lòng nhập tên của bạn"
                size="large"
              />
            </Form.Item>

            <Form.Item
              label="Email"
              name="phone"
              rules={[
                { required: true, message: "Vui lòng nhập số điện thoại!" },
              ]}
            >
              <Input
                prefix={<EmailOutlined />}
                placeholder="Nhập số điện thoại của bạn"
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

            <Form.Item
              label="Xác nhận lại mật khẩu"
              name="confirm"
              dependencies={["password"]}
              rules={[
                {
                  required: true,
                  message: "Vui lòng xác nhận lại mật khẩu của bạn!",
                },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("password") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error("Mật khẩu không trùng khớp!")
                    );
                  },
                }),
              ]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="Xác nhận lại mật khẩu"
                size="large"
              />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                size="large"
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

            <Divider style={{ borderColor: "#f0f0f0" }}>or</Divider>

            <Space direction="vertical" style={{ width: "100%" }}>
              <Button
                icon={<GoogleOutlined />}
                block
                onClick={handleGoogleSignup}
              >
                Đăng ký tài khoản với Google
              </Button>
              <Button
                icon={<FacebookFilled />}
                block
                style={{ backgroundColor: "#3b5998", color: "#fff" }}
              >
                Đăng ký tài khoản với Facebook
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
