import { callAPIManager } from "@/api/axiosInstace";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import {
  CircularProgress,
  Button,
  Modal,
  Box,
  Typography,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import {
  Edit,
  Delete,
  Add,
  ShoppingCart,
  LocalOffer,
} from "@mui/icons-material";
import "@/styles/ag-grid-glassmophorism.css"; // Import glassmorphism CSS
import "./styles.css";

// Custom Glassmorphism Chip Component
const GlassChip = ({
  label,
  variant = "default",
}: {
  label: string;
  variant?: "success" | "error" | "warning" | "primary" | "default";
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case "success":
        return "bg-emerald-500/20 border-emerald-400/40 text-emerald-100";
      case "error":
        return "bg-red-500/20 border-red-400/40 text-red-100";
      case "warning":
        return "bg-amber-500/20 border-amber-400/40 text-amber-100";
      case "primary":
        return "bg-blue-500/20 border-blue-400/40 text-blue-100";
      default:
        return "bg-slate-500/20 border-slate-400/40 text-slate-100";
    }
  };

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium backdrop-blur-sm border shadow-lg ${getVariantStyles()}`}
      style={{
        backdropFilter: "blur(8px)",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
      }}
    >
      {label}
    </span>
  );
};

type OrderBaseTicketRewardFromAPI = {
  _id: string;
  orderPriceThreshold: number;
  gameTicketReward: number;
  createdAt: string;
  updatedAt: string;
};

type NewOrderBaseTicketReward = {
  orderPriceThreshold: number;
  gameTicketReward: number;
};

type Product = {
  product: {
    _id: string;
    categoryId: number;
    name: string;
    description: string;
    volume: number;
    salePrice: number;
    gameTicketReward: number;
    isDeactivated: boolean;
    createdAt: string;
    updatedAt: string;
    imageUrl: string;
  };
  category: {
    _id: number;
    name: string;
  };
  shipmentProducts: {
    shipment: {
      _id: string;
      shipmentDate: string;
      isDeleted: boolean;
      createdAt: string;
      updatedAt: string;
    };
    shipmentProduct: {
      _id: string;
      productId: string;
      shipmentId: string;
      importQuantity: string;
      saleQuantity: string;
      manufacturingDate: string;
      expiryDate: string;
      buyPrice: number;
      isDeactivated: boolean;
      createdAt: string;
      updatedAt: string;
    };
  }[];

  productSkinTypes: {
    _id: number;
    name: string;
  }[];
  productSkinStatuses: {
    _id: number;
    name: string;
  }[];
};

const TicketRuleManagement = () => {
  // STATES
  const [products, setProducts] = useState<Product[]>([]);
  const [ruledProducts, setRuledProducts] = useState<Product[]>([]);
  const [unruledProducts, setUnruledProducts] = useState<Product[]>([]);
  const [orderBaseTicketRewards, setOrderBaseTicketRewards] = useState<
    OrderBaseTicketRewardFromAPI[]
  >([]);
  const [newOrderBaseTicketReward, setNewOrderBaseTicketReward] =
    useState<NewOrderBaseTicketReward>({
      orderPriceThreshold: 0,
      gameTicketReward: 0,
    });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSaveLoading, setIsSaveLoading] = useState<boolean>(false);
  const [isCreating, setIsCreating] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedOrderBaseTicketReward, setSelectedOrderBaseTicketReward] =
    useState<OrderBaseTicketRewardFromAPI | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [showOrderRuleModal, setShowOrderRuleModal] = useState<boolean>(false);
  const [showProductRuleModal, setShowProductRuleModal] =
    useState<boolean>(false);
  const [editingOrderRule, setEditingOrderRule] =
    useState<OrderBaseTicketRewardFromAPI | null>(null);
  const [editingProductRule, setEditingProductRule] = useState<Product | null>(
    null
  );
  const [newProductTicketReward, setNewProductTicketReward] =
    useState<number>(0);
  const [selectedProductIdForRule, setSelectedProductIdForRule] =
    useState<string>("");

  // HOOKS
  useEffect(() => {
    fetchProducts();
  }, []);

  // FUNCTIONS
  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const response = await callAPIManager({
        method: "GET",
        url: "/api/Product/products",
      });
      if (response && response.status === 200) {
        setProducts(response.data.products);
        const ruled = response.data.products.filter(
          (p: Product) => p.product.gameTicketReward > 0
        );
        setRuledProducts(ruled);
        console.log(">>>>>>Ruled Products:", ruled);
        const unruled = response.data.products.filter(
          (p: Product) => p.product.gameTicketReward === 0
        );
        const unRuledActive = unruled.filter(
          (p: Product) => !p.product.isDeactivated
        );
        setUnruledProducts(unRuledActive);
        console.log(">>>>>>Unruled Products:", unRuledActive);
        // Call API to fetch order base ticket rewards
        const rewardsResponse = await callAPIManager({
          method: "GET",
          url: "/api/Order/orderPriceBaseGameTicketRewards",
        });
        if (rewardsResponse && rewardsResponse.status === 200) {
          setOrderBaseTicketRewards(
            rewardsResponse.data.orderPriceBaseGameTicketRewards
          );
          console.log(
            ">>>>>>Order Base Ticket Rewards:",
            rewardsResponse.data.orderPriceBaseGameTicketRewards
          );
        } else {
          Swal.fire(
            "Lỗi!",
            "Không thể fetching Order Base Ticket Rewards",
            "error"
          );
        }
        setIsLoading(false);
      } else {
        Swal.fire("Lỗi!", "Không thể fetching Products", "error");
      }
    } catch (error) {
      console.error("Loi fetch:", error);
    }
  };

  const handleCreateOrderRule = () => {
    setEditingOrderRule(null);
    setNewOrderBaseTicketReward({
      orderPriceThreshold: 0,
      gameTicketReward: 0,
    });
    setShowOrderRuleModal(true);
  };

  const handleEditOrderRule = (rule: OrderBaseTicketRewardFromAPI) => {
    setEditingOrderRule(rule);
    setNewOrderBaseTicketReward({
      orderPriceThreshold: rule.orderPriceThreshold,
      gameTicketReward: rule.gameTicketReward,
    });
    setShowOrderRuleModal(true);
  };

  const handleDeleteOrderRule = async (ruleId: string) => {
    const result = await Swal.fire({
      title: "Xác nhận xóa?",
      text: "Bạn có chắc chắn muốn xóa luật này không?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Xóa",
      cancelButtonText: "Hủy",
    });

    if (result.isConfirmed) {
      try {
        const response = await callAPIManager({
          method: "DELETE",
          url: `/api/Order/orderPriceBaseGameTicketRewards/${ruleId}`,
        });
        if (response && response.status === 200) {
          Swal.fire("Thành công!", "Đã xóa luật thành công", "success");
          fetchProducts();
        }
      } catch (error) {
        Swal.fire("Lỗi!", "Không thể xóa luật", "error");
      }
    }
  };

  const handleSaveOrderRule = async () => {
    setIsSaveLoading(true);
    try {
      let url, method, data;

      if (editingOrderRule) {
        // Update existing rule - use PUT with direct data
        url = `/api/Order/orderPriceBaseGameTicketRewards/${editingOrderRule._id}`;
        method = "PUT";
        data = {
          orderPriceBaseGameTicketReward: newOrderBaseTicketReward,
        };
      } else {
        // Create new rule - use POST with wrapped data
        url = "/api/Order/orderPriceBaseGameTicketRewards";
        method = "POST";
        data = {
          orderPriceBaseGameTicketReward: newOrderBaseTicketReward,
        };
      }

      const response = await callAPIManager({
        method: method as "GET" | "POST" | "PUT" | "DELETE",
        url,
        data,
      });

      if (response && (response.status === 200 || response.status === 201)) {
        Swal.fire(
          "Thành công!",
          editingOrderRule ? "Đã cập nhật luật" : "Đã tạo luật mới",
          "success"
        );
        setShowOrderRuleModal(false);
        fetchProducts();
      }
    } catch (error) {
      Swal.fire("Lỗi!", "Không thể lưu luật", "error");
    } finally {
      setIsSaveLoading(false);
    }
  };

  const handleEditProductRule = (product: Product) => {
    setEditingProductRule(product);
    setNewProductTicketReward(product.product.gameTicketReward);
    setShowProductRuleModal(true);
  };

  const handleAddProductRule = (product: Product) => {
    setEditingProductRule(product);
    setNewProductTicketReward(0);
    setShowProductRuleModal(true);
  };

  const handleCreateNewProductRule = () => {
    setEditingProductRule(null);
    setSelectedProductIdForRule("");
    setNewProductTicketReward(0);
    setShowProductRuleModal(true);
  };

  const handleSaveProductRule = async () => {
    setIsSaveLoading(true);
    let productId = "";
    let currentProduct: Product | null = null;

    if (editingProductRule) {
      productId = editingProductRule.product._id;
      currentProduct = editingProductRule;
    } else {
      productId = selectedProductIdForRule;
      currentProduct =
        unruledProducts.find((p) => p.product._id === productId) || null;
    }

    if (!productId || !currentProduct) {
      Swal.fire("Lỗi!", "Vui lòng chọn sản phẩm", "error");
      setIsSaveLoading(false);
      return;
    }

    try {
      const response = await callAPIManager({
        method: "PUT",
        url: `/api/Product/products/${productId}`,
        data: {
          product: {
            categoryId: currentProduct.product.categoryId,
            name: currentProduct.product.name,
            description: currentProduct.product.description,
            volume: currentProduct.product.volume,
            salePrice: currentProduct.product.salePrice,
            gameTicketReward: newProductTicketReward,
          },
          skinTypeIds: currentProduct.productSkinTypes.map((type) => type._id),
          skinStatusIds: currentProduct.productSkinStatuses.map(
            (status) => status._id
          ),
        },
      });

      if (response && (response.status === 200 || response.status === 201)) {
        Swal.fire("Thành công!", "Đã cập nhật luật sản phẩm", "success");
        setShowProductRuleModal(false);
        fetchProducts();
      }
    } catch (error) {
      Swal.fire("Lỗi!", "Không thể cập nhật luật sản phẩm", "error");
    } finally {
      setIsSaveLoading(false);
    }
  };

  const handleDeleteProductRule = async (productId: string) => {
    const result = await Swal.fire({
      title: "Xác nhận xóa?",
      text: "Bạn có chắc chắn muốn xóa luật cho sản phẩm này không?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Xóa",
      cancelButtonText: "Hủy",
    });

    if (result.isConfirmed) {
      // Find the product to get its current information
      const currentProduct = ruledProducts.find(
        (p) => p.product._id === productId
      );

      if (!currentProduct) {
        Swal.fire("Lỗi!", "Không tìm thấy thông tin sản phẩm", "error");
        return;
      }

      try {
        const response = await callAPIManager({
          method: "PUT",
          url: `/api/Product/products/${productId}`,
          data: {
            product: {
              categoryId: currentProduct.product.categoryId,
              name: currentProduct.product.name,
              description: currentProduct.product.description,
              volume: currentProduct.product.volume,
              salePrice: currentProduct.product.salePrice,
              gameTicketReward: 0, // Reset game ticket reward
            },
            skinTypeIds: currentProduct.productSkinTypes.map(
              (type) => type._id
            ),
            skinStatusIds: currentProduct.productSkinStatuses.map(
              (status) => status._id
            ),
          },
        });
        if (response && (response.status === 200 || response.status === 201)) {
          Swal.fire("Thành công!", "Đã xóa luật sản phẩm", "success");
          fetchProducts();
        }
      } catch (error) {
        Swal.fire("Lỗi!", "Không thể xóa luật sản phẩm", "error");
      }
    }
  };

  if (isLoading) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <div className="backdrop-blur-xl bg-black/20 border border-white/20 rounded-2xl p-8">
          <CircularProgress sx={{ color: "rgba(255, 255, 255, 0.8)" }} />
          <p className="text-white/80 mt-4 text-center">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col p-0">
      {/* Header Section */}
      <div className="mb-8 backdrop-blur-xl bg-gray-400/20 border border-white/10 rounded-2xl p-6 shadow-2xl">
        <h1 className="text-white text-3xl font-bold mb-2">
          Quản lý luật Game Ticket
        </h1>
        <p className="text-white/70 text-lg">
          Quản lý các luật thưởng vé game cho đơn hàng và sản phẩm
        </p>
      </div>

      {/* Order Rules Section */}
      <div className="mb-8 backdrop-blur-xl bg-gray-400/20 border border-white/10 rounded-2xl shadow-2xl">
        <div className="p-6 border-b border-white/10">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <ShoppingCart className="text-blue-300" />
              <h2 className="text-xl font-semibold text-white">
                Luật thưởng theo Đơn hàng
              </h2>
            </div>
            <button
              onClick={handleCreateOrderRule}
              className="px-4 py-2 bg-blue-500/20 border border-blue-400/40 text-blue-200 hover:bg-blue-500/30 transition-all duration-200 backdrop-blur-sm rounded-lg text-sm font-medium shadow-lg flex items-center gap-2"
            >
              <Add className="text-sm" />
              Tạo luật mới
            </button>
          </div>
        </div>

        <div className="p-6">
          {orderBaseTicketRewards.length === 0 ? (
            <div className="text-center py-8">
              <ShoppingCart className="mx-auto mb-4 text-4xl text-white/30" />
              <p className="text-white/70">Chưa có luật nào được tạo</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left py-3 px-4 font-semibold text-white/90">
                      Ngưỡng giá đơn hàng
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-white/90">
                      Số vé thưởng
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-white/90">
                      Ngày tạo
                    </th>
                    <th className="text-right py-3 px-4 font-semibold text-white/90">
                      Thao tác
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {orderBaseTicketRewards.map((rule) => (
                    <tr
                      key={rule._id}
                      className="border-b border-white/5 hover:bg-white/5"
                    >
                      <td className="py-4 px-4">
                        <span className="font-semibold text-green-300">
                          {rule.orderPriceThreshold.toLocaleString("vi-VN", {
                            style: "currency",
                            currency: "VND",
                          })}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <GlassChip
                          label={`${rule.gameTicketReward} vé`}
                          variant="primary"
                        />
                      </td>
                      <td className="py-4 px-4 text-white/70">
                        {new Date(rule.createdAt).toLocaleDateString("vi-VN")}
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => handleEditOrderRule(rule)}
                            className="px-3 py-1.5 bg-blue-500/20 border border-blue-400/40 text-blue-200 hover:bg-blue-500/30 transition-all duration-200 backdrop-blur-sm rounded-lg text-sm font-medium shadow-lg flex items-center gap-1"
                          >
                            <Edit className="text-xs" />
                            Sửa
                          </button>
                          <button
                            onClick={() => handleDeleteOrderRule(rule._id)}
                            className="px-3 py-1.5 bg-red-500/20 border border-red-400/40 text-red-200 hover:bg-red-500/30 transition-all duration-200 backdrop-blur-sm rounded-lg text-sm font-medium shadow-lg flex items-center gap-1"
                          >
                            <Delete className="text-xs" />
                            Xóa
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Product Rules Section */}
      <div className="backdrop-blur-xl bg-gray-400/20 border border-white/10 rounded-2xl shadow-2xl">
        <div className="p-6 border-b border-white/10">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <LocalOffer className="text-green-300" />
              <h2 className="text-xl font-semibold text-white">
                Luật thưởng theo Sản phẩm
              </h2>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-sm text-white/70">
                {ruledProducts.length} sản phẩm có luật /{" "}
                {unruledProducts.length} sản phẩm chưa có luật
              </div>
              <button
                onClick={handleCreateNewProductRule}
                className="px-4 py-2 bg-green-500/20 border border-green-400/40 text-green-200 hover:bg-green-500/30 transition-all duration-200 backdrop-blur-sm rounded-lg text-sm font-medium shadow-lg flex items-center gap-2"
              >
                <Add className="text-sm" />
                Tạo luật sản phẩm
              </button>
            </div>
          </div>
        </div>

        <div className="p-6">
          {ruledProducts.length === 0 ? (
            <div className="text-center py-8">
              <LocalOffer className="mx-auto mb-4 text-4xl text-white/30" />
              <p className="text-white/70">
                Chưa có sản phẩm nào có luật thưởng
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {ruledProducts.map((product) => (
                <div
                  key={product.product._id}
                  className="backdrop-blur-sm bg-white/10 border border-white/20 rounded-lg p-4 hover:bg-white/15 transition-all duration-200 shadow-lg"
                >
                  <div className="flex items-start gap-4">
                    <img
                      src={
                        product.product.imageUrl ||
                        "https://via.placeholder.com/80"
                      }
                      alt={product.product.name}
                      className="w-16 h-16 object-cover rounded-lg border border-white/20"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-white truncate">
                        {product.product.name}
                      </h4>
                      <p className="text-sm text-green-300 font-semibold">
                        {product.product.salePrice.toLocaleString("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        })}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <GlassChip
                          label={`${product.product.gameTicketReward} vé`}
                          variant="warning"
                        />
                      </div>
                      <div className="flex gap-2 mt-3">
                        <button
                          onClick={() => handleEditProductRule(product)}
                          className="px-3 py-1.5 bg-blue-500/20 border border-blue-400/40 text-blue-200 hover:bg-blue-500/30 transition-all duration-200 backdrop-blur-sm rounded-lg text-xs font-medium shadow-lg flex items-center gap-1"
                        >
                          <Edit className="text-xs" />
                          Sửa
                        </button>
                        <button
                          onClick={() =>
                            handleDeleteProductRule(product.product._id)
                          }
                          className="px-3 py-1.5 bg-red-500/20 border border-red-400/40 text-red-200 hover:bg-red-500/30 transition-all duration-200 backdrop-blur-sm rounded-lg text-xs font-medium shadow-lg flex items-center gap-1"
                        >
                          <Delete className="text-xs" />
                          Xóa
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Order Rule Modal */}
      <Modal
        open={showOrderRuleModal}
        onClose={() => setShowOrderRuleModal(false)}
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
          }}
        >
          <Typography variant="h6" component="h2" className="mb-4">
            {editingOrderRule
              ? "Chỉnh sửa luật đơn hàng"
              : "Tạo luật đơn hàng mới"}
          </Typography>

          <div className="space-y-4">
            <TextField
              sx={{ marginTop: 2 }}
              fullWidth
              label="Ngưỡng giá đơn hàng"
              type="number"
              value={newOrderBaseTicketReward.orderPriceThreshold}
              onChange={(e) =>
                setNewOrderBaseTicketReward({
                  ...newOrderBaseTicketReward,
                  orderPriceThreshold: Number(e.target.value),
                })
              }
            />

            <TextField
              sx={{ marginTop: 5 }}
              fullWidth
              label="Số vé thưởng"
              type="number"
              value={newOrderBaseTicketReward.gameTicketReward}
              onChange={(e) =>
                setNewOrderBaseTicketReward({
                  ...newOrderBaseTicketReward,
                  gameTicketReward: Number(e.target.value),
                })
              }
            />
          </div>

          <div className="flex gap-2 mt-6">
            <Button
              variant="contained"
              onClick={handleSaveOrderRule}
              disabled={isSaveLoading}
              className="bg-blue-600 hover:bg-blue-700"
              startIcon={
                isSaveLoading ? <CircularProgress size={16} /> : undefined
              }
            >
              {isSaveLoading ? "Đang lưu..." : "Lưu"}
            </Button>
            <Button
              variant="outlined"
              onClick={() => setShowOrderRuleModal(false)}
              disabled={isSaveLoading}
            >
              Hủy
            </Button>
          </div>
        </Box>
      </Modal>

      {/* Product Rule Modal */}
      <Modal
        open={showProductRuleModal}
        onClose={() => setShowProductRuleModal(false)}
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
          }}
        >
          <Typography variant="h6" component="h2" className="mb-4">
            {editingProductRule
              ? "Chỉnh sửa luật sản phẩm"
              : "Tạo luật sản phẩm mới"}
          </Typography>

          <div className="mb-4">
            {editingProductRule ? (
              <div className="flex items-center gap-3 mb-4">
                <img
                  src={
                    editingProductRule.product.imageUrl ||
                    "https://via.placeholder.com/60"
                  }
                  alt={editingProductRule.product.name}
                  className="w-12 h-12 object-cover rounded-lg"
                />
                <div>
                  <h4 className="font-medium">
                    {editingProductRule.product.name}
                  </h4>
                  <p className="text-sm text-gray-600">
                    {editingProductRule.product.salePrice.toLocaleString(
                      "vi-VN",
                      {
                        style: "currency",
                        currency: "VND",
                      }
                    )}
                  </p>
                </div>
              </div>
            ) : (
              <FormControl fullWidth className="mb-4">
                <InputLabel>Chọn sản phẩm</InputLabel>
                <Select
                  value={selectedProductIdForRule}
                  onChange={(e) => setSelectedProductIdForRule(e.target.value)}
                  label="Chọn sản phẩm"
                >
                  {unruledProducts.map((product) => (
                    <MenuItem
                      key={product.product._id}
                      value={product.product._id}
                    >
                      <div className="flex items-center gap-2">
                        <img
                          src={
                            product.product.imageUrl ||
                            "https://via.placeholder.com/40"
                          }
                          alt={product.product.name}
                          className="w-8 h-8 object-cover rounded"
                        />
                        <div>
                          <div className="font-medium">
                            {product.product.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {product.product.salePrice.toLocaleString("vi-VN", {
                              style: "currency",
                              currency: "VND",
                            })}
                          </div>
                        </div>
                      </div>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}

            <TextField
              sx={{ marginTop: 5 }}
              fullWidth
              label="Số vé thưởng"
              type="number"
              value={newProductTicketReward}
              onChange={(e) =>
                setNewProductTicketReward(Number(e.target.value))
              }
              helperText={
                editingProductRule
                  ? "Nhập 0 để xóa luật"
                  : "Số vé game thưởng cho sản phẩm này"
              }
            />
          </div>

          <div className="flex gap-2 mt-6">
            <Button
              variant="contained"
              onClick={handleSaveProductRule}
              disabled={isSaveLoading}
              className="bg-green-600 hover:bg-green-700"
              startIcon={
                isSaveLoading ? <CircularProgress size={16} /> : undefined
              }
            >
              {isSaveLoading ? "Đang lưu..." : "Lưu"}
            </Button>
            <Button
              variant="outlined"
              onClick={() => setShowProductRuleModal(false)}
              disabled={isSaveLoading}
            >
              Hủy
            </Button>
          </div>
        </Box>
      </Modal>
    </div>
  );
};

export default TicketRuleManagement;
