import React, { useEffect, useState } from "react";
import {
  Typography,
  Form,
  Input,
  InputNumber,
  Checkbox,
  Button,
  List,
  Popconfirm,
  message,
} from "antd";
import {
  getMe,
  addAddress,
  deleteAddress,
  setDefaultAddress,
} from "../../../../services/apiServices";

const { Title } = Typography;

const ShippingAddresses = () => {
  const [addresses, setAddresses] = useState([]);
  const [form] = Form.useForm();
  const [accountId, setAccountId] = useState(null);

  const fetchAddresses = async () => {
    const user = await getMe();
    setAccountId(user.id);
    setAddresses(user.deliveryAddresses || []);
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  const handleAdd = async (values) => {
    if (!accountId) return;
    const result = await addAddress(accountId, values);
    if (result) {
      message.success("Đã thêm địa chỉ");
      form.resetFields();
      fetchAddresses();
    }
  };

  const handleSetDefault = async (id) => {
    await setDefaultAddress(id);
    message.success("Cập nhật mặc định thành công");
    fetchAddresses();
  };

  const handleDelete = async (id) => {
    await deleteAddress(id);
    message.success("Xoá địa chỉ thành công");
    fetchAddresses();
  };

  return (
    <>
      <Title level={4}>Địa chỉ giao hàng</Title>
      <Form layout="vertical" form={form} onFinish={handleAdd}>
        <Form.Item
          label="Tỉnh/Thành phố (mã số)"
          name="provinceCode"
          rules={[{ required: true, message: "Vui lòng nhập mã tỉnh" }]}
        >
          <InputNumber style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item
          label="Quận/Huyện (mã số)"
          name="districtCode"
          rules={[{ required: true, message: "Vui lòng nhập mã quận" }]}
        >
          <InputNumber style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item
          label="Phường/Xã (mã số)"
          name="wardCode"
          rules={[{ required: true, message: "Vui lòng nhập mã xã" }]}
        >
          <InputNumber style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item
          label="Địa chỉ chi tiết"
          name="addressDetailDescription"
          rules={[{ required: true, message: "Nhập địa chỉ chi tiết" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Người nhận"
          name="receiverName"
          rules={[{ required: true, message: "Nhập tên người nhận" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="SĐT người nhận"
          name="receiverPhone"
          rules={[{ required: true, message: "Nhập SĐT người nhận" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item name="isDefault" valuePropName="checked">
          <Checkbox>Đặt làm mặc định</Checkbox>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            Thêm địa chỉ
          </Button>
        </Form.Item>
      </Form>

      <List
        bordered
        dataSource={addresses}
        locale={{ emptyText: "Chưa có địa chỉ nào." }}
        renderItem={(item) => (
          <List.Item
            actions={[
              item.isDefault ? (
                <span style={{ color: "green" }}>Mặc định</span>
              ) : (
                <Button type="link" onClick={() => handleSetDefault(item.id)}>
                  Đặt mặc định
                </Button>
              ),
              <Popconfirm
                title="Xoá địa chỉ?"
                onConfirm={() => handleDelete(item.id)}
              >
                <Button type="link" danger>
                  Xoá
                </Button>
              </Popconfirm>,
            ]}
          >
            <div>
              <strong>{item.receiverName}</strong> ({item.receiverPhone})<br />
              {item.addressDetailDescription}, {item.wardCode},{" "}
              {item.districtCode}, {item.provinceCode}
            </div>
          </List.Item>
        )}
      />
    </>
  );
};

export default ShippingAddresses;
