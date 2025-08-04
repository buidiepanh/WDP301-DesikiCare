import { apiRequest, publicApi } from "@/lib/axiosInstance";

type SkinType = {
  _id: number;
  name: string;
};
export const getProductSkinTypes = async () => {
  try {
    // Fetch skin types from the external API
    const response = await apiRequest({
      instance: publicApi,
      method: "GET",
      url: "Product/skinTypes",
    });

    // Check if the response contains skin types
    const skinTypes: SkinType[] = response?.skinTypes || [];

    return skinTypes;
  } catch (error) {
    console.error("Failed to fetch product skin types:", error);
    throw error;
  }
};
