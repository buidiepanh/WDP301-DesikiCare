"use client";
import React, { useEffect, useState, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { apiRequest, loginRequiredApi } from "@/lib/axiosInstance";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  CheckCircle,
  ShoppingBag,
  User,
  XCircle,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";

type CreateOrderResponse = {
  message: string;
  newOrderId: string;
  refundPoints: string;
  gameTicketReward: number;
  outOfStockProducts: {
    availableQuantity: number;
    requestedQuantity: number;
    product: {
      _id: string;
      categoryId: number;
      name: string;
      description: string;
      volume: number;
      salePrice: number;
      gameTicketReward: number;
      isDeactivated: true;
      createdAt: string;
      updatedAt: string;
      imageUrl: string;
    };
  }[];
};
const PaymentReturn = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const [isSuccess, setIsSuccess] = useState(false);
  const [orderData, setOrderData] = useState<any>(null);
  const [errorDetails, setErrorDetails] = useState<string | null>(null);
  const [hasProcessed, setHasProcessed] = useState(false); // Prevent multiple API calls
  const [apiCallCount, setApiCallCount] = useState(0); // Track API calls in development
  const processedRef = useRef(false); // More reliable guard against double execution

  const [ticketReward, setTicketReward] = useState(0);
  useEffect(() => {
    const processPayment = async () => {
      // Double guard - check both state and ref
      if (hasProcessed || processedRef.current) {
        console.log("Payment already processed, skipping...", {
          hasProcessed,
          processedRefCurrent: processedRef.current,
        });
        return;
      }

      // Set both guards immediately
      processedRef.current = true;
      setHasProcessed(true);
      setIsLoading(true);

      console.log("=== STARTING PAYMENT PROCESSING ===");
      console.log("Guards set - proceeding with API call");

      try {
        // Get URL parameters
        const newOrderId = searchParams.get("newOrderId");
        const pointUsed = parseInt(searchParams.get("pointUsed") || "0");
        const deliveryAddressId = searchParams.get("deliveryAddressId");
        const status = searchParams.get("status");
        const cancel = searchParams.get("cancel");

        console.log("Payment return params:", {
          newOrderId,
          pointUsed,
          deliveryAddressId,
          status,
          cancel,
        });

        // Check if payment was successful
        if (cancel === "true" || status !== "PAID") {
          const errorMsg = `Payment was cancelled or failed. Status: ${status}, Cancelled: ${cancel}`;
          console.error(errorMsg);
          toast.error("Payment was cancelled or failed");
          setErrorDetails(errorMsg);
          setIsSuccess(false);
          setIsLoading(false);
          return;
        }

        // Validate required parameters
        if (!newOrderId || !deliveryAddressId) {
          const errorMsg = `Missing required parameters. newOrderId: ${newOrderId}, deliveryAddressId: ${deliveryAddressId}`;
          console.error(errorMsg);
          toast.error("Missing required payment information");
          setErrorDetails(errorMsg);
          setIsSuccess(false);
          setIsLoading(false);
          return;
        }

        // Final check before API call
        if (!processedRef.current) {
          console.error("Race condition detected - ref was reset");
          return;
        }

        // Call API to create order
        setApiCallCount((prev) => prev + 1);
        console.log("=== CALLING ORDER CREATION API ===");
        console.log("API Call Count:", apiCallCount + 1);
        console.log("processedRef.current:", processedRef.current);
        console.log("Calling Order API with data:", {
          order: {
            newOrderId,
            pointUsed,
            deliveryAddressId,
          },
        });

        const response = await apiRequest({
          instance: loginRequiredApi,
          method: "POST",
          url: "Order/orders",
          data: {
            order: {
              newOrderId,
              pointUsed,
              deliveryAddressId,
            },
          },
        });

        console.log("=== ORDER API RESPONSE ===");
        console.log("Order API response:", response);
        if (response) {
          // Check if order creation failed due to out of stock
          if (
            !response.newOrderId &&
            response.outOfStockProducts &&
            response.outOfStockProducts.length > 0
          ) {
            console.log(
              "Order creation failed - out of stock products:",
              response.outOfStockProducts
            );

            // Create error message for out of stock products
            const outOfStockProduct = response.outOfStockProducts[0]; // Get first out of stock product
            const errorMessage = `Your order creation failed because ${outOfStockProduct.product.name} is out of stock. We have refunded ${response.refundPoints} points to your account. Please use these points to continue shopping. We sincerely apologize for the inconvenience.`;

            console.log("Out of stock error message:", errorMessage);
            setErrorDetails(errorMessage);
            setIsSuccess(false);
            toast.error(errorMessage);
            return;
          }

          console.log("Order created successfully:", response);
          setOrderData(response);
          setTicketReward(response.gameTicketReward || 0);
          setIsSuccess(true);
          toast.success("Order created successfully!");
        } else {
          console.error("API returned empty response");
          throw new Error("No response from order creation API");
        }
      } catch (error) {
        console.error("=== ERROR PROCESSING PAYMENT ===");
        console.error("Error object:", error);
        console.error(
          "Error message:",
          error instanceof Error ? error.message : "Unknown error"
        );
        console.error(
          "Error stack:",
          error instanceof Error ? error.stack : "No stack trace"
        );

        // Log additional details if it's an API error
        if (error && typeof error === "object" && "response" in error) {
          console.error("API Error Response:", (error as any).response);
          console.error("API Error Status:", (error as any).response?.status);
          console.error("API Error Data:", (error as any).response?.data);
        }

        let errorMessage = "Failed to create order. Please contact support.";

        // Customize error message based on error type
        if (error instanceof Error) {
          if (error.message.includes("Network Error")) {
            errorMessage =
              "Network error. Please check your connection and try again.";
          } else if (error.message.includes("401")) {
            errorMessage = "Authentication failed. Please login again.";
          } else if (error.message.includes("400")) {
            errorMessage = "Invalid order data. Please try again.";
          } else if (error.message.includes("500")) {
            errorMessage = "Server error. Please try again later.";
          }
        }

        toast.error(errorMessage);
        setErrorDetails(
          error instanceof Error ? error.message : "Unknown error occurred"
        );
        setIsSuccess(false);

        // Stop execution here - don't proceed further on error
        return;
      } finally {
        setIsLoading(false);
      }
    };

    processPayment();
  }, []); // Empty dependency array to run only once on mount

  const handleContinueShopping = () => {
    router.push("/products");
  };

  const handleCheckOrder = () => {
    router.push("/profiles");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-700">
            Processing Payment...
          </h2>
          <p className="text-gray-500 mt-2">
            Please wait while we confirm your order
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        {isSuccess ? (
          <>
            {/* Success State */}
            <div className="mb-6">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Payment Successful!
              </h1>
              <p className="text-gray-600">
                Your order has been created successfully. You will receive a
                confirmation email shortly.
              </p>
            </div>

            {/* Order Details */}
            {orderData && (
              <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
                <h3 className="font-semibold text-gray-900 mb-2">
                  Order Details
                </h3>
                <div className="space-y-1 text-sm text-gray-600">
                  {orderData.orderId && (
                    <div className="flex justify-between">
                      <span>Order ID:</span>
                      <span className="font-medium">{orderData.orderId}</span>
                    </div>
                  )}
                  {orderData.totalAmount && (
                    <div className="flex justify-between">
                      <span>Total Amount:</span>
                      <span className="font-medium">
                        {orderData.totalAmount.toLocaleString("vn")} đ
                      </span>
                    </div>
                  )}
                  {ticketReward > 0 && (
                    <div className="flex justify-between">
                      <span>Game Ticket Reward:</span>
                      <span className="font-medium">
                        {ticketReward} Tickets
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-3">
              <Link
                href={"/products"}
                className="w-full bg-black text-white py-3 px-6 rounded-lg hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
              >
                <ShoppingBag size={20} />
                Tiếp Tục Mua Sắm
              </Link>
              <Link
                href={"/profile/my-orders"}
                className="w-full border border-gray-300 text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
              >
                <User size={20} />
                Kiểm Tra Đơn Hàng
              </Link>
            </div>
          </>
        ) : (
          <>
            {/* Error State */}
            <div className="mb-6">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-4">
                <XCircle className="h-8 w-8 text-red-600" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Order Creation Failed
              </h1>

              {/* Show detailed error message if it contains out of stock info */}
              {errorDetails && errorDetails.includes("out of stock") ? (
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-4">
                  <div className="flex items-start">
                    <AlertCircle className="h-5 w-5 text-orange-600 mt-0.5 mr-3 flex-shrink-0" />
                    <div className="text-left">
                      <p className="text-sm text-orange-800 leading-relaxed">
                        {errorDetails}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-gray-600 mb-4">
                  There was an issue creating your order. Please try again or
                  contact support.
                </p>
              )}

              {/* Error Details for Development */}
              {errorDetails &&
                process.env.NODE_ENV === "development" &&
                !errorDetails.includes("out of stock") && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                    <div className="flex items-start">
                      <AlertCircle className="h-4 w-4 text-red-600 mt-0.5 mr-2 flex-shrink-0" />
                      <div className="text-left">
                        <p className="text-xs font-medium text-red-800 mb-1">
                          Debug Info:
                        </p>
                        <p className="text-xs text-red-700 break-words">
                          {errorDetails}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              {/* Show different button text for out of stock vs other errors */}
              {errorDetails && errorDetails.includes("out of stock") ? (
                <Link
                  href={"/products"}
                  className="w-full bg-black text-white py-3 px-6 rounded-lg hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
                >
                  <ShoppingBag size={20} />
                  Continue Shopping with Refunded Points
                </Link>
              ) : (
                <button
                  onClick={() => window.location.reload()}
                  className="w-full bg-black text-white py-3 px-6 rounded-lg hover:bg-gray-800 transition-colors"
                >
                  Try Again
                </button>
              )}
              <Link
                href={"/products"}
                className="w-full border border-gray-300 text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
              >
                <ShoppingBag size={20} />
                {errorDetails && errorDetails.includes("out of stock")
                  ? "Browse Other Products"
                  : "Back to Shopping"}
              </Link>
            </div>
          </>
        )}

        {/* Toast Container */}
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
      </div>
    </div>
  );
};

export default PaymentReturn;
