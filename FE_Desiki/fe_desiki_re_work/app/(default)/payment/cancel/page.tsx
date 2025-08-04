"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { XCircle, ShoppingBag, ArrowLeft } from "lucide-react";

const PaymentCancel = () => {
  const router = useRouter();

  const handleContinueShopping = () => {
    router.push("/products");
  };

  const handleBackToCart = () => {
    router.push("/cart");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        {/* Cancel State */}
        <div className="mb-6">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-yellow-100 mb-4">
            <XCircle className="h-8 w-8 text-yellow-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Payment Cancelled
          </h1>
          <p className="text-gray-600">
            Your payment has been cancelled. Your cart items are still saved and
            you can continue shopping or try again.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={handleBackToCart}
            className="w-full bg-black text-white py-3 px-6 rounded-lg hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
          >
            <ArrowLeft size={20} />
            Quay Lại Giỏ Hàng
          </button>
          <button
            onClick={handleContinueShopping}
            className="w-full border border-gray-300 text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
          >
            <ShoppingBag size={20} />
            Tiếp Tục Mua Sắm
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentCancel;
