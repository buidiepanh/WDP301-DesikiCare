import { apiRequest, publicApi } from "@/lib/axiosInstance";
import { categories } from "@/data/categories";

export type ProductFromExternalAPI = {
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
  category: {
    _id: number;
    name: string;
  };
  shipmentProducts: {
    shipment: {
      _id: string;
      shipmentDate: string;
      isDeleted: boolean;
      createdAt: string;
      updatedAt: string;
    };
    shipmentProduct: {
      _id: string;
      productId: string;
      shipmentId: string;
      importQuantity: number;
      saleQuantity: number;
      manufacturingDate: string;
      expiryDate: string;
      buyPrice: number;
      isDeactivated: boolean;
      createdAt: string;
      updatedAt: string;
    };
  }[];
  productSkinTypes: {
    _id: number;
    name: string;
  }[];
  productSkinStatuses: {
    _id: number;
    name: string;
  }[];
};

export type FinalProductDetails = {
  product: ProductFromExternalAPI;
  categoryName: string;
};

// Helper function to calculate remaining quantity
export const calculateRemainingQuantity = (
  product: ProductFromExternalAPI
): number => {
  if (!product.shipmentProducts || product.shipmentProducts.length === 0) {
    return 0;
  }

  return product.shipmentProducts.reduce((total, shipmentItem) => {
    const { importQuantity, saleQuantity } = shipmentItem.shipmentProduct;
    const remainingFromThisShipment = importQuantity - saleQuantity;
    return total + Math.max(0, remainingFromThisShipment); // Đảm bảo không âm
  }, 0);
};

export const fetchProductDetails = async (
  productId: string
): Promise<FinalProductDetails | null> => {
  try {
    // Fetch product from external API
    const product = await apiRequest({
      instance: publicApi,
      method: "GET",
      url: `Product/products/${productId}`,
    });

    if (!product) {
      throw new Error("Product not found");
    }

    // Get category name from categories data
    const getCategoryName = () => {
      // Tìm category trong categories data theo categoryId
      const foundCategory = categories.find(
        (cat) => cat._id === product.product.categoryId
      );

      // Ưu tiên category name từ categories data
      if (foundCategory?.name) {
        return foundCategory.name;
      }

      // Fallback sử dụng category name từ API response
      if (product.category?.name) {
        return product.category.name;
      }

      return "Unknown Category";
    };

    return {
      product,
      categoryName: getCategoryName(),
    };
  } catch (error) {
    console.error("Error fetching product details:", error);
    throw error;
  }
};
