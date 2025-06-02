import { Route, Routes } from "react-router";
import Home from "../pages/user/home/home";
import Login from "../pages/authen/login/login";
import Register from "../pages/authen/regis/register";
import HeaderSkincare from "../components/Header/HeaderSkincare";
import FooterSkincare from "../components/Footer/FooterSkincare";
import Cart from "../pages/user/cart/cart";
import Details from "../pages/user/product-detail/details";

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
        </Routes>
      </div>

      <FooterSkincare />
    </>
  );
}

export function AppRouter() {
  return (
    <Routes>
      <Route path="/*" element={<UserRouter />} />
    </Routes>
  );
}
