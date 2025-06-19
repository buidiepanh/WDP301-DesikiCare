import { Route, Routes } from "react-router";

import Home from "../pages/user/home/home";
import Login from "../pages/authen/login/login";
import Register from "../pages/authen/regis/register";
import HeaderSkincare from "../components/Header/HeaderSkincare";
import FooterSkincare from "../components/Footer/FooterSkincare";
import Cart from "../pages/user/cart/cart";
import Details from "../pages/user/product-detail/details";
import BannerSection from "../pages/user/hot-deal/BannerSection";
import ProductsPage from "../pages/user/sale/ProductsPage";
import BlogGrid from "../pages/user/blog/BlogGrid";
import WarrantyPolicy from "../pages/user/policy/WarrantyPolicy";
import Payment from "../pages/user/payment/payment";
import GameTypePage from "../pages/user/Game/Type/GameTypePage";

import UserManagement from "../pages/admin/UserManagement";
import CustomerPoints from "../pages/admin/CustomerPoints";
import GameManagement from "../pages/admin/GameManagement";
import ChatbotContent from "../pages/admin/ChatbotContent";
import Profile from "../pages/user/profile/Profile";

import ProductManagement from "../pages/manager/ProductManagement";
import InventoryManagement from "../pages/manager/InventoryManagement";
import OrderManagement from "../pages/manager/OrderManagement";
import Statistics from "../pages/manager/Statistics";
import CustomerInfo from "../pages/manager/CustomerInfo";
import ManagerLayout from "../layouts/manager/ManagerLayout";
import AdminLayout from "../layouts/admin/AdminLayout";
import GamePlayPage from "../pages/user/Game/Play/GamePlayPage";

function UserRouter() {
  return (
    <>
      <HeaderSkincare />
      <div style={{ marginTop: "80px", marginBottom: "-75px" }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/products/:productId" element={<Details />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/hot-deal" element={<BannerSection />} />
          <Route path="/warranty-policy" element={<WarrantyPolicy />} />
          <Route path="/products-page" element={<ProductsPage />} />
          <Route path="/blog-grid" element={<BlogGrid />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/game-type/:id" element={<GameTypePage />} />
          <Route path="/game-event/:id" element={<GamePlayPage />} />
        </Routes>
      </div>
      <FooterSkincare />
    </>
  );
}

function AdminRouter() {
  return (
    <Routes>
      <Route path="/" element={<AdminLayout />}>
        <Route path="users" element={<UserManagement />} />
        <Route path="points" element={<CustomerPoints />} />
        <Route path="game" element={<GameManagement />} />
        <Route path="chatbot" element={<ChatbotContent />} />
      </Route>
    </Routes>
  );
}

function ManagerRouter() {
  return (
    <Routes>
      <Route path="/" element={<ManagerLayout />}>
        <Route path="products" element={<ProductManagement />} />
        <Route path="inventory" element={<InventoryManagement />} />
        <Route path="orders" element={<OrderManagement />} />
        <Route path="statistics" element={<Statistics />} />
        <Route path="customers" element={<CustomerInfo />} />
      </Route>
    </Routes>
  );
}

export function AppRouter() {
  return (
    <Routes>
      <Route path="/*" element={<UserRouter />} />
      <Route path="/admin/*" element={<AdminRouter />} />
      <Route path="/manager/*" element={<ManagerRouter />} />
    </Routes>
  );
}
