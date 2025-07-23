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
    quantity: number;
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
          top: "10%",
          left: "50%",
          transform: "translateX(-50%)",
          width: 600,
          height: 600,
          overflowY: "scroll",
          scrollbarWidth: "none", // Firefox
          "&::-webkit-scrollbar": {
            display: "none", // Chrome, Safari
          },
          bgcolor: "white",
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
          color: "black",
        }}
      >
        <div className="flex justify-between items-center mb-4">
          <Typography variant="h6">Thông tin chi tiết sản phẩm</Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </div>

        <div className="grid grid-cols-2">
          <div className="w-full flex items-center justify-center">
            <img
              src={product.product.imageUrl}
              alt="product"
              style={{
                width: 200,
                height: 200,
                objectFit: "cover",
                borderRadius: 8,
              }}
            />
          </div>
          <div className="flex flex-col gap-2">
            <p className="text-md text-cyan-900 font-bold">
              {product.product.name}
            </p>
            <p className="text-sm">
              <strong>Loại sản phẩm:</strong> {skinTypeName}
            </p>
            <p className="text-sm">
              <strong>Mô tả:</strong> {product.product.description}
            </p>
            <p className="text-sm">
              <strong>Dung tích:</strong> {product.product.volume}ml
            </p>
            <p className="text-sm">
              <strong>Giá bán:</strong>{" "}
              {product.product.salePrice.toLocaleString("vi-VN")}₫
            </p>
            <p className="text-sm">
              <strong>Số lượng trong kho:</strong>{" "}
              {product.shipmentProducts.reduce(
                (sum: number, sp: any) => sum + sp.shipmentProduct.quantity,
                0
              )}
            </p>
            {/* <p>
              <strong>Loại da phù hợp:</strong>{" "}
              {product.productSkinTypes.map((s) => s.name).join(", ")}
            </p>
            <p>
              <strong>Tình trạng da phù hợp:</strong>{" "}
              {product.productSkinStatuses.map((s) => s.name).join(", ")}
            </p> */}
          </div>
        </div>

        <div className="w-full flex justify-center my-3">
          <div className="w-8/12 h-0.5 bg-gray-300"></div>
        </div>

        <div className="w-full grid grid-cols-2">
          <div className="flex flex-col items-center gap-1">
            <p className="text-lg font-semibold text-cyan-700">
              Loại da phù hợp
            </p>
            {product.productSkinTypes.map((item, index: number) => (
              <div className="w-[130px] h-[25px] rounded-xl flex items-center justify-center bg-cyan-500 text-white text-sm">
                <p>{item.name}</p>
              </div>
            ))}
          </div>
          <div className="flex flex-col items-center gap-1">
            <p className="text-lg font-semibold text-orange-700">
              Tình trạng da phù hợp
            </p>
            {product.productSkinStatuses.map((item, index: number) => (
              <div className="w-[130px] h-[25px] rounded-xl flex items-center justify-center bg-orange-500 text-white text-sm">
                <p>{item.name}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-5">
          <Typography fontWeight="bold">Thông tin lô hàng</Typography>
          {product.shipmentProducts.map((sp) => (
            <div
              key={sp.shipmentProduct._id}
              className="mt-2 ml-2 border-l-2 pl-2"
            >
              <Typography>
                Lô nhập: {sp.shipment.shipmentDate}, Số lượng:{" "}
                {sp.shipmentProduct.quantity}, Giá nhập:{" "}
                {sp.shipmentProduct.buyPrice.toLocaleString("vi-VN")}₫
              </Typography>
              <Typography>HSD: {sp.shipmentProduct.expiryDate}</Typography>
            </div>
          ))}
        </div>
      </Box>
    </Modal>
  );
};
