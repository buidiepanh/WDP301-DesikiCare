import { apiRequest, publicApi } from "@/lib/axiosInstance";

type Product = {
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

export const getPopularProducts = async () => {
  try {
    // Lấy products từ external API
    const externalResponse = await apiRequest({
      instance: publicApi,
      method: "GET",
      url: "Product/products",
    });

    console.log("External API response:", externalResponse);

    // Kiểm tra structure của external response
    const externalProducts: Product[] = externalResponse?.products || [];

    if (externalProducts.length === 0) {
      console.log("No products found from external API");
      return [];
    }

    // Tính tổng saleQuantity cho mỗi product và sắp xếp theo thứ tự giảm dần
    const productsWithSaleCount = externalProducts.map((product) => {
      const totalSaleQuantity = product.shipmentProducts.reduce(
        (total, shipmentItem) => {
          return total + (shipmentItem.shipmentProduct.saleQuantity || 0);
        },
        0
      );

      return {
        ...product,
        totalSaleQuantity,
      };
    });

    // Sắp xếp theo totalSaleQuantity giảm dần và lấy 4 sản phẩm đầu tiên
    const popularProducts = productsWithSaleCount
      .sort((a, b) => b.totalSaleQuantity - a.totalSaleQuantity)
      .slice(0, 4)
      .map(({ totalSaleQuantity, ...product }) => product); // Bỏ totalSaleQuantity khỏi kết quả cuối

    console.log("Popular products (top 4 by sale quantity):", popularProducts);
    return popularProducts;
  } catch (error) {
    console.log("Error fetching popular products:", error);
    throw new Error("Failed to fetch popular products");
  }
};
