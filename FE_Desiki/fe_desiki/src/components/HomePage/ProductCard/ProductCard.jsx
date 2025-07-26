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
    <div className="product-card">
      <div className="product-image-container">
        <img className="product-image" src={imageUrl} alt={name} />
      </div>
      <div className="product-info">
        <p className="product-name">{name}</p>
        <div className="product-skin-types-container">
          {productSkinTypes.map((type) => (
            <Tag key={type._id} color="cyan">
              {type.name}
            </Tag>
          ))}
        </div>
        <div className="product-skin-statuses-container">
          {productSkinStatuses.map((status) => (
            <Tag key={status._id} color="blue">
              {status.name}
            </Tag>
          ))}
        </div>
        <div className="product-description">
          <p>{productInfo.description}</p>
        </div>

        <div className="price-and-details-relative-container">
          <div className="price-and-details-absolute-container">
            <div className="price-container">
              <p className="price-title">PRICE</p>
              <p className="price">{salePrice?.toLocaleString()}đ</p>
            </div>

            <div className="details-btn" onClick={() => handleClick()}>
              <p className="details-title">Xem Chi Tiết</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;

// <Card
//   className="product-card"
//   hoverable
//   onClick={handleClick}
//   cover={
//     <img
//       alt={name}
//       src={imageUrl}
//       style={{
//         height: 240,
//         objectFit: "cover",
//         borderTopLeftRadius: 12,
//         borderTopRightRadius: 12,
//       }}
//     />
//   }
//   style={{ borderRadius: 12 }}
//   bodyStyle={{ padding: 16 }}
// >
{
  /* <h4 style={{ fontSize: 16, fontWeight: 600, marginBottom: 4 }}>{name}</h4> */
}

{
  /* Giá và giảm giá */
}
{
  /* <div style={{ marginBottom: 8 }}>
        <span style={{ color: "red", fontWeight: 700, fontSize: 16 }}>
          {salePrice?.toLocaleString()}₫
        </span>
      </div> */
}

{
  /* Tình trạng da */
}
{
  /* <div style={{ marginBottom: 8 }}>
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
      </div>  */
}
// </Card>
