import React from "react";
import { Card, Rate, Progress, Tag, Tooltip } from "antd";
import { useNavigate } from "react-router-dom";
import "./ProductCard.css";

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const {
    product: productInfo,
    productSkinTypes,
    productSkinStatuses,
    shipmentProducts,
  } = product;

  const handleClick = () => {
    navigate(`/products/${productInfo._id}`);
  };

  const name = productInfo.name;
  const imageUrl = productInfo.imageUrl;
  const salePrice = productInfo.salePrice;

  const totalQuantity = shipmentProducts?.reduce(
    (sum, item) => sum + (item.shipmentProduct?.quantity || 0),
    0
  );

  return (
    <Card
      className="product-card"
      hoverable
      onClick={handleClick}
      cover={
        <img
          alt={name}
          src={imageUrl}
          style={{
            height: 240,
            objectFit: "cover",
            borderTopLeftRadius: 12,
            borderTopRightRadius: 12,
          }}
        />
      }
      style={{ borderRadius: 12 }}
      bodyStyle={{ padding: 16 }}
    >
      <h4 style={{ fontSize: 16, fontWeight: 600, marginBottom: 4 }}>{name}</h4>

      {/* Giá và giảm giá */}
      <div style={{ marginBottom: 8 }}>
        <span style={{ color: "red", fontWeight: 700, fontSize: 16 }}>
          {salePrice?.toLocaleString()}₫
        </span>
      </div>

      {/* Tình trạng da */}
      <div style={{ marginBottom: 8 }}>
        {productSkinTypes.map((type) => (
          <Tag key={type._id} color="blue">
            {type.name}
          </Tag>
        ))}
        {productSkinStatuses.map((status) => (
          <Tag key={status._id} color="red">
            {status.name}
          </Tag>
        ))}
      </div>
    </Card>
  );
};

export default ProductCard;
