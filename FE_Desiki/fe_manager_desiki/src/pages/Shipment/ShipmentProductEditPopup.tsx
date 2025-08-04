import type React from "react";
import type { ShipmentProductDetails } from "../../data/types";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
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
  const [newImportQuantity, setNewImportQuantity] = useState(
    shipmentProduct.shipmentProduct.importQuantity
  );
  const [newManufactureDate, setNewManufactureDate] = useState(
    shipmentProduct.shipmentProduct.manufacturingDate.split("T")[0]
  );
  const [newExpireDate, setNewExpireDate] = useState(
    shipmentProduct.shipmentProduct.expiryDate.split("T")[0]
  );
  const [newBuyPrice, setNewBuyPrice] = useState(
    shipmentProduct.shipmentProduct.buyPrice
  );

  // Check if product has been sold (saleQuantity > 0)
  const hasSales = (shipmentProduct.shipmentProduct as any).saleQuantity > 0;

  // FUNCTIONS
  const handleSubmit = () => {
    const data = {
      shipmentProduct: {
        importQuantity: newImportQuantity,
        manufacturingDate: newManufactureDate + "T00:00:00.000Z",
        expiryDate: newExpireDate + "T00:00:00.000Z",
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
            <p className="font-semibold text-gray-700 mb-2">
              Số lượng nhập
              {hasSales && (
                <span className="text-red-500 text-sm ml-2">
                  (Không thể chỉnh sửa vì đã có bán hàng)
                </span>
              )}
            </p>
            <TextField
              type="number"
              value={newImportQuantity}
              onChange={(e) => setNewImportQuantity(Number(e.target.value))}
              disabled={hasSales}
              helperText={hasSales ? "Sản phẩm đã có giao dịch bán hàng" : ""}
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
