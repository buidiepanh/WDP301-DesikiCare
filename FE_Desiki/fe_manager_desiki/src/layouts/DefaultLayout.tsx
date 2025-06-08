// src/layouts/DefaultLayout.tsx
import React from "react";
import { Outlet } from "react-router-dom";
import SideBar from "../components/layout/sideBar";
import { getRole } from "../utils/auth";

const DefaultLayout: React.FC = () => {
  const role = getRole();
  
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
