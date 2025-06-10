import { CircularProgress, Chip, IconButton, Button } from "@mui/material";
import { useCallback, useEffect, useMemo, useState } from "react";
import { AgGridReact } from "ag-grid-react";
// import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { Delete, Edit, Visibility } from "@mui/icons-material";
import BlockIcon from "@mui/icons-material/Block";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import { ProductDetailPopup } from "./ProductDetailPopup";
import {
  categoriesData,
  productsData,
  skinStatusesData,
  skinTypesData,
} from "../../data/mockData";
import { ProductEditPopup } from "./ProductEditPopup";
import Swal from "sweetalert2";
import { Link, useNavigate } from "react-router-dom";
import type { ProductAPI, SkinStatus, SkinType } from "../../data/types";
import { callAPIManager } from "../../api/axiosInstace";
import { token } from "../../api/token";

const data = [
  {
    product: {
      _id: "p1",
      categoryId: 1,
      name: "Hydrating Cleanser",
      description: "A gentle cleanser for daily use.",
      volume: 150,
      salePrice: 250000,
      isDeactivated: false,
      createdAt: "2025-06-05T01:03:33.421Z",
      updatedAt: "2025-06-05T01:03:33.421Z",
      imageUrl:
        "https://i.pinimg.com/736x/45/e8/ad/45e8ade79968a9223b43e1ce177245fc.jpg",
    },
    shipmentProducts: [
      {
        shipment: {
          _id: "s1",
          shipmentDate: "2025-06-01",
          createdAt: "2025-06-01T10:00:00.000Z",
          updatedAt: "2025-06-01T10:00:00.000Z",
        },
        shipmentProduct: {
          _id: "sp1",
          productId: "p1",
          shipmentId: "s1",
          quantity: 100,
          manufacturingDate: "2025-05-01",
          expiryDate: "2027-05-01",
          buyPrice: 150000,
          createdAt: "2025-06-01T10:00:00.000Z",
          updatedAt: "2025-06-01T10:00:00.000Z",
        },
      },
    ],
    productSkinTypes: [
      {
        _id: 1,
        name: "Dry Skin",
      },
    ],
    productSkinStatuses: [
      {
        _id: 1,
        name: "Sensitive",
      },
    ],
  },
  {
    product: {
      _id: "p2",
      categoryId: 2,
      name: "Oil-Free Moisturizer",
      description: "Lightweight moisturizer for oily skin.",
      volume: 100,
      salePrice: 320000,
      isDeactivated: false,
      createdAt: "2025-06-05T01:03:33.421Z",
      updatedAt: "2025-06-05T01:03:33.421Z",
      imageUrl:
        "https://i.pinimg.com/736x/7b/89/e3/7b89e30e2a80726c32d3c7fed63b6856.jpg",
    },
    shipmentProducts: [
      {
        shipment: {
          _id: "s2",
          shipmentDate: "2025-05-25",
          createdAt: "2025-05-25T09:30:00.000Z",
          updatedAt: "2025-05-25T09:30:00.000Z",
        },
        shipmentProduct: {
          _id: "sp2",
          productId: "p2",
          shipmentId: "s2",
          quantity: 150,
          manufacturingDate: "2025-04-20",
          expiryDate: "2027-04-20",
          buyPrice: 180000,
          createdAt: "2025-05-25T09:30:00.000Z",
          updatedAt: "2025-05-25T09:30:00.000Z",
        },
      },
    ],
    productSkinTypes: [
      {
        _id: 2,
        name: "Oily Skin",
      },
    ],
    productSkinStatuses: [
      {
        _id: 2,
        name: "Acne-Prone",
      },
    ],
  },
  {
    product: {
      _id: "p3",
      categoryId: 3,
      name: "Vitamin C Serum",
      description: "Brightens and evens out skin tone.",
      volume: 30,
      salePrice: 450000,
      isDeactivated: false,
      createdAt: "2025-06-05T01:03:33.421Z",
      updatedAt: "2025-06-05T01:03:33.421Z",
      imageUrl:
        "https://i.pinimg.com/736x/cd/e7/57/cde7577c542140868d776dca0e9b2def.jpg",
    },
    shipmentProducts: [
      {
        shipment: {
          _id: "s3",
          shipmentDate: "2025-05-15",
          createdAt: "2025-05-15T11:00:00.000Z",
          updatedAt: "2025-05-15T11:00:00.000Z",
        },
        shipmentProduct: {
          _id: "sp3",
          productId: "p3",
          shipmentId: "s3",
          quantity: 80,
          manufacturingDate: "2025-03-30",
          expiryDate: "2027-03-30",
          buyPrice: 270000,
          createdAt: "2025-05-15T11:00:00.000Z",
          updatedAt: "2025-05-15T11:00:00.000Z",
        },
      },
    ],
    productSkinTypes: [
      {
        _id: 3,
        name: "Normal Skin",
      },
    ],
    productSkinStatuses: [
      {
        _id: 3,
        name: "Dull",
      },
    ],
  },
  {
    product: {
      _id: "p4",
      categoryId: 4,
      name: "Exfoliating Toner",
      description: "Gently removes dead skin cells.",
      volume: 120,
      salePrice: 280000,
      isDeactivated: false,
      createdAt: "2025-06-05T01:03:33.421Z",
      updatedAt: "2025-06-05T01:03:33.421Z",
      imageUrl:
        "https://i.pinimg.com/736x/ee/b6/d5/eeb6d52183d304b815a31e05720ca5eb.jpg",
    },
    shipmentProducts: [
      {
        shipment: {
          _id: "s4",
          shipmentDate: "2025-05-10",
          createdAt: "2025-05-10T08:45:00.000Z",
          updatedAt: "2025-05-10T08:45:00.000Z",
        },
        shipmentProduct: {
          _id: "sp4",
          productId: "p4",
          shipmentId: "s4",
          quantity: 120,
          manufacturingDate: "2025-04-01",
          expiryDate: "2027-04-01",
          buyPrice: 160000,
          createdAt: "2025-05-10T08:45:00.000Z",
          updatedAt: "2025-05-10T08:45:00.000Z",
        },
      },
    ],
    productSkinTypes: [
      {
        _id: 4,
        name: "Combination Skin",
      },
    ],
    productSkinStatuses: [
      {
        _id: 4,
        name: "Uneven Texture",
      },
    ],
  },
  {
    product: {
      _id: "p5",
      categoryId: 5,
      name: "Night Repair Cream",
      description: "Deeply nourishes skin overnight.",
      volume: 50,
      salePrice: 390000,
      isDeactivated: false,
      createdAt: "2025-06-05T01:03:33.421Z",
      updatedAt: "2025-06-05T01:03:33.421Z",
      imageUrl:
        "https://down-vn.img.susercontent.com/file/4111dcf10173cfe0c75ae22766890dfe@resize_w900_nl.webp",
    },
    shipmentProducts: [
      {
        shipment: {
          _id: "s5",
          shipmentDate: "2025-05-05",
          createdAt: "2025-05-05T07:00:00.000Z",
          updatedAt: "2025-05-05T07:00:00.000Z",
        },
        shipmentProduct: {
          _id: "sp5",
          productId: "p5",
          shipmentId: "s5",
          quantity: 90,
          manufacturingDate: "2025-03-15",
          expiryDate: "2027-03-15",
          buyPrice: 230000,
          createdAt: "2025-05-05T07:00:00.000Z",
          updatedAt: "2025-05-05T07:00:00.000Z",
        },
      },
    ],
    productSkinTypes: [
      {
        _id: 5,
        name: "All Skin Types",
      },
    ],
    productSkinStatuses: [
      {
        _id: 5,
        name: "Aging",
      },
    ],
  },
  {
    product: {
      _id: "p6",
      categoryId: 1,
      name: "Advanced Repair Serum",
      description:
        "A multi-correctional serum for various skin types and issues.",
      volume: 40,
      salePrice: 520000,
      isDeactivated: false,
      createdAt: "2025-06-05T01:03:33.421Z",
      updatedAt: "2025-06-05T01:03:33.421Z",
      imageUrl:
        "https://i.pinimg.com/736x/58/de/80/58de801f931c1d2f1700cab288d91f96.jpg",
    },
    shipmentProducts: [
      {
        shipment: {
          _id: "s6",
          shipmentDate: "2025-05-30",
          createdAt: "2025-05-30T14:00:00.000Z",
          updatedAt: "2025-05-30T14:00:00.000Z",
        },
        shipmentProduct: {
          _id: "sp6",
          productId: "p6",
          shipmentId: "s6",
          quantity: 200,
          manufacturingDate: "2025-04-10",
          expiryDate: "2027-04-10",
          buyPrice: 310000,
          createdAt: "2025-05-30T14:00:00.000Z",
          updatedAt: "2025-05-30T14:00:00.000Z",
        },
      },
    ],
    productSkinTypes: [
      {
        _id: 1,
        name: "Dry Skin",
      },
      {
        _id: 2,
        name: "Oily Skin",
      },
      {
        _id: 3,
        name: "Normal Skin",
      },
      {
        _id: 4,
        name: "Combination Skin",
      },
    ],
    productSkinStatuses: [
      {
        _id: 1,
        name: "Sensitive",
      },
      {
        _id: 3,
        name: "Dull",
      },
      {
        _id: 4,
        name: "Uneven Texture",
      },
      {
        _id: 5,
        name: "Aging",
      },
    ],
  },
];

