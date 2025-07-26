
import { Outlet } from "react-router-dom";
import { Toaster } from "react-hot-toast";

const AuthLayout: React.FC = () => {
  return (
    <div>
      <Outlet />
      <Toaster position="top-center" />
    </div>
  );
};

export default AuthLayout;
