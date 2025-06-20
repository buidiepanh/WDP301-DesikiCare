import React, { useEffect, useState } from "react";
import { Table, Tag, message, Switch, Typography, Divider } from "antd";
import { callAPIAdmin } from "../../api/axiosInstace";

const { Title } = Typography;

const RoleAccountManagement = () => {
  const [roles, setRoles] = useState([]);
  const [accounts, setAccounts] = useState([]);

  useEffect(() => {
    fetchRoles();
    fetchAccounts();
  }, []);

  const fetchRoles = async () => {
    try {
      const res = await callAPIAdmin({ method: "GET", url: "/api/Account/roles" });
      setRoles(res?.data?.roles || []);
    } catch {
      message.error("Không thể tải danh sách vai trò.");
    }
  };

  const fetchAccounts = async () => {
    try {
      const res = await callAPIAdmin({ method: "GET", url: "/api/Account/accounts" });
      setAccounts(res?.data?.accounts || []);
    } catch {
      message.error("Không thể tải danh sách tài khoản.");
    }
  };

  const handleToggle = async (accountId, isActive) => {
    try {
      await callAPIAdmin({
        method: "PUT",
        url: `/api/Account/accounts/${accountId}/deactivate/${isActive ? 0 : 1}`,
      });
      message.success(`Đã ${isActive ? "vô hiệu hóa" : "kích hoạt"} tài khoản.`);
      fetchAccounts();
    } catch {
      message.error("Thao tác thất bại.");
    }
  };

  const roleColumns = [
    { title: "ID", dataIndex: "_id", key: "_id" },
    { title: "Tên vai trò", dataIndex: "name", key: "name" },
  ];

  const accountColumns = [
    { title: "Họ tên", dataIndex: "fullName", key: "fullName" },
    { title: "Email", dataIndex: "email", key: "email" },
    {
      title: "Vai trò",
      dataIndex: "roleId",
      key: "roleId",
      render: (id) => roles.find((r) => r._id === id)?.name || "Không xác định",
    },
    {
      title: "Trạng thái",
      dataIndex: "isDeactivated",
      key: "status",
      render: (deactivated, record) => (
        <Switch
          checked={!deactivated}
          onChange={() => handleToggle(record._id, !deactivated)}
          checkedChildren="Hoạt động"
          unCheckedChildren="Bị khóa"
        />
      ),
    },
  ];

  return (
    <div style={{ padding: 32, background: "#fff" }}>
      <Title level={3} style={{ color: "#e91e63", fontWeight: 700 }}>
        🧑‍💼 Danh sách vai trò
      </Title>
      <Table
        columns={roleColumns}
        dataSource={roles}
        rowKey="_id"
        pagination={false}
        style={{
          marginBottom: 48,
          borderRadius: 12,
          boxShadow: "0 6px 16px rgba(233, 30, 99, 0.1)",
          border: "1px solid #f8bbd0",
        }}
      />

      <Divider style={{ borderColor: "#e91e63" }} />

      <Title level={3} style={{ color: "#e91e63", fontWeight: 700 }}>
        👤 Danh sách tài khoản
      </Title>
      <Table
        columns={accountColumns}
        dataSource={accounts}
        rowKey="_id"
        pagination={{ pageSize: 6 }}
        style={{
          borderRadius: 12,
          boxShadow: "0 6px 16px rgba(233, 30, 99, 0.1)",
          border: "1px solid #f8bbd0",
        }}
      />
    </div>
  );
};

export default RoleAccountManagement;
