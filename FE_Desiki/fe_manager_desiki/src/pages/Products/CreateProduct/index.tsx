import type React from "react";

import { useEffect, useState } from "react";
import { ChevronDown, Upload, X, Plus, Check, ImageIcon } from "lucide-react";
import {
  skinTypesData,
  skinStatusesData,
  categoriesData,
} from "../../../data/mockData";
import { useNavigate } from "react-router-dom";
import { callAPIManager } from "../../../api/axiosInstace";
import { nextAPI } from "../../../api/nextAPI";
import Swal from "sweetalert2";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { toast } from "react-toastify";
type Option = {
  _id: number;
  name: string;
};

type Brand = {
  _id: string;
  name: string;
  imageUrl: string;
  createdAt: string;
  updatedAt: string;
};

// Custom Glassmorphism Components
const GlassInput = ({
  placeholder,
  value,
  onChange,
  type = "text",
  label,
  multiline = false,
}: {
  placeholder?: string;
  value: string | number;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  type?: string;
  label?: string;
  multiline?: boolean;
}) => (
  <div className="flex flex-col gap-2">
    {label && (
      <label className="text-white/90 text-sm font-medium">{label}</label>
    )}
    {multiline ? (
      <textarea
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        rows={4}
        className="px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-white/50 focus:border-white/40 focus:ring-2 focus:ring-white/20 backdrop-blur-sm transition-all duration-200 resize-none"
        style={{ backdropFilter: "blur(8px)" }}
      />
    ) : (
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-white/50 focus:border-white/40 focus:ring-2 focus:ring-white/20 backdrop-blur-sm transition-all duration-200"
        style={{ backdropFilter: "blur(8px)" }}
      />
    )}
  </div>
);

