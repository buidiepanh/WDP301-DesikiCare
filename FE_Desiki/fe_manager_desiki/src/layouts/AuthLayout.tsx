// src/layouts/AuthLayout.tsx
import React from "react";
import { Outlet } from "react-router-dom";

const AuthLayout: React.FC = () => {
  return (
    <div style={{ padding: 40 }}>
      <Outlet />
    </div>
  );
};

export default AuthLayout;