const Products = () => {
  // STATES
  const [products, setProducts] = useState<ProductAPI[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Handle Actions of Product
  const [selectedProduct, setSelectedProduct] = useState<ProductAPI | null>(
    null
  );
  const [showDetailPopup, setShowDetailPopup] = useState(false);
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [imgBase64, setImgBase64] = useState("");
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

  const columnDefs = [
    {
      headerName: "Ảnh",
      field: "product.imageUrl",
      cellRenderer: (params: any) => (
        <div className="flex items-center justify-center p-2">
          <img
            src={params.value}
            alt="product"
            style={{
              width: 100,
              height: 100,
              objectFit: "cover",
              borderRadius: 8,
              margin: "auto",
            }}
          />
        </div>
      ),
    },
    { headerName: "ID", field: "product._id", filter: true },
    { headerName: "Tên", field: "product.name", filter: true },
    {
      headerName: "Giá bán",
      field: "product.salePrice",
      valueFormatter: (params: any) =>
        params.value.toLocaleString("vi-VN", {
          style: "currency",
          currency: "VND",
        }),
      sortable: true,
    },
    {
      headerName: "Dung tích",
      field: "product.volume",
      valueFormatter: (params: any) => `${params.value} ml`,
    },
    {
      headerName: "Số lượng",
      field: "shipmentProducts",
      valueGetter: (params: any) =>
        params.data.shipmentProducts.reduce(
          (sum: number, sp: any) => sum + sp.shipmentProduct.quantity,
          0
        ),
      sortable: true,
    },
    {
      headerName: "Tình trạng",
      field: "product.isDeactivated",
      cellRenderer: (params: any) => (
        <Chip
          label={params.value ? "Không hoạt động" : "Đang bán"}
          color={params.value ? "error" : "success"}
          size="small"
        />
      ),
      filter: true,
    },
    {
      headerName: "Loại da",
      field: "productSkinTypes",
      cellRenderer: (params: any) => (
        <>
          {params.value.map((st: SkinType) => (
            <Chip key={st._id} label={st.name} size="small" className="mr-1" />
          ))}
        </>
      ),
      filter: true,
    },
    {
      headerName: "Tình trạng da",
      field: "productSkinStatuses",
      cellRenderer: (params: any) => (
        <>
          {params.value.map((ss: SkinStatus) => (
            <Chip key={ss._id} label={ss.name} size="small" className="mr-1" />
          ))}
        </>
      ),
      filter: true,
    },
    {
      headerName: "Thao tác",
      field: "product._id",
      cellRenderer: (params: any) => (
        <div>
          <IconButton
            onClick={() => handleViewDetail(params.data.product._id)}
            color="primary"
          >
            <Visibility fontSize="small" />
          </IconButton>
          <IconButton
            onClick={() => handleEdit(params.data.product._id)}
            color="info"
          >
            <Edit fontSize="small" />
          </IconButton>
          {params.data.product.isDeactivated ? (
            <IconButton
              onClick={() => handleToggleActivate(params.data.product._id)}
              color="error"
            >
              <CheckBoxIcon color="primary" fontSize="small" />
            </IconButton>
          ) : (
            <IconButton
              onClick={() => handleToggleActivate(params.data.product._id)}
              color="error"
            >
              <BlockIcon fontSize="small" />
            </IconButton>
          )}
        </div>
      ),
    },
  ];

  const autoSizeAllColumns = (params: GridReadyEvent) => {
    const allColumnIds: string[] = [];
    params.columnApi.getAllColumns()?.forEach((col) => {
      if (col.getColId()) allColumnIds.push(col.getColId());
    });
    params.columnApi.autoSizeColumns(allColumnIds, false);
  };

  const handleViewDetail = async (id: string) => {
    // Call API Right Here To Get Product Details
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
      fetchAPI(); // Reload danh sách sản phẩm
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
    // Call API to deactivate the Product
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
    <div className="w-full flex flex-col p-5">
      <h1 className="text-black text-3xl font-bold">Manage Products</h1>
      <p className="text-black text-xl font-normal">Quản lý sản phẩm.</p>
      <div className="my-5 flex items-center justify-end w-full">
        <Button
          component={Link}
          to={"/Products/create"}
          variant="contained"
          color="primary"
        >
          Tạo sản phẩm mới
        </Button>
      </div>
      <div
        className="ag-theme-alpine w-full"
        style={{ width: "100%", height: "100%", minHeight: "850px" }}
      >
        {isLoading ? (
          <div className="w-full h-full flex items-center justify-center">
            <CircularProgress />
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
            paginationPageSize={5} // hoặc 5, 20, tùy ý
          />
        )}

        {showDetailPopup && selectedProduct && (
          <ProductDetailPopup
            product={selectedProduct}
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
    </div>
  );
};

export default Products;
