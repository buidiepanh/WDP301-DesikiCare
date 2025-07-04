import type React from "react";

import { useEffect, useState } from "react";
import { CircularProgress } from "@mui/material";
import {
  ChevronDown,
  ChevronUp,
  Calendar,
  SortAsc,
  SortDesc,
  Plus,
} from "lucide-react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-theme-alpine.css";
import "@/styles/ag-grid-glassmophorism.css";
import { useNavigate } from "react-router-dom";
import type { ShipmentType, ShipmentProductDetails } from "../../data/types";
import { ShipmentProductEditPopup } from "./ShipmentProductEditPopup";
import Swal from "sweetalert2";
import { callAPIManager } from "../../api/axiosInstace";

// Custom Glassmorphism Components
const GlassChip = ({
  label,
  variant = "default",
}: {
  label: string;
  variant?: "success" | "error" | "default";
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case "success":
        return "bg-emerald-500/20 border-emerald-400/40 text-emerald-100";
      case "error":
        return "bg-red-500/20 border-red-400/40 text-red-100";
      default:
        return "bg-slate-500/20 border-slate-400/40 text-slate-100";
    }
  };

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium backdrop-blur-sm border shadow-lg ${getVariantStyles()}`}
      style={{ backdropFilter: "blur(8px)" }}
    >
      {label}
    </span>
  );
};

const GlassInput = ({
  placeholder,
  value,
  onChange,
  type = "text",
  label,
}: {
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  label?: string;
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
      className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-white/50 focus:border-white/40 focus:ring-2 focus:ring-white/20 backdrop-blur-sm transition-all duration-200"
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
}: {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "success" | "warning" | "error";
  disabled?: boolean;
  size?: "sm" | "md" | "lg";
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
        return "px-6 py-3 text-lg";
      default:
        return "px-4 py-2 text-base";
    }
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${getVariantStyles()} ${getSizeStyles()} border rounded-lg font-medium backdrop-blur-sm transition-all duration-200 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed`}
      style={{ backdropFilter: "blur(8px)" }}
    >
      {children}
    </button>
  );
};

const GlassAccordion = ({
  title,
  children,
  defaultExpanded = false,
}: {
  title: string;
  children: React.ReactNode;
  defaultExpanded?: boolean;
}) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  return (
    <div className="backdrop-blur-xl bg-gray-400/20 border border-white/10 rounded-2xl shadow-2xl mb-4 overflow-hidden">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-4 flex items-center justify-between text-left hover:bg-white/5 transition-all duration-200"
      >
        <h3 className="text-white font-semibold text-lg">{title}</h3>
        {isExpanded ? (
          <ChevronUp className="h-5 w-5 text-white/70" />
        ) : (
          <ChevronDown className="h-5 w-5 text-white/70" />
        )}
      </button>
      {isExpanded && (
        <div className="p-4 border-t border-white/10">{children}</div>
      )}
    </div>
  );
};

