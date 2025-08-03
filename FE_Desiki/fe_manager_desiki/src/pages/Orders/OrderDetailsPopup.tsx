import type { Order } from "../../data/types";
import { Modal, Box, Typography, IconButton, Chip } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
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
  width: "95%",
  maxWidth: "1200px",
  maxHeight: "90vh",
  bgcolor: "white",
  boxShadow: 24,
  p: 4,
  overflow: "auto",
  borderRadius: 2,
};

// Custom Cell Renderers - không cần nữa khi dùng table thường

export const OrderDetailsPopup: React.FC<Props> = ({
  open,
  order,
  onClose,
}) => {
  const { order: orderInfo, orderItems, orderStatus } = order;

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={modalStyle}>
        {/* Header */}
        <Box className="flex justify-between items-center mb-6 pb-4 border-b border-gray-200">
          <Typography variant="h5" fontWeight="600" className="text-gray-800">
            Chi tiết đơn hàng
          </Typography>
          <IconButton
            onClick={onClose}
            className="text-gray-600 hover:bg-gray-100"
          >
            <CloseIcon />
          </IconButton>
        </Box>

        {/* Order Information */}
        <Box className="mb-6 p-4 bg-gray-50 rounded-lg border">
          <Typography variant="h6" className="text-gray-800 mb-4 font-medium">
            Thông tin đơn hàng
          </Typography>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <span className="text-gray-600 font-medium min-w-[120px]">
                  Khách hàng:
                </span>
                <span className="text-gray-800 bg-gray-200 px-2 py-1 rounded text-sm">
                  {orderInfo.accountId}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-gray-600 font-medium min-w-[120px]">
                  Ngày đặt:
                </span>
                <span className="text-gray-800">
                  {new Date(orderInfo.createdAt).toLocaleDateString("vi-VN")}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-gray-600 font-medium min-w-[120px]">
                  Điểm sử dụng:
                </span>
                <span className="text-gray-800">
                  {orderInfo.pointUsed > 0
                    ? `${orderInfo.pointUsed.toLocaleString("vi-VN")} điểm`
                    : "Không sử dụng"}
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <span className="text-gray-600 font-medium min-w-[120px]">
                  Trạng thái:
                </span>
                <Chip
                  label={orderStatus.name}
                  color={
                    orderStatus._id === 3
                      ? "success"
                      : orderStatus._id === 4
                      ? "error"
                      : "primary"
                  }
                  size="small"
                />
              </div>

              <div className="flex items-center gap-3">
                <span className="text-gray-600 font-medium min-w-[120px]">
                  Tổng tiền gốc:
                </span>
                <span className="text-gray-500 line-through">
                  {(orderInfo.pointUsed + orderInfo.totalPrice).toLocaleString(
                    "vi-VN",
                    {
                      style: "currency",
                      currency: "VND",
                    }
                  )}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-gray-600 font-medium min-w-[120px]">
                  Thành tiền:
                </span>
                <span className="text-gray-800 font-semibold">
                  {orderInfo.totalPrice.toLocaleString("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  })}
                </span>
              </div>
            </div>
          </div>
        </Box>

        {/* Products Table */}
        <Box className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-white">
            <Typography className="text-gray-800 font-medium text-base">
              Danh sách sản phẩm ({orderItems.length} mặt hàng)
            </Typography>
          </div>

          <div className="p-6 bg-white">
            <div className="rounded-lg border border-gray-200 overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-20">
                      Ảnh
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tên sản phẩm
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider w-24">
                      Số lượng
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider w-32">
                      Đơn giá
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider w-36">
                      Thành tiền
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-32">
                      Mã lô hàng
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-28">
                      Ngày SX
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-28">
                      Hạn sử dụng
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {orderItems.map((item, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="flex justify-center">
                          <img
                            src={
                              item.product.imageUrl ||
                              "https://via.placeholder.com/80"
                            }
                            alt="product"
                            className="w-10 h-10 object-cover rounded"
                          />
                        </div>
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-800">
                        {item.product.name}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-800 text-right">
                        {item.orderItem.quantity}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-800 text-right">
                        {item.orderItem.unitPrice.toLocaleString("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        })}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-800 text-right font-semibold">
                        {(
                          item.orderItem.unitPrice * item.orderItem.quantity
                        ).toLocaleString("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        })}
                      </td>
                      <td className="px-4 py-4 text-center">
                        <span className="bg-gray-100 px-2 py-1 rounded text-xs text-gray-700 font-mono">
                          {item.shipmentProduct.shipmentId}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-600 text-center">
                        {new Date(
                          item.shipmentProduct.manufacturingDate
                        ).toLocaleDateString("vi-VN")}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-600 text-center">
                        {new Date(
                          item.shipmentProduct.expiryDate
                        ).toLocaleDateString("vi-VN")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </Box>
      </Box>
    </Modal>
  );
};
