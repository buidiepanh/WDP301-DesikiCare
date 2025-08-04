"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { categories } from "@/data/categories";
import { getProducts } from "@/services/products/getProducts";
import { getProductSkinTypes } from "@/services/products/getProductSkinTypes";
import { getProductSkinStatuses } from "@/services/products/getProductSkinStatuses";
import { ProductCard } from "../home/components/popularProduct/ProductCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Search, Filter, SortDesc, ChevronDown } from "lucide-react";

type Product = {
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
  shipmentProducts: {
    shipment: {
      _id: string;
      shipmentDate: string;
      isDeleted: boolean;
      createdAt: string;
      updatedAt: string;
    };
    shipmentProduct: {
      _id: string;
      productId: string;
      shipmentId: string;
      importQuantity: number;
      saleQuantity: number;
      manufacturingDate: string;
      expiryDate: string;
      buyPrice: number;
      isDeactivated: boolean;
      createdAt: string;
      updatedAt: string;
    };
  }[];
  productSkinTypes: {
    _id: number;
    name: string;
  }[];
  productSkinStatuses: {
    _id: number;
    name: string;
  }[];
};

type SkinType = {
  _id: number;
  name: string;
};

type SkinStatus = {
  _id: number;
  name: string;
};

const ProductsPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // STATES
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [skinTypes, setSkinTypes] = useState<SkinType[]>([]);
  const [skinStatuses, setSkinStatuses] = useState<SkinStatus[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // FILTER STATES - Initialize from URL params
  const [searchTerm, setSearchTerm] = useState(
    searchParams.get("search") || ""
  );
  const [selectedCategory, setSelectedCategory] = useState<number | null>(
    searchParams.get("category") ? Number(searchParams.get("category")) : null
  );
  const [selectedSkinTypes, setSelectedSkinTypes] = useState<number[]>(
    searchParams.get("skinTypes")
      ? searchParams.get("skinTypes")!.split(",").map(Number)
      : []
  );
  const [selectedSkinStatuses, setSelectedSkinStatuses] = useState<number[]>(
    searchParams.get("skinStatuses")
      ? searchParams.get("skinStatuses")!.split(",").map(Number)
      : []
  );
  const [sortBy, setSortBy] = useState<"price-asc" | "price-desc" | null>(
    (searchParams.get("sort") as "price-asc" | "price-desc") || null
  );

  // Dropdown visibility states
  const [showSkinTypeDropdown, setShowSkinTypeDropdown] = useState(false);
  const [showSkinStatusDropdown, setShowSkinStatusDropdown] = useState(false);

  // FUNCTIONS
  const updateURL = useCallback(() => {
    const params = new URLSearchParams();

    if (searchTerm) params.set("search", searchTerm);
    if (selectedCategory !== null)
      params.set("category", selectedCategory.toString());
    if (selectedSkinTypes.length > 0)
      params.set("skinTypes", selectedSkinTypes.join(","));
    if (selectedSkinStatuses.length > 0)
      params.set("skinStatuses", selectedSkinStatuses.join(","));
    if (sortBy) params.set("sort", sortBy);

    const queryString = params.toString();
    const newURL = queryString ? `?${queryString}` : "/products";

    router.replace(newURL, { scroll: false });
  }, [
    router,
    searchTerm,
    selectedCategory,
    selectedSkinTypes,
    selectedSkinStatuses,
    sortBy,
  ]);

  // HOOKS
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [productsData, skinTypesData, skinStatusesData] =
          await Promise.all([
            getProducts(),
            getProductSkinTypes(),
            getProductSkinStatuses(),
          ]);

        setProducts(productsData);
        setSkinTypes(skinTypesData);
        setSkinStatuses(skinStatusesData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Update URL when filters change
  useEffect(() => {
    updateURL();
  }, [updateURL]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest(".dropdown-container")) {
        setShowSkinTypeDropdown(false);
        setShowSkinStatusDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // FILTER AND SORT LOGIC
  useEffect(() => {
    let filtered = [...products];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (item) =>
          item.product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.product.description
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
      );
    }

    // Category filter
    if (selectedCategory !== null) {
      filtered = filtered.filter(
        (item) => item.product.categoryId === selectedCategory
      );
    }

    // Skin type filter
    if (selectedSkinTypes.length > 0) {
      filtered = filtered.filter((item) =>
        item.productSkinTypes.some((type) =>
          selectedSkinTypes.includes(type._id)
        )
      );
    }

    // Skin status filter
    if (selectedSkinStatuses.length > 0) {
      filtered = filtered.filter((item) =>
        item.productSkinStatuses.some((status) =>
          selectedSkinStatuses.includes(status._id)
        )
      );
    }

    // Sort
    if (sortBy === "price-asc") {
      filtered.sort((a, b) => a.product.salePrice - b.product.salePrice);
    } else if (sortBy === "price-desc") {
      filtered.sort((a, b) => b.product.salePrice - a.product.salePrice);
    }

    setFilteredProducts(filtered);
  }, [
    products,
    searchTerm,
    selectedCategory,
    selectedSkinTypes,
    selectedSkinStatuses,
    sortBy,
  ]);

  const toggleSkinType = (skinTypeId: number) => {
    setSelectedSkinTypes((prev) =>
      prev.includes(skinTypeId)
        ? prev.filter((id) => id !== skinTypeId)
        : [...prev, skinTypeId]
    );
  };

  const toggleSkinStatus = (skinStatusId: number) => {
    setSelectedSkinStatuses((prev) =>
      prev.includes(skinStatusId)
        ? prev.filter((id) => id !== skinStatusId)
        : [...prev, skinStatusId]
    );
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCategory(null);
    setSelectedSkinTypes([]);
    setSelectedSkinStatuses([]);
    setSortBy(null);
  };

  const hasActiveFilters =
    searchTerm ||
    selectedCategory !== null ||
    selectedSkinTypes.length > 0 ||
    selectedSkinStatuses.length > 0 ||
    sortBy;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Products</h1>
          <p className="text-gray-600">
            Discover our premium skincare collection
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition-all"
              />
            </div>
          </div>

          {/* Filters Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            {/* Category Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                value={selectedCategory || ""}
                onChange={(e) =>
                  setSelectedCategory(
                    e.target.value ? Number(e.target.value) : null
                  )
                }
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none"
              >
                <option value="">All Categories</option>
                {categories.map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Skin Type Filter */}
            <div className="relative dropdown-container">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Skin Type
              </label>
              <button
                type="button"
                onClick={() => setShowSkinTypeDropdown(!showSkinTypeDropdown)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none text-left flex items-center justify-between bg-white"
              >
                <span className="text-gray-700">
                  {selectedSkinTypes.length === 0
                    ? "All Skin Types"
                    : `${selectedSkinTypes.length} selected`}
                </span>
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </button>

              {showSkinTypeDropdown && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                  {skinTypes.map((type) => (
                    <label
                      key={type._id}
                      className="flex items-center px-3 py-2 hover:bg-gray-50 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={selectedSkinTypes.includes(type._id)}
                        onChange={() => toggleSkinType(type._id)}
                        className="mr-2 rounded border-gray-300 text-gray-900 focus:ring-gray-900"
                      />
                      <span className="text-sm text-gray-700">{type.name}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* Skin Status Filter */}
            <div className="relative dropdown-container">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Skin Condition
              </label>
              <button
                type="button"
                onClick={() =>
                  setShowSkinStatusDropdown(!showSkinStatusDropdown)
                }
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none text-left flex items-center justify-between bg-white"
              >
                <span className="text-gray-700">
                  {selectedSkinStatuses.length === 0
                    ? "All Conditions"
                    : `${selectedSkinStatuses.length} selected`}
                </span>
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </button>

              {showSkinStatusDropdown && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                  {skinStatuses.map((status) => (
                    <label
                      key={status._id}
                      className="flex items-center px-3 py-2 hover:bg-gray-50 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={selectedSkinStatuses.includes(status._id)}
                        onChange={() => toggleSkinStatus(status._id)}
                        className="mr-2 rounded border-gray-300 text-gray-900 focus:ring-gray-900"
                      />
                      <span className="text-sm text-gray-700">
                        {status.name}
                      </span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* Sort Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sort by Price
              </label>
              <select
                value={sortBy || ""}
                onChange={(e) =>
                  setSortBy(
                    e.target.value === ""
                      ? null
                      : (e.target.value as "price-asc" | "price-desc")
                  )
                }
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none"
              >
                <option value="">Default</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
            </div>
          </div>

          {/* Clear Filters */}
          {hasActiveFilters && (
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">
                {filteredProducts.length} product
                {filteredProducts.length !== 1 ? "s" : ""} found
              </span>
              <Button onClick={clearFilters} variant="outline" size="sm">
                Clear All Filters
              </Button>
            </div>
          )}
        </div>

        {/* Products Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, index) => (
              <div key={index} className="bg-white rounded-lg p-4">
                <Skeleton className="w-full h-64 mb-4" />
                <Skeleton className="w-3/4 h-4 mb-2" />
                <Skeleton className="w-1/2 h-4 mb-2" />
                <Skeleton className="w-1/3 h-6" />
              </div>
            ))}
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((item) => (
              <div key={item.product._id} className="flex justify-center">
                <ProductCard product={item.product} category={item.category} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Filter className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No products found
            </h3>
            <p className="text-gray-600 mb-4">
              Try adjusting your search or filter criteria
            </p>
            <Button onClick={clearFilters} variant="outline">
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductsPage;
