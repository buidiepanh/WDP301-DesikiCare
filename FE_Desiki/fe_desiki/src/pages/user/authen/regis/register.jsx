import React from "react";
import { Layout, Form, Input, Button, Typography, Divider, Space } from "antd";
import {
  UserOutlined,
  LockOutlined,
  PhoneOutlined,
  GoogleOutlined,
  FacebookFilled,
} from "@ant-design/icons";
import image1 from "../../../../assets/authen_background1.jpg";

const { Title, Text, Link } = Typography;
const { Content } = Layout;

const Register = () => {
  const onFinish = (values) => {
    console.log("Register success:", values);
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
          Desiki Care is a pioneering skincare brand that seamlessly blends
          natural beauty with modern science. We are dedicated to providing safe
          and effective products designed to nourish your skin deeply and
          promote lasting health. At Desiki Care, every step of your skincare
          routine becomes a relaxing ritual that empowers you to shine with
          confidence and radiance every day. Join us as we explore innovative
          beauty solutions and embark on a journey toward comprehensive skin
          wellness.
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
            Create Account
          </Title>
          <Text
            type="secondary"
            style={{ textAlign: "center", fontSize: "14px" }}
          >
            Join Desiki Care to unlock your beauty journey.
          </Text>

          <Form layout="vertical" name="registerForm" onFinish={onFinish}>
            <Form.Item
              label="Username"
              name="username"
              rules={[
                { required: true, message: "Please enter your username!" },
              ]}
            >
              <Input
                prefix={<UserOutlined />}
                placeholder="Enter your name"
                size="large"
              />
            </Form.Item>

            <Form.Item
              label="Phone Number"
              name="phone"
              rules={[
                { required: true, message: "Please enter your phone number!" },
              ]}
            >
              <Input
                prefix={<PhoneOutlined />}
                placeholder="Enter your phone number"
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

            <Form.Item
              label="Confirm Password"
              name="confirm"
              dependencies={["password"]}
              rules={[
                { required: true, message: "Please confirm your password!" },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("password") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error("Passwords do not match!"));
                  },
                }),
              ]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="Confirm your password"
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
                Register
              </Button>
            </Form.Item>

            <Text style={{ display: "block", textAlign: "center" }}>
              Already have an account?{" "}
              <Link href="/login" style={{ color: "#c2185b" }}>
                Login now
              </Link>
            </Text>

            <Divider style={{ borderColor: "#f0f0f0" }}>or</Divider>

            <Space direction="vertical" style={{ width: "100%" }}>
              <Button icon={<GoogleOutlined />} block>
                Sign up with Google
              </Button>
              <Button
                icon={<FacebookFilled />}
                block
                style={{ backgroundColor: "#3b5998", color: "#fff" }}
              >
                Sign up with Facebook
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

export default Register;
