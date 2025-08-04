import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import {
  Row,
  Col,
  Typography,
  Button,
  InputNumber,
  Card,
  Divider,
  Image,
  Tag,
  Space,
  Spin,
} from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import {
  addToCart,
  getAllProducts,
  checkProductQuantity,
} from "../../../services/apiServices";
import dayjs from "dayjs";
import toast from "react-hot-toast";
import "./styles.css";
const { Title, Text, Paragraph } = Typography;
function Details() {
  const { productId } = useParams();
  const [productData, setProductData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [availableQuantity, setAvailableQuantity] = useState(0);
  const [isOutOfStock, setIsOutOfStock] = useState(false);
  const [isDeactivated, setIsDeactivated] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    fetchProductDetails();
  }, []);
  const fetchProductDetails = async () => {
    try {
      setLoading(true);
      const result = await getAllProducts();
      const foundProduct = result.find(
        (item) => productId === item.product._id
      );
      if (!foundProduct) {
        toast.error("Không tìm thấy sản phẩm!");
        navigate("/products-page");
        return;
      }
      setProductData(foundProduct);
      // Check if product is deactivated
      setIsDeactivated(foundProduct.product.isDeactivated || false);
      await checkProductAvailability(foundProduct.product._id);
    } catch (error) {
      console.log(error);
      toast.error("Có lỗi xảy ra khi tải thông tin sản phẩm!");
      navigate("/products-page");
    } finally {
      setLoading(false);
    }
  };
  const checkProductAvailability = async (productId) => {
    try {
      const quantity = await checkProductQuantity(productId);
      setAvailableQuantity(quantity);
      setIsOutOfStock(quantity <= 0);
    } catch (error) {
      console.log("Error checking product quantity:", error);
      setIsOutOfStock(true); // Assume out of stock if error
    }
  };
  // COMMIT - NHI
  const handleAddToCart = async (productId) => {
    const token = sessionStorage.getItem("accessToken");
    if (!token) {
      toast.error("Vui lòng đăng nhập để thêm vào giỏ hàng!");
      navigate("/login");
      return;
    }
    try {
      const result = await addToCart(productId);
      if (result) {
        toast.success("Đã thêm sản phẩm vào giỏ hàng!");
        navigate("/");
      } else {
        toast.error(`Thêm vào giỏ hàng thất bại, sản phẩm đã hết hàng!`);
      }
    } catch (error) {
      console.log(error);
      toast.error(`Không thể thêm vào giỏ hàng!`);
    }
  };
  if (loading) {
    return (
      <div style={{ textAlign: "center", paddingTop: 100 }}>
        <Spin size="large" />
      </div>
    );
  }
  if (!productData) return null;
  const {
    product,
    category,
    shipmentProducts,
    productSkinTypes,
    productSkinStatuses,
  } = productData;
  const totalQuantity = shipmentProducts.reduce(
    (sum, item) => sum + (item.shipmentProduct.quantity || 0),
    0
  );
  return (
    <div className="product-detail-container">
      <Button
        type="link"
        icon={<ArrowLeftOutlined />}
        onClick={() => navigate(-1)}
        className="back-button"
      >Quay lại
      </Button>
      <Row gutter={[32, 32]}>
        <Col xs={24} md={10}>
          <Card className="product-image-card">
            <Image
              width="100%"
              src={product.imageUrl}
              alt={product.name}
              className="product-image"
              fallback="https://via.placeholder.com/400x400"
            />
          </Card>
        </Col>
        {/* Product Info */}
        <Col xs={24} md={14}>
          <div className="product-info-container">
            <Title
              level={2}
              className="product-title"
              style={{
                textDecoration: isDeactivated ? "line-through" : "none",
                color: isDeactivated ? "#8c8c8c" : "inherit",
              }}
            >
              {product.name}
            </Title>
            <Text className="product-category">
              {category?.name || "Chưa phân loại"}
            </Text>
            <div className="product-price">
              {product.salePrice.toLocaleString()} đ
            </div>
            <Divider className="divider-custom" />
            <div className="info-section">
              <Text className="info-label">Mô tả sản phẩm:</Text>
              <div className="info-content">
                {product.description || "Chưa có mô tả"}
              </div>
            </div>
            <div className="info-section">
              <Text className="info-label">Thể tích:</Text>
              <div className="info-content">{product.volume} ml</div>
            </div>
            <div className="info-section">
              <Text className="info-label">Số lượng có sẵn:</Text>
              <div className="info-content">
                {isOutOfStock ? (
                  <Text
                    className="out-of-stock-text"
                    style={{ color: "#ff4d4f", fontWeight: "bold" }}
                  >
                    Sản phẩm đã hết hàng
                  </Text>
                ) : (
                  <Text style={{ color: "#52c41a", fontWeight: "bold" }}>
                    {availableQuantity} sản phẩm
                  </Text>
                )}
              </div>
            </div>
            {isDeactivated && (
              <div className="info-section">
                <Text className="info-label">Trạng thái:</Text>
                <div className="info-content">
                  <Text
                    style={{
                      color: "#ff4d4f",
                      fontWeight: "bold",
                      backgroundColor: "#fff2f0",
                      padding: "4px 8px",
                      borderRadius: "4px",
                      border: "1px solid #ffccc7",
                    }}
                  >
                    Sản phẩm đang bị khóa
                  </Text>
                </div>
              </div>
            )}
            <div className="info-section">
              <Text className="info-label">Loại da phù hợp:</Text>
              <div className="tag-container">
                {productSkinTypes && productSkinTypes.length > 0 ? (
                  productSkinTypes.map((skin) => (
                    <Tag key={skin._id} className="skin-tag skin-type-tag">
                      {skin.name}
                    </Tag>
                  ))
                ) : (
                  <Text className="no-data-text">Chưa có cụ thể</Text>
                )}
              </div>
            </div>
            <div className="info-section">
              <Text className="info-label">Tình trạng da:</Text>
              <div className="tag-container">
                {productSkinStatuses && productSkinStatuses.length > 0 ? (
                  productSkinStatuses.map((status) => (
                    <Tag key={status._id} className="skin-tag skin-status-tag">
                      {status.name}
                    </Tag>
                  ))
                ) : (
                  <Text className="no-data-text">Chưa có cụ thể</Text>
                )}
              </div>
            </div>
            <Button
              type="primary"
              size="large"
              onClick={() => handleAddToCart(productId)}
              className="add-to-cart-btn"
              disabled={isOutOfStock || isDeactivated}
              block
            >
              {isDeactivated
                ? "Đang bị khóa"
                : isOutOfStock
                  ? "Hết hàng"
                  : "Thêm vào giỏ hàng"}
            </Button>
          </div>
        </Col>
      </Row>
    </div>
  );
}
export default Details;