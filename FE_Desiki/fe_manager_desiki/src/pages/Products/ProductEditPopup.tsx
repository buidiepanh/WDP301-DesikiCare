import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  MenuItem,
  Box,
  Autocomplete,
} from "@mui/material";
import { useState } from "react";

type Option = {
  _id: number;
  name: string;
};

type ProductEditPopupProps = {
  open: boolean;
  onClose: () => void;
  onSubmit: (formData: any) => void;
  product: {
    _id: string;
    categoryId: number;
    name: string;
    description: string;
    volume: number;
    salePrice: number;
    imageUrl: string;
    productSkinTypes: Option[];
    productSkinStatuses: Option[];
  };
  categories: Option[];
  skinTypes: Option[];
  skinStatuses: Option[];
};

export const ProductEditPopup = ({
  open,
  onClose,
  onSubmit,
  product,
  categories,
  skinTypes,
  skinStatuses,
}: ProductEditPopupProps) => {
  const [form, setForm] = useState({
    categoryId: product.categoryId,
    name: product.name,
    description: product.description,
    volume: product.volume,
    salePrice: product.salePrice,
    imageBase64: "",
    skinTypeIds: product.productSkinTypes.map((s) => s._id),
    skinStatusIds: product.productSkinStatuses.map((s) => s._id),
  });

  const handleChange = (field: string, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  //   const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //     const file = e.target.files?.[0];
  //     if (!file) return;
  //     const reader = new FileReader();
  //     reader.onloadend = () => {
  //       setForm((prev) => ({
  //         ...prev,
  //         imageBase64: reader.result?.toString() || "",
  //       }));
  //     };
  //     reader.readAsDataURL(file);
  //   };
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setForm((prev) => ({
        ...prev,
        imageBase64: reader.result?.toString() || "",
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = () => {
    const data = {
      product: {
        categoryId: form.categoryId,
        name: form.name,
        description: form.description,
        volume: form.volume,
        salePrice: form.salePrice,
        imageBase64: form.imageBase64,
      },
      skinTypeIds: form.skinTypeIds,
      skinStatusIds: form.skinStatusIds,
    };
    onSubmit(data);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Chỉnh sửa sản phẩm</DialogTitle>
      <DialogContent dividers>
        <div className="my-4">
          <TextField
            select
            fullWidth
            label="Danh mục"
            value={form.categoryId}
            onChange={(e) => handleChange("categoryId", Number(e.target.value))}
            className="my-2"
          >
            {categories.map((cat) => (
              <MenuItem key={cat._id} value={cat._id}>
                {cat.name}
              </MenuItem>
            ))}
          </TextField>
        </div>

        <div className="mb-4"></div>

        <div className="mb-4">
          <TextField
            fullWidth
            label="Tên sản phẩm"
            value={form.name}
            onChange={(e) => handleChange("name", e.target.value)}
            className="my-2"
          />
        </div>

        <div className="mb-4">
          <TextField
            fullWidth
            label="Mô tả"
            multiline
            value={form.description}
            onChange={(e) => handleChange("description", e.target.value)}
            className="my-2"
          />
        </div>

        <div className="mb-4">
          <TextField
            fullWidth
            label="Dung tích (ml)"
            type="number"
            value={form.volume}
            onChange={(e) => handleChange("volume", Number(e.target.value))}
            className="my-2"
          />
        </div>

        <div className="mb-4">
          <TextField
            fullWidth
            label="Giá bán (VND)"
            type="number"
            value={form.salePrice}
            onChange={(e) => handleChange("salePrice", Number(e.target.value))}
            className="my-2"
          />
        </div>

        <div className="mb-4">
          <p className="font-bold text-black mb-2">Ảnh sản phẩm:</p>

          {/* Ảnh hiện tại hoặc ảnh đã upload */}
          <div className="mb-2">
            <img
              src={form.imageBase64 || product.imageUrl}
              alt="Ảnh sản phẩm"
              className="w-40 h-40 object-cover rounded border"
            />
          </div>

          {/* File input */}
          <input
            type="file"
            id="product-image-upload"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />

          <label
            htmlFor="product-image-upload"
            className="cursor-pointer inline-block bg-blue-600 text-white font-semibold py-2 px-4 rounded hover:bg-blue-700 transition"
          >
            Chọn ảnh mới
          </label>
        </div>

        <div className="mb-4">
          <Autocomplete
            multiple
            options={skinTypes}
            getOptionLabel={(option) => option.name}
            value={skinTypes.filter((st) => form.skinTypeIds.includes(st._id))}
            onChange={(_, newValue) =>
              handleChange(
                "skinTypeIds",
                newValue.map((v) => v._id)
              )
            }
            renderInput={(params) => (
              <TextField {...params} label="Loại da phù hợp" className="my-2" />
            )}
          />
        </div>

        <div className="mb-4">
          <Autocomplete
            multiple
            options={skinStatuses}
            getOptionLabel={(option) => option.name}
            value={skinStatuses.filter((st) =>
              form.skinStatusIds.includes(st._id)
            )}
            onChange={(_, newValue) =>
              handleChange(
                "skinStatusIds",
                newValue.map((v) => v._id)
              )
            }
            renderInput={(params) => (
              <TextField {...params} label="Tình trạng da" className="my-2" />
            )}
          />
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
