import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Avatar,
  Fade,
  Grid,
} from "@mui/material";
import toast from "react-hot-toast";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Swal from "sweetalert2";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { callAPIUnAuth } from "../../../api/axiosInstace";

interface DecodedToken {
  role: { _id: number; name: string };
  [key: string]: any;
}

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const navigate = useNavigate();

  const login = async () => {
    try {
      const response = await callAPIUnAuth({
        method: "POST",
        url: "/api/Account/login",
        data: { loginInfo: { email, password } },
      });

      if (response.status === 201) {
        const token = response?.data.token;
        if (token) {
          const decoded: DecodedToken = jwtDecode(token);
          const roleId = decoded?.role?._id;

          if (roleId === 1 || roleId === 2) {
            localStorage.setItem("accessToken", token);
            toast.success("Đăng nhập thành công!");
            setTimeout(() => navigate("/"), 800);
          } else {
            toast.error("Tài khoản của bạn không có quyền truy cập.");
          }
        } else {
          toast.error("Không nhận được token từ server");
        }
      } else {
        toast.error("Không đăng nhập được");
      }
    } catch {
      toast.error("Email hoặc mật khẩu không đúng.");
    }
  };

  useEffect(() => {
    setEmail("");
    setPassword("");
    setTimeout(() => setShow(true), 200);
  }, []);

  return (
    <Grid
      container
      justifyContent="center"
      alignItems="center"
      style={{
        minHeight: "100vh",
        backgroundImage:
          "url('https://png.pngtree.com/background/20250202/original/pngtree-a-pink-table-filled-with-pink-things-such-as-cosmetics-and-picture-image_12895045.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
      }}
    >
      <Fade in={show} timeout={600}>
        <Paper
          elevation={8}
          sx={{
            p: 4,
            width: "90%",
            maxWidth: 400,
            borderRadius: 6,
            backdropFilter: "blur(12px)",
            backgroundColor: "rgba(255, 182, 193, 0.2)",
            boxShadow: "0 12px 24px rgba(0,0,0,0.3)",
            color: "#fff",
          }}
        >
          <Box display="flex" flexDirection="column" alignItems="center" mb={2}>
            <Avatar sx={{ bgcolor: "#e91e63", mb: 1 }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography variant="h5" fontWeight={600} color="white">
              Đăng nhập
            </Typography>
            <Typography variant="body2" sx={{ color: "rgba(255, 255, 255, 0.7)" }} align="center">
              Dành cho Manager & Admin của Desiki
            </Typography>
          </Box>

          <TextField
            label="Email"
            variant="filled"
            type="email"
            value={email}
            fullWidth
            margin="normal"
            onChange={(e) => setEmail(e.target.value)}
            InputProps={{ style: { color: "#fff" } }}
            InputLabelProps={{ style: { color: "#f0f0f0" } }}
          />

          <TextField
            label="Mật khẩu"
            variant="filled"
            type="password"
            value={password}
            fullWidth
            margin="normal"
            onChange={(e) => setPassword(e.target.value)}
            InputProps={{ style: { color: "#fff" } }}
            InputLabelProps={{ style: { color: "#f0f0f0" } }}
          />

          <Button
            variant="contained"
            fullWidth
            size="large"
            sx={{
              mt: 2,
              backgroundColor: "#e91e63",
              ":hover": { backgroundColor: "#d81b60" },
            }}
            onClick={login}
          >
            ĐĂNG NHẬP
          </Button>
        </Paper>
      </Fade>
    </Grid>
  );
};

export default Login;
