import React, { useState } from "react";
import { Layout } from "antd";
import {
  UserOutlined,
  LockOutlined,
  ShoppingOutlined,
  GiftOutlined,
  EnvironmentOutlined,
} from "@ant-design/icons";

import PersonalInfo from "./components/PersonalInfo";
import ChangePassword from "./components/ChangePassword";
import OrderHistory from "./components/OrderHistory";
import GameRewardHistory from "./components/GameRewardHistory";
import ShippingAddresses from "./components/ShippingAddresses";

import "./Profile.css"; 

const { Content } = Layout;

const Profile = () => {
  const [selectedKey, setSelectedKey] = useState("1");

  const renderContent = () => {
    switch (selectedKey) {
      case "1":
        return <PersonalInfo />;
      case "2":
        return <ChangePassword />;
      case "3":
        return <OrderHistory />;
      case "4":
        return <GameRewardHistory />;
      case "5":
        return <ShippingAddresses />;
      default:
        return null;
    }
  };

  return (
    <div className="profile-container">
      <div className="profile-content">
        <div className="profile-layout">
          <div className="profile-left">
            <div className="profile-menu">
              <div
                className={`profile-menu-item ${
                  selectedKey === "1" ? "active" : ""
                }`}
                onClick={() => setSelectedKey("1")}
              >
                <UserOutlined />
                <span>Thông tin cá nhân</span>
              </div>
              <div
                className={`profile-menu-item ${
                  selectedKey === "2" ? "active" : ""
                }`}
                onClick={() => setSelectedKey("2")}
              >
                <LockOutlined />
                <span>Đổi mật khẩu</span>
              </div>
              <div
                className={`profile-menu-item ${
                  selectedKey === "3" ? "active" : ""
                }`}
                onClick={() => setSelectedKey("3")}
              >
                <ShoppingOutlined />
                <span>Lịch sử đơn hàng</span>
              </div>
              <div
                className={`profile-menu-item ${
                  selectedKey === "4" ? "active" : ""
                }`}
                onClick={() => setSelectedKey("4")}
              >
                <GiftOutlined />
                <span>Phần thưởng sự kiện</span>
              </div>
              <div
                className={`profile-menu-item ${
                  selectedKey === "5" ? "active" : ""
                }`}
                onClick={() => setSelectedKey("5")}
              >
                <EnvironmentOutlined />
                <span>Địa chỉ giao hàng</span>
              </div>
            </div>
          </div>

          <div className="profile-right">{renderContent()}</div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
