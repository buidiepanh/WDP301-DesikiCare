import type React from "react";
import type { ShipmentProductDetails } from "../../data/types";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Modal,
  TextField,
} from "@mui/material";
import { useState } from "react";

interface Props {
  open: boolean;
  shipmentProduct: ShipmentProductDetails;
  onClose: () => void;
  onSubmit: (formData: any) => void;
}

export const ShipmentProductEditPopup: React.FC<Props> = ({
  open,
  shipmentProduct,
  onClose,
  onSubmit,
}) => {
  // STATES
  const [newQuantity, setNewQuantity] = useState(
    shipmentProduct.shipmentProduct.quantity
  );
  const [newManufactureDate, setNewManufactureDate] = useState(
    shipmentProduct.shipmentProduct.manufacturingDate
  );
  const [newExpireDate, setNewExpireDate] = useState(
    shipmentProduct.shipmentProduct.expiryDate
  );
  const [newBuyPrice, setNewBuyPrice] = useState(
    shipmentProduct.shipmentProduct.buyPrice
  );

  // FUNCTIONS
  const handleSubmit = () => {
    const data = {
      shipmentProduct: {
        quantity: newQuantity,
        manufacturingDate: newManufactureDate,
        expiryDate: newExpireDate,
        buyPrice: newBuyPrice,
      },
    };

    onSubmit(data);
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>Chỉnh sửa gói hàng</DialogTitle>
      <DialogContent>
        <div className="w-full p-2 flex flex-col">
          <div className="w-full flex flex-col mb-4">
            <p className="font-semibold text-gray-700 mb-2">Số lượng nhập</p>
            <TextField
              type="number"
              value={newQuantity}
              onChange={(e) => setNewQuantity(Number(e.target.value))}
            />
          </div>

          <div className="w-full flex flex-col mb-4">
            <p className="font-semibold text-gray-700 mb-2">Ngày sản xuất</p>
            <TextField
              type="date"
              value={newManufactureDate}
              onChange={(e) => setNewManufactureDate(e.target.value)}
            />
          </div>

          <div className="w-full flex flex-col mb-4">
            <p className="font-semibold text-gray-700 mb-2">Ngày hết hạn</p>
            <TextField
              type="date"
              value={newExpireDate}
              onChange={(e) => setNewExpireDate(e.target.value)}
            />
          </div>

          <div className="w-full flex flex-col mb-4">
            <p className="font-semibold text-gray-700 mb-2">Giá mua (VND)</p>
            <TextField
              type="number"
              value={newBuyPrice}
              onChange={(e) => setNewBuyPrice(Number(e.target.value))}
            />
          </div>
        </div>
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
