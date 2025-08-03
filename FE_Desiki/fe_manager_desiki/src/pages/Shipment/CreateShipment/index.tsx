import type React from "react";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ChevronDown,
  Plus,
  Calendar,
  Package,
  Check,
  X,
  Edit,
  Trash2,
} from "lucide-react";
import type { ProductAPI } from "../../../data/types";
import Swal from "sweetalert2";
import { callAPIManager } from "../../../api/axiosInstace";

// Custom Glassmorphism Components
const GlassInput = ({
  placeholder,
  value,
  onChange,
  type = "text",
  label,
  disabled = false,
}: {
  placeholder?: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  label?: string;
  disabled?: boolean;
}) => (
  <div className="flex flex-col gap-2">
    {label && (
      <label className="text-white/90 text-sm font-medium">{label}</label>
    )}
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      disabled={disabled}
      className="px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-white/50 focus:border-white/40 focus:ring-2 focus:ring-white/20 backdrop-blur-sm transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
      style={{ backdropFilter: "blur(8px)" }}
    />
  </div>
);

const GlassButton = ({
  children,
  onClick,
  variant = "primary",
  disabled = false,
  size = "md",
  fullWidth = false,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "success" | "warning" | "error";
  disabled?: boolean;
  size?: "sm" | "md" | "lg";
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
      case "warning":
        return "bg-amber-500/20 border-amber-400/40 text-amber-100 hover:bg-amber-500/30";
      case "error":
        return "bg-red-500/20 border-red-400/40 text-red-100 hover:bg-red-500/30";
      default:
        return "bg-blue-500/20 border-blue-400/40 text-blue-100 hover:bg-blue-500/30";
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case "sm":
        return "px-3 py-1.5 text-sm";
      case "lg":
        return "px-6 py-4 text-lg";
      default:
        return "px-4 py-3 text-base";
    }
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${getVariantStyles()} ${getSizeStyles()} ${
        fullWidth ? "w-full" : ""
      } border rounded-lg font-medium backdrop-blur-sm transition-all duration-200 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2`}
      style={{ backdropFilter: "blur(8px)" }}
    >
      {children}
    </button>
  );
};

const GlassSelect = ({
  options,
  value,
  onChange,
  placeholder,
  label,
}: {
  options: ProductAPI[];
  value: ProductAPI | null;
  onChange: (product: ProductAPI | null) => void;
  placeholder?: string;
  label?: string;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredOptions = options.filter((option) =>
    option.product.name.toLowerCase().includes(searchTerm.toLowerCase())
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
          <span className={value ? "text-white" : "text-white/50"}>
            {value ? value.product.name : placeholder || "Chọn sản phẩm..."}
          </span>
          <ChevronDown
            className={`h-4 w-4 transition-transform ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {isOpen && (
          <div className="absolute top-full left-0 right-0 mt-1 backdrop-blur-xl bg-black/40 border border-white/20 rounded-lg shadow-2xl z-50 max-h-60 overflow-hidden">
            <div className="p-2 border-b border-white/10">
              <input
                type="text"
                placeholder="Tìm kiếm sản phẩm..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded text-white placeholder:text-white/50 text-sm focus:border-white/40 focus:outline-none"
              />
            </div>
            <div className="max-h-48 overflow-y-auto">
              {filteredOptions.map((option) => (
                <button
                  key={option.product._id}
                  onClick={() => {
                    onChange(option);
                    setIsOpen(false);
                    setSearchTerm("");
                  }}
                  className="w-full px-4 py-3 text-left text-white hover:bg-white/10 transition-colors duration-200 border-b border-white/5 last:border-b-0"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={option.product.imageUrl || "/placeholder.svg"}
                      alt={option.product.name}
                      className="w-8 h-8 object-cover rounded"
                    />
                    <span className="text-sm">{option.product.name}</span>
                  </div>
                </button>
              ))}
              {filteredOptions.length === 0 && (
                <div className="px-4 py-3 text-white/50 text-sm">
                  Không tìm thấy sản phẩm
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// ShipmentProductCard Component
type ShipmentProductInput = {
  productId: string;
  importQuantity: number;
  manufacturingDate: string;
  expiryDate: string;
  buyPrice: number;
};

type ShipmentProductCardProps = {
  product: ProductAPI;
  shipmentProduct: ShipmentProductInput;
  onDelete: () => void;
  onEdit: (newData: ShipmentProductInput) => void;
};

const ShipmentProductCard: React.FC<ShipmentProductCardProps> = ({
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

  const handleCancel = () => {
    setEditedData(shipmentProduct);
    setIsEditing(false);
  };

  return (
    <div className="backdrop-blur-xl bg-green-200/20 border border-white/10 rounded-2xl p-6 shadow-2xl mb-4 relative">
      <div className="flex items-start gap-6">
        <img
          src={product.product.imageUrl || "/placeholder.svg"}
          alt={product.product.name}
          className="w-32 h-32 object-cover rounded-lg border border-white/20 shadow-lg"
        />

        <div className="flex-1">
          <h3 className="text-white text-xl font-semibold mb-4">
            {product.product.name}
          </h3>

          {!isEditing ? (
            <div className="grid grid-cols-2 gap-4 text-white/80">
              <div>
                <span className="text-white/60">Số lượng nhập:</span>
                <span className="ml-2 font-medium">
                  {shipmentProduct.importQuantity}
                </span>
              </div>
              <div>
                <span className="text-white/60">Giá nhập:</span>
                <span className="ml-2 font-medium">
                  {shipmentProduct.buyPrice.toLocaleString("vi-VN")} VND
                </span>
              </div>
              <div>
                <span className="text-white/60">Ngày sản xuất:</span>
                <span className="ml-2 font-medium">
                  {shipmentProduct.manufacturingDate}
                </span>
              </div>
              <div>
                <span className="text-white/60">Ngày hết hạn:</span>
                <span className="ml-2 font-medium">
                  {shipmentProduct.expiryDate}
                </span>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              <GlassInput
                label="Số lượng"
                type="number"
                value={editedData.importQuantity}
                onChange={(e) =>
                  handleChange("importQuantity", Number(e.target.value))
                }
              />
              <GlassInput
                label="Giá nhập"
                type="number"
                value={editedData.buyPrice}
                onChange={(e) =>
                  handleChange("buyPrice", Number(e.target.value))
                }
              />
              <GlassInput
                label="Ngày sản xuất"
                type="date"
                value={editedData.manufacturingDate}
                onChange={(e) =>
                  handleChange("manufacturingDate", e.target.value)
                }
              />
              <GlassInput
                label="Ngày hết hạn"
                type="date"
                value={editedData.expiryDate}
                onChange={(e) => handleChange("expiryDate", e.target.value)}
              />
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-2">
          {!isEditing ? (
            <>
              <button
                onClick={() => setIsEditing(true)}
                className="p-2 bg-blue-500/20 border border-blue-400/40 text-blue-200 hover:bg-blue-500/30 transition-all duration-200 backdrop-blur-sm rounded-lg"
              >
                <Edit className="h-4 w-4" />
              </button>
              <button
                onClick={onDelete}
                className="p-2 bg-red-500/20 border border-red-400/40 text-red-200 hover:bg-red-500/30 transition-all duration-200 backdrop-blur-sm rounded-lg"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </>
          ) : (
            <>
              <button
                onClick={handleSave}
                className="p-2 bg-emerald-500/20 border border-emerald-400/40 text-emerald-200 hover:bg-emerald-500/30 transition-all duration-200 backdrop-blur-sm rounded-lg"
              >
                <Check className="h-4 w-4" />
              </button>
              <button
                onClick={handleCancel}
                className="p-2 bg-slate-500/20 border border-slate-400/40 text-slate-200 hover:bg-slate-500/30 transition-all duration-200 backdrop-blur-sm rounded-lg"
              >
                <X className="h-4 w-4" />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

const generateShipmentId = (dateStr: string): string => {
  const formatted = new Date(dateStr)
    .toISOString()
    .split("T")[0]
    .split("-")
    .reverse()
    .join("");
  const unique = Math.floor(Math.random() * 100000);
  return `S-${formatted}-${unique}`;
};

const CreateShipment = () => {
  // STATES
  const [shipmentDate, setShipmentDate] = useState("");
  const [shipmentId, setShipmentId] = useState("");
  const [shipmentCreated, setShipmentCreated] = useState(false);

  const [products, setProducts] = useState<ProductAPI[]>([]);
  const [shipmentProducts, setShipmentProducts] = useState<
    ShipmentProductInput[]
  >([]);

  const [selectedProduct, setSelectedProduct] = useState<ProductAPI | null>(
    null
  );
  const [quantity, setQuantity] = useState<number>(0);
  const [mfgDate, setMfgDate] = useState("");
  const [expDate, setExpDate] = useState("");
  const [buyPrice, setBuyPrice] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);

  // HOOKS
  const navigate = useNavigate();

  useEffect(() => {
    fetchProduct();
  }, []);

  // FUNCTIONS
  const fetchProduct = async () => {
    setIsLoading(true);
    try {
      const response = await callAPIManager({
        method: "GET",
        url: `/api/Product/products`,
      });
      if (response && response.status === 200) {
        const activeProducts = response.data.products.filter(
          (p: ProductAPI) => !p.product.isDeactivated
        );
        setProducts(activeProducts);
      } else {
        Swal.fire("Lỗi", "Lỗi khi lấy danh sách sản phẩm", "error");
      }
    } catch (error) {
      console.log("Lỗi khi lấy danh sách sản phẩm: ", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateShipment = async () => {
    const generatedId = generateShipmentId(shipmentDate);
    const payload = {
      shipment: {
        _id: generatedId,
        shipmentDate: shipmentDate + "T00:00:00.000Z",
      },
    };
    try {
      const response = await callAPIManager({
        method: "POST",
        url: `/api/Product/shipments`,
        data: payload,
      });
      if (response && response.status === 201) {
        setShipmentId(generatedId);
        setShipmentCreated(true);
      } else {
        Swal.fire("Lỗi", "Không thể tạo lô hàng", "error");
      }
    } catch (error) {
      console.log("Lỗi ở tạo lô hàng: ", error);
    }
  };

  const handleAddShipmentProduct = () => {
    if (!selectedProduct) {
      Swal.fire("Chưa chọn sản phẩm", "Vui lòng chọn một sản phẩm", "warning");
      return;
    }

    const id = selectedProduct.product._id;
    const alreadyExists = shipmentProducts.some((sp) => sp.productId === id);

    if (alreadyExists) {
      Swal.fire(
        "Sản phẩm đã tồn tại",
        "Không thể thêm trùng sản phẩm vào cùng một lô",
        "error"
      );
      return;
    }

    const item: ShipmentProductInput = {
      productId: id,
      importQuantity: quantity,
      manufacturingDate: mfgDate + "T00:00:00.000Z",
      expiryDate: expDate + "T00:00:00.000Z",
      buyPrice,
    };

    setShipmentProducts((prev) => [...prev, item]);

    // Reset inputs
    setSelectedProduct(null);
    setQuantity(0);
    setMfgDate("");
    setExpDate("");
    setBuyPrice(0);
  };

  const handleSubmitAll = async () => {
    try {
      shipmentProducts.forEach(async (sp) => {
        const payload = {
          shipmentProduct: {
            ...sp,
            shipmentId,
          },
        };
        try {
          const response = await callAPIManager({
            method: "POST",
            url: `/api/Product/shipmentProducts`,
            data: payload,
          });
          if (!response || response.status !== 201) {
            Swal.fire("Lỗi", "Lỗi khi tạo kiện hàng của lô hàng", "error");
          }
        } catch (error) {
          console.log("Lỗi chỗ tạo kiện hàng: ", error);
        }
      });
    } catch (error) {
      console.log("Lỗi chỗ tạo kiện hàng: ", error);
    } finally {
      navigate("/Shipments");
    }
  };

  const getProductDetails = (id: string) => {
    const product = products.filter((p) => p.product._id === id);
    return product[0];
  };

  return (
    <div className="w-full flex flex-col p-6">
      {/* Header */}
      <div className="mb-8 backdrop-blur-xl bg-gray-400/20 border border-white/10 rounded-2xl p-6 shadow-2xl">
        <h1 className="text-white text-3xl font-bold mb-2">Tạo lô hàng mới</h1>
        <p className="text-white/70 text-lg">
          Tạo lô hàng và thêm các kiện hàng vào lô.
        </p>
      </div>

      {/* Step 1: Create Shipment */}
      {!shipmentCreated ? (
        <div className="backdrop-blur-xl bg-gray-400/20 border border-white/10 rounded-2xl p-6 shadow-2xl">
          <h2 className="text-white text-xl font-semibold mb-6 flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Bước 1: Nhập ngày nhập lô hàng
          </h2>
          <div className="max-w-md">
            <GlassInput
              type="date"
              value={shipmentDate}
              onChange={(e) => setShipmentDate(e.target.value)}
              label="Ngày nhập lô hàng"
            />
            <div className="mt-6">
              <GlassButton
                onClick={handleCreateShipment}
                disabled={!shipmentDate}
                variant="primary"
                fullWidth
              >
                <Package className="h-4 w-4" />
                Tạo lô hàng
              </GlassButton>
            </div>
          </div>
        </div>
      ) : (
        <div className="backdrop-blur-xl bg-blue-500/20 border border-blue-400/40 rounded-2xl p-6 shadow-2xl mb-6">
          <div className="flex items-center gap-3">
            <Package className="h-6 w-6 text-blue-200" />
            <div>
              <h3 className="text-blue-100 text-lg font-semibold">
                Lô hàng đã tạo thành công!
              </h3>
              <p className="text-blue-200/80">
                Mã lô:{" "}
                <span className="font-mono font-medium">{shipmentId}</span> |
                Ngày: <span className="font-medium">{shipmentDate}</span>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Step 2: Add Shipment Products */}
      {shipmentCreated && !isLoading && (
        <>
          <div className="backdrop-blur-xl bg-gray-400/20 border border-white/10 rounded-2xl p-6 shadow-2xl mb-6">
            <h2 className="text-white text-xl font-semibold mb-6 flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Bước 2: Đăng ký các kiện hàng bên trong lô
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="lg:col-span-2">
                <GlassSelect
                  options={products}
                  value={selectedProduct}
                  onChange={setSelectedProduct}
                  placeholder="Chọn sản phẩm..."
                  label="Sản phẩm"
                />
              </div>

              <GlassInput
                label="Số lượng"
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                placeholder="Nhập số lượng"
              />

              <GlassInput
                label="Giá nhập"
                type="number"
                value={buyPrice}
                onChange={(e) => setBuyPrice(Number(e.target.value))}
                placeholder="Nhập giá nhập"
              />

              <GlassInput
                label="Ngày sản xuất"
                type="date"
                value={mfgDate}
                onChange={(e) => setMfgDate(e.target.value)}
              />

              <GlassInput
                label="Ngày hết hạn"
                type="date"
                value={expDate}
                onChange={(e) => setExpDate(e.target.value)}
              />

              <div className="lg:col-span-2">
                <GlassButton
                  onClick={handleAddShipmentProduct}
                  variant="success"
                  fullWidth
                >
                  <Plus className="h-4 w-4" />
                  Thêm Gói Hàng
                </GlassButton>
              </div>
            </div>
          </div>

          {/* Shipment Products List */}
          {shipmentProducts.length > 0 && (
            <div className="mb-6">
              <div className="backdrop-blur-xl bg-blue-400/20 border border-white/10 rounded-2xl p-6 shadow-2xl mb-4">
                <h3 className="text-white text-lg font-semibold">
                  Các Gói Hàng đã nhập ({shipmentProducts.length})
                </h3>
              </div>

              {shipmentProducts.map((sp, index) => (
                <ShipmentProductCard
                  key={index}
                  product={getProductDetails(sp.productId)}
                  shipmentProduct={sp}
                  onDelete={() => {
                    const filtered = shipmentProducts.filter(
                      (_, i) => i !== index
                    );
                    setShipmentProducts(filtered);
                  }}
                  onEdit={(newData) => {
                    const updated = [...shipmentProducts];
                    updated[index] = newData;
                    setShipmentProducts(updated);
                  }}
                />
              ))}
            </div>
          )}

          {/* Submit Button */}
          <div className="flex justify-end">
            <GlassButton
              onClick={handleSubmitAll}
              disabled={shipmentProducts.length === 0}
              variant="primary"
              size="lg"
            >
              <Check className="h-5 w-5" />
              Xác nhận Tạo Lô Hàng
            </GlassButton>
          </div>
        </>
      )}
    </div>
  );
};

export default CreateShipment;
