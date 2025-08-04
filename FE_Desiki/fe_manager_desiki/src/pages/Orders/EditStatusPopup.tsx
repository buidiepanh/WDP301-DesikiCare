import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from "@mui/material";
import { useState } from "react";
import Swal from "sweetalert2";

interface Props {
  open: boolean;
  currentStatusId: number;
  orderStatuses: { _id: number; name: string }[];
  isPaid: boolean;
  onClose: () => void;
  onSubmit: (statusId: number) => void;
}

export const EditStatusPopup: React.FC<Props> = ({
  open,
  currentStatusId,
  orderStatuses,
  isPaid,
  onClose,
  onSubmit,
}) => {
  const [selectedStatus, setSelectedStatus] = useState<number>(currentStatusId);

  // CSS để fix z-index cho SweetAlert2
  const injectSwalStyles = () => {
    const style = document.createElement("style");
    style.textContent = `
      .swal2-container {
        z-index: 10000 !important;
      }
      .swal2-backdrop-show {
        z-index: 9999 !important;
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  };

  // Logic để xác định trạng thái nào được phép chọn
  const getAvailableStatuses = () => {
    const cancelledStatusId = 4; // Đã hủy

    return orderStatuses.filter((status) => {
      // Luôn cho phép chuyển sang "Đã hủy"
      if (status._id === cancelledStatusId) {
        return true;
      }

      // Cho phép giữ nguyên trạng thái hiện tại
      if (status._id === currentStatusId) {
        return true;
      }

      // Chỉ cho phép chuyển lên trạng thái tiếp theo (không nhảy bậc)
      // Ví dụ: Từ "Chờ xử lý" (1) chỉ có thể chuyển sang "Đang giao" (2)
      return status._id === currentStatusId + 1;
    });
  };

  const handleSubmit = async () => {
    const deliveryStatusIds = [2, 3]; // Đang giao (2), Đã giao (3)

    // Kiểm tra nếu chưa thanh toán và muốn chuyển sang trạng thái giao hàng
    if (!isPaid && deliveryStatusIds.includes(selectedStatus)) {
      // Inject CSS để fix z-index
      const cleanupStyles = injectSwalStyles();

      const result = await Swal.fire({
        title: "Xác nhận",
        text: "Đơn hàng chưa được thanh toán. Bạn có chắc chắn muốn chuyển sang trạng thái giao hàng?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Xác nhận",
        cancelButtonText: "Hủy",
        allowOutsideClick: false,
      });

      // Cleanup styles sau khi Swal đóng
      cleanupStyles();

      if (!result.isConfirmed) {
        return;
      }
    }

    onSubmit(selectedStatus);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>Chỉnh sửa trạng thái đơn hàng</DialogTitle>
      <DialogContent>
        <FormControl fullWidth sx={{ marginTop: "5px" }}>
          <InputLabel id="status-label">Trạng thái</InputLabel>
          <Select
            labelId="status-label"
            value={selectedStatus}
            label="Trạng thái"
            onChange={(e) => setSelectedStatus(Number(e.target.value))}
          >
            {getAvailableStatuses().map((status) => (
              <MenuItem key={status._id} value={status._id}>
                {status.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Hủy</Button>
        <Button variant="contained" onClick={handleSubmit}>
          Lưu
        </Button>
      </DialogActions>
    </Dialog>
  );
};
