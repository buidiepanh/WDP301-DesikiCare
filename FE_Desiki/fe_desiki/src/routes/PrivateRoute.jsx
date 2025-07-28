import { Navigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";

const PrivateRoute = ({ children }) => {
  const location = useLocation();
  const isLoggedIn = sessionStorage.getItem("user");

  if (!isLoggedIn) {
    toast.error("Bạn cần đăng nhập để truy cập trang này.");
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default PrivateRoute;
