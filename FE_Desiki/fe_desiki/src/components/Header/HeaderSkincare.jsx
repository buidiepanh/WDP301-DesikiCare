import React, { useEffect, useState } from "react";
import {
  AppBar,
  Toolbar,
  Box,
  Typography,
  IconButton,
  Badge,
} from "@mui/material";
import {
  ShoppingCartOutlined,
  Logout,
  VerifiedUser,
  Phone,
} from "@mui/icons-material";
import { Input } from "antd";
import { useNavigate } from "react-router-dom";
import styles from "./HeaderSkincare.module.css";
import logo from "../../assets/logo.jpg";
import toast from "react-hot-toast";

const HeaderSkincare = () => {
  const [userName, setUserName] = useState(null);
  const navigate = useNavigate();

  const loadUser = () => {
    try {
      const storedUser = sessionStorage.getItem("user");
      if (!storedUser || storedUser === "undefined") {
        setUserName(null);
        return;
      }

      const parsedUser = JSON.parse(storedUser);
      setUserName(parsedUser?.fullName || parsedUser?.name || null);
    } catch (err) {
      setUserName(null);
    }
  };

  useEffect(() => {
    loadUser();
    const handleUserChanged = () => loadUser();
    window.addEventListener("userChanged", handleUserChanged);
    return () => window.removeEventListener("userChanged", handleUserChanged);
  }, []);

  const handleLogout = () => {
    sessionStorage.clear();
    window.dispatchEvent(new Event("userChanged"));
    toast.success("Đăng xuất thành công!");
    navigate("/login");
  };

  const handleWarranty = () => navigate("/warranty-policy");

  return (
    <AppBar
      position="fixed"
      className={styles.appBar}
      sx={{
        backgroundColor: "#ec407a",
        paddingTop: "8px",
        paddingBottom: "8px",
      }}
    >
      <Toolbar className={styles.toolbar}>
        <Box className={styles.logoSloganBox}>
          <img
            src={logo}
            alt="Logo"
            className={styles.logoImg}
            onClick={() => navigate("/")}
          />
          <Box>
            <Typography fontSize={14}>
              Chất lượng thật - Giá trị thật
            </Typography>
          </Box>
        </Box>

        <Box className={styles.menuSearchBox}>
          <Box className={styles.menuItems}>
            <span>Kem Chống Nắng</span>
            <span>Tẩy Trang</span>
            <span>Sữa Rửa Mặt</span>
            <span>Tẩy tế bào chết</span>
            <span>Kem chống nắng sunplay</span>
          </Box>
          <Input.Search
            placeholder="Tìm sản phẩm, thương hiệu bạn mong muốn..."
            className={styles.searchInput}
            allowClear
          />
        </Box>

        <Box className={styles.iconsMenu}>
          <Box className={styles.iconBox}>
            <IconButton color="inherit">
              <VerifiedUser />
            </IconButton>
            <Typography variant="caption" onClick={handleWarranty}>
              Chính Sách Bảo Hành
            </Typography>
          </Box>

          <Box className={styles.iconBox}>
            <IconButton color="inherit">
              <Phone />
            </IconButton>
            <Typography variant="caption">Hỗ trợ khách hàng</Typography>
          </Box>

          {userName ? (
            <Box className={styles.cartLogoutGroup}>
              <IconButton color="inherit" onClick={() => navigate("/cart")}>
                <Badge badgeContent={0} color="error">
                  <ShoppingCartOutlined className={styles.shoppingCartIcon} />
                </Badge>
              </IconButton>
              <IconButton color="inherit" onClick={handleLogout}>
                <Logout />
              </IconButton>
            </Box>
          ) : (
            <Box className={styles.authButtons}>
              <Typography
                onClick={() => navigate("/login")}
                className={styles.loginText}
              >
                Đăng nhập
              </Typography>
              <span>/</span>
              <Typography
                onClick={() => navigate("/register")}
                className={styles.loginText}
              >
                Đăng ký
              </Typography>
            </Box>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default HeaderSkincare;