const Shipment = () => {
  // STATES
  const [shipments, setShipments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedShipment, setSelectedShipment] = useState<ShipmentType | null>(
    null
  );
  const [selectedShipmentProduct, setSelectedShipmentProduct] =
    useState<ShipmentProductDetails | null>(null);
  const [showShipmentProductEditPopup, setShowShipmentProductEditPopup] =
    useState(false);
  const [showShipmentEditPopup, setShowShipmentEditPopup] = useState(false);
  const [newShipmentDate, setNewShipmentDate] = useState("");
  const [filterShipments, setFilterShipments] = useState<any[] | null>(null);

  const [filterStartDate, setFilterStartDate] = useState("");
  const [filterEndDate, setFilterEndDate] = useState("");
  const [searchKeyword, setSearchKeyword] = useState("");

  // HOOKS
  const navigate = useNavigate();

  useEffect(() => {
    fetchShipments();
  }, []);

  // FUNCTIONS
  const fetchShipments = async () => {
    setIsLoading(true);
    try {
      const response = await callAPIManager({
        method: "GET",
        url: `/api/Product/shipments`,
      });
      if (response && response.status === 200) {
        console.log("Shipments: ", response.data.shipments);
        setShipments(response.data.shipments);
        setFilterShipments(response.data.shipments);
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Lỗi fetch shipments:", error);
    }
  };

  const handleFilterDateShipments = () => {
    setIsLoading(true);
    setTimeout(() => {
      if (filterStartDate !== "" && filterEndDate !== "") {
        const from = new Date(filterStartDate);
        const to = new Date(filterEndDate);
        const filteredShipments = shipments.filter(
          (shipment) =>
            new Date(shipment.shipment.shipmentDate) >= from &&
            new Date(shipment.shipment.shipmentDate) <= to
        );
        setFilterShipments(filteredShipments);
        setIsLoading(false);
      }
    }, 100);
  };

  const handleResetFilterDate = () => {
    setIsLoading(true);
    setTimeout(() => {
      setFilterEndDate("");
      setFilterStartDate("");
      setSearchKeyword("");
      setFilterShipments(shipments);
      setIsLoading(false);
    }, 100);
  };

  const handleSortShipment = (sortType: number) => {
    setIsLoading(true);
    setTimeout(() => {
      const source = filterShipments ?? shipments;
      const cloned = [...source];
      const sorted =
        sortType > 0
          ? cloned.sort(
              (a, b) =>
                new Date(b.shipment.shipmentDate).getTime() -
                new Date(a.shipment.shipmentDate).getTime()
            )
          : cloned.sort(
              (a, b) =>
                new Date(a.shipment.shipmentDate).getTime() -
                new Date(b.shipment.shipmentDate).getTime()
            );
      setFilterShipments(sorted);
      setIsLoading(false);
    }, 100);
  };

  const handleSearchProducts = (keyword: string) => {
    setSearchKeyword(keyword);
    const filtered = shipments.filter((s) =>
      s.shipmentProducts.some((sp: any) =>
        sp.product.name.toLowerCase().includes(keyword.toLowerCase())
      )
    );
    setFilterShipments(filtered);
  };

  const handleDeleteShipment = async (id: string) => {
    // Implementation for handleDeleteShipment
    console.log("Delete shipment with ID:", id);
  };

  const handleEditShipment = async (id: string) => {
    // Implementation for handleEditShipment
    console.log("Edit shipment with ID:", id);
  };

  const handleSubmitEditShipment = async () => {
    // Implementation for handleSubmitEditShipment
    console.log("Submit edit shipment");
  };

  const handleEditShipmentProduct = async (id: string) => {
    try {
      const response = await callAPIManager({
        method: "GET",
        url: `/api/Product/shipmentProducts/${id}`,
      });
      if (response && response.status === 200) {
        setSelectedShipmentProduct(response.data);
        setShowShipmentProductEditPopup(true);
      } else {
        Swal.fire("Lỗi", "Lỗi khi lấy chi tiết kiện hàng", "error");
      }
    } catch (error) {
      console.log("Lỗi khi get shipment product details: ", error);
    }
  };

  const onCloseShipmentProductEditPopup = () => {
    setSelectedShipmentProduct(null);
    setShowShipmentProductEditPopup(false);
  };

  const onSubmitShipmentProductEdit = async (formData: any) => {
    try {
      const response = await callAPIManager({
        method: "PUT",
        url: `/api/Product/shipmentProducts/${selectedShipmentProduct?.shipmentProduct._id}`,
        data: formData,
      });
      if (response && response.status === 200) {
        Swal.fire("Thành công", "Update Kiện hàng thành công", "success");
      } else {
        Swal.fire("Lỗi", "Không thể Update Kiện hàng", "error");
      }
    } catch (error) {
      console.log("Lỗi ở Edit ShipmentProduct: ", error);
    } finally {
      setSelectedShipmentProduct(null);
      setShowShipmentProductEditPopup(false);
      fetchShipments();
    }
  };

  const handleDeactivateShipmentProduct = async (id: string) => {
    Swal.fire({
      title: "Xác nhận thao tác này ?",
      text: "Confirm your action",
      icon: "info",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes!",
    }).then(async (result: any) => {
      if (result.isConfirmed) {
        await confirmDeactivateShipmentProduct(id);
      }
    });
  };

  const confirmDeactivateShipmentProduct = async (id: string) => {
    let status = false;
    let message = "";
    try {
      const response = await callAPIManager({
        method: "GET",
        url: `/api/Product/shipmentProducts/${id}`,
      });
      if (response && response.status === 200) {
        status = response.data.shipmentProduct.isDeactivated;
        message = status
          ? "Kích hoạt kiện hàng thành công"
          : "Vô hiệu hóa kiện hàng thành công";
        try {
          const responseInner = await callAPIManager({
            method: "PUT",
            url: `/api/Product/shipmentProducts/${id}/deactivate/${!status}`,
          });
          if (responseInner && responseInner.status === 200) {
            Swal.fire("Thành công", `${message}`, "success");
          } else {
            Swal.fire("Lỗi", `${message}`, "error");
          }
        } catch (error) {
          console.log("Lỗi chỗ kích hoạt/vô hiệu shipmentProduct: ", error);
        } finally {
          fetchShipments();
        }
      } else {
        Swal.fire("Lỗi", "Lỗi khi lấy chi tiết kiện hàng", "error");
      }
    } catch (error) {
      console.log("Lỗi khi get shipment product details: ", error);
    }
  };

  const getShipmentProductColumnDefs = () => [
    {
      headerName: "ID",
      field: "shipmentProduct._id",
      cellStyle: {
        color: "rgba(255, 255, 255, 0.9)",
        background: "transparent !important",
        fontFamily: "monospace",
      },
    },
    {
      headerName: "Mã SP",
      field: "product._id",
      cellStyle: {
        color: "rgba(255, 255, 255, 0.9)",
        background: "transparent !important",
        fontFamily: "monospace",
      },
    },
    {
      headerName: "Mã Lô",
      field: "shipmentProduct.shipmentId",
      cellStyle: {
        color: "rgba(255, 255, 255, 0.9)",
        background: "transparent !important",
      },
    },
    {
      headerName: "SL Nhập",
      field: "shipmentProduct.quantity",
      cellStyle: {
        color: "rgba(255, 255, 255, 0.9)",
        background: "transparent !important",
        fontWeight: "500",
      },
    },
    {
      headerName: "Manufacturing",
      field: "shipmentProduct.manufacturingDate",
      valueFormatter: (p: any) => new Date(p.value).toLocaleDateString("vi-VN"),
      cellStyle: {
        color: "rgba(255, 255, 255, 0.8)",
        background: "transparent !important",
      },
    },
    {
      headerName: "Expire Date",
      field: "shipmentProduct.expiryDate",
      valueFormatter: (p: any) => new Date(p.value).toLocaleDateString("vi-VN"),
      cellStyle: {
        color: "rgba(255, 255, 255, 0.8)",
        background: "transparent !important",
      },
    },
    {
      headerName: "Trạng thái",
      field: "shipmentProduct.isDeactivated",
      cellRenderer: (params: any) => (
        <div className="h-full w-full flex items-center">
          <GlassChip
            label={params.value ? "Deactive" : "Active"}
            variant={params.value ? "error" : "success"}
          />
        </div>
      ),
      cellStyle: {
        background: "transparent !important",
      },
    },
    {
      headerName: "Thao tác",
      cellRenderer: (params: any) => (
        <div className="flex h-full gap-2 items-center">
          <button
            onClick={() =>
              handleEditShipmentProduct(params.data.shipmentProduct._id)
            }
            className="px-2 py-1 bg-blue-500/20 border border-blue-400/40 text-blue-200 hover:bg-blue-500/30 transition-all duration-200 backdrop-blur-sm rounded text-xs font-medium"
          >
            Edit
          </button>
          <button
            onClick={() =>
              handleDeactivateShipmentProduct(params.data.shipmentProduct._id)
            }
            className="px-2 py-1 bg-amber-500/20 border border-amber-400/40 text-amber-200 hover:bg-amber-500/30 transition-all duration-200 backdrop-blur-sm rounded text-xs font-medium"
          >
            {params.data.shipmentProduct.isDeactivated
              ? "Kích hoạt"
              : "Vô hiệu hóa"}
          </button>
        </div>
      ),
      cellStyle: {
        background: "transparent !important",
      },
    },
  ];

  return (
    <div className="w-full flex flex-col p-0">
      {/* Header Section */}
      <div className="mb-8 backdrop-blur-xl bg-gray-400/20 border border-white/10 rounded-2xl p-6 shadow-2xl">
        <h1 className="text-white text-3xl font-bold mb-2">Shipment Page</h1>
        <p className="text-white/70 text-lg">
          Quản lý lô hàng, kho của trang web.
        </p>
      </div>

      {/* Create Button */}
      <div className="mb-6 flex items-center justify-end">
        <GlassButton
          onClick={() => navigate("/Shipments/create")}
          variant="primary"
        >
          Tạo Lô Hàng Mới
        </GlassButton>
      </div>

      {/* Filter Section */}
      <div className="backdrop-blur-xl bg-gray-400/20 border border-white/10 rounded-2xl p-6 shadow-2xl mb-6">
        <h3 className="text-white font-semibold mb-4">Bộ lọc và tìm kiếm</h3>

        {/* Search */}
        <div className="mb-4">
          <GlassInput
            placeholder="Tìm theo tên sản phẩm..."
            value={searchKeyword}
            onChange={(e) => handleSearchProducts(e.target.value)}
            label="Tìm kiếm sản phẩm"
          />
        </div>

        {/* Date Filter */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="flex gap-4 items-end">
            <GlassInput
              type="date"
              value={filterStartDate}
              onChange={(e) => setFilterStartDate(e.target.value)}
              label="Từ ngày"
            />
            <GlassInput
              type="date"
              value={filterEndDate}
              onChange={(e) => setFilterEndDate(e.target.value)}
              label="Đến ngày"
            />
            <GlassButton
              onClick={handleFilterDateShipments}
              disabled={filterEndDate === "" || filterStartDate === ""}
              variant="primary"
            >
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4 mr-2" />
                Filter
              </div>
            </GlassButton>
            <GlassButton onClick={handleResetFilterDate} variant="secondary">
              Reset
            </GlassButton>
          </div>

          {/* Sort Buttons */}
          <div className="flex items-end justify-end gap-2">
            <GlassButton
              onClick={() => handleSortShipment(1)}
              variant="secondary"
            >
              <div className="flex items-center gap-1">
                <SortDesc className="h-4 w-4 mr-2" />
                Mới nhất
              </div>
            </GlassButton>
            <GlassButton
              onClick={() => handleSortShipment(-1)}
              variant="secondary"
            >
              <div className="flex items-center gap-1">
                <SortAsc className="h-4 w-4 mr-2" />
                Cũ nhất
              </div>
            </GlassButton>
          </div>
        </div>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="w-full flex justify-center py-20">
          <div className="backdrop-blur-xl bg-black/20 border border-white/20 rounded-2xl p-8">
            <CircularProgress sx={{ color: "rgba(255, 255, 255, 0.8)" }} />
            <p className="text-white/80 mt-4 text-center">
              Đang tải dữ liệu...
            </p>
          </div>
        </div>
      ) : filterShipments?.length === 0 ? (
        <div className="backdrop-blur-xl bg-black/20 border border-white/10 rounded-2xl p-8 shadow-2xl text-center">
          <p className="text-white/70 text-lg">Không có lô hàng nào.</p>
        </div>
      ) : (
        filterShipments?.map((item) => (
          <GlassAccordion
            key={item.shipment._id}
            title={`Lô nhập ngày: ${new Date(
              item.shipment.shipmentDate
            ).toLocaleDateString("vi-VN")} – ${
              item.shipmentProducts.length
            } gói hàng`}
          >
            <div
              className="ag-theme-alpine w-full mb-4"
              style={
                {
                  height: "250px",
                  "--ag-background-color": "transparent",
                  "--ag-foreground-color": "rgba(255, 255, 255, 0.9)",
                  "--ag-border-color": "rgba(255, 255, 255, 0.1)",
                } as any
              }
            >
              <AgGridReact
                rowData={item.shipmentProducts}
                columnDefs={getShipmentProductColumnDefs()}
                pagination={true}
                rowHeight={40}
                paginationPageSize={5}
                domLayout="autoHeight"
              />
            </div>

            {/* Shipment Actions */}
            <div className="flex justify-end gap-2 pt-4 border-white/10">
              <GlassButton
                onClick={() => handleDeleteShipment(item.shipment._id)}
                variant={item.shipment.isDeleted ? "success" : "warning"}
              >
                {item.shipment.isDeleted ? "Kích hoạt" : "Vô hiệu hóa"}
              </GlassButton>
              <GlassButton
                onClick={() => handleEditShipment(item.shipment._id)}
                variant="secondary"
              >
                Sửa lô hàng
              </GlassButton>
            </div>
          </GlassAccordion>
        ))
      )}

      {/* Modals */}
      {showShipmentProductEditPopup && selectedShipmentProduct && (
        <ShipmentProductEditPopup
          open={showShipmentProductEditPopup}
          shipmentProduct={selectedShipmentProduct}
          onClose={onCloseShipmentProductEditPopup}
          onSubmit={onSubmitShipmentProductEdit}
        />
      )}

      {showShipmentEditPopup && selectedShipment && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="backdrop-blur-xl bg-black/40 border border-white/20 rounded-2xl p-6 shadow-2xl max-w-md w-full mx-4">
            <h3 className="text-white text-xl font-semibold mb-4">
              Chỉnh sửa lô hàng
            </h3>
            <GlassInput
              type="date"
              value={newShipmentDate}
              onChange={(e) => setNewShipmentDate(e.target.value)}
              label="Ngày nhập lô hàng"
            />
            <div className="flex justify-end gap-2 mt-6">
              <GlassButton
                onClick={() => setShowShipmentEditPopup(false)}
                variant="secondary"
              >
                Hủy
              </GlassButton>
              <GlassButton onClick={handleSubmitEditShipment} variant="primary">
                Lưu
              </GlassButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Shipment;
