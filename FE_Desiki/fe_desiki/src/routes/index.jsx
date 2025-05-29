import { Route, Routes } from "react-router";
import Home from "../pages/user/home/home";
import Login from "../pages/user/authen/login/login";
import Register from "../pages/user/authen/regis/register";

function UserRouter() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
       <Route path="/home" element={<Home />} />
    </Routes>
  );
}

export function AppRouter() {
  return (
    <Routes>
      <Route path="/*" element={<UserRouter />} />
    </Routes>
  );
}
