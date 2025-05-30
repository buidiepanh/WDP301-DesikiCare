import React from 'react';
import { Card, Rate, Progress } from 'antd';
import { useNavigate } from 'react-router-dom';

const ProductCard = ({ product }) => {
  const {
    id,
    img,
    name,
    price,
    oldPrice,
    discount,
    sold,
    total = 100,
    rating = 4.5,
    ratingCount = 128,
  } = product;

  const soldPercent = Math.min(Math.round((sold / total) * 100), 100);
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/product/${id}`);
  };

  return (
    <Card
      hoverable
      onClick={handleClick}
      cover={
        <img
          alt={name}
          src={img}
          style={{ height: 240, objectFit: 'cover', cursor: 'pointer' }}
        />
      }
      style={{ borderRadius: '12px' }}
    >
      <h4 style={{ fontSize: 16 }}>{name}</h4>
      <div style={{ marginBottom: 8 }}>
        <span style={{ color: 'red', fontWeight: 600 }}>{price.toLocaleString()}₫</span>{' '}
        <span style={{ textDecoration: 'line-through', color: '#999', marginLeft: 8 }}>
          {oldPrice.toLocaleString()}₫
        </span>
        <span style={{ marginLeft: 8, color: '#52c41a' }}>-{discount}%</span>
      </div>

      <div style={{ marginBottom: 8 }}>
        <Rate allowHalf disabled defaultValue={rating} style={{ fontSize: 14 }} />
        <span style={{ marginLeft: 8, fontSize: 12, color: '#888' }}>({ratingCount} đánh giá)</span>
      </div>

      <div>
        <Progress percent={soldPercent} size="small" strokeColor="#1890ff" />
        <span style={{ fontSize: 13, color: '#555' }}>Đã bán {sold} sản phẩm</span>
      </div>
    </Card>
  );
};

export default ProductCard;
