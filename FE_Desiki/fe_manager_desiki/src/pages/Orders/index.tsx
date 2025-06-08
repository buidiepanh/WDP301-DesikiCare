import { useEffect, useState } from "react";
import type { Order } from "../../data/types";
import { ordersData, orderStatusesData } from "../../data/mockData";
import { CircularProgress } from "@mui/material";
import { Chip, Button } from "@mui/material";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css"; // hoặc theme bạn muốn dùng
import "ag-grid-community/styles/ag-theme-quartz.css";
import {
  AllCommunityModule,
  ModuleRegistry,
  themeBalham,
  themeMaterial,
} from "ag-grid-community";
ModuleRegistry.registerModules([AllCommunityModule]);
import "./style.css";
import { OrderDetailsPopup } from "./OrderDetailsPopup";
import { EditStatusPopup } from "./EditStatusPopup";
const Orders = () => {
  // STATES
  const [orders, setOrders] = useState<Order[] | null>(null);
  const [isLoading, setIsLoading] = useState<Boolean>(true);
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
      setTimeout(() => {
        const response = ordersData;
        setOrders(response);
        setOrderStatuses(orderStatusesData);
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      console.log("Error while fetching Orders: ", error);
      setIsLoading(false); // hoặc cũng đặt fallback ở đây
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
      },
      minWidth: 180,
    },
    {
      headerName: "ID Khách hàng",
      field: "order.accountId",
    },
    {
      headerName: "Số điểm dùng",
      field: "order.pointUsed",
      sortable: true,
      cellRenderer: (params: any) =>
        params.value === 0
          ? "Không dùng điểm"
          : params.value.toLocaleString("vi-VN"),
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
    },
    {
      headerName: "Trạng thái",
      field: "orderStatus.name",
      filter: "agSetColumnFilter",
      cellRenderer: (params: any) => {
        const id = params.data.orderStatus._id;
        const name = params.value;
        let color: "default" | "primary" | "warning" | "error" | "success" =
          "default";

        switch (id) {
          case 1:
            color = "default";
            break;
          case 2:
            color = "primary";
            break;
          case 3:
            color = "success";
            break;
          case 4:
            color = "error";
            break;
        }

        return <Chip label={name} color={color} size="small" />;
      },
    },
    {
      headerName: "Số sản phẩm",
      valueGetter: (params: any) => params.data.orderItems.length,
      sortable: true,
    },
    {
      headerName: "Thao tác",
      cellRenderer: (params: any) => {
        return (
          <div className="w-full h-full flex justify-around items-center gap-2">
            <Button
              onClick={() => handleViewDetails(params.data.order._id)}
              color="primary"
              variant="contained"
              size="small"
            >
              Details
            </Button>
            <Button
              onClick={() => handleEditStatus(params.data.order._id)}
              color="warning"
              variant="contained"
              size="small"
            >
              Edit Status
            </Button>
          </div>
        );
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

    const endpoint = `/api/Order/orders/${orderId}/orderStatuses/${statusId}`;
    console.log("CALL API:", endpoint);

    // TODO: call API here
    // await axios.put(endpoint)

    onCloseEditStatusPopup();
  };

  return (
    <div className="w-full flex flex-col p-5 text-black">
      <h1 className="font-bold text-3xl">Orders</h1>
      <p className="font-semibold text-lg">Quản lý đơn hàng</p>

      <div className="w-full mt-10">
        {isLoading ? (
          <div className="w-full h-96 flex items-center justify-center">
            <CircularProgress />
          </div>
        ) : (
          <div className="ag-theme-quartz w-full h-[706px]">
            <AgGridReact
              rowData={orders}
              columnDefs={columnDefs}
              pagination={true}
              paginationPageSize={10}
              rowHeight={60}
              animateRows={true}
              domLayout="normal"
              defaultColDef={defaultColDef}
            />
          </div>
        )}
      </div>
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
