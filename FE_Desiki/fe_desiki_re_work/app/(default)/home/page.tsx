"use client";
import CarouselDesiki from "@/app/(default)/home/components/carousel/CarouselDesiki";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import SubNav from "./components/subNav/SubNav";
import { PopularProduct } from "./components/popularProduct/PopularProduct";
import { Collections } from "./components/collections/Collections";

const HomePage = () => {
  const [popularProducts, setPopularProducts] = useState([]);
  useEffect(() => {}, []);

  const fetchPopularProducts = async () => {
    try {
    } catch (error) {
      console.error("Error fetching popular products:", error);
    }
  };

  return (
    <div className="w-full flex flex-col gap-10 font-instrument">
      <CarouselDesiki />
      <SubNav />
      <div className="w-full flex items-center justify-center ">
        <PopularProduct />
      </div>
      <div className="w-full flex items-center justify-center mb-20">
        <Collections />
      </div>
    </div>
  );
};

export default HomePage;
