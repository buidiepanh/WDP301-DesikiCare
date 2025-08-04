import { apiRequest, loginRequiredApi } from "@/lib/axiosInstance";

export const addProductToCart = async (productId: string) => {
  try {
    const response = await apiRequest({
        instance: loginRequiredApi,
        method: "POST",
        url: `/api/Order/cartItems`,
        data:{
            productId: productId,
        }
    });
    return response.data;
  } catch (error) {
    console.error("Failed to add product to cart:", error);
    throw error;
  }
};
