
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

interface Props {
  open: boolean;
  currentStatusId: number;
  orderStatuses: { _id: number; name: string }[];
  onClose: () => void;
  onSubmit: (statusId: number) => void;
}

export const EditStatusPopup: React.FC<Props> = ({
  open,
  currentStatusId,
  orderStatuses,
  onClose,
  onSubmit,
}) => {
  const [selectedStatus, setSelectedStatus] =
    useState<number>(currentStatusId);

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
            {orderStatuses.map((status) => (
              <MenuItem key={status._id} value={status._id}>
                {status.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Hủy</Button>
        <Button variant="contained" onClick={() => onSubmit(selectedStatus)}>
          Lưu
        </Button>
      </DialogActions>
    </Dialog>
  );
};
