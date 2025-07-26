
import type { Order } from "../../data/types";
import {
  Modal,
  Box,
  Typography,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import "./style.css";

interface Props {
  open: boolean;
  order: Order;
  onClose: () => void;
}

const modalStyle = {
  position: "absolute" as const,
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "90%",
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  overflow: "auto",
  borderRadius: 2,
};

export const OrderDetailsPopup: React.FC<Props> = ({
  open,
  order,
  onClose,
}) => {
  const { order: orderInfo, orderItems, orderStatus } = order;

  const defaultColDef = {
    sortable: true,
    resizable: true,
    filter: true,
  };

  const columnDefs = [
    {
      headerName: "Ảnh",
      field: "product.imageUrl",
      cellRenderer: (params: any) => (
        <img
          src={params.value}
          alt="product"
          style={{ width: 80, height: 80, objectFit: "cover", borderRadius: 8 }}
        />
      ),
      width: 100,
    },
    {
      headerName: "Tên sản phẩm",
      field: "product.name",
      flex: 1,
    },
    {
      headerName: "Số lượng",
      field: "orderItem.quantity",
      width: 120,
    },
    {
      headerName: "Đơn giá",
      field: "orderItem.unitPrice",
      valueFormatter: (params: any) =>
        params.value.toLocaleString("vi-VN", {
          style: "currency",
          currency: "VND",
        }),
      width: 140,
    },
    {
      headerName: "Thành tiền",
      valueGetter: (params: any) =>
        params.data.orderItem.unitPrice * params.data.orderItem.quantity,
      valueFormatter: (params: any) =>
        params.value.toLocaleString("vi-VN", {
          style: "currency",
          currency: "VND",
        }),
      width: 160,
    },
    {
      headerName: "Mã lô hàng",
      field: "shipmentProduct.shipmentId",
      width: 150,
    },
    {
      headerName: "Ngày SX",
      field: "shipmentProduct.manufacturingDate",
      valueFormatter: (params: any) =>
        new Date(params.value).toLocaleDateString("vi-VN"),
      width: 130,
    },
    {
      headerName: "Hạn sử dụng",
      field: "shipmentProduct.expiryDate",
      valueFormatter: (params: any) =>
        new Date(params.value).toLocaleDateString("vi-VN"),
      width: 130,
    },
  ];

  return (
    <Modal open={open} onClose={onClose}>
      <Box className="text-black" sx={modalStyle}>
        <Box className="flex justify-between items-center mb-4">
          <Typography variant="h6" fontWeight="bold">
            Chi tiết đơn hàng: {orderInfo._id}
          </Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>

        <Box className="mb-4">
          <Typography>ID Khách hàng: {orderInfo.accountId}</Typography>
          <Typography>Trạng thái: {orderStatus.name}</Typography>
          <Typography>
            Số điểm sử dụng:{" "}
            {orderInfo.pointUsed > 0
              ? orderInfo.pointUsed.toLocaleString("vi-VN")
              : "Không dùng"}
          </Typography>
          <Typography>
            Tổng tiền:{" "}
            {(orderInfo.pointUsed + orderInfo.totalPrice).toLocaleString(
              "vi-VN",
              {
                style: "currency",
                currency: "VND",
              }
            )}
          </Typography>
          <Typography>
            Ngày đặt hàng:{" "}
            {new Date(orderInfo.createdAt).toLocaleDateString("vi-VN")}
          </Typography>
        </Box>

        <Typography className="mb-2" fontWeight="bold">
          Danh sách sản phẩm
        </Typography>
        <div className="ag-theme-quartz" style={{ height: 300, width: "100%" }}>
          <AgGridReact
            rowData={orderItems}
            columnDefs={columnDefs as any}
            defaultColDef={defaultColDef}
            pagination={true}
            paginationPageSize={3}
            rowHeight={120}
            domLayout="autoHeight"
          />
        </div>
      </Box>
    </Modal>
  );
};
