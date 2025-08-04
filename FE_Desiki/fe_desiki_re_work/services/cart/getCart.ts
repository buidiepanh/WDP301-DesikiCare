import { apiRequest, loginRequiredApi } from "@/lib/axiosInstance";

export const getCart = async () => {
  try {
    const cart = await apiRequest({
      instance: loginRequiredApi,
      method: "GET",
      url: "Order/carts/me",
    });
    if(cart) {
      return cart;
    }
  } catch (error) {
    console.error("Error fetching cart:", error);
  }
};
