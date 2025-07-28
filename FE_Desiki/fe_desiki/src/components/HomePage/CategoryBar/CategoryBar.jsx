import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  MenuItem,
  Popper,
  Paper,
  ClickAwayListener,
  Modal,
  Button,
} from "@mui/material";
import { Menu } from "@mui/icons-material";
import styles from "./CategoryBar.module.css";
import { useLocation, useNavigate } from "react-router-dom";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import {
  getAllCategories,
  getAllMiniGames,
  getAllSkinStatuses,
  getAllSkinTypes,
} from "../../../services/apiServices";

const CategoryBar = () => {
  const location = useLocation();
  const isHome = location.pathname === "/";

  const navigate = useNavigate();
  const [openDanhMuc, setOpenDanhMuc] = useState(false);
  const [anchorDanhMuc, setAnchorDanhMuc] = useState(null);

  const [openSanPham, setOpenSanPham] = useState(false);
  const [anchorSanPham, setAnchorSanPham] = useState(null);
  const [categories, setCategories] = useState([]);
  const [skinTypes, setSkinTypes] = useState([]);
  const [skinStatuses, setSkinStatuses] = useState([]);

  const handleBanner = () => navigate("/hot-deal");
  const handleDeals = () => navigate("/products-page");
  const handleBlog = () => navigate("/blog-grid");

  const handleDanhMucClick = (event) => {
    setAnchorDanhMuc(event.currentTarget);
    setOpenDanhMuc((prev) => !prev);
    setOpenSanPham(false);
  };

  useEffect(() => {
    fetchAllCategories();
    fetchAllSkinTypes();
    fetchAllSkinStatuses();
    fetchAllMiniGames();
  }, []);

  const fetchAllCategories = async () => {
    try {
      const result = await getAllCategories();
      setCategories(result.categories);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchAllMiniGames = async () => {
    try {
      const result = await getAllMiniGames();
      setGameNames(result.gameTypes);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchAllSkinTypes = async () => {
    try {
      const result = await getAllSkinTypes();
      setSkinTypes(result.skinTypes);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchAllSkinStatuses = async () => {
    try {
      const result = await getAllSkinStatuses();
      setSkinStatuses(result.skinStatuses);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSanPhamClick = (event) => {
    setAnchorSanPham(event.currentTarget);
    setOpenSanPham((prev) => !prev);
    setOpenDanhMuc(false);
  };

  const handleCloseAll = () => {
    setOpenDanhMuc(false);
    setOpenSanPham(false);
  };

  const danhMucList = categories.map((item) => item.name);

  const sanPhamList = [
    {
      name: "Các loại da",
      subItems: skinTypes.map((item) => item.name),
    },
    {
      name: "Tình trạng da",
      subItems: skinStatuses.map((item) => item.name),
    },
  ];

  return (
    <Box
      className={styles.categoryContainer}
      style={{
        marginTop: isHome ? "20px" : "100px",
      }}
    >
      <Box className={styles.leftMenu}>
        <Box
          display="flex"
          alignItems="center"
          onClick={handleDanhMucClick}
          style={{ cursor: "pointer" }}
        >
          <Menu fontSize="small" />
          <Typography fontWeight="bold" style={{ marginLeft: 4 }}>
            DANH MỤC
          </Typography>
        </Box>

        <span className={styles.divider}>|</span>
        <Typography className={styles.categoryItem} onClick={handleDeals}>
          Sản phẩm DeskiCare
        </Typography>
        <Typography className={styles.categoryItem} onClick={handleBanner}>
          HOT DEALS
        </Typography>
        <Typography
          className={styles.categoryItem}
          onClick={handleSanPhamClick}
        >
          Loại Sản Phẩm
        </Typography>
        <Typography className={styles.categoryItem} onClick={handleBlog}>
          Tạp Chí Làm Đẹp
        </Typography>
      </Box>

      {/* Danh mục popper */}
      <Popper
        open={openDanhMuc}
        anchorEl={anchorDanhMuc}
        placement="bottom-start"
      >
        <ClickAwayListener onClickAway={handleCloseAll}>
          <Paper elevation={3} sx={{ width: 240, padding: 1 }}>
            {danhMucList.map((cat, index) => (
              <MenuItem
                key={index}
                onClick={() => {
                  handleCloseAll();
                  localStorage.setItem("category", cat);
                  navigate("/products-page");
                }}
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Typography>{cat}</Typography>
                <ChevronRightIcon fontSize="small" />
              </MenuItem>
            ))}
          </Paper>
        </ClickAwayListener>
      </Popper>

      <Popper
        open={openSanPham}
        anchorEl={anchorSanPham}
        placement="bottom-start"
      >
        <ClickAwayListener onClickAway={handleCloseAll}>
          <Paper
            elevation={3}
            sx={{
              width: 900,
              height: 300, // tăng chiều cao
              padding: 1,
              bgcolor: "background.paper",
              borderRadius: 1,
              boxShadow: 3,
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "stretch", // cho các phần con cao bằng nhau
              overflowY: "auto",
              zIndex: "10",
            }}
          >
            {sanPhamList.map((item, index) => (
              <Box
                key={index}
                sx={{
                  flex: 1,
                  borderRight:
                    index !== sanPhamList.length - 1
                      ? "1px solid #e0e0e0"
                      : "none",
                  px: 2,
                  display: "flex",
                  flexDirection: "column",
                  minWidth: 0, // chống tràn
                }}
              >
                <Typography
                  fontWeight="bold"
                  sx={{ py: 0.75, fontSize: "1rem", color: "text.primary" }}
                >
                  {item.name}
                </Typography>
                <Box sx={{ flexGrow: 1, overflowY: "auto" }}>
                  {item.subItems.map((sub, i) => (
                    <MenuItem
                      key={i}
                      onClick={() => {
                        handleCloseAll();
                        localStorage.setItem("skin", sub);
                        navigate("/products-page");
                      }}
                      sx={{
                        pl: 3,
                        py: 0.5,
                        fontSize: "0.9rem",
                        color: "text.secondary",
                        "&:hover": {
                          bgcolor: "action.hover",
                        },
                      }}
                    >
                      {sub}
                    </MenuItem>
                  ))}
                </Box>
              </Box>
            ))}
          </Paper>
        </ClickAwayListener>
      </Popper>
    </Box>
  );
};

export default CategoryBar;
