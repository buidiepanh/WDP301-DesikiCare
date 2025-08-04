"use client";
import { useState } from "react";
import { X } from "lucide-react";

type DeliveryAddress = {
  deliveryAddress: {
    _id: string;
    accountId: string;
    provinceCode: string;
    districtCode: string;
    wardCode: string;
    addressDetailDescription: string;
    receiverName: string;
    receiverPhone: string;
    isDefault: boolean;
    createdAt: string;
    updatedAt: string;
  };
};

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  userDeliveryAddresses: DeliveryAddress[];
  deliveryAddressId: string | null;
  setDeliveryAddressId: (id: string) => void;
  pointUsed: number;
  setPointUsed: (points: number) => void;
  userPoints: number;
  totalPrice: number;
  onConfirm: () => void;
  isLoading: boolean;
}

export const CheckoutModal = ({
  isOpen,
  onClose,
  userDeliveryAddresses,
  deliveryAddressId,
  setDeliveryAddressId,
  pointUsed,
  setPointUsed,
  userPoints,
  totalPrice,
  onConfirm,
  isLoading,
}: CheckoutModalProps) => {
  if (!isOpen) return null;

  console.log("CheckoutModal - userDeliveryAddresses:", userDeliveryAddresses);
  console.log("CheckoutModal - deliveryAddressId:", deliveryAddressId);

  const selectedAddress = userDeliveryAddresses.find(
    (addr) => addr.deliveryAddress._id === deliveryAddressId
  );

  const finalPrice = Math.max(0, totalPrice - pointUsed);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold">Checkout</h2>
          <button
            onClick={onClose}
            disabled={isLoading}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <X size={20} />
          </button>
        </div>

        {/* Delivery Address Section */}
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-4">Delivery Address</h3>
          {userDeliveryAddresses && userDeliveryAddresses.length > 0 ? (
            <div className="space-y-3">
              {userDeliveryAddresses.map((addr) => (
                <div
                  key={addr.deliveryAddress._id}
                  className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                    deliveryAddressId === addr.deliveryAddress._id
                      ? "border-black bg-gray-50"
                      : "border-gray-300 hover:border-gray-400"
                  }`}
                  onClick={() => setDeliveryAddressId(addr.deliveryAddress._id)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <p className="font-medium">
                          {addr.deliveryAddress.receiverName}
                        </p>
                        {addr.deliveryAddress.isDefault && (
                          <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                            Default
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mb-1">
                        Phone: {addr.deliveryAddress.receiverPhone}
                      </p>
                      <p className="text-sm text-gray-600">
                        {addr.deliveryAddress.addressDetailDescription}
                      </p>
                    </div>
                    <div className="ml-4">
                      <div
                        className={`w-4 h-4 rounded-full border-2 ${
                          deliveryAddressId === addr.deliveryAddress._id
                            ? "border-black bg-black"
                            : "border-gray-300"
                        }`}
                      >
                        {deliveryAddressId === addr.deliveryAddress._id && (
                          <div className="w-2 h-2 bg-white rounded-full m-0.5" />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="border border-dashed border-gray-300 rounded-lg p-8 text-center">
              <p className="text-gray-500 mb-4">No delivery addresses found</p>
              <p className="text-sm text-gray-400">
                Please add a delivery address to your account first
              </p>
            </div>
          )}
        </div>

        {/* Points Section - Only show if user has points */}
        {userPoints > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-4">Use Points</h3>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-gray-600">Available Points:</span>
                <span className="font-medium">
                  {userPoints.toLocaleString("vn")} points
                </span>
              </div>
              <div className="flex items-center gap-3">
                <label className="text-sm text-gray-600">Points to use:</label>
                <input
                  type="number"
                  min="0"
                  max={Math.min(userPoints, totalPrice - 10000)}
                  value={pointUsed}
                  onChange={(e) => {
                    const value = parseInt(e.target.value) || 0;
                    const maxAllowed = Math.min(userPoints, totalPrice - 10000);
                    setPointUsed(Math.min(value, Math.max(0, maxAllowed)));
                  }}
                  disabled={isLoading || totalPrice <= 10000}
                  className="border border-gray-300 rounded px-3 py-2 w-32 text-center disabled:bg-gray-100"
                />
                <button
                  onClick={() => {
                    const maxAllowed = Math.min(userPoints, totalPrice - 10000);
                    setPointUsed(Math.max(0, maxAllowed));
                  }}
                  disabled={isLoading || totalPrice <= 10000}
                  className="text-sm text-blue-600 hover:text-blue-800 disabled:text-gray-400"
                >
                  Use Max
                </button>
              </div>
              <div className="mt-2 space-y-1">
                <p className="text-xs text-gray-500">1 point = 1 đ discount</p>
                {totalPrice <= 10000 ? (
                  <p className="text-xs text-red-500">
                    Order must be at least 10,000 đ to use points
                  </p>
                ) : (
                  <p className="text-xs text-gray-500">
                    Minimum order value after discount: 10,000 đ
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Order Summary */}
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-4">Order Summary</h3>
          <div className="bg-gray-50 rounded-lg p-4 space-y-2">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>{totalPrice.toLocaleString("vn")} đ</span>
            </div>
            {pointUsed > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Points discount:</span>
                <span>-{pointUsed.toLocaleString("vn")} đ</span>
              </div>
            )}
            <hr className="my-2" />
            <div className="flex justify-between font-semibold text-lg">
              <span>Total:</span>
              <span>{finalPrice.toLocaleString("vn")} đ</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 py-3 px-6 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={
              isLoading ||
              !deliveryAddressId ||
              userDeliveryAddresses.length === 0 ||
              finalPrice < 10000
            }
            className="flex-1 py-3 px-6 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading
              ? "Processing..."
              : finalPrice < 10000
              ? "Minimum 10,000 đ required"
              : "Proceed to Payment"}
          </button>
        </div>
      </div>
    </div>
  );
};