const GlassSelect = ({
  options,
  value,
  onChange,
  placeholder,
  label,
}: {
  options: Option[];
  value: string | number;
  onChange: (value: string | number) => void;
  placeholder?: string;
  label?: string;
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const selectedOption = options.find(
    (opt) => opt._id.toString() === value.toString()
  );

  return (
    <div className="relative flex flex-col gap-2">
      {label && (
        <label className="text-white/90 text-sm font-medium">{label}</label>
      )}
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white text-left backdrop-blur-sm transition-all duration-200 flex items-center justify-between hover:border-white/30"
          style={{ backdropFilter: "blur(8px)" }}
        >
          <span className={selectedOption ? "text-white" : "text-white/50"}>
            {selectedOption ? selectedOption.name : placeholder || "Chọn..."}
          </span>
          <ChevronDown
            className={`h-4 w-4 transition-transform ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {isOpen && (
          <div className="absolute top-full left-0 right-0 mt-1 backdrop-blur-xl bg-black/40 border border-white/20 rounded-lg shadow-2xl z-50 max-h-60 overflow-y-auto">
            {options.map((option) => (
              <button
                key={option._id}
                onClick={() => {
                  onChange(option._id);
                  setIsOpen(false);
                }}
                className="w-full px-4 py-3 text-left text-white hover:bg-white/10 transition-colors duration-200 border-b border-white/5 last:border-b-0"
              >
                {option.name}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const BrandSelect = ({
  brands,
  value,
  onChange,
  label,
  placeholder,
  isLoading = false,
}: {
  brands: Brand[];
  value: string;
  onChange: (brandId: string) => void;
  label?: string;
  placeholder?: string;
  isLoading?: boolean;
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const selectedBrand = brands.find((brand) => brand._id === value);

  return (
    <div className="relative flex flex-col gap-2">
      {label && (
        <label className="text-white/90 text-sm font-medium">{label}</label>
      )}
      <div className="relative">
        <button
          onClick={() => !isLoading && setIsOpen(!isOpen)}
          disabled={isLoading}
          className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white text-left backdrop-blur-sm transition-all duration-200 flex items-center justify-between hover:border-white/30 disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ backdropFilter: "blur(8px)" }}
        >
          <span className={selectedBrand ? "text-white" : "text-white/50"}>
            {isLoading
              ? "Đang tải brands..."
              : selectedBrand
              ? selectedBrand.name
              : placeholder || "Chọn brand..."}
          </span>
          <ChevronDown
            className={`h-4 w-4 transition-transform ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {isOpen && !isLoading && (
          <div className="absolute top-full left-0 right-0 mt-1 backdrop-blur-xl bg-black/40 border border-white/20 rounded-lg shadow-2xl z-50 max-h-60 overflow-y-auto">
            {brands.length === 0 ? (
              <div className="px-4 py-3 text-white/50 text-center">
                Không có brands nào
              </div>
            ) : (
              brands.map((brand) => (
                <button
                  key={brand._id}
                  onClick={() => {
                    onChange(brand._id);
                    setIsOpen(false);
                  }}
                  className="w-full px-4 py-3 text-left text-white hover:bg-white/10 transition-colors duration-200 border-b border-white/5 last:border-b-0 flex items-center gap-3"
                >
                  {/* Brand Image */}
                  {brand.imageUrl && (
                    <img
                      src={brand.imageUrl}
                      alt={brand.name}
                      className="w-8 h-8 object-cover rounded-full border border-white/20"
                    />
                  )}
                  <span>{brand.name}</span>
                </button>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const GlassMultiSelect = ({
  options,
  selectedIds,
  onChange,
  label,
  placeholder,
}: {
  options: Option[];
  selectedIds: number[];
  onChange: (ids: number[]) => void;
  label?: string;
  placeholder?: string;
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const selectedOptions = options.filter((opt) =>
    selectedIds.includes(opt._id)
  );

  const toggleOption = (optionId: number) => {
    if (selectedIds.includes(optionId)) {
      onChange(selectedIds.filter((id) => id !== optionId));
    } else {
      onChange([...selectedIds, optionId]);
    }
  };

  const removeOption = (optionId: number) => {
    onChange(selectedIds.filter((id) => id !== optionId));
  };

  return (
    <div className="flex flex-col gap-2">
      {label && (
        <label className="text-white/90 text-sm font-medium">{label}</label>
      )}

      {/* Selected Items */}
      {selectedOptions.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-2">
          {selectedOptions.map((option) => (
            <span
              key={option._id}
              className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-500/20 border border-blue-400/40 text-blue-100 backdrop-blur-sm"
              style={{ backdropFilter: "blur(8px)" }}
            >
              {option.name}
              <button
                onClick={() => removeOption(option._id)}
                className="ml-2 hover:text-blue-200 transition-colors"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Dropdown */}
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white text-left backdrop-blur-sm transition-all duration-200 flex items-center justify-between hover:border-white/30"
          style={{ backdropFilter: "blur(8px)" }}
        >
          <span
            className={
              selectedOptions.length > 0 ? "text-white" : "text-white/50"
            }
          >
            {selectedOptions.length > 0
              ? `Đã chọn ${selectedOptions.length} mục`
              : placeholder || "Chọn..."}
          </span>
          <ChevronDown
            className={`h-4 w-4 transition-transform ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {isOpen && (
          <div className="absolute top-full left-0 right-0 mt-1 backdrop-blur-xl bg-black/40 border border-white/20 rounded-lg shadow-2xl z-50 max-h-60 overflow-y-auto">
            {options.map((option) => (
              <button
                key={option._id}
                onClick={() => toggleOption(option._id)}
                className="w-full px-4 py-3 text-left text-white hover:bg-white/10 transition-colors duration-200 border-b border-white/5 last:border-b-0 flex items-center justify-between"
              >
                <span>{option.name}</span>
                {selectedIds.includes(option._id) && (
                  <Check className="h-4 w-4 text-emerald-400" />
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const GlassButton = ({
  children,
  onClick,
  variant = "primary",
  disabled = false,
  fullWidth = false,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "success";
  disabled?: boolean;
  fullWidth?: boolean;
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case "primary":
        return "bg-blue-500/20 border-blue-400/40 text-blue-100 hover:bg-blue-500/30";
      case "secondary":
        return "bg-slate-500/20 border-slate-400/40 text-slate-100 hover:bg-slate-500/30";
      case "success":
        return "bg-emerald-500/20 border-emerald-400/40 text-emerald-100 hover:bg-emerald-500/30";
      default:
        return "bg-blue-500/20 border-blue-400/40 text-blue-100 hover:bg-blue-500/30";
    }
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${getVariantStyles()} ${
        fullWidth ? "w-full" : ""
      } px-6 py-3 border rounded-lg font-medium backdrop-blur-sm transition-all duration-200 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2`}
      style={{ backdropFilter: "blur(8px)" }}
    >
      {children}
    </button>
  );
};

const ImageUpload = ({
  value,
  onChange,
  label,
}: {
  value: string;
  onChange: (base64: string) => void;
  label?: string;
}) => {
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    console.log("📸 Image selected:", {
      name: file.name,
      size: file.size,
      type: file.type,
    });

    // Kiểm tra kích thước file (giới hạn 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Kích thước ảnh quá lớn! Vui lòng chọn ảnh nhỏ hơn 5MB.");
      return;
    }

    // Kiểm tra định dạng file
    if (!file.type.startsWith("image/")) {
      toast.error("Vui lòng chọn file ảnh hợp lệ!");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result?.toString() || "";
      console.log("📸 Image converted to base64, length:", result.length);
      onChange(result);
    };
    reader.onerror = () => {
      console.error("❌ Error reading file");
      toast.error("Lỗi khi đọc file ảnh!");
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="flex flex-col gap-3">
      {label && (
        <label className="text-white/90 text-sm font-medium">{label}</label>
      )}

      {/* Preview */}
      {value && (
        <div className="relative inline-block">
          <img
            src={value || "/placeholder.svg"}
            alt="preview"
            className="w-40 h-40 object-cover rounded-lg border border-white/20 shadow-lg"
            onError={() => {
              console.error("❌ Error loading image preview");
              toast.error("Lỗi hiển thị ảnh preview!");
            }}
          />
          <button
            onClick={() => {
              console.log("🗑️ Removing image");
              onChange("");
            }}
            className="absolute -top-2 -right-2 p-1 bg-red-500/20 border border-red-400/40 text-red-200 hover:bg-red-500/30 transition-all duration-200 backdrop-blur-sm rounded-full"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Upload Button */}
      <div>
        <input
          type="file"
          id="image-upload"
          accept="image/*"
          onChange={handleImageChange}
          className="hidden"
        />
        <label
          htmlFor="image-upload"
          className="cursor-pointer inline-flex items-center gap-2 px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white hover:bg-white/15 transition-all duration-200 backdrop-blur-sm font-medium"
          style={{ backdropFilter: "blur(8px)" }}
        >
          {value ? (
            <ImageIcon className="h-4 w-4" />
          ) : (
            <Upload className="h-4 w-4" />
          )}
          {value ? "Thay đổi ảnh" : "Chọn ảnh"}
        </label>
      </div>
    </div>
  );
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
    brandId: "", // Add brandId to form
  });

  const [htmlContent, setHtmlContent] = useState("");
  const [brands, setBrands] = useState<Brand[]>([]);
  const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null);
  const [isLoadingBrands, setIsLoadingBrands] = useState(false);

  // HOOKS
  const navigate = useNavigate();
  useEffect(() => {
    fetchBrands();
  }, []);

  // FUNCTIONS
  const fetchBrands = async () => {
    setIsLoadingBrands(true);
    try {
      console.log("🔍 Fetching brands from /api/brands (via nextAPI proxy)");

      // Use nextAPI without baseURL to leverage Vite proxy
      const response = await nextAPI.get("/api/brands");

      console.log("📨 Brands API Response:", {
        status: response?.status,
        data: response?.data,
        headers: response?.headers,
      });

      if (response && response.data && response.data.brands) {
        setBrands(response.data.brands);
        console.log("✅ Brands loaded:", response.data.brands.length, "brands");
        console.log(
          "📋 Brands list:",
          response.data.brands.map((b: Brand) => ({ id: b._id, name: b.name }))
        );
      } else {
        setBrands([]);
        console.log("⚠️ No brands found in response:", response?.data);
      }
    } catch (error: any) {
      console.error("❌ Error fetching brands:", {
        message: error?.message,
        response: error?.response?.data,
        status: error?.response?.status,
        url: error?.config?.url,
      });
      setBrands([]);
      toast.error(
        `Không thể tải danh sách brands: ${
          error?.response?.data?.message || error?.message
        }`
      );
    } finally {
      setIsLoadingBrands(false);
    }
  };
  const handleChange = (field: string, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const reset = () => {
    setForm({
      categoryId: "",
      name: "",
      description: "",
      volume: "",
      salePrice: "",
      imageBase64: "",
      skinTypeIds: [] as number[],
      skinStatusIds: [] as number[],
      brandId: "", // Add brandId to reset function
    });
  };

  const handleSubmit = async () => {
    // Kiểm tra dữ liệu trước khi gửi
    console.log("📋 Form data validation:");
    console.log("- Name:", form.name);
    console.log("- CategoryId:", form.categoryId);
    console.log("- Volume:", form.volume);
    console.log("- SalePrice:", form.salePrice);
    console.log("- Image Base64 length:", form.imageBase64.length);
    console.log("- BrandId:", form.brandId);
    console.log("- HTML Content length:", htmlContent.length);

    // Kiểm tra các trường bắt buộc
    if (!form.name || !form.categoryId || !form.volume || !form.salePrice) {
      Swal.fire("Lỗi", "Vui lòng điền đầy đủ thông tin bắt buộc!", "error");
      return;
    }

    // Kiểm tra ảnh
    if (!form.imageBase64) {
      Swal.fire("Lỗi", "Vui lòng chọn ảnh sản phẩm!", "error");
      return;
    }

    // Payload cho API chính (không bao gồm brandId)
    const mainPayload = {
      product: {
        categoryId: Number(form.categoryId),
        name: form.name,
        description: form.description,
        volume: Number(form.volume),
        salePrice: Number(form.salePrice),
        gameTicketReward: 0,
        imageBase64: form.imageBase64,
      },
      skinTypeIds: form.skinTypeIds,
      skinStatusIds: form.skinStatusIds,
    };

    console.log("📤 Main API Payload:", {
      ...mainPayload,
      product: {
        ...mainPayload.product,
        imageBase64: `[Base64 image - ${form.imageBase64.length} chars]`,
      },
    });

    try {
      // Bước 1: Tạo sản phẩm với API chính
      console.log("🔄 Creating product with main API...");
      const response = await callAPIManager({
        method: "POST",
        url: "/api/Product/products",
        data: mainPayload,
      });

      console.log("📨 Main API Response:", {
        status: response?.status,
        data: response?.data,
        headers: response?.headers,
      });

      if (response && response.status === 201 && response.data?.newProductId) {
        const newProductId = response.data.newProductId;
        console.log("✅ Product created successfully, ID:", newProductId);

        // Bước 2: Gửi thông tin bổ sung qua API phụ (Next.js)
        if (form.brandId || htmlContent) {
          try {
            console.log("🔄 Sending additional data to Next.js API...");

            // Tìm brand name từ brandId
            const selectedBrand = brands.find(
              (brand) => brand._id === form.brandId
            );
            const brandName = selectedBrand ? selectedBrand.name : "";

            const additionalPayload = {
              id: newProductId,
              brandId: form.brandId || null,
              brandName: brandName || null,
              htmlContent: htmlContent || null,
            };

            console.log("📤 Next.js API Payload:", additionalPayload);

            const nextResponse = await nextAPI.post(
              "/api/products",
              additionalPayload
            );

            console.log("📨 Next.js API Response:", {
              status: nextResponse?.status,
              data: nextResponse?.data,
              headers: nextResponse?.headers,
            });

            if (nextResponse && nextResponse.status === 200) {
              console.log("✅ Additional data sent successfully");
            } else {
              console.warn(
                "⚠️ Warning: Additional data sending failed, but product was created",
                nextResponse
              );
            }
          } catch (nextErr: any) {
            console.error("❌ Error sending additional data:", {
              message: nextErr?.message,
              response: nextErr?.response?.data,
              status: nextErr?.response?.status,
              url: nextErr?.config?.url,
            });
            // Không block quá trình vì sản phẩm đã tạo thành công
            toast.error(
              `Sản phẩm đã tạo thành công nhưng có lỗi khi cập nhật thông tin bổ sung: ${
                nextErr?.response?.data?.message || nextErr?.message
              }`
            );
          }
        } else {
          console.log(
            "ℹ️ No additional data to send (no brandId or htmlContent)"
          );
        }

        // Reset form và thông báo thành công
        reset();
        setHtmlContent("");
        Swal.fire("Thành công", "Đã tạo thành công sản phẩm", "success");
        navigate("/Products");
      } else {
        console.error("❌ Invalid response from main API:", response);
        Swal.fire("Lỗi", "Lỗi khi tạo sản phẩm, vui lòng thử lại", "error");
      }
    } catch (err: any) {
      console.error("❌ Lỗi khi tạo sản phẩm:", {
        message: err?.message,
        response: err?.response?.data,
        status: err?.response?.status,
        url: err?.config?.url,
      });
      Swal.fire(
        "Lỗi",
        `Tạo sản phẩm thất bại: ${
          err?.response?.data?.message || err?.message
        }`,
        "error"
      );
    }
  };

  return (
    <div className="w-full flex flex-col p-6">
      {/* Header */}
      <div className="mb-8 backdrop-blur-xl bg-black/20 border border-white/10 rounded-2xl p-6 shadow-2xl">
        <h1 className="text-white text-3xl font-bold mb-2">Tạo Sản Phẩm Mới</h1>
        <p className="text-white/70 text-lg">Thêm sản phẩm mới vào hệ thống.</p>
      </div>

      {/* Form */}
      <div className="backdrop-blur-xl bg-black/20 border border-white/10 rounded-2xl p-6 shadow-2xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Basic Info */}
          <div className="space-y-6">
            <GlassInput
              label="Tên sản phẩm"
              placeholder="Nhập tên sản phẩm..."
              value={form.name}
              onChange={(e) => handleChange("name", e.target.value)}
            />

            <GlassInput
              label="Mô tả"
              placeholder="Nhập mô tả sản phẩm..."
              value={form.description}
              onChange={(e) => handleChange("description", e.target.value)}
              multiline
            />

            <div className="grid grid-cols-2 gap-4">
              <GlassInput
                label="Dung tích (ml)"
                type="number"
                placeholder="0"
                value={form.volume}
                onChange={(e) => handleChange("volume", e.target.value)}
              />

              <GlassInput
                label="Giá bán (VND)"
                type="number"
                placeholder="0"
                value={form.salePrice}
                onChange={(e) => handleChange("salePrice", e.target.value)}
              />
            </div>

            <GlassSelect
              label="Danh mục"
              placeholder="Chọn danh mục..."
              options={categoriesData}
              value={form.categoryId}
              onChange={(value) => handleChange("categoryId", value)}
            />

            <BrandSelect
              label="Brand"
              placeholder="Chọn brand cho sản phẩm..."
              brands={brands}
              value={form.brandId}
              onChange={(brandId) => handleChange("brandId", brandId)}
              isLoading={isLoadingBrands}
            />
          </div>

          {/* Advanced Options & Image */}
          <div className="space-y-6">
            <GlassMultiSelect
              label="Loại da phù hợp"
              placeholder="Chọn loại da..."
              options={skinTypesData}
              selectedIds={form.skinTypeIds}
              onChange={(ids) => handleChange("skinTypeIds", ids)}
            />

            <GlassMultiSelect
              label="Tình trạng da"
              placeholder="Chọn tình trạng da..."
              options={skinStatusesData}
              selectedIds={form.skinStatusIds}
              onChange={(ids) => handleChange("skinStatusIds", ids)}
            />

            <ImageUpload
              label="Ảnh sản phẩm"
              value={form.imageBase64}
              onChange={(base64) => handleChange("imageBase64", base64)}
            />
          </div>
        </div>
        {/* Description Editor */}
        <div className="text-white mt-8">
          <h2 className="text-xl font-semibold mb-4">Mô tả chi tiết</h2>
          <ReactQuill value={htmlContent} onChange={setHtmlContent} />
        </div>

        {/* Submit Button */}
        <div className="mt-8 flex justify-end">
          <GlassButton onClick={handleSubmit} variant="success" fullWidth>
            <Plus className="h-5 w-5" />
            Tạo sản phẩm
          </GlassButton>
        </div>
      </div>
    </div>
  );
};

export default CreateProduct;
