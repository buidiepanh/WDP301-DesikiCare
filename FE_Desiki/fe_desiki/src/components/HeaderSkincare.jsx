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

import styles from "./HeaderSkincare.module.css"; // CSS module

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
    <AppBar position="fixed" className={styles.appBar}>
      <Toolbar className={styles.toolbar}>
        {/* Logo & slogan */}
        <Box className={styles.logoSloganBox}>
          <img
            src="data:image/jpeg;base64,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"
            alt="Logo"
            className={styles.logoImg}
          />
          <Box>
            <Typography fontSize={14}>Chất lượng thật - Giá trị thật</Typography>
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

          <Box className={styles.iconBox}>
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
