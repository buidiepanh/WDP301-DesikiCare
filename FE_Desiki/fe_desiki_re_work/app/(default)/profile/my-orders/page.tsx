"use client";
import { apiRequest, loginRequiredApi } from "@/lib/axiosInstance";
import { useEffect, useState } from "react";
import { useAppDispatch } from "@/app/hooks";
import { setUserInfo } from "@/slices/userSlice";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";

type OrderFromAPI = {
  order: {
    _id: string;
    accountId: string;
    deliveryAddressId: string;
    pointUsed: number;
    totalPrice: number;
    orderStatusId: number;
    isPaid: boolean;
    gameTicketReward: number;
    createdAt: string;
    updatedAt: string;
  };
  orderStatus: {
    _id: number;
    name: string;
  };
  account: {
    _id: string;
    email: string;
    fullName: string;
    phoneNumber: string;
    gender: string;
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
      importQuantity: number;
      saleQuantity: number;
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
      gameTicketReward: number;
      isDeactivated: boolean;
      createdAt: string;
      updatedAt: string;
      imageUrl: string;
    };
  }[];
};

export default function MyOrdersPage() {
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(true);
  const [orders, setOrders] = useState<OrderFromAPI[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<OrderFromAPI | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [paymentFilter, setPaymentFilter] = useState<string>("all");
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>("all");
  const [isCancelling, setIsCancelling] = useState<string | null>(null);
  const ordersPerPage = 5;

  // HOOKS
  useEffect(() => {
    fetchOrders();
  }, []);

  // FUNCTIONS
  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const response = await apiRequest({
        instance: loginRequiredApi,
        method: "GET",
        url: "Order/orders",
      });
      if (response && Array.isArray(response.orders)) {
        // Sort orders by createdAt (newest first)
        const sortedOrders = response.orders.sort(
          (a: OrderFromAPI, b: OrderFromAPI) => {
            return (
              new Date(b.order.createdAt).getTime() -
              new Date(a.order.createdAt).getTime()
            );
          }
        );
        setOrders(sortedOrders);
        setCurrentPage(1); // Reset to first page when new data is loaded
      } else {
        console.error("Unexpected response format:", response);
      }
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Helper functions
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB"); // DD/MM/YYYY format
  };

  const formatDateTime = (dateString: string): string => {
    const date = new Date(dateString);
    return (
      date.toLocaleDateString("en-GB") +
      " " +
      date.toLocaleTimeString("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
      })
    ); // DD/MM/YYYY HH:MM format
  };

  const getPaymentStatusClass = (isPaid: boolean) => {
    return isPaid ? "text-green-600" : "text-gray-600";
  };

  const getOrderStatusClass = (orderStatusId: number) => {
    switch (orderStatusId) {
      case 1:
        return "text-indigo-600";
      case 2:
        return "text-blue-600";
      case 3:
        return "text-green-600";
      case 4:
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  const OrdersSkeleton = () => (
    <div className="space-y-4">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="space-y-3">
          <Skeleton className="h-12 w-full" />
        </div>
      ))}
    </div>
  );

  // Pagination calculations
  const filteredOrders = orders.filter((orderData) => {
    const paymentMatch =
      paymentFilter === "all" ||
      (paymentFilter === "paid" && orderData.order.isPaid) ||
      (paymentFilter === "unpaid" && !orderData.order.isPaid);

    const statusMatch =
      orderStatusFilter === "all" ||
      orderData.orderStatus._id.toString() === orderStatusFilter;

    return paymentMatch && statusMatch;
  });

  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);
  const startIndex = (currentPage - 1) * ordersPerPage;
  const endIndex = startIndex + ordersPerPage;
  const currentOrders = filteredOrders.slice(startIndex, endIndex);

  const goToPage = (page: number) => {
    setCurrentPage(page);
  };

  const goToPreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const goToNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [paymentFilter, orderStatusFilter]);

  const fetchUserInfo = async () => {
    try {
      const response = await apiRequest({
        instance: loginRequiredApi,
        method: "GET",
        url: "Account/me",
      });
      if (response && response.account) {
        dispatch(setUserInfo(response.account));
      }
    } catch (error) {
      console.error("Failed to fetch user info:", error);
    }
  };

  const handleCancelOrder = async (orderId: string) => {
    setIsCancelling(orderId);
    try {
      const response = await apiRequest({
        instance: loginRequiredApi,
        method: "PUT",
        url: `Order/orders/${orderId}/cancel`,
      });
      if (response) {
        toast.success("Order cancelled successfully");
        // Refresh orders and user info after cancellation
        await Promise.all([fetchOrders(), fetchUserInfo()]);
      } else {
        toast.error("Failed to cancel order");
        console.error("Failed to cancel order:", response.message);
      }
    } catch (error) {
      toast.error("Error cancelling order");
      console.error("Error cancelling order:", error);
    } finally {
      setIsCancelling(null);
    }
  };

  const handleGetPaymentLink = async (orderId: string) => {
    try {
      const response = await apiRequest({
        instance: loginRequiredApi,
        method: "POST",
        url: `Order/orders/${orderId}/getPaymentLink`,
        data: {
          returnUrl: "http://localhost:3000/profile/my-orders",
          cancelUrl: "http://localhost:3000/profile/cancel-orders",
        },
      });
      if (response && response.paymentLink) {
        window.location.href = response.paymentLink;
      } else {
        toast.error("Failed to get payment link");
        console.error("Failed to get payment link:", response);
      }
    } catch (error) {
      toast.error("Error getting payment link");
      console.error("Error getting payment link:", error);
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">My Orders</h1>
        <p className="text-gray-600 mt-1">Track and manage your orders</p>
      </div>

      {/* Total Orders */}
      <div className="bg-white p-4 rounded-lg border">
        <div className="text-sm text-gray-600">Total Orders</div>
        {isLoading ? (
          <Skeleton className="h-8 w-16 mt-1" />
        ) : (
          <div className="text-2xl font-bold text-gray-900">
            {orders.length}
          </div>
        )}
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg border">
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">
              Payment Status:
            </label>
            <select
              value={paymentFilter}
              onChange={(e) => setPaymentFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All</option>
              <option value="paid">Already Paid</option>
              <option value="unpaid">Not Yet Paid</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">
              Order Status:
            </label>
            <select
              value={orderStatusFilter}
              onChange={(e) => setOrderStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All</option>
              <option value="1">Chờ xử lí</option>
              <option value="2">Đang giao</option>
              <option value="3">Đã giao</option>
              <option value="4">Đã hủy</option>
            </select>
          </div>

          <div className="text-sm text-gray-600">
            Showing {filteredOrders.length} of {orders.length} orders
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-lg border">
        {isLoading ? (
          <div className="p-6">
            <OrdersSkeleton />
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Order Date</TableHead>
                <TableHead>Total Amount</TableHead>
                <TableHead>Point Used</TableHead>
                <TableHead>Ticket Reward</TableHead>
                <TableHead>Payment Status</TableHead>
                <TableHead>Order Status</TableHead>
                <TableHead>Num of Products</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentOrders.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={9}
                    className="text-center py-8 text-gray-500"
                  >
                    No orders found
                  </TableCell>
                </TableRow>
              ) : (
                currentOrders.map((orderData) => (
                  <TableRow key={orderData.order._id}>
                    <TableCell className="font-medium">
                      {orderData.order._id.slice(-8)}
                    </TableCell>
                    <TableCell>
                      {formatDate(orderData.order.createdAt)}
                    </TableCell>
                    <TableCell>
                      {orderData.order.totalPrice.toLocaleString("vn")} đ
                    </TableCell>
                    <TableCell>
                      {orderData.order.pointUsed.toLocaleString("vn")}
                    </TableCell>
                    <TableCell>{orderData.order.gameTicketReward}</TableCell>
                    <TableCell>
                      <span
                        className={getPaymentStatusClass(
                          orderData.order.isPaid
                        )}
                      >
                        {orderData.order.isPaid ? "Already" : "Not Yet"}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span
                        className={getOrderStatusClass(
                          orderData.orderStatus._id
                        )}
                      >
                        {orderData.orderStatus.name}
                      </span>
                    </TableCell>
                    <TableCell>{orderData.orderItems.length}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        {/* Details Button */}
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setSelectedOrder(orderData)}
                            >
                              Details
                            </Button>
                          </DialogTrigger>
                          <DialogContent
                            className="w-[95vw] max-w-[1400px] max-h-[85vh] overflow-y-auto"
                            style={{ width: "95vw", maxWidth: "1400px" }}
                          >
                            <DialogHeader>
                              <DialogTitle>Order Details</DialogTitle>
                            </DialogHeader>
                            <div className="py-4">
                              {selectedOrder && (
                                <div className="space-y-6">
                                  {/* Order Information */}
                                  <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                                    <div>
                                      <h3 className="font-semibold text-gray-900 mb-3">
                                        Order Information
                                      </h3>
                                      <div className="space-y-2">
                                        <div>
                                          <span className="text-sm text-gray-600">
                                            Order ID:
                                          </span>
                                          <p className="font-medium">
                                            {selectedOrder.order._id}
                                          </p>
                                        </div>
                                        <div>
                                          <span className="text-sm text-gray-600">
                                            Order Date:
                                          </span>
                                          <p className="font-medium">
                                            {formatDateTime(
                                              selectedOrder.order.createdAt
                                            )}
                                          </p>
                                        </div>
                                        <div>
                                          <span className="text-sm text-gray-600">
                                            Point Used:
                                          </span>
                                          <p className="font-medium">
                                            {selectedOrder.order.pointUsed.toLocaleString(
                                              "vn"
                                            )}{" "}
                                            points
                                          </p>
                                        </div>
                                      </div>
                                    </div>

                                    <div>
                                      <h3 className="font-semibold text-gray-900 mb-3">
                                        Status
                                      </h3>
                                      <div className="space-y-2">
                                        <div>
                                          <span className="text-sm text-gray-600">
                                            Payment Status:
                                          </span>
                                          <p
                                            className={`font-medium ${getPaymentStatusClass(
                                              selectedOrder.order.isPaid
                                            )}`}
                                          >
                                            {selectedOrder.order.isPaid
                                              ? "Already Paid"
                                              : "Not Yet Paid"}
                                          </p>
                                        </div>
                                        <div>
                                          <span className="text-sm text-gray-600">
                                            Order Status:
                                          </span>
                                          <p
                                            className={`font-medium ${getOrderStatusClass(
                                              selectedOrder.orderStatus._id
                                            )}`}
                                          >
                                            {selectedOrder.orderStatus.name}
                                          </p>
                                        </div>
                                      </div>
                                    </div>
                                  </div>

                                  {/* Order Items Table */}
                                  <div>
                                    <h3 className="font-semibold text-gray-900 mb-3">
                                      Order Items
                                    </h3>
                                    <div className="border rounded-lg overflow-hidden">
                                      <Table>
                                        <TableHeader>
                                          <TableRow>
                                            <TableHead className="w-20">
                                              Image
                                            </TableHead>
                                            <TableHead>Product Name</TableHead>
                                            <TableHead className="text-right">
                                              Unit Price
                                            </TableHead>
                                            <TableHead className="text-center">
                                              Quantity
                                            </TableHead>
                                            <TableHead className="text-right">
                                              Total Price
                                            </TableHead>
                                          </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                          {selectedOrder.orderItems.map(
                                            (item, index) => (
                                              <TableRow key={index}>
                                                <TableCell>
                                                  <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100">
                                                    {item.product.imageUrl ? (
                                                      <img
                                                        src={
                                                          item.product.imageUrl
                                                        }
                                                        alt={item.product.name}
                                                        className="w-full h-full object-cover"
                                                      />
                                                    ) : (
                                                      <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                                                        No Image
                                                      </div>
                                                    )}
                                                  </div>
                                                </TableCell>
                                                <TableCell>
                                                  <div>
                                                    <p className="font-medium">
                                                      {item.product.name}
                                                    </p>
                                                    <p className="text-sm text-gray-500">
                                                      Volume:{" "}
                                                      {item.product.volume}ml
                                                    </p>
                                                  </div>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                  {item.product.salePrice.toLocaleString(
                                                    "vn"
                                                  )}{" "}
                                                  đ
                                                </TableCell>
                                                <TableCell className="text-center">
                                                  {item.orderItem.quantity}
                                                </TableCell>
                                                <TableCell className="text-right font-medium">
                                                  {(
                                                    item.product.salePrice *
                                                    item.orderItem.quantity
                                                  ).toLocaleString("vn")}{" "}
                                                  đ
                                                </TableCell>
                                              </TableRow>
                                            )
                                          )}
                                        </TableBody>
                                      </Table>
                                    </div>
                                  </div>

                                  {/* Order Summary */}
                                  <div className="border-t pt-4">
                                    <div className="flex justify-end">
                                      <div className="w-64 space-y-2">
                                        <div className="flex justify-between">
                                          <span className="text-gray-600">
                                            Subtotal:
                                          </span>
                                          <span className="font-medium">
                                            {selectedOrder.orderItems
                                              .reduce(
                                                (total, item) =>
                                                  total +
                                                  item.product.salePrice *
                                                    item.orderItem.quantity,
                                                0
                                              )
                                              .toLocaleString("vn")}{" "}
                                            đ
                                          </span>
                                        </div>
                                        <div className="flex justify-between">
                                          <span className="text-gray-600">
                                            Points Used:
                                          </span>
                                          <span className="text-green-600 font-medium">
                                            -
                                            {selectedOrder.order.pointUsed.toLocaleString(
                                              "vn"
                                            )}{" "}
                                            đ
                                          </span>
                                        </div>
                                        <div className="flex justify-between border-t pt-2">
                                          <span className="font-semibold">
                                            Total:
                                          </span>
                                          <span className="font-bold text-lg">
                                            {selectedOrder.order.totalPrice.toLocaleString(
                                              "vn"
                                            )}{" "}
                                            đ
                                          </span>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          </DialogContent>
                        </Dialog>

                        {/* Cancel Button - Show only for paid orders with status 1 or 2 */}
                        {orderData.order.isPaid &&
                          (orderData.orderStatus._id === 1 ||
                            orderData.orderStatus._id === 2) && (
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  variant="destructive"
                                  size="sm"
                                  disabled={
                                    isCancelling === orderData.order._id
                                  }
                                >
                                  {isCancelling === orderData.order._id
                                    ? "Cancelling..."
                                    : "Cancel"}
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>
                                    Cancel Order
                                  </AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to cancel this order?
                                    This action cannot be undone. Your points
                                    will be refunded if applicable.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>
                                    No, keep order
                                  </AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() =>
                                      handleCancelOrder(orderData.order._id)
                                    }
                                    className="bg-red-600 hover:bg-red-700"
                                  >
                                    Yes, cancel order
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          )}

                        {/* Pay Button - Show only for unpaid orders */}
                        {!orderData.order.isPaid && (
                          <Button
                            variant="default"
                            size="sm"
                            onClick={() =>
                              handleGetPaymentLink(orderData.order._id)
                            }
                            className="bg-green-600 hover:bg-green-700"
                          >
                            Pay
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        )}

        {/* Pagination */}
        {!isLoading && filteredOrders.length > 0 && (
          <div className="flex items-center justify-between px-6 py-4 border-t">
            <div className="text-sm text-gray-600">
              Showing {startIndex + 1} to{" "}
              {Math.min(endIndex, filteredOrders.length)} of{" "}
              {filteredOrders.length} filtered orders
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={goToPreviousPage}
                disabled={currentPage === 1}
              >
                Previous
              </Button>

              <div className="flex space-x-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <Button
                      key={page}
                      variant={currentPage === page ? "default" : "outline"}
                      size="sm"
                      onClick={() => goToPage(page)}
                      className="w-8 h-8 p-0"
                    >
                      {page}
                    </Button>
                  )
                )}
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={goToNextPage}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
