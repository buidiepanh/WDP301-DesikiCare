import React, { useState } from "react";
import {
  Box,
  Typography,
  MenuItem,
  Popper,
  Paper,
  ClickAwayListener,
} from "@mui/material";
import { Menu } from "@mui/icons-material";
import styles from "./CategoryBar.module.css";
import { useNavigate } from "react-router-dom";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

const CategoryBar = () => {
  const navigate = useNavigate();
  const [openDanhMuc, setOpenDanhMuc] = useState(false);
  const [anchorDanhMuc, setAnchorDanhMuc] = useState(null);

  const [openSanPham, setOpenSanPham] = useState(false);
  const [anchorSanPham, setAnchorSanPham] = useState(null);

  const handleBanner = () => navigate("/hot-deal");
  const handleDeals = () => navigate("/flash-deal-sale");
  const handleBlog = () => navigate("/blog-grid");
  const handleDanhMucClick = (event) => {
    setAnchorDanhMuc(event.currentTarget);
    setOpenDanhMuc((prev) => !prev);
    setOpenSanPham(false); // Đóng popper khác nếu đang mở
  };

  const handleSanPhamClick = (event) => {
    setAnchorSanPham(event.currentTarget);
    setOpenSanPham((prev) => !prev);
    setOpenDanhMuc(false); // Đóng popper khác nếu đang mở
  };

  const handleCloseAll = () => {
    setOpenDanhMuc(false);
    setOpenSanPham(false);
  };

  const danhMucList = [
    "Sức Khỏe - Làm Đẹp",
    "Mỹ Phẩm High-End",
    "Chăm Sóc Da Mặt",
    "Trang Điểm",
  
    "Chăm Sóc Cơ Thể",
    "Chăm Sóc Cá Nhân",
    "Nước Hoa",

    "DermaHair",
  ];

 const sanPhamList = [
  {
    name: "Chăm Sóc Da",
    subItems: ["Kem Dưỡng Da", "Sữa Rửa Mặt", "Mặt Nạ", "Toner", "Serum", "Tẩy Trang", "Kem Chống Nắng"],
  },
  {
    name: "Trang Điểm",
    subItems: ["Phấn Nước", "Son Môi", "Che Khuyết Điểm", "Kẻ Mắt"],
  },
  {
    name: "Dưỡng Tóc",
    subItems: ["Dầu Gội", "Dầu Xả", "Dưỡng Tóc"],
  },
];


  return (
    <Box className={styles.categoryContainer}>
      <Box className={styles.leftMenu}>
        <Box display="flex" alignItems="center" onClick={handleDanhMucClick} style={{ cursor: "pointer" }}>
          <Menu fontSize="small" />
          <Typography fontWeight="bold" style={{ marginLeft: 4 }}>DANH MỤC</Typography>
        </Box>

        <span className={styles.divider}>|</span>
        <Typography className={styles.categoryItem} onClick={handleDeals}>DeskiCare DEALS</Typography>
        <Typography className={styles.categoryItem} onClick={handleBanner}>HOT DEALS</Typography>
        <Typography className={styles.categoryItem}  onClick={handleSanPhamClick}>Sản Phẩm</Typography>
        <Typography className={styles.categoryItem}>Chăm Sóc Da</Typography>
        <Typography className={styles.categoryItem} onClick={handleBlog}>Tạp Chí Làm Đẹp</Typography>
        <Typography className={styles.categoryItem}>Sản Phẩm Mới</Typography>
      </Box>

      {/* Danh mục popper */}
      <Popper open={openDanhMuc} anchorEl={anchorDanhMuc} placement="bottom-start">
        <ClickAwayListener onClickAway={handleCloseAll}>
          <Paper elevation={3} sx={{ width: 240, padding: 1 }}>
            {danhMucList.map((cat, index) => (
              <MenuItem
                key={index}
                onClick={handleCloseAll}
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

     <Popper open={openSanPham} anchorEl={anchorSanPham} placement="bottom-start">
  <ClickAwayListener onClickAway={handleCloseAll}>
    <Paper
      elevation={3}
      sx={{
        width: 900,
        height: 300,             // tăng chiều cao
        padding: 1,
        bgcolor: 'background.paper',
        borderRadius: 1,
        boxShadow: 3,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'stretch',   // cho các phần con cao bằng nhau
        overflowY: 'auto',
      }}
    >
      {sanPhamList.map((item, index) => (
        <Box
          key={index}
          sx={{
            width: '33.33%',          // mỗi phần chiếm 1/3 chiều rộng
            borderRight: index !== sanPhamList.length - 1 ? '1px solid #e0e0e0' : 'none',
            paddingRight: 2,
            pl: 1,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Typography
            fontWeight="bold"
            sx={{ py: 0.75, fontSize: '1rem', color: 'text.primary' }}
          >
            {item.name}
          </Typography>
          <Box sx={{ flexGrow: 1, overflowY: 'auto' }}>
            {item.subItems.map((sub, i) => (
              <MenuItem
                key={i}
                onClick={handleCloseAll}
                sx={{
                  pl: 3,
                  py: 0.5,
                  fontSize: '0.9rem',
                  color: 'text.secondary',
                  '&:hover': {
                    bgcolor: 'action.hover',
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
