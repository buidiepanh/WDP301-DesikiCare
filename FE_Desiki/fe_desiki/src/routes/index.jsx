import { Route, Routes } from "react-router";
import Home from "../pages/user/home/home";
import Login from "../pages/authen/login/login";
import Register from "../pages/authen/regis/register";
import HeaderSkincare from "../components/Header/HeaderSkincare";
import FooterSkincare from "../components/Footer/FooterSkincare";
import Cart from "../pages/user/cart/cart";
import Details from "../pages/user/product-detail/details";
import BannerSection from "../pages/user/hot-deal/BannerSection";
import FlashDealSale from "../pages/user/sale/FlashDealSale";
import BlogGrid from "../pages/user/blog/BlogGrid";
import WarrantyPolicy from "../pages/user/policy/WarrantyPolicy";
import Admin from "../pages/admin/admin";

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
          <Route path="/hot-deal" element={<BannerSection />} />
          <Route path="/warranty-policy" element={<WarrantyPolicy />} />
          <Route path="/flash-deal-sale" element={<FlashDealSale />} />
          <Route path="/blog-grid" element={<BlogGrid />} />
        </Routes>
      </div>

      <FooterSkincare />
    </>
  );
}

function AdminRouter() {
  return (
    <Routes>
      <Route path="/" element={<Admin />} />
    </Routes>
  );
}

export function AppRouter() {
  return (
    <Routes>
      <Route path="/*" element={<UserRouter />} />
      <Route path="/admin" element={<AdminRouter />} />
    </Routes>
  );
}
