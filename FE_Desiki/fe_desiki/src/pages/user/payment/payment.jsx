import React from "react";
import { Form, Input, Button, Card, Row, Col, Select, Typography, Radio, Divider } from "antd";
import "./payment.css";

const { Title } = Typography;
const { TextArea } = Input;
const { Option } = Select;

const Payment = () => {
  const [form] = Form.useForm();

  const onFinish = (values) => {
    console.log("Thông tin thanh toán:", values);
  };

  return (
    <div className="payment-container">
      <Title level={2} style={{ textAlign: "center", marginBottom: "2rem" }}>
        Thanh toán đơn hàng
      </Title>

      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={{ paymentMethod: "cod" }}
      >
        <Row gutter={38}>
          <Col xs={24} md={14}>
            <Card title="Thông tin giao hàng" bordered={false}>
              <Form.Item
                label="Họ và tên"
                name="fullName"
                rules={[{ required: true, message: "Vui lòng nhập họ và tên" }]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                label="Số điện thoại"
                name="phone"
                rules={[{ required: true, message: "Vui lòng nhập số điện thoại" }]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                label="Địa chỉ giao hàng"
                name="address"
                rules={[{ required: true, message: "Vui lòng nhập địa chỉ" }]}
              >
                <Input />
              </Form.Item>

              <Form.Item label="Ghi chú" name="note">
                <TextArea rows={3} />
              </Form.Item>

              <Form.Item
                label="Phương thức thanh toán"
                name="paymentMethod"
                rules={[{ required: true, message: "Vui lòng chọn phương thức thanh toán" }]}
              >
                <Radio.Group>
                  <Radio value="cod">Thanh toán khi nhận hàng (COD)</Radio>
                  <Radio value="bank">Chuyển khoản ngân hàng</Radio>
                  <Radio value="momo">Ví MoMo</Radio>
                </Radio.Group>
              </Form.Item>
            </Card>
          </Col>

          <Col xs={24} md={10}>
            <Card title="Tóm tắt đơn hàng" bordered={false}>
              <div className="order-summary">
                <div className="summary-item">
                  <span>Sản phẩm A</span>
                  <span>150.000₫</span>
                </div>
                <div className="summary-item">
                  <span>Phí giao hàng</span>
                  <span>30.000₫</span>
                </div>
                <Divider />
                <div className="summary-total">
                  <strong>Tổng cộng:</strong>
                  <strong>180.000₫</strong>
                </div>
              </div>

              <Form.Item style={{ marginTop: "1.5rem" }}>
                <Button type="primary" htmlType="submit" block size="large">
                  Thanh toán
                </Button>
              </Form.Item>
            </Card>
          </Col>
        </Row>
      </Form>
    </div>
  );
};

export default Payment;
