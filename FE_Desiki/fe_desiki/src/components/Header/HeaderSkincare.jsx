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
  ConfirmationNumber,
  AccountCircle,
} from "@mui/icons-material";
import SearchIcon from "@mui/icons-material/Search";
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
    } else {
      localStorage.clear();
    }
    navigate("/products-page");
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
      <AppBar position="fixed" className={styles.appBar} elevation={0}>
        <Toolbar className={styles.toolbar}>
          <Box className={styles.logoSloganBox}>
            <img
              src={logo}
              alt="Desiki Care Logo"
              className={styles.logoImg}
              onClick={handleLogoClick}
            />
            <Box>
              <Typography className={styles.sloganText} fontSize={14}>
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
              className={styles.searchField}
              sx={{
                "& .MuiInputBase-input": {
                  padding: "12px 16px",
                  fontSize: "14px",
                },
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={handleSearchFunction}
                      edge="end"
                      className={styles.searchButton}
                      size="small"
                    >
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
                <IconButton
                  color="inherit"
                  onClick={() => navigate("/cart")}
                  className={styles.cartButton}
                >
                  <Badge badgeContent={0} color="error">
                    <ShoppingCartOutlined className={styles.shoppingCartIcon} />
                  </Badge>
                </IconButton>

                <Box
                  className={styles.ticketBox}
                  onClick={() => navigate("/mini-games")}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                    cursor: "pointer",
                    padding: "4px 8px",
                    borderRadius: "8px",
                    backgroundColor: "rgba(255, 255, 255, 0.1)",
                    "&:hover": {
                      backgroundColor: "rgba(255, 255, 255, 0.2)",
                    },
                  }}
                >
                  <ConfirmationNumber sx={{ fontSize: "20px" }} />
                  <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                    {user?.account?.gameTicketCount ?? 0}
                  </Typography>
                </Box>

                <Box
                  className={styles.userInfoBox}
                  onClick={() => navigate("/profile")}
                >
                  <AccountCircle />
                  <Typography variant="body2">
                    {user?.account?.points ?? 0} điểm
                  </Typography>
                </Box>

                <IconButton
                  color="inherit"
                  onClick={handleLogout}
                  className={styles.logoutButton}
                  title="Đăng xuất"
                >
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
                <Typography sx={{ color: "rgba(255, 255, 255, 0.7)" }}>
                  /
                </Typography>
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