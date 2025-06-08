import { useState } from "react";
import { TextField, MenuItem, Button, Autocomplete, Box } from "@mui/material";
import {
  skinTypesData,
  skinStatusesData,
  categoriesData,
} from "../../../data/mockData";
import { useNavigate } from "react-router-dom";
import { callAPI } from "../../../api/axiosInstace";
import { token } from "../../../api/token";
// import axios from "axios";

type Option = {
  _id: number;
  name: string;
};

const CreateProduct = () => {
  // STATES
  const [form, setForm] = useState({
    categoryId: "",
    name: "",
    description: "",
    volume: "",
    salePrice: "",
    imageBase64: "",
    skinTypeIds: [] as number[],
    skinStatusIds: [] as number[],
  });

  // HOOKS
  const navigate = useNavigate();

  // FUNCTIONS
  const handleChange = (field: string, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

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

  const handleSubmit = async () => {
    const payload = {
      product: {
        categoryId: Number(form.categoryId),
        name: form.name,
        description: form.description,
        volume: Number(form.volume),
        salePrice: Number(form.salePrice),
        imageBase64: form.imageBase64,
      },
      skinTypeIds: form.skinTypeIds,
      skinStatusIds: form.skinStatusIds,
    };

    try {
      //   const res = await axios.post("/api/Product/products", payload);
      //   console.log("✅ Tạo sản phẩm thành công:", res.data);
      const response = await callAPI({
        method: "POST",
        url: "/api/Product/products",
        headers: {
          Authorization: `Bearer ${token}`,
          "ngrok-skip-browser-warning": "69420",
        },
        data: payload,
      });
      console.log("Tạo sản phẩm thành công: ", response);
      alert("Tạo thành công!");
      navigate("/Products");
    } catch (err) {
      console.error("❌ Lỗi khi tạo sản phẩm:", err);
      alert("Tạo thất bại!");
    }
  };

  return (
    <div className="w-full flex-col flex items-center p-5">
      <div className="w-full flex items-center">
        <p className="text-4xl font-bold text-black mb-6">Tạo Sản Phẩm Mới</p>
      </div>
      <div className="w-full bg-white shadow-md p-6 rounded-xl space-y-4">
        <TextField
          label="Tên sản phẩm"
          fullWidth
          value={form.name}
          onChange={(e) => handleChange("name", e.target.value)}
        />

        <TextField
          label="Mô tả"
          fullWidth
          multiline
          value={form.description}
          onChange={(e) => handleChange("description", e.target.value)}
        />

        <TextField
          label="Dung tích (ml)"
          fullWidth
          type="number"
          value={form.volume}
          onChange={(e) => handleChange("volume", e.target.value)}
        />

        <TextField
          label="Giá bán (VND)"
          fullWidth
          type="number"
          value={form.salePrice}
          onChange={(e) => handleChange("salePrice", e.target.value)}
        />

        <TextField
          select
          label="Danh mục"
          fullWidth
          value={form.categoryId}
          onChange={(e) => handleChange("categoryId", e.target.value)}
        >
          {categoriesData.map((cat) => (
            <MenuItem key={cat._id} value={cat._id}>
              {cat.name}
            </MenuItem>
          ))}
        </TextField>

        <Autocomplete
          multiple
          options={skinTypesData}
          getOptionLabel={(opt) => opt.name}
          onChange={(_, value) =>
            handleChange(
              "skinTypeIds",
              value.map((v) => v._id)
            )
          }
          renderInput={(params) => (
            <TextField {...params} label="Loại da phù hợp" />
          )}
        />

        <Autocomplete
          multiple
          options={skinStatusesData}
          getOptionLabel={(opt) => opt.name}
          onChange={(_, value) =>
            handleChange(
              "skinStatusIds",
              value.map((v) => v._id)
            )
          }
          renderInput={(params) => (
            <TextField {...params} label="Tình trạng da" />
          )}
        />

        <Box>
          <p className="text-sm font-semibold text-gray-700 mb-1">
            Ảnh sản phẩm:
          </p>
          {form.imageBase64 && (
            <img
              src={form.imageBase64}
              alt="preview"
              className="w-40 h-40 object-cover rounded mb-2 border"
            />
          )}
          <input
            type="file"
            id="image-upload"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />
          <label
            htmlFor="image-upload"
            className="cursor-pointer inline-block bg-blue-600 text-white font-semibold py-2 px-4 rounded hover:bg-blue-700 transition"
          >
            Chọn ảnh
          </label>
        </Box>

        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={handleSubmit}
        >
          Tạo sản phẩm
        </Button>
      </div>
    </div>
  );
};

export default CreateProduct;
