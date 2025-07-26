import { useEffect, useState } from "react";
import type { Order } from "../../data/types";
import { CircularProgress } from "@mui/material";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-theme-alpine.css";
import "@/styles/ag-grid-glassmophorism.css"; // Import our custom glassmorphism CSS
import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";
ModuleRegistry.registerModules([AllCommunityModule]);
import { OrderDetailsPopup } from "./OrderDetailsPopup";
import { EditStatusPopup } from "./EditStatusPopup";
import { callAPIManager } from "../../api/axiosInstace";
import Swal from "sweetalert2";

// Custom Glassmorphism Chip Component
const GlassChip = ({
  label,
  variant = "default",
}: {
  label: string;
  variant?: "success" | "error" | "warning" | "primary" | "default";
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case "success":
        return "bg-emerald-500/20 border-emerald-400/40 text-emerald-100";
      case "error":
        return "bg-red-500/20 border-red-400/40 text-red-100";
      case "warning":
        return "bg-amber-500/20 border-amber-400/40 text-amber-100";
      case "primary":
        return "bg-blue-500/20 border-blue-400/40 text-blue-100";
      default:
        return "bg-slate-500/20 border-slate-400/40 text-slate-100";
    }
  };

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium backdrop-blur-sm border shadow-lg ${getVariantStyles()}`}
      style={{
        backdropFilter: "blur(8px)",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
      }}
    >
      {label}
    </span>
  );
};

const Orders = () => {
  // STATES
  const [orders, setOrders] = useState<Order[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [orderStatuses, setOrderStatuses] = useState<any>([]);

  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showOrderDetailsPopup, setShowOrderDetailsPopup] = useState(false);
  const [showEditStatusPopup, setShowEditStatusPopup] = useState(false);

  // HOOKS
  useEffect(() => {
    fetch();
  }, []);

  // FUNCTIONS
  const fetch = async () => {
    setIsLoading(true);
    console.log("Fetching ...");
    try {
      const response = await callAPIManager({
        method: "GET",
        url: `/api/Order/orders`,
      });
      if (response && response.status === 200) {
        setOrders(response.data.orders);
        const responseStatuses = await callAPIManager({
          method: "GET",
          url: `/api/Order/orderStatuses`,
        });
        if (responseStatuses && responseStatuses.status === 200) {
          setOrderStatuses(responseStatuses.data.orderStatuses);
          setIsLoading(false);
        } else {
          Swal.fire("Lỗi", "Lỗi khi fetching Order Statuses", "error");
        }
      } else {
        Swal.fire("Lỗi", "Lỗi khi fetching Orders", "error");
      }
    } catch (error) {
      console.log("Error while fetching Orders: ", error);
      setIsLoading(false);
    }
  };

  const defaultColDef = {
    sortable: true,
    filter: true,
    resizable: true,
    minWidth: 120,
    wrapHeaderText: true,
    autoHeaderHeight: true,
  };

  const columnDefs = [
    {
      headerName: "Mã Đơn Hàng",
      field: "order._id",
      autoHeight: true,
      cellStyle: {
        whiteSpace: "normal",
        wordBreak: "break-all",
        lineHeight: "1.25rem",
        color: "rgba(255, 255, 255, 0.9)",
        background: "transparent !important",
        fontFamily: "monospace",
      },
      minWidth: 180,
    },
    {
      headerName: "ID Khách hàng",
      field: "order.accountId",
      cellStyle: {
        color: "rgba(255, 255, 255, 0.9)",
        background: "transparent !important",
        fontFamily: "monospace",
      },
    },
    {
      headerName: "Số điểm dùng",
      field: "order.pointUsed",
      sortable: true,
      cellRenderer: (params: any) =>
        params.value === 0
          ? "Không dùng điểm"
          : params.value.toLocaleString("vi-VN"),
      cellStyle: {
        color: "rgba(255, 255, 255, 0.8)",
        background: "transparent !important",
      },
    },
    {
      headerName: "Tiền gốc",
      valueGetter: (params: any) =>
        params.data.order.pointUsed + params.data.order.totalPrice,
      valueFormatter: (params: any) =>
        params.value.toLocaleString("vi-VN", {
          style: "currency",
          currency: "VND",
        }),
      sortable: true,
      cellStyle: {
        color: "rgba(255, 255, 255, 0.9)",
        background: "transparent !important",
        fontWeight: "500",
      },
    },
    {
      headerName: "Tiền phải trả",
      field: "order.totalPrice",
      valueFormatter: (params: any) =>
        params.value.toLocaleString("vi-VN", {
          style: "currency",
          currency: "VND",
        }),
      sortable: true,
      cellStyle: {
        color: "rgba(255, 255, 255, 0.9)",
        background: "transparent !important",
        fontWeight: "600",
      },
    },
    {
      headerName: "Trạng thái",
      field: "orderStatus.name",
      filter: "agSetColumnFilter",
      cellRenderer: (params: any) => {
        const id = params.data.orderStatus._id;
        const name = params.value;
        let variant: "default" | "primary" | "warning" | "error" | "success" =
          "default";

        switch (id) {
          case 1:
            variant = "default";
            break;
          case 2:
            variant = "primary";
            break;
          case 3:
            variant = "success";
            break;
          case 4:
            variant = "error";
            break;
        }

        return (
          <div className="flex items-center h-full">
            <GlassChip label={name} variant={variant} />
          </div>
        );
      },
      cellStyle: {
        background: "transparent !important",
        display: "flex",
        alignItems: "center",
      },
    },
    {
      headerName: "Số sản phẩm",
      valueGetter: (params: any) => params.data.orderItems.length,
      sortable: true,
      cellStyle: {
        color: "rgba(255, 255, 255, 0.9)",
        background: "transparent !important",
        fontWeight: "500",
      },
    },
    {
      headerName: "Thao tác",
      cellRenderer: (params: any) => {
        return (
          <div className="w-full h-full flex justify-center items-center gap-2">
            <button
              onClick={() => handleViewDetails(params.data.order._id)}
              className="px-3 py-1.5 bg-blue-500/20 border border-blue-400/40 text-blue-200 hover:bg-blue-500/30 transition-all duration-200 backdrop-blur-sm rounded-lg text-sm font-medium shadow-lg"
            >
              Details
            </button>
            <button
              onClick={() => handleEditStatus(params.data.order._id)}
              className="px-3 py-1.5 bg-amber-500/20 border border-amber-400/40 text-amber-200 hover:bg-amber-500/30 transition-all duration-200 backdrop-blur-sm rounded-lg text-sm font-medium shadow-lg"
            >
              Edit Status
            </button>
          </div>
        );
      },
      cellStyle: {
        background: "transparent !important",
      },
    },
  ];

  const handleViewDetails = (id: string) => {
    const findResult = orders?.filter((order) => order.order._id === id);
    const order = findResult ? findResult[0] : null;
    setSelectedOrder(order);
    setShowOrderDetailsPopup(true);
  };

  const onCloseOrderDetailsPopup = () => {
    setSelectedOrder(null);
    setShowOrderDetailsPopup(false);
  };

  const handleEditStatus = (id: string) => {
    const order = orders?.find((o) => o.order._id === id);
    if (order) {
      setSelectedOrder(order);
      setShowEditStatusPopup(true);
    }
  };

  const onCloseEditStatusPopup = () => {
    setSelectedOrder(null);
    setShowEditStatusPopup(false);
  };

  const onSubmitEditStatus = async (statusId: number) => {
    const orderId = selectedOrder?.order._id;
    if (!orderId) return;

    try {
      const response = await callAPIManager({
        method: "PUT",
        url: `/api/Order/orders/${orderId}/orderStatuses/${statusId}`,
      });
      if (response && response.status === 200) {
        Swal.fire("Thành công", "Đã set trạng thái thành công", "success");
        fetch();
      } else {
        Swal.fire("Lỗi", "Đã có lỗi xảy ra", "error");
        fetch();
      }
    } catch (error) {
      console.log("Error while edit status: ", error);
    }

    onCloseEditStatusPopup();
  };

  return (
    <div className="w-full flex flex-col p-0">
      {/* Header Section */}
      <div className="mb-8 backdrop-blur-xl bg-gray-400/20 border border-white/10 rounded-2xl p-6 shadow-2xl">
        <h1 className="text-white text-3xl font-bold mb-2">Orders</h1>
        <p className="text-white/70 text-lg">Quản lý đơn hàng của hệ thống.</p>
      </div>

      {/* Data Grid Container */}
      <div className="backdrop-blur-xl bg-gray-400/20 border border-white/10 rounded-2xl p-4 shadow-2xl">
        <div className="w-full">
          {isLoading ? (
            <div className="w-full h-96 flex items-center justify-center">
              <div className="backdrop-blur-xl bg-black/20 border border-white/20 rounded-2xl p-8">
                <CircularProgress sx={{ color: "rgba(255, 255, 255, 0.8)" }} />
                <p className="text-white/80 mt-4 text-center">
                  Đang tải dữ liệu...
                </p>
              </div>
            </div>
          ) : (
            <div
              className="ag-theme-alpine w-full"
              style={
                {
                  height: "620px",
                  "--ag-background-color": "transparent",
                  "--ag-foreground-color": "rgba(255, 255, 255, 0.9)",
                  "--ag-border-color": "rgba(255, 255, 255, 0.1)",
                } as any
              }
            >
              <AgGridReact
                rowData={orders}
                columnDefs={columnDefs as any}
                pagination={true}
                paginationPageSize={9}
                rowHeight={60}
                animateRows={true}
                domLayout="normal"
                defaultColDef={defaultColDef}
              />
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      {showOrderDetailsPopup && selectedOrder && (
        <OrderDetailsPopup
          open={showOrderDetailsPopup}
          order={selectedOrder}
          onClose={onCloseOrderDetailsPopup}
        />
      )}
      {showEditStatusPopup && selectedOrder && (
        <EditStatusPopup
          open={showEditStatusPopup}
          orderStatuses={orderStatuses}
          currentStatusId={selectedOrder.orderStatus._id}
          onClose={onCloseEditStatusPopup}
          onSubmit={onSubmitEditStatus}
        />
      )}
    </div>
  );
};

export default Orders;
