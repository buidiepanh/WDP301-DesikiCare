import { Route, Routes, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

// User pages
import Home from "../pages/user/home/home";
import Login from "../pages/authen/login/login";
import Register from "../pages/authen/regis/register";
import Cart from "../pages/user/cart/cart";
import Details from "../pages/user/product-detail/details";
import BannerSection from "../pages/user/hot-deal/BannerSection";
import ProductsPage from "../pages/user/sale/ProductsPage";
import BlogGrid from "../pages/user/blog/BlogGrid";
import WarrantyPolicy from "../pages/user/policy/WarrantyPolicy";
import Payment from "../pages/user/payment/payment";
import PaymentReturn from "../pages/user/payment-return/paymentReturn";
import Profile from "../pages/user/profile/Profile";
import GamePage from "../pages/user/Game";
import GamePlayPage from "../pages/user/Game/Play/GamePlayPage";

// Admin pages
import UserManagement from "../pages/admin/UserManagement";
import CustomerPoints from "../pages/admin/CustomerPoints";
import GameManagement from "../pages/admin/GameManagement";
import ChatbotContent from "../pages/admin/ChatbotContent";

// Manager pages
import ProductManagement from "../pages/manager/ProductManagement";
import InventoryManagement from "../pages/manager/InventoryManagement";
import OrderManagement from "../pages/manager/OrderManagement";
import Statistics from "../pages/manager/Statistics";
import CustomerInfo from "../pages/manager/CustomerInfo";

// Layouts
import HeaderSkincare from "../components/Header/HeaderSkincare";
import FooterSkincare from "../components/Footer/FooterSkincare";
import AdminLayout from "../layouts/admin/AdminLayout";
import ManagerLayout from "../layouts/manager/ManagerLayout";

function UserRouter() {
  const [isLogin, setIsLogin] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const userFromSessionStorage = sessionStorage.getItem("user");
    setIsLogin(!!userFromSessionStorage);
  }, [location]);

  return (
    <div style={{ position: "relative" }}>
      <HeaderSkincare />
      <div style={{ marginTop: "80px", marginBottom: "75px" }}>
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
          <Route path="/payment-return" element={<PaymentReturn />} />

          {/* Game */}
          <Route path="/mini-games" element={<GamePage />} />
          <Route path="/mini-games/play" element={<GamePlayPage />} />
        </Routes>
      </div>
      <FooterSkincare />
    </div>
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
