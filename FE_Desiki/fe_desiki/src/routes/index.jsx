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
import QuizPage from "../pages/user/quiz";

// Layouts
import HeaderSkincare from "../components/Header/HeaderSkincare";
import FooterSkincare from "../components/Footer/FooterSkincare";

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
      <div style={{ marginTop: "120px" }}>
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
          <Route path="/mini-games" element={<GamePage />} />
          <Route path="/mini-games/play" element={<GamePlayPage />} />
          <Route path="/quiz" element={<QuizPage />} />
        </Routes>
      </div>
      <FooterSkincare />
    </div>
  );
}

export function AppRouter() {
  return (
    <Routes>
      <Route path="/*" element={<UserRouter />} />
    </Routes>
  );
}
