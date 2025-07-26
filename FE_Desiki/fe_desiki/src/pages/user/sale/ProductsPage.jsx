"use client";

import { useEffect, useState } from "react";
import {
  Typography,
  Card,
  CardContent,
  CardMedia,
  Grid,
  TextField,
  Button,
  Menu,
  MenuItem,
  CircularProgress,
  Box,
  Container,
  InputAdornment,
  Stack,
} from "@mui/material";
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  Sort as SortIcon,
  KeyboardArrowDown as ArrowDownIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import "./ProductsPage.css";
import CategoryBar from "../../../components/HomePage/CategoryBar/CategoryBar";
import { getAllProducts } from "../../../services/apiServices";

const ProductsPage = () => {
  const navigation = useNavigate();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchValue, setSearchValue] = useState("");
  const [sortBy, setSortBy] = useState("default");
  const [filterBy, setFilterBy] = useState("all");

  // Menu states
  const [sortAnchorEl, setSortAnchorEl] = useState(null);
  const [filterAnchorEl, setFilterAnchorEl] = useState(null);

  const searchText = localStorage.getItem("searchText");

  useEffect(() => {
    fetchAllProducts();
  }, [searchText]);

  useEffect(() => {
    handleFilterAndSort();
  }, [products, searchValue, sortBy, filterBy]);

  const fetchAllProducts = async () => {
    try {
      setLoading(true);
      const result = await getAllProducts();
      let transformed = [];

      if (!searchText) {
        transformed = result.map((item) => ({
          _id: item.product._id,
          name: item.product.name,
          image: item.product.imageUrl,
          price: item.product.salePrice,
          description:
            item.product.description || "Sản phẩm chăm sóc da chất lượng cao",
          skinStatuses: item.productSkinStatuses.map((status) => status.name),
          skinTypes: item.productSkinTypes.map((type) => type.name),
          volume: item.product.volume,
        }));
      } else {
        const filter = result.filter((item) =>
          item.product.name.toLowerCase().includes(searchText.toLowerCase())
        );
        transformed = filter.map((item) => ({
          _id: item.product._id,
          name: item.product.name,
          image: item.product.imageUrl,
          price: item.product.salePrice,
          description:
            item.product.description || "Sản phẩm chăm sóc da chất lượng cao",
          skinStatuses: item.productSkinStatuses.map((status) => status.name),
          skinTypes: item.productSkinTypes.map((type) => type.name),
          volume: item.product.volume,
        }));
      }

      setProducts(transformed);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterAndSort = () => {
    let filtered = [...products];

    // Apply search filter
    if (searchValue) {
      filtered = filtered.filter((product) =>
        product.name.toLowerCase().includes(searchValue.toLowerCase())
      );
    }

    // Apply category filter
    if (filterBy !== "all") {
      filtered = filtered.filter((product) =>
        product.skinTypes.some((type) =>
          type.toLowerCase().includes(filterBy.toLowerCase())
        )
      );
    }

    // Apply sorting
    switch (sortBy) {
      case "price-low":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "name":
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        break;
    }

    setFilteredProducts(filtered);
  };

  const handleSearch = (event) => {
    setSearchValue(event.target.value);
  };

  const handleSearchSubmit = (event) => {
    if (event.key === "Enter") {
      handleFilterAndSort();
    }
  };

  const sortItems = [
    { key: "default", label: "Mặc định" },
    { key: "price-low", label: "Giá thấp đến cao" },
    { key: "price-high", label: "Giá cao đến thấp" },
    { key: "name", label: "Tên A-Z" },
  ];

  const filterItems = [
    { key: "all", label: "Tất cả" },
    { key: "khô", label: "Da khô" },
    { key: "dầu", label: "Da dầu" },
    { key: "hỗn hợp", label: "Da hỗn hợp" },
    { key: "nhạy cảm", label: "Da nhạy cảm" },
  ];

  const handleSortClick = (key) => {
    setSortBy(key);
    setSortAnchorEl(null);
  };

  const handleFilterClick = (key) => {
    setFilterBy(key);
    setFilterAnchorEl(null);
  };

  const getSortLabel = () => {
    const item = sortItems.find((item) => item.key === sortBy);
    return item ? item.label : "Sắp xếp";
  };

  const getFilterLabel = () => {
    const item = filterItems.find((item) => item.key === filterBy);
    return item ? item.label : "Lọc sản phẩm";
  };

  return (
    <div className="products-page">
      <CategoryBar />

      <Container maxWidth="xl" className="products-container">
        <Box className="products-header">
          <Typography variant="h4" className="products-title" gutterBottom>
            Các sản phẩm của DesikiCare 🔥
          </Typography>

          <Box className="search-filter-bar">
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Tìm kiếm sản phẩm..."
              value={searchValue}
              onChange={handleSearch}
              onKeyPress={handleSearchSubmit}
              className="search-input"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
              sx={{ maxWidth: 500 }}
            />

            <Stack direction="row" spacing={2} className="filter-controls">
              <Button
                variant="outlined"
                startIcon={<FilterIcon />}
                endIcon={<ArrowDownIcon />}
                onClick={(e) => setFilterAnchorEl(e.currentTarget)}
                className="filter-btn"
              >
                {getFilterLabel()}
              </Button>

              <Button
                variant="outlined"
                startIcon={<SortIcon />}
                endIcon={<ArrowDownIcon />}
                onClick={(e) => setSortAnchorEl(e.currentTarget)}
                className="sort-btn"
              >
                {getSortLabel()}
              </Button>
            </Stack>

            <Menu
              anchorEl={filterAnchorEl}
              open={Boolean(filterAnchorEl)}
              onClose={() => setFilterAnchorEl(null)}
            >
              {filterItems.map((item) => (
                <MenuItem
                  key={item.key}
                  onClick={() => handleFilterClick(item.key)}
                  selected={filterBy === item.key}
                >
                  {item.label}
                </MenuItem>
              ))}
            </Menu>

            <Menu
              anchorEl={sortAnchorEl}
              open={Boolean(sortAnchorEl)}
              onClose={() => setSortAnchorEl(null)}
            >
              {sortItems.map((item) => (
                <MenuItem
                  key={item.key}
                  onClick={() => handleSortClick(item.key)}
                  selected={sortBy === item.key}
                >
                  {item.label}
                </MenuItem>
              ))}
            </Menu>
          </Box>
        </Box>

        {loading ? (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            minHeight="200px"
          >
            <CircularProgress size={60} className="loading-spinner" />
          </Box>
        ) : (
          <>
            <Grid container spacing={3}>
              {filteredProducts.map((product, idx) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={idx}>
                  <Card
                    className="modern-product-card"
                    onClick={() => navigation(`/products/${product._id}`)}
                    sx={{
                      cursor: "pointer",
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <CardMedia
                      component="img"
                      height="220"
                      image={product.imageUrl || "/default-image.jpg"}
                      alt={product.name}
                      className="product-image"
                    />
                    <CardContent
                      className="product-content"
                      sx={{
                        flexGrow: 1,
                        display: "flex",
                        flexDirection: "column",
                      }}
                    >
                      <Typography
                        variant="h6"
                        className="product-title"
                        gutterBottom
                      >
                        {product.name}
                      </Typography>

                      <Typography
                        variant="body2"
                        color="text.secondary"
                        className="product-description"
                        sx={{ flexGrow: 1 }}
                      >
                        {product.description}
                      </Typography>

                      <Box
                        className="product-price-container"
                        mt={2}
                        pt={1.5}
                        borderTop="1px solid #f0f0f0"
                      >
                        <Typography variant="h6" className="product-price">
                          {new Intl.NumberFormat("vi-VN", {
                            style: "currency",
                            currency: "VND",
                          }).format(product.price)}
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>

            {filteredProducts.length === 0 && (
              <Box className="no-products" textAlign="center" py={8}>
                <Typography variant="h6" color="text.secondary">
                  Không tìm thấy sản phẩm nào
                </Typography>
              </Box>
            )}
          </>
        )}
      </Container>
    </div>
  );
};

export default ProductsPage;
