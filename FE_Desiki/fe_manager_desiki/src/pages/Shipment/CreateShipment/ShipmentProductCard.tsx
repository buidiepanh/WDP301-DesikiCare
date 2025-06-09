import { useState } from "react";
import { Button, IconButton, TextField, Typography } from "@mui/material";
import type { ProductAPI } from "../../../data/types";
import EditIcon from "@mui/icons-material/Edit";
import DoDisturbOnIcon from "@mui/icons-material/DoDisturbOn";

type ShipmentProductInput = {
  productId: string;
  quantity: number;
  manufacturingDate: string;
  expiryDate: string;
  buyPrice: number;
};

type Props = {
  product: ProductAPI;
  shipmentProduct: ShipmentProductInput;
  onDelete: () => void;
  onEdit: (newData: ShipmentProductInput) => void;
};

export const ShipmentProductCard: React.FC<Props> = ({
  product,
  shipmentProduct,
  onDelete,
  onEdit,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] =
    useState<ShipmentProductInput>(shipmentProduct);

  const handleChange = (key: keyof ShipmentProductInput, value: any) => {
    setEditedData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSave = () => {
    onEdit(editedData);
    setIsEditing(false);
  };

  return (
    <div className="border border-gray-300 p-4 mb-4 rounded-md shadow-sm bg-white relative">
      <div className="flex items-center gap-4">
        <img
          src={product.product.imageUrl}
          alt={product.product.name}
          className="w-[120px] h-[120px] object-cover rounded-md"
        />
        <div className="flex-1">
          <Typography fontWeight="bold" fontSize={16}>
            {product.product.name}
          </Typography>

          {!isEditing ? (
            <ul className="list-disc pl-5 text-gray-800">
              <li>Số lượng: {shipmentProduct.quantity}</li>
              <li>
                Giá nhập: {shipmentProduct.buyPrice.toLocaleString("vi-VN")} VND
              </li>
              <li>Ngày sản xuất: {shipmentProduct.manufacturingDate}</li>
              <li>Ngày hết hạn: {shipmentProduct.expiryDate}</li>
            </ul>
          ) : (
            <div className="grid grid-cols-2 gap-3 mt-2">
              <TextField
                label="Số lượng"
                type="number"
                value={editedData.quantity}
                onChange={(e) =>
                  handleChange("quantity", Number(e.target.value))
                }
              />
              <TextField
                label="Giá nhập"
                type="number"
                value={editedData.buyPrice}
                onChange={(e) =>
                  handleChange("buyPrice", Number(e.target.value))
                }
              />
              <TextField
                label="Ngày sản xuất"
                type="date"
                InputLabelProps={{ shrink: true }}
                value={editedData.manufacturingDate}
                onChange={(e) =>
                  handleChange("manufacturingDate", e.target.value)
                }
              />
              <TextField
                label="Ngày hết hạn"
                type="date"
                InputLabelProps={{ shrink: true }}
                value={editedData.expiryDate}
                onChange={(e) => handleChange("expiryDate", e.target.value)}
              />
            </div>
          )}
        </div>

        {/* ACTIONS */}
        <div className="flex flex-col gap-2">
          {!isEditing ? (
            <div className="absolute top-5 right-5 flex gap-2">
              <IconButton color="primary" onClick={() => setIsEditing(true)}>
                <EditIcon />
              </IconButton>
              <IconButton color="error" onClick={onDelete}>
                <DoDisturbOnIcon />
              </IconButton>
            </div>
          ) : (
            <>
              <Button size="small" variant="contained" onClick={handleSave}>
                Save
              </Button>
              <Button
                size="small"
                variant="outlined"
                onClick={() => {
                  setEditedData(shipmentProduct);
                  setIsEditing(false);
                }}
              >
                Cancel
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
