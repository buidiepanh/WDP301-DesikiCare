"use client";

import Link from "next/link";
import Image from "next/image";
import React, { useState, use, useEffect } from "react";
import { useRouter } from "next/navigation";
import { fetchProductDetails } from "@/services/products/getProductDetails";
import { toast } from "react-toastify";
// Import types from service file
import type {
  ProductFromExternalAPI,
  FinalProductDetails,
} from "@/services/products/getProductDetails";
import { Skeleton } from "@/components/ui/skeleton";
import { useAppSelector, useAppDispatch } from "@/app/hooks";
import { incrementItemQuantity, setCart } from "@/slices/cartSlice";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { AlertDialogCancel } from "@radix-ui/react-alert-dialog";
import { addToCart } from "@/services/cart";
import { getCartItems } from "@/services/cart";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle2Icon } from "lucide-react";

const ProductDetails = ({ params }: { params: Promise<{ id: string }> }) => {
  const { id: productId } = use(params);
  const router = useRouter();

  // REDUX
  const dispatch = useAppDispatch();
  const token = useAppSelector((state) => state.user.token);

  // STATES
  const [isLoading, setIsLoading] = useState(true);
  const [product, setProduct] = useState<FinalProductDetails | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  // EFFECTS
  useEffect(() => {
    const loadProductDetails = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const productDetails = await fetchProductDetails(productId);
        setProduct(productDetails);
      } catch (err) {
        console.error("Failed to load product details:", err);
        setError("Failed to load product details. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    if (productId) {
      loadProductDetails();
    }
  }, [productId]);

  // FUNCTIONS
  const quantityCalculate = (productData: ProductFromExternalAPI): number => {
    if (
      !productData.shipmentProducts ||
      productData.shipmentProducts.length === 0
    ) {
      return 0;
    }

    return productData.shipmentProducts.reduce((total, shipmentItem) => {
      const { importQuantity, saleQuantity } = shipmentItem.shipmentProduct;
      const remainingFromThisShipment = importQuantity - saleQuantity;
      return total + Math.max(0, remainingFromThisShipment); // Đảm bảo không âm
    }, 0);
  };

  const handleAddToCart = async () => {
    if (!token) {
      setShowLoginDialog(true);
      return;
    }

    if (isAddingToCart) return; // Prevent double clicks

    try {
      setIsAddingToCart(true);

      // 1. Optimistic update - tăng quantity trong UI ngay lập tức
      dispatch(incrementItemQuantity(productId));

      // 2. Gọi API để add product to cart
      const response = await addToCart(productId);

      if (response) {
        toast.success("Product added to cart successfully!");
        console.log("Product added to cart successfully");

        // 3. Fetch updated cart data từ server để sync
        try {
          const updatedCartData = await getCartItems();
          if (updatedCartData) {
            dispatch(setCart(updatedCartData));
            console.log("Cart data synced with server");
          }
        } catch (syncError) {
          console.error("Failed to sync cart data:", syncError);
          // Nếu sync fail, có thể revert optimistic update ở đây
        }
      } else {
        console.error("Failed to add product to cart");
        // TODO: Có thể revert optimistic update nếu API fail
      }
    } catch (error) {
      console.error("Error adding product to cart:", error);
      // TODO: Revert optimistic update khi có error
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleLoginRedirect = () => {
    // Lưu path hiện tại vào localStorage
    if (typeof window !== "undefined") {
      localStorage.setItem("previousPath", window.location.pathname);
    }

    // Chuyển tới trang login
    router.push("/login");
  };

  // RENDER LOADING STATE
  if (isLoading) {
    return (
      <div className="w-full flex flex-col px-10">
        <div className="flex items-center gap-2 pt-5">
          <Link
            className="text-gray-500 hover:text-black hover:underline"
            href="/"
          >
            Home
          </Link>
          <span className="text-gray-500">-</span>
          <Link
            className="text-gray-500 hover:text-black hover:underline"
            href="/products"
          >
            Products
          </Link>
          <span className="text-gray-500">-</span>
          <span className="text-gray-500">Product Details</span>
        </div>
        {/* Product Details */}
        <div className="grid md:grid-cols-2 gap-12 mb-12 mt-10">
          {/* Product Image */}
          <div className="w-full">
            <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
              <Skeleton className="w-full h-full" />
            </div>
          </div>

          {/* Product Information */}
          <div className="flex flex-col gap-6 pl-20">
            {/* Basic Info */}
            <div>
              <Skeleton className="w-1/2 h-8 mb-4" />
              <Skeleton className="w-3/4 h-6 mb-2" />
            </div>

            {/* Price */}
            <div className="pt-6">
              <Skeleton className="w-1/3 h-10 mb-4" />
              <Skeleton className="w-2/3 h-6" />
            </div>

            {/* Product Details */}
            <div className="pt-6">
              <Skeleton className="w-full h-64 mb-2" />
            </div>

            {/* Action Buttons */}
            <div className="pt-6 space-y-3">
              <Skeleton className="w-full h-12" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // RENDER ERROR STATE
  if (error || !product) {
    return (
      <div className="w-full flex flex-col px-10">
        <div className="flex items-center gap-2 pt-5">
          <Link
            className="text-gray-500 hover:text-black hover:underline"
            href="/"
          >
            Home
          </Link>
          <span className="text-gray-500">-</span>
          <Link
            className="text-gray-500 hover:text-black hover:underline"
            href="/products"
          >
            Products
          </Link>
          <span className="text-gray-500">-</span>
          <span className="text-gray-500">Product Details</span>
        </div>

        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <p className="text-red-600 text-lg mb-4">
              {error || "Product not found"}
            </p>
            <Link
              href="/products"
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Back to Products
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // RENDER PRODUCT DETAILS
  const { product: productData, categoryName } = product;
  const availableQuantity = quantityCalculate(productData);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="w-full flex flex-col px-10">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 pt-10 mb-8">
        <Link
          className="text-gray-500 hover:text-black hover:underline"
          href="/"
        >
          Home
        </Link>
        <span className="text-gray-500">-</span>
        <Link
          className="text-gray-500 hover:text-black hover:underline"
          href="/products"
        >
          Products
        </Link>
        <span className="text-gray-500">-</span>
        <span className="text-gray-900 font-medium">Product Details</span>
      </div>

      {/* Product Details */}
      <div className="grid md:grid-cols-2 gap-12 mb-12">
        {/* Product Image */}
        <div className="w-full">
          <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
            {productData.product.imageUrl ? (
              <img
                src={productData.product.imageUrl}
                alt={productData.product.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-200">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gray-300 rounded-lg mx-auto mb-4 flex items-center justify-center">
                    <svg
                      className="w-8 h-8 text-gray-400"
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
                  <p className="text-gray-400">No Image Available</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Product Information */}
        <div className="flex flex-col gap-6 pl-20">
          {/* Basic Info */}
          <div>
            <p className="text-black mb-4">{categoryName}</p>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {productData.product.name}
            </h1>
            <p className="text-gray-600 line-clamp-2">
              {productData.product.description}
            </p>
          </div>

          {/* Price */}
          <div className="pt-6">
            <p className="text-3xl font-light text-black mb-4">
              {formatPrice(productData.product.salePrice)}
            </p>

            {productData.product.gameTicketReward > 0 && (
              <p className="text-[#6699b5] text-lg italic">
                (Buy this Product now to get{" "}
                <span className="font-bold">
                  {productData.product.gameTicketReward}
                </span>{" "}
                tickets for games!)
              </p>
            )}
          </div>

          {/* Product Details */}
          <div className="pt-6">
            <h3 className="text-lg font-semibold mb-3">Product Details</h3>
            <div className="space-y-2 text-sm">
              <p>
                <span className="font-medium">Volume:</span>{" "}
                {productData.product.volume}ml
              </p>
              <p>
                <span className="font-medium">Available Quantity:</span>{" "}
                <span
                  className={`${availableQuantity > 0 ? "" : "text-gray-400"}`}
                >
                  {availableQuantity > 0
                    ? availableQuantity + " products"
                    : "Out of Stock"}
                </span>
              </p>
            </div>
          </div>

          {/* Skin Types & Status */}
          {(productData.productSkinTypes.length > 0 ||
            productData.productSkinStatuses.length > 0) && (
            <div className="pt-6">
              {productData.productSkinTypes.length > 0 && (
                <div className="mb-4">
                  <h3 className="text-lg font-semibold mb-3">
                    Suitable for Skin Types:
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {productData.productSkinTypes.map((type) => (
                      <span
                        key={type._id}
                        className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                      >
                        {type.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {productData.productSkinStatuses.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-3">
                    Skin Conditions:
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {productData.productSkinStatuses.map((status) => (
                      <span
                        key={status._id}
                        className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm"
                      >
                        {status.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="pt-6 space-y-3">
            <button
              onClick={handleAddToCart}
              disabled={availableQuantity === 0 || isAddingToCart}
              className={`w-full py-3 px-6 transition-colors font-medium ${
                availableQuantity > 0 && !isAddingToCart
                  ? "bg-black text-white hover:bg-gray-800"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              {isAddingToCart
                ? "Adding..."
                : availableQuantity > 0
                ? "Add to Cart"
                : "Out of Stock"}
            </button>
          </div>
        </div>
      </div>

      {/* Login Dialog */}
      <AlertDialog open={showLoginDialog} onOpenChange={setShowLoginDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Login Required</AlertDialogTitle>
            <AlertDialogDescription>
              You need to login first to add products to your cart. Please login
              to continue.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowLoginDialog(false)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleLoginRedirect}>
              Login
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ProductDetails;
