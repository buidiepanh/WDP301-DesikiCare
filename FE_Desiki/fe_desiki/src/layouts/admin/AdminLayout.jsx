import React from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import styles from "./AdminLayout.module.css";
import toast from "react-hot-toast";

const adminMenu = [
  { label: "Quản lý người dùng", path: "/admin/users" },
  { label: "Cấu hình điểm khách", path: "/admin/points" },
  { label: "Quản lý Game", path: "/admin/game" },
  { label: "Chatbot nội dung", path: "/admin/chatbot" },
];

const AdminLayout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/login");
    toast.success("Đăng xuất thành công!");
  };

  return (
    <div className={styles.adminLayout}>
      <div className={styles.sidebar}>
        <div className={styles.sidebarTitle}>Admin</div>
        <div className={styles.sidebarNav}>
          {adminMenu.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `${styles.sidebarLink} ${isActive ? styles.active : ""}`
              }
            >
              {item.label}
            </NavLink>
          ))}
          <div
            onClick={handleLogout}
            className={styles.sidebarLink}
            style={{ marginTop: "1rem", cursor: "pointer" }}
          >
            Logout
          </div>
        </div>
      </div>

      <div className={styles.mainContent}>
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;
