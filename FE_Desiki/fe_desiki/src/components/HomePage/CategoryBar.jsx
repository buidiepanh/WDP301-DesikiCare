import React from "react";
import { Box, Typography } from "@mui/material";
import { Menu, Room } from "@mui/icons-material";
import styles from "./CategoryBar.module.css";

const CategoryBar = () => {
  return (
    <Box className={styles.categoryContainer}>
      <Box className={styles.leftMenu}>
        <Menu fontSize="small" />
        <Typography  fontWeight="bold">
          DANH MỤC
        </Typography>
        <span className={styles.divider}>|</span>
        <Typography className={styles.categoryItem}>HASAKI DEALS</Typography>
        <Typography className={styles.categoryItem}>HOT DEALS</Typography>
        <Typography className={styles.categoryItem}>THƯƠNG HIỆU</Typography>
        <Typography className={styles.categoryItem}>HÀNG MỚI VỀ</Typography>
        <Typography className={styles.categoryItem}>BÁN CHẠY</Typography>
        <Typography className={styles.categoryItem}>CLINIC & SPA</Typography>
        <Typography className={styles.categoryItem}>DERMAHAIR</Typography>
      </Box>

      <Box className={styles.rightMenu}>
        <Typography className={styles.linkItem}>Tra cứu đơn hàng</Typography>
        <span className={styles.divider}>|</span>
        <Typography className={styles.linkItem}>Tải ứng dụng</Typography>
        <Room fontSize="small" />
        <Typography className={styles.linkItem} fontWeight="bold">
          Chọn khu vực của bạn
        </Typography>
      </Box>
    </Box>
  );
};

export default CategoryBar;
