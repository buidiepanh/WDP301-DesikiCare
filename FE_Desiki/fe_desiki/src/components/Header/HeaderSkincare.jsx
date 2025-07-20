import React, { useEffect, useState } from "react";
import {
  AppBar,
  Toolbar,
  Box,
  Typography,
  IconButton,
  Badge,
  TextField,
  InputAdornment,
} from "@mui/material";
import {
  ShoppingCartOutlined,
  Logout,
  VerifiedUser,
  Phone,
} from "@mui/icons-material";
import SearchIcon from "@mui/icons-material/Search";
import { AccountCircle } from "@mui/icons-material";
import { Input } from "antd";
import { useNavigate } from "react-router-dom";
import styles from "./HeaderSkincare.module.css";
import logo from "../../assets/logo.jpg";
import toast from "react-hot-toast";
import ChatWidget from "../Chatbot/ChatWidget";
import { getMe } from "../../services/apiServices";

const HeaderSkincare = () => {
  const [userName, setUserName] = useState(null);
  const [user, setUser] = useState(null);
  const [showChat, setShowChat] = useState(false);
  const [searchText, setSearchText] = useState("");
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

  const getAuthenticatedUser = async () => {
    try {
      const res = await getMe();
      setUser(res);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    loadUser();
    getAuthenticatedUser();
    const handleUserChanged = () => loadUser();
    window.addEventListener("userChanged", handleUserChanged);
    return () => window.removeEventListener("userChanged", handleUserChanged);
  }, []);

  const handleLogoClick = () => {
    navigate("/");
    setSearchText("");
    localStorage.clear();
  };

  const handleSearchFunction = () => {
    if (searchText.trim() !== "") {
      localStorage.setItem("searchText", searchText);
      navigate("/products-page");
    } else {
      localStorage.clear();
      navigate("/products-page");
    }
  };

  const handleLogout = () => {
    sessionStorage.clear();
    localStorage.clear();
    window.dispatchEvent(new Event("userChanged"));
    setShowChat(false);
    toast.success("Đăng xuất thành công!");
    navigate("/login");
  };

  const handleWarranty = () => navigate("/warranty-policy");

  const handleSupport = () => {
    if (!userName) {
      toast.error("Vui lòng đăng nhập để sử dụng chức năng hỗ trợ khách hàng.");
      return;
    }
    setShowChat(true);
  };

  return (
    <>
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
              onClick={() => handleLogoClick()}
              style={{ cursor: "pointer" }}
            />
            <Box>
              <Typography fontSize={14}>
                Chất lượng thật - Giá trị thật
              </Typography>
            </Box>
          </Box>

          <Box className={styles.menuSearchBox}>
            <TextField
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSearchFunction();
              }}
              placeholder="Tìm sản phẩm, thương hiệu bạn mong muốn..."
              variant="outlined"
              size="small"
              fullWidth
              sx={{
                backgroundColor: "white",
                borderRadius: "4px",
                input: {
                  padding: "10px 14px",
                },
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={handleSearchFunction} edge="end">
                      <SearchIcon />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Box>

          <Box className={styles.iconsMenu}>
            <Box className={styles.iconBox}>
              <IconButton color="inherit" onClick={handleWarranty}>
                <VerifiedUser />
              </IconButton>
              <Typography variant="caption">Chính Sách Bảo Hành</Typography>
            </Box>

            <Box className={styles.iconBox}>
              <IconButton color="inherit" onClick={handleSupport}>
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

                <Box
                  className={styles.userInfoBox}
                  onClick={() => navigate("/profile")}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    cursor: "pointer",
                  }}
                >
                  <AccountCircle />
                  <Typography variant="body2" sx={{ ml: 0.5, color: "white" }}>
                    {user?.account?.points ?? 0} điểm
                  </Typography>
                </Box>

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

      {showChat && <ChatWidget onClose={() => setShowChat(false)} />}
    </>
  );
};

export default HeaderSkincare;
