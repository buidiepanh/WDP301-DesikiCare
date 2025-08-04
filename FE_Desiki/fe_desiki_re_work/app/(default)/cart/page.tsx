"use client";
import { getCart, getCartItems } from "@/services/cart";
import { useEffect, useState } from "react";
import { CartItemCard } from "./components/CartItemCard";
import { apiRequest, loginRequiredApi } from "@/lib/axiosInstance";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAppSelector, useAppDispatch } from "@/app/hooks";
import { setCart } from "@/slices/cartSlice";
import { CheckoutModal } from "./components/CheckoutModal";
import { Skeleton } from "@/components/ui/skeleton";
import { useRouter } from "next/navigation";

type CartItem = {
  cartItem: {
    _id: string;
    cartId: string;
    productId: string;
    quantity: number;
    createdAt: string;
    updatedAt: string;
  };
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
};

type Cart = {
  cart: {
    _id: string;
    accountId: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
  };
  cartItems: CartItem[];
};

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

const Cart = () => {
  // ROUTER
  const router = useRouter();

  // REDUX
  const dispatch = useAppDispatch();
  const cartItems = useAppSelector((state) => state.cart.items);
  const cartId = useAppSelector((state) => state.cart.cartId);
  const userInfo = useAppSelector((state) => state.user.info);
  const userToken = useAppSelector((state) => state.user.token);

  // STATES
  const [totalPrice, setTotalPrice] = useState(0);
  const [numOfCartItems, setNumOfCartItems] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  const [isCheckoutLoading, setIsCheckoutLoading] = useState(false);

  const [pointUsed, setPointUsed] = useState(0);
  const [userDeliveryAddresses, setUserDeliveryAddresses] = useState<
    DeliveryAddress[]
  >([]);
  const [deliveryAddressId, setDeliveryAddressId] = useState<string | null>(
    null
  );

  // HOOKS
  useEffect(() => {
    // Check if user is authenticated
    if (!userToken) {
      console.log("User not authenticated, redirecting to login");
      toast.error("Please login to view your cart");
      router.push("/auth/login");
      return;
    }

    setIsLoading(true);
    fetchCartItems();
  }, [userToken, router]);

  useEffect(() => {
    if (userInfo && userToken) {
      fetchUserDeliveryAddresses();
    }
  }, [userInfo, userToken]);

  // Recalculate total when Redux cart items change
  useEffect(() => {
    setNumOfCartItems(cartItems.length);
    const total = cartItems.reduce((acc: any, item: any) => {
      return acc + item.product.salePrice * item.cartItem.quantity;
    }, 0);
    setTotalPrice(total);
  }, [cartItems]);

  // FUNCTIONS
  const fetchCartItems = async () => {
    if (!userToken) {
      console.log("No token available for fetching cart items");
      return;
    }

    try {
      const cartData = await getCartItems();
      if (cartData) {
        // Update Redux store
        dispatch(
          setCart({
            cartId: cartData.cartId,
            items: cartData.items,
          })
        );

        // Update local states
        setNumOfCartItems(cartData.items.length);
        const total = cartData.items.reduce((acc: any, item: any) => {
          return acc + item.product.salePrice * item.cartItem.quantity;
        }, 0);
        setTotalPrice(total);
      }
    } catch (error) {
      console.error("Error fetching cart items:", error);
      // If authentication error, redirect to login
      if (error && typeof error === "object" && "response" in error) {
        const status = (error as any).response?.status;
        if (status === 401) {
          toast.error("Session expired. Please login again.");
          router.push("/auth/login");
          return;
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUserDeliveryAddresses = async () => {
    if (!userInfo || !userToken) {
      console.log("No userInfo or token available");
      return;
    }

    console.log("Fetching delivery addresses for user:", userInfo._id);
    try {
      const response = await apiRequest({
        instance: loginRequiredApi,
        method: "GET",
        url: `Account/accounts/${userInfo._id}/deliveryAddresses`,
      });

      console.log("Delivery addresses response:", response);

      if (response && response.deliveryAddresses) {
        setUserDeliveryAddresses(response.deliveryAddresses);
        console.log("Set delivery addresses:", response.deliveryAddresses);

        // Set default address if available
        const defaultAddress = response.deliveryAddresses.find(
          (addr: DeliveryAddress) => addr.deliveryAddress.isDefault
        );
        if (defaultAddress) {
          setDeliveryAddressId(defaultAddress.deliveryAddress._id);
          console.log(
            "Set default address ID:",
            defaultAddress.deliveryAddress._id
          );
        }
      }
    } catch (error) {
      console.error("Error fetching delivery addresses:", error);
      // If authentication error, redirect to login
      if (error && typeof error === "object" && "response" in error) {
        const status = (error as any).response?.status;
        if (status === 401) {
          toast.error("Session expired. Please login again.");
          router.push("/auth/login");
          return;
        }
      }
    }
  };
  const handleUpdateCartItemQuantity = async (
    item: CartItem,
    quantity: number
  ) => {
    try {
      const response = await apiRequest({
        instance: loginRequiredApi,
        method: "PUT",
        url: `Order/cartItems/${item.cartItem._id}`,
        data: {
          quantity,
        },
      });
      // Success is handled in CartItemCard with toast
    } catch (error) {
      console.error("Error updating cart item quantity:", error);
      throw error; // Re-throw to let CartItemCard handle the error
    }
  };

  const handleRemoveCartItem = async (item: CartItem) => {
    try {
      await apiRequest({
        instance: loginRequiredApi,
        method: "DELETE",
        url: `Order/cartItems/${item.cartItem._id}`,
      });
      // Success is handled in CartItemCard with toast
    } catch (error) {
      console.error("Error removing cart item:", error);
      throw error; // Re-throw to let CartItemCard handle the error
    }
  };

  const handleProceedToCheckout = async () => {
    setIsCheckoutModalOpen(true);
  };

  const handleConfirmCheckout = async () => {
    if (!deliveryAddressId) {
      toast.error("Please select a delivery address");
      return;
    }

    setIsCheckoutLoading(true);
    try {
      const response = await apiRequest({
        instance: loginRequiredApi,
        method: "POST",
        url: "Order/carts/getPaymentLink",
        data: {
          order: {
            pointUsed: pointUsed,
            deliveryAddressId: deliveryAddressId,
          },
          metaData: {
            cancelUrl: "http://localhost:3000/payment/cancel",
            returnUrl: "http://localhost:3000/payment/return",
          },
        },
      });

      if (response && response.paymentLink) {
        // Open payment link in new window/tab
        window.location.href = response.paymentLink;

        // Close modal
        setIsCheckoutModalOpen(false);

        toast.success("Redirecting to payment...");
      } else {
        toast.error("Failed to get payment link");
      }
    } catch (error) {
      console.error("Error creating payment link:", error);
      toast.error("Failed to proceed to payment. Please try again.");
    } finally {
      setIsCheckoutLoading(false);
    }
  };

  // Early return if user is not authenticated
  if (!userToken) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-700">
            Checking authentication...
          </h2>
          <p className="text-gray-500 mt-2">Redirecting to login page</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="w-full flex flex-col p-10 gap-10">
        {/* Cart Header */}
        <div className="w-full flex items-center justify-between">
          <div className="flex items-center gap-4">
            <p className="m-0 text-2xl font-semibold">Your Cart</p>
            <Skeleton className="w-24 h-6" />
          </div>
          <div className="flex items-end gap-6">
            <p className="m-0 text-sm font-light">Total</p>
            <Skeleton className="w-32 h-8" />
          </div>
        </div>

        <div className="w-full flex flex-col">
          <Skeleton className="w-full h-40 mb-4" />
        </div>

        <div className="w-full flex items-center justify-end">
          <Skeleton className="w-40 h-10" />
        </div>
      </div>
    );
  } else {
    return (
      <div className="w-full flex flex-col p-10 gap-10">
        {/* Cart Header */}
        <div className="w-full flex items-center justify-between">
          <div className="flex items-center gap-4">
            <p className="m-0 text-2xl font-semibold">Your Cart</p>
            <p className="m-0 text-md font-light text-gray-500">
              {numOfCartItems} items
            </p>
          </div>
          <div className="flex items-end gap-6">
            <p className="m-0 text-sm font-light">Total</p>
            <p className="m-0 text-xl font-bold">
              {totalPrice.toLocaleString("vn")} đ
            </p>
          </div>
        </div>
        {/* Cart Items */}
        <div className="w-full flex flex-col">
          {cartItems.map((cartItem: CartItem, index: number) => (
            <CartItemCard
              key={index}
              item={cartItem}
              onUpdateQuantity={handleUpdateCartItemQuantity}
              onRemoveItem={handleRemoveCartItem}
              onRefreshCart={fetchCartItems}
            />
          ))}
        </div>

        {/* Checkout Button */}
        <div className="w-full flex items-center justify-end">
          <button
            onClick={handleProceedToCheckout}
            disabled={cartItems.length === 0}
            className="bg-black text-white px-6 py-2 hover:bg-gray-800 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            Proceed to Checkout
          </button>
        </div>

        {/* Toast Container */}
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />

        {/* Checkout Modal */}
        <CheckoutModal
          isOpen={isCheckoutModalOpen}
          onClose={() => setIsCheckoutModalOpen(false)}
          userDeliveryAddresses={userDeliveryAddresses}
          deliveryAddressId={deliveryAddressId}
          setDeliveryAddressId={setDeliveryAddressId}
          pointUsed={pointUsed}
          setPointUsed={setPointUsed}
          userPoints={userInfo?.points || 0}
          totalPrice={totalPrice}
          onConfirm={handleConfirmCheckout}
          isLoading={isCheckoutLoading}
        />
      </div>
    );
  }
};

export default Cart;
