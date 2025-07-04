import { Navigate, Outlet } from "react-router-dom";
import { getAccessToken, hasRole } from "../utils/auth";
import Swal from "sweetalert2";

interface Props {
  allowedRoles: number[]; // [1] for Admin, [1,2] for Admin + Manager
}

export const ProtectedRoute = ({ allowedRoles }: Props) => {
  const token = getAccessToken();

  if (!token) {
    return <Navigate to="/Auth/login" replace />;
  }

  if (!hasRole(allowedRoles)) {
    Swal.fire({
      icon: "error",
      title: "Bạn không có quyền truy cập!",
    });
    return <Navigate to="/Auth/login" replace />;
  }

  return <Outlet />;
};
