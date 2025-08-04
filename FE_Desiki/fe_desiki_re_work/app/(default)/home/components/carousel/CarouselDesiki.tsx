"use client";
import React, { useState, useEffect } from "react";
import styles from "./CarouselDesiki.module.css";

const carouselData = [
  {
    id: 1,
    image: "/images/decoration/home/carousel/serum.png",
    title: "Serums",
    brand: "The Ordinary",
    name: "Hydralunoic Serums",
  },
  {
    id: 2,
    image: "/images/decoration/home/carousel/faceCleaner.png",
    title: "Face Cleaners",
    brand: "YOUTH to the PEOPLE",
    name: "Kale + Green Tea Cleanser",
  },
  {
    id: 3,
    image: "/images/decoration/home/carousel/makeupRemover.png",
    title: "Makeup Removers",
    brand: "Riversol",
    name: "Micellar Water",
  },
  {
    id: 4,
    image: "/images/decoration/home/carousel/mask.png",
    title: "Masks",
    brand: "Juice Beauty",
    name: "Goop Glow Mask",
  },
  {
    id: 5,
    image: "/images/decoration/home/carousel/ex.png",
    title: "Exfoliators",
    brand: "Neutrogena",
    name: "Hydro Boost Exfoliator",
  },
];

const carouselScreenTitle = [
  "Serums",
  "Face Cleanser",
  "Makeup Remover",
  "Mask",
  "Exfoliate",
];

const CarouselDesiki = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Safety check for data
  if (!carouselData || carouselData.length === 0) {
    return <div>No carousel data available</div>;
  }

  // Auto-slide functionality
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselData.length);
    }, 5000); // Change slide every 5 seconds

    // Cleanup interval on unmount
    return () => {
      clearInterval(interval);
    };
  }, []);

  const goToSlide = (index: number) => {
    if (index >= 0 && index < carouselData.length) {
      setCurrentSlide(index);
    }
  };

  const handleCategoryClick = (index: number) => {
    if (index >= 0 && index < carouselData.length) {
      setCurrentSlide(index);
    }
  };

  return (
    <div className={styles.carousel}>
      {/* Fixed Shop Now Title */}
      <div className="absolute top-16 left-20 z-10">
        <h1 className={styles.shopNow}>Shop Now</h1>
      </div>
      {/* Fixed Category List */}
      <div className="absolute top-48 left-20 z-10">
        <ul className={styles.categoryList}>
          {carouselScreenTitle.map((category, categoryIndex) => (
            <li
              key={`category-${categoryIndex}-${category}`}
              className={`${styles.categoryItem} ${
                categoryIndex === currentSlide ? styles.active : ""
              }`}
              onClick={() => handleCategoryClick(categoryIndex)}
            >
              {category}
            </li>
          ))}
        </ul>
      </div>
      <div
        className={styles.slideContainer}
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {carouselData.map((item, index) => (
          <div key={`slide-${item.id}-${index}`} className={styles.slide}>
            {/* Left Content - Now Empty since Shop Now is fixed */}
            <div className={styles.leftContent}>
              {/* Empty space for fixed content */}
            </div>

            {/* Center - Product Image */}
            <div className={styles.imageContainer}>
              <img
                src={item.image}
                alt={item.name}
                className={styles.productImage}
              />
            </div>

            {/* Right Content */}
            <div className={styles.rightContent}>
              <p className={styles.brand}>{item.brand}</p>
              <h2 className={styles.productName}>{item.name}</h2>
            </div>
          </div>
        ))}
      </div>

      {/* Indicators */}
      <div className={styles.indicators}>
        {carouselData.map((_, index) => (
          <button
            key={index}
            className={`${styles.indicator} ${
              index === currentSlide ? styles.active : ""
            }`}
            onClick={() => goToSlide(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default CarouselDesiki;
