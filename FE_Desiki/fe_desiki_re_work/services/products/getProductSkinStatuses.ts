import { apiRequest, publicApi } from "@/lib/axiosInstance";

type SkinStatus = {
  _id: number;
  name: string;
};
export const getProductSkinStatuses = async () => {
  try {
    // Fetch skin statuses from the external API
    const response = await apiRequest({
      instance: publicApi,
      method: "GET",
      url: "Product/skinStatuses",
    });

    // Check if the response contains skin statuses
    const skinStatuses: SkinStatus[] = response?.skinStatuses || [];

    return skinStatuses;
  } catch (error) {
    console.error("Failed to fetch product skin statuses:", error);
    throw error;
  }
};
