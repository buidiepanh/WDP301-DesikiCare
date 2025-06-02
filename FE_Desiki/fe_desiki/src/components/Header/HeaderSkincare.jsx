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
  PersonOutline,
  VerifiedUser,
  Phone,
} from "@mui/icons-material";
import { Input } from "antd";
import { useNavigate } from "react-router-dom";
import styles from "./HeaderSkincare.module.css";
import logo from "../../assets/logo.jpg";

const HeaderSkincare = () => {
  const [userName, setUserName] = useState(null);
  const navigate = useNavigate();
  useEffect(() => {
    // Kiểm tra localStorage để lấy tên người dùng sau khi đăng nhập Google
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUserName(parsedUser.name); // hoặc parsedUser.displayName tùy Google trả về gì
    }
  }, []);

  const handleLoginClick = () => {
    navigate("/login");
  };

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
        {/* Logo & slogan */}
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

        {/* Menu + Search */}
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

        {/* Icon menu */}
        <Box className={styles.iconsMenu}>
          <Box className={styles.iconBox}>
            <IconButton color="inherit" onClick={handleLoginClick}>
              <PersonOutline />
            </IconButton>
            <Typography variant="caption" onClick={handleLoginClick}>
              {userName ? `Xin chào, ${userName}` : "Đăng nhập / Đăng ký"}
            </Typography>
          </Box>

          <Box className={styles.iconBox}>
            <IconButton color="inherit">
              <VerifiedUser />
            </IconButton>
            <Typography variant="caption">Chính Sách Bảo Hành</Typography>
          </Box>

          <Box className={styles.iconBox}>
            <IconButton color="inherit">
              <Phone />
            </IconButton>
            <Typography variant="caption">Hỗ trợ khách hàng</Typography>
          </Box>

          <Box className={styles.iconBox} onClick={() => navigate("/cart")}>
            <Badge badgeContent={0} color="error">
              <ShoppingCartOutlined className={styles.shoppingCartIcon} />
            </Badge>
          </Box>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default HeaderSkincare;
