import { Box, IconButton, Modal, Typography } from "@mui/material";
import type React from "react";
import CloseIcon from "@mui/icons-material/Close";
import { categoriesData } from "../../data/mockData";
import { useEffect, useState } from "react";

type SkinType = {
  _id: number;
  name: string;
};

type SkinStatus = {
  _id: number;
  name: string;
};

type ShipmentProduct = {
  shipment: {
    _id: string;
    shipmentDate: string;
    createdAt: string;
    updatedAt: string;
  };
  shipmentProduct: {
    _id: string;
    productId: string;
    shipmentId: string;
    importQuantity: number;
    saleQuantity: number;
    manufacturingDate: string;
    expiryDate: string;
    buyPrice: number;
    createdAt: string;
    updatedAt: string;
  };
};

type ProductAPI = {
  product: {
    _id: string;
    categoryId: number;
    name: string;
    description: string;
    volume: number;
    salePrice: number;
    isDeactivated: boolean;
    createdAt: string;
    updatedAt: string;
    imageUrl: string;
  };
  shipmentProducts: ShipmentProduct[];
  productSkinTypes: SkinType[];
  productSkinStatuses: SkinStatus[];
};

interface Props {
  product: ProductAPI;
  onClose: () => void;
}

export const ProductDetailPopup: React.FC<Props> = ({ product, onClose }) => {
  // STATES
  const [skinTypeName, setSkinTypeName] = useState("");

  // HOOKS
  useEffect(() => {
    const skinType = categoriesData.filter(
      (item) => item._id === product.product.categoryId
    );
    if (skinType) {
      setSkinTypeName(skinType[0].name);
    } else {
      setSkinTypeName("Chưa xác định");
    }
  }, []);

  return (
    <Modal open={true} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "90%",
          maxWidth: 800,
          maxHeight: "90vh",
          overflowY: "auto",
          bgcolor: "white",
          boxShadow: 24,
          borderRadius: 3,
        }}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200 bg-gray-50">
          <Typography variant="h5" className="text-gray-800 font-semibold">
            Chi tiết sản phẩm
          </Typography>
          <IconButton
            onClick={onClose}
            className="text-gray-600 hover:bg-gray-200"
          >
            <CloseIcon />
          </IconButton>
        </div>

        <div className="p-6">
          {/* Product Info Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Image */}
            <div className="flex items-center justify-center bg-gray-50 rounded-lg p-4">
              <img
                src={product.product.imageUrl}
                alt="product"
                className="w-64 h-64 object-cover rounded-lg shadow-md"
              />
            </div>

            {/* Product Details */}
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                {product.product.name}
              </h2>

              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <span className="text-gray-600 font-medium min-w-[120px]">
                    Loại sản phẩm:
                  </span>
                  <span className="text-gray-800">{skinTypeName}</span>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-gray-600 font-medium min-w-[120px]">
                    Dung tích:
                  </span>
                  <span className="text-gray-800">
                    {product.product.volume}ml
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-gray-600 font-medium min-w-[120px]">
                    Giá bán:
                  </span>
                  <span className="text-green-600 font-semibold text-lg">
                    {product.product.salePrice.toLocaleString("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    })}
                  </span>
                </div>

                <div className="flex items-start gap-3">
                  <span className="text-gray-600 font-medium min-w-[120px]">
                    Mô tả:
                  </span>
                  <span className="text-gray-800 leading-relaxed">
                    {product.product.description}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Skin Types & Status */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="bg-blue-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-blue-800 mb-3">
                Loại da phù hợp
              </h3>
              <div className="flex flex-wrap gap-2">
                {product.productSkinTypes.map((item, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-blue-500 text-white text-sm rounded-full"
                  >
                    {item.name}
                  </span>
                ))}
              </div>
            </div>

            <div className="bg-orange-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-orange-800 mb-3">
                Tình trạng da phù hợp
              </h3>
              <div className="flex flex-wrap gap-2">
                {product.productSkinStatuses.map((item, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-orange-500 text-white text-sm rounded-full"
                  >
                    {item.name}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Shipment Products */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Danh sách lô hàng
            </h3>

            {product.shipmentProducts.length === 0 ? (
              <p className="text-gray-500 text-center py-4">
                Chưa có lô hàng nào
              </p>
            ) : (
              <div className="space-y-4">
                {product.shipmentProducts.map((sp, index) => (
                  <div
                    key={sp.shipmentProduct._id}
                    className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <h4 className="font-medium text-gray-800">
                        Lô hàng #{index + 1}
                      </h4>
                      <span className="text-xs text-gray-500">
                        {new Date(sp.shipment.shipmentDate).toLocaleDateString(
                          "vi-VN"
                        )}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Số lượng nhập:</span>
                        <p className="font-medium text-blue-600">
                          {sp.shipmentProduct.importQuantity.toLocaleString()}
                        </p>
                      </div>

                      <div>
                        <span className="text-gray-600">Số lượng đã bán:</span>
                        <p className="font-medium text-red-600">
                          {sp.shipmentProduct.saleQuantity.toLocaleString()}
                        </p>
                      </div>

                      <div>
                        <span className="text-gray-600">Còn lại:</span>
                        <p className="font-medium text-green-600">
                          {(
                            sp.shipmentProduct.importQuantity -
                            sp.shipmentProduct.saleQuantity
                          ).toLocaleString()}
                        </p>
                      </div>

                      <div>
                        <span className="text-gray-600">Giá nhập:</span>
                        <p className="font-medium text-gray-800">
                          {sp.shipmentProduct.buyPrice.toLocaleString("vi-VN", {
                            style: "currency",
                            currency: "VND",
                          })}
                        </p>
                      </div>

                      <div>
                        <span className="text-gray-600">Ngày sản xuất:</span>
                        <p className="font-medium text-gray-800">
                          {new Date(
                            sp.shipmentProduct.manufacturingDate
                          ).toLocaleDateString("vi-VN")}
                        </p>
                      </div>

                      <div>
                        <span className="text-gray-600">Ngày hết hạn:</span>
                        <p className="font-medium text-gray-800">
                          {new Date(
                            sp.shipmentProduct.expiryDate
                          ).toLocaleDateString("vi-VN")}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </Box>
    </Modal>
  );
};
