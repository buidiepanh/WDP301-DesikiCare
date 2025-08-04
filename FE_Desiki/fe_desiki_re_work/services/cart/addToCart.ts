import { apiRequest, loginRequiredApi } from "@/lib/axiosInstance";

export const addToCart = async (productId: string, quantity: number = 1) => {
  try {
    const response = await apiRequest({
      instance: loginRequiredApi,
      method: "POST",
      url: "Order/cartItems",
      data: {
        productId,
      },
    });

    return response;
  } catch (error) {
    console.error("Error adding to cart:", error);
    throw error;
  }
};
