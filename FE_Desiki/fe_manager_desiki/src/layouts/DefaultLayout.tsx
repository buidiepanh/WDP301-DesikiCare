// src/layouts/DefaultLayout.tsx
import React from "react";
import { Outlet } from "react-router-dom";
import SideBar from "../components/layout/sideBar";

const getUserRole = (): "admin" | "manager" => {
  // TODO: Lấy role thực tế từ context hoặc auth
  return "admin"; // giả định admin cho dev
};

const DefaultLayout: React.FC = () => {
  const role = getUserRole();

  return (
    <div className="w-full flex">
      <SideBar role={role} />
      <div className="w-[100vw] min-h-[100vh] bg-[#f5f5f5]">
        <Outlet />
      </div>
    </div>
  );
};

export default DefaultLayout;
