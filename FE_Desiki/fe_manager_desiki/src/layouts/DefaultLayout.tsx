// src/layouts/DefaultLayout.tsx
import React from "react";
import { Outlet } from "react-router-dom";
import SideBar from "../components/layout/sideBar";
import { getRole } from "../utils/auth";
import backgroundImage from "@/assets/Background/bgDarkBlue.jpg";

const DefaultLayout: React.FC = () => {
  const role = getRole();

  return (
    // <div className="w-full flex">
    //   <SideBar role={role} />
    //   <div className="w-[100vw] min-h-[100vh] bg-[#f5f5f5]">
    //     <Outlet />
    //   </div>
    // </div>

    <div
      className="min-h-screen w-full flex items-center p-4"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
      }}
    >
      <SideBar role={role} />
      <div
        className="h-[calc(100vh-32px)] ml-[280px] w-[calc(100vw-280px-16px)] overflow-y-auto scrollbar-hide"
        style={{
          scrollbarWidth: "none" /* Firefox */,
          msOverflowStyle: "none" /* IE and Edge */,
        }}
      >
        <Outlet />
      </div>
    </div>
  );
};

export default DefaultLayout;
