"use client";

import { CircularProgress } from "@mui/material";
import { useEffect, useState } from "react";
import { AgGridReact } from "ag-grid-react";
import type { ColDef } from "ag-grid-community";
import "ag-grid-community/styles/ag-theme-alpine.css";
import "@/styles/ag-grid-glassmophorism.css";
import { ProductDetailPopup } from "./ProductDetailPopup";
import {
  categoriesData,
  skinStatusesData,
  skinTypesData,
} from "../../data/mockData";
import { ProductEditPopup } from "./ProductEditPopup";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";
import type { ProductAPI, SkinStatus, SkinType } from "../../data/types";
import { callAPIManager } from "../../api/axiosInstace";

// Custom Glassmorphism Chip Component - FORCE dark theme
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
        return "bg-emerald-500/20 border-emerald-400/40 text-emerald-100 shadow-lg";
      case "error":
        return "bg-red-500/20 border-red-400/40 text-red-100 shadow-lg";
      default:
        return "bg-slate-500/20 border-slate-400/40 text-slate-100 shadow-lg";
    }
  };

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium backdrop-blur-sm border mr-1 mb-1 ${getVariantStyles()}`}
      style={{
        backdropFilter: "blur(8px)",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
      }}
    >
      {label}
    </span>
  );
};

const Products = () => {
  // STATES
  const [products, setProducts] = useState<ProductAPI[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedProduct, setSelectedProduct] = useState<ProductAPI | null>(
    null
  );
  const [showDetailPopup, setShowDetailPopup] = useState(false);
  const [showEditPopup, setShowEditPopup] = useState(false);

  // HOOKS
  useEffect(() => {
    fetchAPI();
  }, []);

  // FUNCTIONS
  const fetchAPI = async () => {
    setIsLoading(true);
    try {
      const response = await callAPIManager({
        method: "GET",
        url: "/api/Product/products",
      });
      if (response && response.status === 200) {
        setProducts(response.data.products);
        setIsLoading(false);
      } else {
        Swal.fire("Lỗi!", "Không thể fetching Products", "error");
      }
    } catch (error) {
      console.error("Loi fetch:", error);
    }
  };

  const columnDefs: ColDef[] = [
    {
      headerName: "Ảnh",
      field: "product.imageUrl",
      cellRenderer: (params: any) => {
        // Replace old ngrok URL with new one
        let imageUrl = params.value;
        if (
          imageUrl &&
          imageUrl.includes("9068-104-28-205-73.ngrok-free.app")
        ) {
          imageUrl = imageUrl.replace(
            "https://9068-104-28-205-73.ngrok-free.app",
            "https://a555-116-110-42-126.ngrok-free.app"
          );
        }

        return (
          <div className="flex items-center justify-center p-2">
            <img
              src={
                imageUrl ||
                "https://i.pinimg.com/736x/bf/b2/15/bfb2154f0173a6d4499896d1a56b19d0.jpg"
              }
              alt="product"
              className="w-20 h-20 object-cover rounded-lg border border-white/30 shadow-lg"
              style={{
                backdropFilter: "blur(4px)",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
              }}
            />
          </div>
        );
      },
      cellStyle: {
        background: "transparent !important",
        padding: "8px",
      },
    },
    {
      headerName: "ID",
      field: "product._id",
      filter: true,
      cellStyle: {
        color: "rgba(255, 255, 255, 0.9)",
        background: "transparent !important",
        fontFamily: "monospace",
      },
    },
    {
      headerName: "Tên",
      field: "product.name",
      filter: true,
      cellStyle: {
        color: "rgba(255, 255, 255, 0.95)",
        fontWeight: "500",
        background: "transparent !important",
      },
    },
    {
      headerName: "Giá bán",
      field: "product.salePrice",
      valueFormatter: (params: any) =>
        params.value.toLocaleString("vi-VN", {
          style: "currency",
          currency: "VND",
        }),
      sortable: true,
      cellStyle: {
        color: "rgba(255, 255, 255, 0.9)",
        fontWeight: "600",
        background: "transparent !important",
      },
    },
    {
      headerName: "Dung tích",
      field: "product.volume",
      valueFormatter: (params: any) => `${params.value} ml`,
      cellStyle: {
        color: "rgba(255, 255, 255, 0.8)",
        background: "transparent !important",
      },
    },
    {
      headerName: "Số lượng hiện có",
      field: "shipmentProducts",
      valueGetter: (params: any) => {
        if (
          !params.data.shipmentProducts ||
          params.data.shipmentProducts.length === 0
        ) {
          return 0;
        }

        return params.data.shipmentProducts.reduce(
          (totalQuantity: number, sp: any) => {
            // Chỉ tính những shipmentProduct không bị deactivated và shipment không bị deleted
            if (sp.shipmentProduct.isDeactivated || sp.shipment.isDeleted) {
              return totalQuantity;
            }

            const availableQuantity =
              (sp.shipmentProduct.importQuantity || 0) -
              (sp.shipmentProduct.saleQuantity || 0);
            return totalQuantity + Math.max(0, availableQuantity); // Đảm bảo không âm
          },
          0
        );
      },
      sortable: true,
      filter: "agNumberColumnFilter",
      valueFormatter: (params: any) => {
        const quantity = params.value;
        return quantity === 0 ? "Hết hàng" : `${quantity.toLocaleString()}`;
      },
      cellStyle: (params: any) => {
        const quantity = params.value;
        return {
          color:
            quantity === 0
              ? "rgba(239, 68, 68, 0.9)"
              : quantity < 10
              ? "rgba(251, 191, 36, 0.9)"
              : "rgba(34, 197, 94, 0.9)",
          fontWeight: "600",
          background: "transparent !important",
        };
      },
    },
    {
      headerName: "Tình trạng",
      field: "product.isDeactivated",
      cellRenderer: (params: any) => (
        <div className="flex items-center h-full">
          <GlassChip
            label={params.value ? "Không hoạt động" : "Đang bán"}
            variant={params.value ? "error" : "success"}
          />
        </div>
      ),
      filter: true,
      cellStyle: {
        background: "transparent !important",
        display: "flex",
        alignItems: "center",
      },
    },
    {
      headerName: "Loại da",
      field: "productSkinTypes",
      cellRenderer: (params: any) => (
        <div className="flex flex-wrap items-center h-full py-2">
          {params.value.map((st: SkinType) => (
            <GlassChip key={st._id} label={st.name} />
          ))}
        </div>
      ),
      filter: true,
      cellStyle: {
        background: "transparent !important",
      },
    },
    {
      headerName: "Tình trạng da",
      field: "productSkinStatuses",
      cellRenderer: (params: any) => (
        <div className="flex flex-wrap items-center h-full py-2">
          {params.value.map((ss: SkinStatus) => (
            <GlassChip key={ss._id} label={ss.name} />
          ))}
        </div>
      ),
      filter: true,
      cellStyle: {
        background: "transparent !important",
      },
    },
    {
      headerName: "Thao tác",
      field: "product._id",
      cellRenderer: (params: any) => (
        <div className="flex items-center gap-2 h-full">
          <button
            onClick={() => handleViewDetail(params.data.product._id)}
            className="px-3 py-1 text-xs rounded-lg bg-blue-500/20 border border-blue-400/40 text-blue-200 hover:bg-blue-500/30 transition-all duration-200 backdrop-blur-sm shadow-lg font-medium"
          >
            Details
          </button>
          <button
            onClick={() => handleEdit(params.data.product._id)}
            className="px-3 py-1 text-xs rounded-lg bg-amber-500/20 border border-amber-400/40 text-amber-200 hover:bg-amber-500/30 transition-all duration-200 backdrop-blur-sm shadow-lg font-medium"
          >
            Edit
          </button>
          <button
            onClick={() => handleToggleActivate(params.data.product._id)}
            className={`px-3 py-1 text-xs rounded-lg transition-all duration-200 backdrop-blur-sm shadow-lg font-medium ${
              params.data.product.isDeactivated
                ? "bg-emerald-500/20 border border-emerald-400/40 text-emerald-200 hover:bg-emerald-500/30"
                : "bg-red-500/20 border border-red-400/40 text-red-200 hover:bg-red-500/30"
            }`}
          >
            {params.data.product.isDeactivated ? "Active" : "Deactive"}
          </button>
        </div>
      ),
      cellStyle: {
        background: "transparent !important",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      },
    },
  ];

  const autoSizeAllColumns = (params: any) => {
    const allColumnIds: string[] = [];
    params.columnApi.getAllColumns()?.forEach((col: any) => {
      if (col.getColId()) allColumnIds.push(col.getColId());
    });
    params.columnApi.autoSizeColumns(allColumnIds, false);
  };

  const handleViewDetail = async (id: string) => {
    const product = products.filter((p) => p.product._id === id);
    setSelectedProduct(product[0]);
    setShowDetailPopup(true);
  };

  const onCloseDetailModal = () => {
    setSelectedProduct(null);
    setShowDetailPopup(false);
  };

  const handleEdit = (id: string) => {
    const product = products.filter((p) => p.product._id === id);
    setSelectedProduct(product[0]);
    setShowEditPopup(true);
  };

  const onCloseEditModal = () => {
    setSelectedProduct(null);
    setShowEditPopup(false);
  };

  const onSubmitEditProduct = async (formData: any) => {
    const productId = selectedProduct?.product._id;
    if (!productId) return;

    try {
      const response = await callAPIManager({
        method: "PUT",
        url: `/api/Product/products/${productId}`,
        data: formData,
      });
      if (response && response.status === 200) {
        Swal.fire(
          "Cập nhật thành công",
          `Đã cập nhật sản phẩm với id: ${productId}`,
          "success"
        );
      } else {
        Swal.fire("Lỗi", "Không thể cập nhật sản phẩm", "error");
      }
      onCloseEditModal();
      fetchAPI();
    } catch (err) {
      console.error("❌ Lỗi khi cập nhật sản phẩm:", err);
    }
  };

  const handleToggleActivate = async (id: string) => {
    const product = products.filter((p) => p.product._id === id);
    const isDeactivate = product[0].product.isDeactivated;

    Swal.fire({
      title: isDeactivate
        ? "Bạn có muốn kích hoạt sản phẩm?"
        : "Bạn có muốn vô hiệu hóa sản phẩm?",
      text: "Confirm your action",
      icon: isDeactivate ? "info" : "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, deactivate it!",
    }).then(async (result: any) => {
      if (result.isConfirmed) {
        if (isDeactivate) {
          await confirmToggleActivate(id, false);
        } else {
          await confirmToggleActivate(id, true);
        }
        fetchAPI();
      }
    });
  };

  const confirmToggleActivate = async (id: string, boolean: boolean) => {
    try {
      const response = await callAPIManager({
        method: "PUT",
        url: `/api/Product/products/${id}/deactivate/${boolean}`,
      });
      if (response && response.status === 200) {
        const check = boolean ? "Vô hiệu hóa" : "Kích hoạt";
        Swal.fire("Thành công", `Đã ${check} sản phẩm thành công`, "success");
      }
    } catch (error) {}
  };

  return (
    <div className="w-full flex flex-col p-0">
      {/* Header Section */}
      <div className="mb-8 backdrop-blur-xl bg-gray-400/20 border border-white/10 rounded-2xl p-6 shadow-2xl">
        <h1 className="text-white text-3xl font-bold mb-2">Manage Products</h1>
        <p className="text-white/70 text-lg">Quản lý sản phẩm của hệ thống.</p>
      </div>

      {/* Action Button */}
      <div className="mb-6 flex items-center justify-end">
        <Link to="/Products/create">
          <button className="px-6 py-3 bg-blue-200/20 border border-blue-400/40 text-white rounded-xl hover:bg-blue-500/30 transition-all duration-200 backdrop-blur-sm font-medium shadow-lg">
            Tạo sản phẩm mới
          </button>
        </Link>
      </div>

      {/* Data Grid Container */}
      <div className="backdrop-blur-xl bg-gray-400/20 border border-white/10 rounded-2xl p-4 shadow-2xl">
        <div
          className="ag-theme-alpine w-full"
          style={
            {
              width: "100%",
              height: "100%",
              minHeight: "500px",
              "--ag-background-color": "transparent",
              "--ag-foreground-color": "rgba(255, 255, 255, 0.9)",
              "--ag-border-color": "rgba(255, 255, 255, 0.1)",
            } as any
          }
        >
          {isLoading ? (
            <div className="w-full h-full flex items-center justify-center py-20">
              <div className="backdrop-blur-xl bg-black/20 border border-white/20 rounded-2xl p-8">
                <CircularProgress sx={{ color: "rgba(255, 255, 255, 0.8)" }} />
                <p className="text-white/80 mt-4 text-center">
                  Đang tải dữ liệu...
                </p>
              </div>
            </div>
          ) : (
            <AgGridReact
              rowHeight={120}
              rowData={products}
              columnDefs={columnDefs}
              domLayout="autoHeight"
              onGridReady={autoSizeAllColumns}
              animateRows={true}
              pagination={true}
              paginationPageSize={4}
              enableCellTextSelection={true}
              ensureDomOrder={true}
              suppressCopyRowsToClipboard={false}
              enableRangeSelection={true}
              enableRangeHandle={true}
              enableFillHandle={true}
              copyHeadersToClipboard={true}
            />
          )}
        </div>
      </div>

      {/* Modals */}
      {showDetailPopup && selectedProduct && (
        <ProductDetailPopup
          product={selectedProduct as any}
          onClose={onCloseDetailModal}
        />
      )}

      {showEditPopup && selectedProduct && (
        <ProductEditPopup
          open={showEditPopup}
          onClose={onCloseEditModal}
          onSubmit={onSubmitEditProduct}
          product={{
            ...selectedProduct.product,
            productSkinTypes: selectedProduct.productSkinTypes,
            productSkinStatuses: selectedProduct.productSkinStatuses,
          }}
          categories={categoriesData}
          skinTypes={skinTypesData}
          skinStatuses={skinStatusesData}
        />
      )}
    </div>
  );
};

export default Products;
