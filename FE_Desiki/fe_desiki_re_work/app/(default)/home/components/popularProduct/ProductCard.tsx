"use client";

import Image from "next/image";
import Link from "next/link";
import React from "react";
import { categories } from "@/data/categories";
type ProductCardProps = {
  product: {
    _id: string;
    categoryId: number;
    name: string;
    description: string;
    volume: number;
    salePrice: number;
    gameTicketReward: number;
    isDeactivated: boolean;
    createdAt: string;
    updatedAt: string;
    imageUrl: string;
  };
  category: {
    _id: number;
    name: string;
  };
};

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  category,
}) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      minimumFractionDigits: 0,
    }).format(price);
  };

  // Lấy category name từ categories data hoặc từ category prop
  const getCategoryName = () => {
    // Ưu tiên tìm trong data categories theo categoryId
    const foundCategory = categories.find(
      (cat) => cat._id === product.categoryId
    );

    if (foundCategory?.name) {
      return foundCategory.name;
    }

    // Fallback sử dụng category name từ API response
    if (category?.name) {
      return category.name;
    }

    return "Unknown Category";
  };

  return (
    <Link
      href={`/products/${product._id}`}
      className="w-[258px] h-[354px] flex flex-col gap-3 rounded-lg cursor-pointer group hover:translate-y-[-8px] hover:shadow-lg transition-all duration-300 ease-out"
    >
      {/* Product Image */}
      <div className="w-full h-[258px] bg-gray-100 rounded-lg overflow-hidden relative">
        {product.imageUrl ? (
          <Image
            src={product.imageUrl || "/images/products/unknown.png"}
            alt={product.name}
            fill
            className="object-cover"
            sizes="258px"
            onError={(e) => {
              // Fallback to placeholder if image fails to load
              const target = e.target as HTMLImageElement;
              target.style.display = "none";
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-200">
            <div className="text-center">
              <div className="w-12 h-12 bg-gray-300 rounded-lg mx-auto mb-2 flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <p className="text-gray-400 text-xs">No Image</p>
            </div>
          </div>
        )}
        {/* {extendedInfo?.hasExtendedInfo && (
          <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded">
            Enhanced
          </div>
        )} */}
      </div>

      {/* Product Info */}
      <div className="flex flex-col gap-1 flex-1 px-2">
        <h3 className="font-instrument text-sm font-medium truncate text-gray-900">
          {product.name}
        </h3>

        <p className="text-gray-500 text-xs">{getCategoryName()}</p>

        <p className="font-semibold text-base text-gray-900 mt-auto">
          {formatPrice(product.salePrice)}
        </p>

        {product.gameTicketReward > 0 && (
          <p className="text-green-600 text-xs">
            🎟️ +{product.gameTicketReward} Game Tickets
          </p>
        )}
      </div>
    </Link>
  );
};
