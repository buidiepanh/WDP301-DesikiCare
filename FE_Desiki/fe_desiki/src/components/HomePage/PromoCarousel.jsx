import React, { useState } from 'react';
import { Box, IconButton } from '@mui/material';
import { ArrowBackIos, ArrowForwardIos } from '@mui/icons-material';
import './PromoCarousel.css';

const images = [
  'https://achaumedia.vn/wp-content/uploads/2020/05/dich-v%E1%BB%A5-chup-anh-san-pham-my-pham-1.jpg', // Replace with actual image paths
  '/images/slide2.png',
  '/images/slide3.png'
];

const PromoCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <Box className="slider-container">
      <IconButton className="nav-button left" onClick={prevSlide}>
        <ArrowBackIos />
      </IconButton>

      <Box
        component="img"
        src={images[currentIndex]}
        alt={`slide-${currentIndex}`}
        className="slide-image"
      />

      <IconButton className="nav-button right" onClick={nextSlide}>
        <ArrowForwardIos />
      </IconButton>

      <Box className="dot-container">
        {images.map((_, index) => (
          <Box
            key={index}
            className={`dot ${index === currentIndex ? 'active' : ''}`}
            onClick={() => setCurrentIndex(index)}
          />
        ))}
      </Box>
    </Box>
  );
};

export default PromoCarousel;
