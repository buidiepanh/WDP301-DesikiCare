import React from "react";
import { Box, Typography, Chip, Pagination, Grid } from "@mui/material";
import CategoryBar from "../../../components/HomePage/CategoryBar/CategoryBar";
import PromoCarousel from "../../../components/HomePage/Carousel/PromoCarousel";
const filters = [
  "Tất cả",
  "Góc review",
  "Tin tức",
  "Cách chăm sóc da",
  "Sự kiện",
  "Bí quyết khỏe đẹp",
  "Xu hướng trang điểm",
];

const articles = [
  {
    title: "Có nên sử dụng mỹ phẩm cận date và gần hết hạn sử dụng?",
    category: "Góc review",
    image:
      "https://image.hsv-tech.io/1040x662/bbx/common/a7a8c084-b118-4d51-a4fa-dceedbb0363a.webp",
  },
  {
    title: "Tưng bừng khai trương đại tiệc làm đẹp Beauty Box tại Hà Nội",
    category: "Tin tức",
    image:
      "https://image.hsv-tech.io/1040x662/bbx/common/a7a8c084-b118-4d51-a4fa-dceedbb0363a.webp",
  },

];

const BlogGrid = () => {
  return (
    <div>

<CategoryBar/>  
<div style={{marginTop: 10}}>
    <PromoCarousel/>
</div>
    
    <Box px={{ xs: 2, sm: 4 }} py={{ xs: 3, sm: 5 }} maxWidth="1200px" mx="auto">
      <Typography
        variant="h5"
        fontWeight="bold"
        mb={3}
        sx={{ textAlign: { xs: "center", sm: "left" } }}
      >
        Danh mục bài viết
      </Typography>

      <Box
        mb={4}
        display="flex"
        flexWrap="wrap"
        gap={1}
        justifyContent={{ xs: "center", sm: "flex-start" }}
      >
        {filters.map((filter, index) => (
          <Chip
            key={index}
            label={filter}
            clickable
            sx={{
              fontWeight: 600,
              "&:hover": {
                backgroundColor: "primary.light",
                color: "primary.contrastText",
              },
            }}
          />
        ))}
      </Box>

      <Grid container spacing={3}>
        {articles.map((article, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Box
              display="flex"
              flexDirection="column"
              borderRadius={2}
              overflow="hidden"
              boxShadow={3}
              sx={{
                height: "100%", // để full chiều cao Grid item
                transition: "transform 0.3s ease",
                "&:hover": {
                  transform: "translateY(-6px)",
                  boxShadow: 6,
                },
              }}
            >
              {/* Ảnh vuông, cố định */}
              <Box
                sx={{
                  position: "relative",
                  width: "100%",
                  paddingBottom: "100%", // tạo tỷ lệ vuông 1:1
                  overflow: "hidden",
                  flexShrink: 0,
                }}
              >
                <Box
                  component="img"
                  src={article.image}
                  alt={article.title}
                  sx={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    display: "block",
                  }}
                />
              </Box>

              {/* Nội dung text */}
              <Box
                p={2}
                display="flex"
                flexDirection="column"
                flexGrow={1}
              >
                <Typography
                  variant="body2"
                  color="text.secondary"
                  fontWeight={500}
                  mb={1}
                  sx={{ flexShrink: 0 }}
                >
                  {article.category}
                </Typography>

                <Typography
                  variant="subtitle1"
                  fontWeight="bold"
                  sx={{
                    display: "-webkit-box",
                    WebkitLineClamp: 3, // Giới hạn 3 dòng
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    flexGrow: 1,
                  }}
                >
                  {article.title}
                </Typography>
              </Box>
            </Box>
          </Grid>
        ))}
      </Grid>

      <Box mt={5} display="flex" justifyContent="center">
        <Pagination count={6} shape="rounded" color="primary" />
      </Box>
    </Box>
    </div>
  );
};

export default BlogGrid;
