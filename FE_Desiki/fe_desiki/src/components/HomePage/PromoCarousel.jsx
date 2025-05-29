import React from 'react';
import './PromoCarousel.css';

const PromoCarousel = () => {
  return (
    <div className="promo-container">
      <iframe
        className="promo-video"
        src="https://www.youtube.com/embed/aRxVvhefHQQ?autoplay=1&mute=1&loop=1&playlist=aRxVvhefHQQ"
        title="Video giới thiệu mỹ phẩm"
        frameBorder="0"
        allow="autoplay; encrypted-media"
        allowFullScreen
      ></iframe>
    </div>
  );
};

export default PromoCarousel;
