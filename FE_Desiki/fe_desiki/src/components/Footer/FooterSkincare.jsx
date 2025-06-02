import React from "react";
import { Box, Typography, Grid, TextField, Button } from "@mui/material";
import { Facebook, Instagram, YouTube } from "@mui/icons-material";
import "./FooterSkincare.css";
import code from "../../assets/code.png";
const defaultIcon = "https://via.placeholder.com/60?text=None";
const defaultBanner = "https://via.placeholder.com/150?text=Payment";

const FooterSkincare = () => {
  return (
    <Box className="footer-container">
      {/* Top feature icons */}
      <Box className="footer-icons">
        <Box className="footer-icon-box">
          <img
            src={"https://media.hcdn.vn/hsk/icons/icon_footer_1.png"}
            alt="cod"
            width={85}
          />
          <Typography mt={1}>Thanh toán khi nhận hàng</Typography>
        </Box>
        <Box className="footer-icon-box">
          <img
            src={"https://media.hcdn.vn/hsk/icons/icon_footer_2.png"}
            alt="free2h"
            width={120}
          />
          <Typography mt={1}>Giao nhanh miễn phí 2H</Typography>
        </Box>
        <Box className="footer-icon-box">
          <img
            src={"https://media.hcdn.vn/hsk/icons/icon_footer_2.png"}
            alt="return30"
            width={120}
          />
          <Typography mt={1}>30 ngày đổi trả miễn phí</Typography>
        </Box>
        <Box className="footer-icon-box">
          <img
            src={"https://media.hcdn.vn/hsk/icons/icon_footer_4.png"}
            alt="authentic"
            width={85}
          />
          <Typography mt={1}>Thương hiệu uy tín toàn cầu</Typography>
        </Box>
        <Box className="footer-icon-box">
          <Typography fontWeight="bold" fontSize="20px">
            HOTLINE CSKH
          </Typography>
          <Typography variant="h6" className="footer-hotline">
            1800 6324
          </Typography>
        </Box>
      </Box>

      {/* Footer links */}
      <Grid container spacing={18} mt={4}>
        <Grid item xs={12} sm={4} marginLeft={9}>
          <Typography fontWeight="bold" gutterBottom>
            HỖ TRỢ KHÁCH HÀNG
          </Typography>
          <Typography color="orange" fontWeight="bold">
            Hotline: 1800 6324
          </Typography>
          <Typography>(miễn phí , 08-22h kể cả T7, CN)</Typography>
          <Typography mt={1}>Các câu hỏi thường gặp</Typography>
          <Typography>Gửi yêu cầu hỗ trợ</Typography>
          <Typography>Hướng dẫn đặt hàng</Typography>
          <Typography>Phương thức vận chuyển</Typography>
          <Typography>Chính sách đổi trả</Typography>
        </Grid>

        <Grid item xs={12} sm={3}>
          <Typography fontWeight="bold" gutterBottom>
            VỀ DeskiCare.VN
          </Typography>
          <Typography>Giới thiệu DeskiCare.vn</Typography>
          <Typography>Tuyển Dụng</Typography>
          <Typography>Chính sách bảo mật</Typography>
          <Typography>Điều khoản sử dụng</Typography>
          <Typography>Liên hệ</Typography>
        </Grid>

        <Grid item xs={12} sm={3}>
          <Typography fontWeight="bold" gutterBottom>
            HỢP TÁC & LIÊN KẾT
          </Typography>
          <Typography>https://desikicare.vn/clinic</Typography>
          <Typography>DeskiCare cẩm nang</Typography>
          <Box mt={2} display="flex" gap={2}>
            <Facebook />
            <Instagram />
            <YouTube />
          </Box>
          <Box mt={2}>
            <img
              src={"https://media.hcdn.vn/hsk/icons/visa.png"}
              alt="payment"
              width={150}
            />
          </Box>
        </Grid>

        <Grid item xs={12} sm={4}>
          <Typography fontWeight="bold">
            CẬP NHẬT THÔNG TIN KHUYẾN MÃI
          </Typography>
          <Box display="flex" mt={1}>
            <TextField
              placeholder="email của bạn"
              variant="outlined"
              size="small"
              className="footer-input"
            />
            <Button
              variant="contained"
              sx={{
                backgroundColor: "#ff6a00",
                fontWeight: "bold",
                borderRadius: 20,
              }}
            >
              Đăng ký
            </Button>
          </Box>
          <Box className="footer-apps">
            <img src={code} alt="qr" width={60} />
            <Box
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <img
                src={"https://media.hcdn.vn/hsk/icons/dl_apple.png"}
                alt="App Store"
                width={120}
              />
              <img
                src={
                  "https://hotro.hasaki.vn/images/graphics/img_google_play.jpg"
                }
                alt="Google Play"
                width={120}
                style={{ marginTop: 8 }}
              />
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default FooterSkincare;

// done quaa choiogit
