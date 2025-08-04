"use client";

import { apiRequest, loginRequiredApi } from "@/lib/axiosInstance";
import Footer from "./components/footer/Footer";
import Header from "./components/header/Header";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { setUserInfo } from "@/slices/userSlice";
import { setCart } from "@/slices/cartSlice";
import { useEffect, useCallback, useState } from "react";
import { usePathname } from "next/navigation";

const DefaultLayout = ({ children }: { children: React.ReactNode }) => {
  // REDUX
  const dispatch = useAppDispatch();
  const token = useAppSelector((state) => state.user.token);
  const userInfo = useAppSelector((state) => state.user.info);

  // HOOKS
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(false);
  const [lastFetchTime, setLastFetchTime] = useState<number>(0);

  // FUNCTIONS
  // Call API to fetch user info and cart info everytime the layout is rendered or navigation
  const fetchUserInfoAndCart = useCallback(async () => {
    // Prevent multiple simultaneous calls
    if (isLoading) return;

    // Rate limiting - only fetch if last fetch was more than 5 seconds ago
    const now = Date.now();
    if (now - lastFetchTime < 5000) return;

    try {
      setIsLoading(true);

      // Fetch both APIs in parallel for better performance
      const [userInfoResponse, cartInfoResponse] = await Promise.allSettled([
        apiRequest({
          instance: loginRequiredApi,
          method: "GET",
          url: "Account/me",
        }),
        apiRequest({
          instance: loginRequiredApi,
          method: "GET",
          url: "Order/carts/me",
        }),
      ]);

      // Handle user info response
      if (userInfoResponse.status === "fulfilled" && userInfoResponse.value) {
        dispatch(
          setUserInfo(userInfoResponse.value.account || userInfoResponse.value)
        );
      } else if (userInfoResponse.status === "rejected") {
        console.error("Failed to fetch user info:", userInfoResponse.reason);
      }

      // Handle cart info response
      if (cartInfoResponse.status === "fulfilled" && cartInfoResponse.value) {
        const cartData = cartInfoResponse.value;

        // Transform API response to match Redux store structure
        const transformedCartData = {
          cartId: cartData.cart?._id || null,
          items: cartData.cartItems || [],
        };

        dispatch(setCart(transformedCartData));
      } else if (cartInfoResponse.status === "rejected") {
        console.error("Failed to fetch cart info:", cartInfoResponse.reason);
      }

      setLastFetchTime(now);
    } catch (error) {
      console.error("Error fetching user info or cart info:", error);
    } finally {
      setIsLoading(false);
    }
  }, [dispatch, isLoading, lastFetchTime]);

  // Effect to fetch data when token is available or route changes
  useEffect(() => {
    if (token) {
      fetchUserInfoAndCart();
    }
  }, [token, pathname, fetchUserInfoAndCart]);

  // Effect to handle page visibility change (when user comes back to tab)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible" && token) {
        fetchUserInfoAndCart();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [token, fetchUserInfoAndCart]);

  // Effect to handle focus events (when user focuses back to window)
  useEffect(() => {
    const handleFocus = () => {
      if (token) {
        fetchUserInfoAndCart();
      }
    };

    window.addEventListener("focus", handleFocus);

    return () => {
      window.removeEventListener("focus", handleFocus);
    };
  }, [token, fetchUserInfoAndCart]);

  return (
    <div className="w-full min-h-screen flex flex-col">
      <Header onRefreshData={fetchUserInfoAndCart} isLoading={isLoading} />
      <div className="w-full flex-1">{children}</div>
      <Footer />
    </div>
  );
};

export default DefaultLayout;
