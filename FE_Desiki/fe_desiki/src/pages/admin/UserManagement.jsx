import React from "react";
import styles from "./Admin.module.css";

const users = [
  { id: 1, name: "Admin A", email: "adminA@mail.com", role: "Admin", status: "Hoạt động" },
  { id: 2, name: "Nguyễn Văn B", email: "userB@mail.com", role: "Manager", status: "Khóa" },
];

const UserManagement = () => {
  return (
    <div className={styles.page}>
      <h2 className={styles.title}>Quản lý người dùng</h2>
      <div className={styles.card}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>#</th>
              <th>Họ tên</th>
              <th>Email</th>
              <th>Vai trò</th>
              <th>Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u, i) => (
              <tr key={u.id}>
                <td>{i + 1}</td>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td>{u.role}</td>
                <td>{u.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserManagement;
