import React, { useState, useEffect } from "react";
import { Form, Select, Input, Button, List, Checkbox, Popconfirm, message, Typography } from "antd";
import { getMe, addAddress, setDefaultAddress, deleteAddress, getProvince } from "../../../../services/apiServices";

const { Title } = Typography;
const { Option } = Select;

const ShippingAddresses = () => {
  const [provinceList, setProvinceList] = useState([]);
  const [districtList, setDistrictList] = useState([]);
  const [wardList, setWardList] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [form] = Form.useForm();

  const fetchProfile = async () => {
    try {
      const res = await getMe();
      setAddresses(res.deliveryAddresses || []);
    } catch {
      message.error("Không thể tải danh sách địa chỉ.");
    }
  };

  const fetchProvinces = async () => {
    try {
      const res = await getProvince();
      setProvinceList(res);
    } catch {
      message.error("Không thể tải dữ liệu tỉnh/thành.");
    }
  };

  useEffect(() => {
    fetchProfile();
    fetchProvinces();
  }, []);

  const handleProvinceChange = code => {
    const pr = provinceList.find(p => p.code === code);
    setDistrictList(pr?.districts || []);
    form.setFieldsValue({ districtCode: null, wardCode: null });
    setWardList([]);
  };

  const handleDistrictChange = code => {
    const dt = districtList.find(d => d.code === code);
    setWardList(dt?.wards || []);
    form.setFieldsValue({ wardCode: null });
  };

  const handleAdd = async (values) => {
    try {
      const me = await getMe();              // <-- CHỜ kết quả trả về từ getMe()
      const userId = me?.account?._id;       // <-- Lấy userId an toàn

      if (!userId) {
        return message.error("Không tìm thấy thông tin tài khoản.");
      }

      const payload = {
        deliveryAddress: {
          provinceCode: Number(values.provinceCode),
          districtCode: Number(values.districtCode),
          wardCode: Number(values.wardCode),
          addressDetailDescription: values.addressDetailDescription,
          receiverName: values.receiverName,
          receiverPhone: values.receiverPhone,
          isDefault: values.isDefault || false,
        },
      };

      await addAddress(userId, payload);
      message.success("Thêm địa chỉ thành công!");
      form.resetFields();
      fetchProfile();
    } catch (error) {
      console.log("Error in handleAdd:", error);
      message.error("Thêm địa chỉ thất bại.");
    }
  };

  const handleSetDefault = async id => {
    try {
      await setDefaultAddress(id);
      message.success("Đã đặt làm mặc định.");
      fetchProfile();
    } catch {
      message.error("Không thể đặt mặc định.");
    }
  };

  const handleDelete = async id => {
    try {
      await deleteAddress(id);
      message.success("Xoá địa chỉ thành công!");
      fetchProfile();
    } catch {
      message.error("Không thể xoá địa chỉ.");
    }
  };

  return (
    <div className="profile-section">
      <Title level={4}>Địa chỉ giao hàng</Title>
      <Form layout="vertical" form={form} onFinish={handleAdd}>
        <Form.Item name="provinceCode" label="Tỉnh/Thành phố" rules={[{ required: true }]}>
          <Select placeholder="Chọn tỉnh" onChange={handleProvinceChange}>
            {provinceList.map(p => <Option key={p.code} value={p.code}>{p.name}</Option>)}
          </Select>
        </Form.Item>
        <Form.Item name="districtCode" label="Quận/Huyện" rules={[{ required: true }]}>
          <Select placeholder="Chọn quận" onChange={handleDistrictChange} disabled={!districtList.length}>
            {districtList.map(d => <Option key={d.code} value={d.code}>{d.name}</Option>)}
          </Select>
        </Form.Item>
        <Form.Item name="wardCode" label="Phường/Xã" rules={[{ required: true }]}>
          <Select placeholder="Chọn phường" disabled={!wardList.length}>
            {wardList.map(w => <Option key={w.code} value={w.code}>{w.name}</Option>)}
          </Select>
        </Form.Item>
        <Form.Item name="addressDetailDescription" label="Địa chỉ chi tiết" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="receiverName" label="Người nhận" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="receiverPhone" label="SĐT người nhận" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="isDefault" valuePropName="checked">
          <Checkbox>Đặt làm mặc định</Checkbox>
        </Form.Item>
        <Form.Item>
          <Button type="dashed" htmlType="submit" block>Thêm địa chỉ</Button>
        </Form.Item>
      </Form>

      <List
        bordered
        dataSource={addresses}
        locale={{ emptyText: "Chưa có địa chỉ nào." }}
        renderItem={item => (
          <List.Item actions={[
            item.isDefault
              ? <span style={{ color: "green" }}>Mặc định</span>
              : <Button type="link" onClick={() => handleSetDefault(item._id)}>Đặt mặc định</Button>,
            <Popconfirm key="del" title="Xoá địa chỉ?" onConfirm={() => handleDelete(item._id)}>
              <Button type="link" danger>Xoá</Button>
            </Popconfirm>
          ]}>
            <div>
              <strong>{item.receiverName}</strong> ({item.receiverPhone})
              <div>{item.addressDetailDescription}, Phường {item.wardCode}, Quận {item.districtCode}, Tỉnh {item.provinceCode}</div>
            </div>
          </List.Item>
        )}
      />
    </div>
  );
};

export default ShippingAddresses;
