import { createBrowserRouter, Navigate } from "react-router-dom";
import DefaultLayout from "../layouts/DefaultLayout";
import AuthLayout from "../layouts/AuthLayout";

import RevenueDashboard from "../pages/RevenueDashboard";
import Products from "../pages/Products";
import Orders from "../pages/Orders";
import Brands from "../pages/Brands";
import RoleAccountManagement from "../pages/AccountManagement/RoleAccountManagement";
import PointManagement from "../pages/Points";
import MiniGames from "../pages/MiniGames";
import Chatbot from "../pages/Chatbot";
import Login from "../pages/Auth/Login";
import Register from "../pages/Auth/Register";
import Shipment from "../pages/Shipment";
import CreateProduct from "../pages/Products/CreateProduct";
import CreateShipment from "../pages/Shipment/CreateShipment";
import QuizManagement from "../pages/QuizManagement";
import TicketRuleManagement from "../pages/TicketRuleManagement";

import { ProtectedRoute } from "./ProtectedRoute";

const router = createBrowserRouter([
  {
    element: <AuthLayout />,
    children: [
      { path: "/Auth/Login", element: <Login /> },
      { path: "/Auth/Register", element: <Register /> },
    ],
  },

  {
    element: <ProtectedRoute allowedRoles={[1, 2]} />, // admin & manager
    children: [
      {
        element: <DefaultLayout />,
        children: [
          { path: "/", element: <Navigate to="/RevenueDashboard" replace /> },
          { path: "/RevenueDashboard", element: <RevenueDashboard /> },
        ],
      },
    ],
  },

  {
    element: <ProtectedRoute allowedRoles={[1]} />, // only manager
    children: [
      {
        element: <DefaultLayout />,
        children: [
          { path: "/Shipments", element: <Shipment /> },
          { path: "/Shipments/create", element: <CreateShipment /> },
          { path: "/Products", element: <Products /> },
          { path: "/Products/create", element: <CreateProduct /> },
          { path: "/Orders", element: <Orders /> },
          { path: "/Brands", element: <Brands /> },
          { path: "/game-rules", element: <TicketRuleManagement /> },
        ],
      },
    ],
  },

  {
    element: <ProtectedRoute allowedRoles={[2]} />, // only admin
    children: [
      {
        element: <DefaultLayout />,
        children: [
          {
            path: "/AccountManagement/RoleAccountManagement",
            element: <RoleAccountManagement />,
          },
          { path: "/Points", element: <PointManagement /> },
          { path: "/MiniGames", element: <MiniGames /> },
          { path: "/Chatbot", element: <Chatbot /> },
          { path: "/quiz", element: <QuizManagement /> },
        ],
      },
    ],
  },
]);

export default router;
