import React, { useState } from "react";
import "./Profile.css";

import PersonalInfo from "./components/PersonalInfoForm";
import OrderHistory from "./components/OrderHistory";
import GameRewardHistory from "./components/GameRewardHistory";
import ShippingAddresses from "./components/ShippingAddresses";
import ChangePassword from "./components/ChangePassword";

const Profile = () => {
  const [activeTab, setActiveTab] = useState("personal");

  const renderTabContent = () => {
    switch (activeTab) {
      case "personal":
        return <PersonalInfo />;
      case "orders":
        return <OrderHistory />;
      case "rewards":
        return <GameRewardHistory />;
      case "addresses":
        return <ShippingAddresses />;
      case "password":
        return <ChangePassword />;
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
                className={`profile-menu-item ${activeTab === "personal" ? "active" : ""}`}
                onClick={() => setActiveTab("personal")}
              >
                Thông tin cá nhân
              </div>
              <div
                className={`profile-menu-item ${activeTab === "orders" ? "active" : ""}`}
                onClick={() => setActiveTab("orders")}
              >
                Lịch sử đơn hàng
              </div>
              <div
                className={`profile-menu-item ${activeTab === "rewards" ? "active" : ""}`}
                onClick={() => setActiveTab("rewards")}
              >
                Lịch sử điểm minigame
              </div>
              <div
                className={`profile-menu-item ${activeTab === "addresses" ? "active" : ""}`}
                onClick={() => setActiveTab("addresses")}
              >
                Địa chỉ nhận hàng
              </div>
              <div
                className={`profile-menu-item ${activeTab === "password" ? "active" : ""}`}
                onClick={() => setActiveTab("password")}
              >
                Đổi mật khẩu
              </div>
            </div>
          </div>

          <div className="profile-right">{renderTabContent()}</div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
