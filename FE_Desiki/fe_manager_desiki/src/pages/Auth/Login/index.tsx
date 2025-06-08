import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button, TextField } from "@mui/material";
import Swal from "sweetalert2";
import { jwtDecode } from "jwt-decode";
import { callAPI } from "../../../api/axiosInstace";

interface DecodedToken {
  user: {
    role: {
      _id: number;
      name: string;
    };
    [key: string]: any;
  };
  exp: number;
  iat: number;
  [key: string]: any;
}

const Login = () => {
  // STATES
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  // FUNCTIONS
  const login = async () => {
    try {
      const response = await callAPI({
        method: "POST",
        url: "/api/Account/login",
        data: {
          loginInfo: {
            email,
            password,
          },
        },
      });

      const token = response?.token;
      if (token) {
        const decoded: DecodedToken = jwtDecode(token);

        const roleId = decoded?.role?._id;
        console.log("Decoded token:", decoded);
        console.log("ID:", roleId);
        if (roleId === 1 || roleId === 2) {
          localStorage.setItem("accessToken", token);
          Swal.fire("Thành công", "Đăng nhập thành công!", "success");
          navigate("/");
        } else {
          Swal.fire(
            "Không đủ quyền",
            "Tài khoản của bạn không có quyền truy cập.",
            "error"
          );
        }
      } else {
        Swal.fire("Lỗi", "Không nhận được token từ server", "error");
      }
    } catch (error) {
      console.log("Error while login:", error);
      Swal.fire("Lỗi", "Email hoặc mật khẩu không đúng.", "error");
    }
  };

  useEffect(() => {
    setEmail("");
    setPassword("");
  }, []);

  return (
    <div className="w-full flex flex-col p-5">
      <h1 className="text-4xl font-bold">Đăng nhập</h1>
      <p className="text-lg font-semibold">
        Trang đăng nhập cho Manager & Admin của Desiki.
      </p>

      <div className="w-full mt-10 bg-white text-black flex flex-col p-10 gap-4">
        <div>
          <p>Email</p>
          <TextField
            fullWidth
            value={email}
            type="email"
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div>
          <p>Password</p>
          <TextField
            fullWidth
            value={password}
            type="password"
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <Button variant="contained" color="primary" onClick={login}>
          Đăng nhập
        </Button>
      </div>
    </div>
  );
};

export default Login;
