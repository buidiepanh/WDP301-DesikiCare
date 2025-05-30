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
  PhoneOutlined,
  GoogleOutlined,
  FacebookFilled,
} from "@ant-design/icons";
import image1 from "../../../assets/authen/authen_background1.jpg";
import { auth, provider } from "../../../config/firebase";
import {
  createUserWithEmailAndPassword,
  updateProfile,
  signInWithPopup,
} from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { EmailOutlined } from "@mui/icons-material";

const { Title, Text, Link } = Typography;
const { Content } = Layout;

const Register = () => {
  const navigate = useNavigate();

  const onFinish = async (values) => {
    try {
      const { username, phone, password } = values;
      const email = `${phone}@desiki.com`; // Firebase requires email format
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
    <Layout style={{ minHeight: "100vh", flexDirection: "row" }}>
      <Content
        style={{
          flex: 1.5,
          backgroundImage: `url(${image1})`,
          backgroundSize: "auto 100%",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          imageRendering: "crisp-edges",
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
        <Title
          style={{
            color: "#fff",
            textAlign: "center",
            marginTop: 0,
            position: "relative",
            zIndex: 2,
          }}
        >
          Desiki Care
        </Title>
        <Text
          style={{
            textAlign: "center",
            color: "#eee",
            maxWidth: "360px",
            fontSize: "16px",
            lineHeight: 1.5,
            position: "relative",
            zIndex: 2,
          }}
        >
          Desiki Care là thương hiệu chăm sóc da tiên phong kết hợp hài hòa giữa
          vẻ đẹp tự nhiên và khoa học hiện đại. Chúng tôi cam kết mang đến các
          sản phẩm an toàn và hiệu quả, giúp nuôi dưỡng làn da từ sâu bên trong
          và thúc đẩy sức khỏe lâu dài. Tại Desiki Care, mỗi bước trong quy
          trình chăm sóc da đều trở thành một nghi thức thư giãn, giúp bạn tỏa
          sáng với sự tự tin và rạng rỡ mỗi ngày.
        </Text>
      </Content>

      <Content
        style={{
          flex: 1,
          backgroundImage:
            "url('https://images.unsplash.com/photo-1526045431048-c5e4e2a3d1c4')",
          backgroundSize: "cover",
          backgroundPosition: "center",
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
            backgroundColor: "rgba(255, 255, 255, 0.9)",
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
            Đăng ký tài khoản
          </Title>
          <Text
            type="secondary"
            style={{ textAlign: "center", fontSize: "14px" }}
          >
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
              name="email"
              rules={[
                { required: true, message: "Vui lòng nhập email!" },
                { type: "email", message: "Email không hợp lệ!" },
              ]}
            >
              <Input
                prefix={<EmailOutlined />}
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
                placeholder="Vui lòng xác nhận lại mật khẩu của bạn"
                size="large"
              />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                size="large"
                block
                style={{ backgroundColor: "#ec407a", borderColor: "#ec407a" }}
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

export default Register;
