import React, { useState, useEffect } from "react";
import { Form, Input, Button, message } from "antd";
import { changePassword, getMe } from "../../../../services/apiServices"; 

const ChangePassword = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await getMe();
        setUserId(data.account._id);
      } catch (err) {
        message.error("Không thể tải thông tin người dùng.");
      }
    };

    fetchUser();
  }, []);

  const handleChangePassword = async (values) => {
    const { oldPassword, newPassword, confirmPassword } = values;

    if (newPassword !== confirmPassword) {
      message.error("Mật khẩu mới và xác nhận không khớp!");
      return;
    }

    try {
      setLoading(true);
      await changePassword(userId, oldPassword, newPassword);
      message.success("Đổi mật khẩu thành công!");
      form.resetFields();
    } catch (error) {
      message.error(error.message || "Đổi mật khẩu thất bại!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form form={form} layout="vertical" onFinish={handleChangePassword}>
      <Form.Item
        label="Mật khẩu hiện tại"
        name="oldPassword"
        rules={[{ required: true, message: "Vui lòng nhập mật khẩu hiện tại" }]}
      >
        <Input.Password />
      </Form.Item>

      <Form.Item
        label="Mật khẩu mới"
        name="newPassword"
        rules={[{ required: true, message: "Vui lòng nhập mật khẩu mới" }]}
      >
        <Input.Password />
      </Form.Item>

      <Form.Item
        label="Xác nhận mật khẩu mới"
        name="confirmPassword"
        rules={[{ required: true, message: "Vui lòng xác nhận mật khẩu mới" }]}
      >
        <Input.Password />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" loading={loading}>
          Đổi mật khẩu
        </Button>
      </Form.Item>
    </Form>
  );
};

export default ChangePassword;
