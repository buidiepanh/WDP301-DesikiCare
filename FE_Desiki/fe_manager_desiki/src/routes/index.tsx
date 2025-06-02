// src/routes/index.tsx
import React from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";
import DefaultLayout from "../layouts/DefaultLayout";
import AuthLayout from "../layouts/AuthLayout";

import RevenueDashboard from "../pages/RevenueDashboard";
import Products from "../pages/Products";
import Orders from "../pages/Orders";
import CustomerManagement from "../pages/AccountManagement/CustomerManagement";
import AllRoleManagement from "../pages/AccountManagement/AllRoleManagement";
import PointManagement from "../pages/Points";
import MiniGames from "../pages/MiniGames";
import Chatbot from "../pages/Chatbot";
import Login from "../pages/Auth/Login";
import Register from "../pages/Auth/Register";


const router = createBrowserRouter([
  {
    element: <DefaultLayout />,
    children: [
      { path: "/", element: <Navigate to="/RevenueDashboard" replace /> },
      { path: "/RevenueDashboard", element: <RevenueDashboard /> },
      { path: "/Products", element: <Products /> },
      { path: "/Orders", element: <Orders /> },
      {
        path: "/AccountManagement/CustomerManagement",
        element: <CustomerManagement />,
      },
      {
        path: "/AccountManagement/AllRoleManagement",
        element: <AllRoleManagement />,
      },
      { path: "/Points", element: <PointManagement /> },
      { path: "/MiniGames", element: <MiniGames /> },
      { path: "/Chatbot", element: <Chatbot /> },
    ],
  },
  {
    element: <AuthLayout />,
    children: [
      { path: "/Auth/Login", element: <Login /> },
      { path: "/Auth/Register", element: <Register /> },
    ],
  },
]);

export default router;
