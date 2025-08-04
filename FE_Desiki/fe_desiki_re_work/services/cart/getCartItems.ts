import { apiRequest, loginRequiredApi } from "@/lib/axiosInstance";

export const getCartItems = async () => {
  try {
    const response = await apiRequest({
      instance: loginRequiredApi,
      method: "GET",
      url: "Order/carts/me",
    });

    if (response && response.cart) {
      // Transform API response to match Redux store structure
      const transformedCartData = {
        cartId: response.cart._id,
        items: response.cartItems || [],
      };

      return transformedCartData;
    }

    return null;
  } catch (error) {
    console.error("Error fetching cart items:", error);
    throw error;
  }
};
