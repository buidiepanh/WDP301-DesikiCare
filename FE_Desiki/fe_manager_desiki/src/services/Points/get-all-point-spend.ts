import { callAPIAdmin } from "@/api/axiosInstace";
import { handleApiResponse } from "../handleApiResponses";

type Order = {
  order: {
    _id: string;
    accountId: string;
    deliveryAddressId: string;
    pointUsed: number;
    totalPrice: number;
    orderStatusId: number;
    createdAt: string;
    updatedAt: string;
  };
  orderStatus: {
    _id: number;
    name: string;
  };
  orderItems: {
    orderItem: {
      _id: string;
      orderId: string;
      shipmentProductId: string;
      quantity: number;
      unitPrice: number;
      createdAt: string;
      updatedAt: string;
    };
    shipmentProduct: {
      _id: string;
      productId: string;
      shipmentId: string;
      quantity: number;
      manufacturingDate: string;
      expiryDate: string;
      buyPrice: number;
      isDeactivated: boolean;
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
      isDeactivated: boolean;
      createdAt: string;
      updatedAt: string;
      imageUrl: string;
    };
  }[];
};

type PointChangingHistory = {
  userId: string;
  amount: number;
  changingType: number;
  reason: string;
  changeAt: string;
};

const callAPIRaw = async () => {
  return await handleApiResponse<{ orders: Order[] }>(
    () =>
      callAPIAdmin({
        method: "GET",
        url: "/api/Order/orders",
      }),
    {
      success: "Lấy danh sách games thành công!",
      forbidden: "Bạn không đủ quyền hạn để truy cập dữ liệu này!",
      notFound: "Không tìm thấy game nào!",
      serverError: "Lỗi máy chủ!",
    }
  );
};

export const GetAllPointSpendingHistory = async (): Promise<
  PointChangingHistory[]
> => {
  try {
    const res = await callAPIRaw();
    if (res && res.isSuccess && res.data) {
      const ordersAll = res.data.orders;
      const finishedOrders = ordersAll.filter(
        (ord) => ord.orderStatus._id === 3
      );
      const orderWithPointUsed = finishedOrders.filter(
        (ord) => ord.order.pointUsed > 0
      );

      const pointChangingHistory: PointChangingHistory[] =
        orderWithPointUsed.map((order) => ({
          userId: order.order.accountId,
          amount: order.order.pointUsed, // Âm vì đây là chi tiêu điểm
          changingType: 2, // Giả định 2 là loại chi tiêu điểm
          reason: `Sử dụng điểm cho đơn hàng ${order.order._id}`,
          changeAt: order.order.createdAt,
        }));

      return pointChangingHistory;
    } else {
      return [];
    }
  } catch (error) {
    console.error("Error getting point spending history:", error);
    return [];
  }
};
