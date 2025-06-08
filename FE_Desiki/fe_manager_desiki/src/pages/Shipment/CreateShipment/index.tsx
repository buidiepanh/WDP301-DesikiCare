import {
  Autocomplete,
  Button,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { productsData } from "../../../data/mockData";
import type { ProductAPI } from "../../../data/types";
import { ShipmentProductCard } from "./ShipmentProductCard";
import Swal from "sweetalert2";

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

type ShipmentProductInput = {
  productId: string;
  quantity: number;
  manufacturingDate: string;
  expiryDate: string;
  buyPrice: number;
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
  const [quantity, setQuantity] = useState(0);
  const [mfgDate, setMfgDate] = useState("");
  const [expDate, setExpDate] = useState("");
  const [buyPrice, setBuyPrice] = useState(0);

  const navigate = useNavigate();

  // HOOKS
  useEffect(() => {
    // TODO: call /api/Product/products
    setProducts(productsData);
  }, []);

  // FUNCTIONS
  const handleCreateShipment = () => {
    const generatedId = generateShipmentId(shipmentDate);
    setShipmentId(generatedId);
    setShipmentCreated(true);

    const payload = {
      shipment: {
        _id: generatedId,
        shipmentDate,
      },
    };

    console.log("CALL API /api/Product/shipments với payload:", payload);
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
      quantity,
      manufacturingDate: mfgDate,
      expiryDate: expDate,
      buyPrice,
    };

    setShipmentProducts((prev) => [...prev, item]);

    // Reset inputs
    setSelectedProduct(null);
    setQuantity(0);
    setMfgDate("");
    setExpDate("");
    setBuyPrice(0);

    console.log("Preview shipmentProduct:", item);
  };

  const handleSubmitAll = () => {
    shipmentProducts.forEach((sp) => {
      const payload = {
        shipmentProduct: {
          ...sp,
          shipmentId,
        },
      };
      console.log("CALL API /api/Product/shipmentProducts với:", payload);
    });

    navigate("/Shipments");
  };

  const getProductDetails = (id: string) => {
    const product = products.filter((p) => p.product._id === id);
    return product[0];
  };

  return (
    <div className="w-full p-5 text-black flex flex-col gap-5">
      <Typography variant="h4" fontWeight="bold">
        Tạo lô hàng mới
      </Typography>

      {/* B1: Ngày và Tạo */}
      {!shipmentCreated ? (
        <div className="flex flex-col gap-4 mt-10">
          <p className="font-bold text-xl">Bước 1: Nhập ngày nhập lô hàng</p>
          <TextField
            type="date"
            value={shipmentDate}
            onChange={(e) => setShipmentDate(e.target.value)}
            label="Ngày nhập lô hàng"
            InputLabelProps={{ shrink: true }}
          />
          <Button
            variant="contained"
            color="primary"
            disabled={!shipmentDate}
            onClick={handleCreateShipment}
          >
            Tạo lô hàng
          </Button>
        </div>
      ) : (
        <div className="w-full py-5 px-5 flex items-center gap-5 text-white bg-blue-500 rounded-md">
          <p className="font-bold text-lg">
            Lô hàng: {shipmentId} | {shipmentDate}
          </p>
        </div>
      )}

      {/* B2: Nhập shipmentProducts */}
      {shipmentCreated && (
        <>
          <p className="font-bold text-xl">
            B2: Đăng ký các kiện hàng bên trong lô
          </p>

          {/* B3: Form nhập gói hàng */}
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              {/* <Select
                value={productId}
                displayEmpty
                onChange={(e) => setProductId(e.target.value)}
                fullWidth
              >
                <MenuItem disabled value="">
                  Chọn sản phẩm
                </MenuItem>
                {products.map((p) => (
                  <MenuItem key={p.product._id} value={p.product._id}>
                    {p.product.name}
                  </MenuItem>
                ))}
              </Select> */}
              <Autocomplete
                value={selectedProduct || null}
                onChange={(event, newValue) => {
                  setSelectedProduct(newValue || null); // ✅ fix chính
                }}
                options={products}
                getOptionLabel={(option) => option.product.name}
                renderInput={(params) => (
                  <TextField {...params} label="Chọn sản phẩm" />
                )}
                isOptionEqualToValue={(option, value) =>
                  option.product._id === value?.product._id
                }
              />
            </div>

            <TextField
              label="Số lượng"
              type="number"
              fullWidth
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
            />

            <TextField
              label="Giá nhập"
              type="number"
              fullWidth
              value={buyPrice}
              onChange={(e) => setBuyPrice(Number(e.target.value))}
            />

            <TextField
              label="Ngày sản xuất"
              type="date"
              fullWidth
              InputLabelProps={{ shrink: true }}
              value={mfgDate}
              onChange={(e) => setMfgDate(e.target.value)}
            />

            <TextField
              label="Ngày hết hạn"
              type="date"
              fullWidth
              InputLabelProps={{ shrink: true }}
              value={expDate}
              onChange={(e) => setExpDate(e.target.value)}
            />

            <div className="flex col-span-2 justify-center items-center">
              <Button
                variant="outlined"
                color="success"
                fullWidth
                onClick={handleAddShipmentProduct}
              >
                Thêm Gói Hàng
              </Button>
            </div>
          </div>

          {/* B4: Hiển thị lại danh sách gói hàng */}
          <div className="mt-5">
            <Typography fontWeight="bold">Các Gói Hàng đã nhập:</Typography>
            <ul className="list-disc pl-6 mt-2">
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
            </ul>
          </div>

          <div className="flex justify-end mt-4">
            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmitAll}
              disabled={shipmentProducts.length === 0}
            >
              Xác nhận Tạo Lô Hàng
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default CreateShipment;
