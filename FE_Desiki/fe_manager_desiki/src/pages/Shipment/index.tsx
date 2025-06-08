import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  CircularProgress,
  Button,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useEffect, useState } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { useNavigate } from "react-router-dom";
import { shipmentData, shipmentProductDetailsData } from "../../data/mockData";
import type {
  ShipmentType,
  ShipmentProduct,
  ShipmentProductDetails,
} from "../../data/types";
import { ShipmentProductEditPopup } from "./ShipmentProductEditPopup";
import Swal from "sweetalert2";

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

  // HOOKS
  const navigate = useNavigate();

  useEffect(() => {
    fetchShipments();
  }, []);

  // FUNCTIONS
  const fetchShipments = async () => {
    setIsLoading(true);
    try {
      // TODO: Replace with actual API call
      // const res = await fetch("/api/Product/shipments");
      // const data = await res.json();
      // setShipments(data.shipments);

      await new Promise((res) => setTimeout(res, 1000)); // fake loading
      setShipments(shipmentData); // fake empty state
      setFilterShipments(shipmentData);
    } catch (error) {
      console.error("Lỗi fetch shipments:", error);
    } finally {
      setIsLoading(false);
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
    }, 100); // nhỏ thôi là đủ tránh race-condition
  };

  const handleEditShipmentProduct = async (id: string) => {
    try {
      // Call API to get shipment product details
      console.log("Edit with id:", id);
      const shipmentProduct = shipmentProductDetailsData;
      setSelectedShipmentProduct(shipmentProduct);
    } catch (error) {
      console.log("Lỗi khi get shipment product details: ", error);
    } finally {
      setShowShipmentProductEditPopup(true);
    }
  };

  const onCloseShipmentProductEditPopup = () => {
    setSelectedShipmentProduct(null);
    setShowShipmentProductEditPopup(false);
  };

  const onSubmitShipmentProductEdit = async (formData: any) => {
    console.log("Edit Parameters: ", formData);
    setSelectedShipmentProduct(null);
    setShowShipmentProductEditPopup(false);
  };

  const handleDeactivate = async (id: string) => {
    Swal.fire({
      title: "Are you sure you want to deactivated this Shipment Product?",
      text: "Confirm your action",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, deactivate it!",
    }).then(async (result: any) => {
      if (result.isConfirmed) {
        await confirmDeactivate(id);
        Swal.fire({
          title: "Deactivated!",
          text: "Your shipment product has been deactivated.",
          icon: "success",
        });
      }
    });
  };

  const confirmDeactivate = async (id: string) => {
    // CALL API TO DEACTIVE
    console.log("Deactivate Shipment Product with id: ", id);
  };

  const handleEditShipment = (id: string) => {
    const shipment = shipments.filter((s) => s.shipment._id === id);
    setSelectedShipment(shipment[0]);
    setNewShipmentDate(shipment[0].shipment.shipmentDate);
    setShowShipmentEditPopup(true);
  };

  const onCloseShipmentEditPopup = () => {
    setSelectedShipment(null);
    setShowShipmentEditPopup(false);
  };

  const handleSubmitEditShipment = async () => {
    try {
      const shipmentId = selectedShipment?.shipment._id;
      const data = {
        shipment: {
          shipmentDate: newShipmentDate,
        },
      };
      console.log(
        `Đã cập nhật shipment với id ${shipmentId} với data gửi đi là: `,
        data
      );
    } catch (error) {
      console.log("Error while editing shipmentDate: ", error);
    } finally {
      setNewShipmentDate("");
      setSelectedShipment(null);
      setShowShipmentEditPopup(false);
    }
  };

  const handleDeleteShipment = async (id: string) => {
    Swal.fire({
      title: "Are you sure you want to delete this Shipment?",
      text: "Confirm your action",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result: any) => {
      if (result.isConfirmed) {
        await confirmDelelteShipment(id);
        Swal.fire({
          title: "Deactivated!",
          text: "Your shipment has been deactivated.",
          icon: "success",
        });
      }
    });
  };

  const confirmDelelteShipment = async (id: string) => {
    try {
      // CALL API RIGHT HERE TO DELETE SHIPMENT
      console.log("Delete Shipment with id: ", id);
    } catch (error) {
      console.log("Error while delete shipment: ", error);
    }
  };

  return (
    <div className="w-full flex flex-col p-5 text-black">
      {/* PAGE TITLE */}
      <p className="text-3xl font-bold">Shipment Page</p>
      <p className="text-xl font-normal">Quản lý lô hàng, kho của trang web</p>

      {/* CREATE BUTTON */}
      <div className="my-5 flex items-center justify-end w-full">
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate("/Shipments/create")}
        >
          Tạo Lô Hàng Mới
        </Button>
      </div>

      {/* FILTER BAR */}
      <div className="w-full flex flex-col gap-3 my-4">
        <div className="w-full">
          <TextField
            label="Tìm theo tên sản phẩm"
            variant="outlined"
            fullWidth
            onChange={(e) => {
              const keyword = e.target.value.toLowerCase();
              const filtered = shipments.filter((s) =>
                s.shipmentProducts.some((sp) =>
                  sp.product.name.toLowerCase().includes(keyword)
                )
              );
              setFilterShipments(filtered);
            }}
          />
        </div>
        <div className="grid grid-cols-2 w-full">
          <div className="gap-2 flex items-center">
            <TextField
              label="Từ ngày"
              type="date"
              value={filterStartDate}
              InputLabelProps={{ shrink: true }}
              onChange={(e) => {
                setFilterStartDate(e.target.value);
              }}
            />
            <TextField
              label="Đến ngày"
              type="date"
              value={filterEndDate}
              InputLabelProps={{ shrink: true }}
              onChange={(e) => {
                setFilterEndDate(e.target.value);
              }}
            />
            <Button
              disabled={filterEndDate === "" || filterStartDate === ""}
              variant="contained"
              color="primary"
              onClick={() => handleFilterDateShipments()}
            >
              Filter
            </Button>
            <Button
              onClick={() => handleResetFilterDate()}
              variant="outlined"
              color="primary"
            >
              Reset-filter
            </Button>
          </div>
          <div className="flex items-center justify-end gap-2">
            <Button variant="outlined" onClick={() => handleSortShipment(1)}>
              Sắp xếp mới nhất
            </Button>

            <Button variant="outlined" onClick={() => handleSortShipment(-1)}>
              Sắp xếp cũ nhất
            </Button>
          </div>
        </div>
      </div>

      {/* ACCORDIONS */}
      {isLoading ? (
        <div className="w-full flex justify-center mt-10">
          <CircularProgress />
        </div>
      ) : filterShipments?.length === 0 ? (
        <p className="text-center text-gray-500 mt-10">Không có lô hàng nào.</p>
      ) : (
        filterShipments?.map((item) => (
          <Accordion key={item.shipment._id} className="mb-3 shadow-md">
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography fontWeight="bold">
                Lô nhập ngày:{" "}
                {new Date(item.shipment.shipmentDate).toLocaleDateString(
                  "vi-VN"
                )}{" "}
                – {item.shipmentProducts.length} gói hàng
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <div className="ag-theme-alpine" style={{ width: "100%" }}>
                <AgGridReact
                  rowData={item.shipmentProducts}
                  columnDefs={[
                    { headerName: "ID", field: "shipmentProduct._id" },
                    { headerName: "Mã SP", field: "product._id" },
                    {
                      headerName: "Mã Lô",
                      field: "shipmentProduct.shipmentId",
                    },
                    {
                      headerName: "SL Nhập",
                      field: "shipmentProduct.quantity",
                    },
                    {
                      headerName: "Manufacturing",
                      field: "shipmentProduct.manufacturingDate",
                      valueFormatter: (p: any) =>
                        new Date(p.value).toLocaleDateString("vi-VN"),
                    },
                    {
                      headerName: "Expire Date",
                      field: "shipmentProduct.expiryDate",
                      valueFormatter: (p: any) =>
                        new Date(p.value).toLocaleDateString("vi-VN"),
                    },
                    {
                      headerName: "Trạng thái Nè",
                      field: "isDeactivated",
                      cellRenderer: (params: any) => (
                        <div className="h-full w-full flex items-center">
                          <Chip
                            label={params.value ? "Deactive" : "Active"}
                            color={params.value ? "error" : "success"}
                            size="small"
                          />
                        </div>
                      ),
                    },
                    {
                      headerName: "Thao tác",
                      cellRenderer: (params: any) => (
                        <div className="flex h-full gap-1 items-center">
                          <Button
                            size="small"
                            variant="outlined"
                            onClick={() =>
                              handleEditShipmentProduct(
                                params.data.shipmentProduct._id
                              )
                            }
                          >
                            Edit
                          </Button>
                          <Button
                            size="small"
                            variant="outlined"
                            color="warning"
                            onClick={() =>
                              handleDeactivate(params.data.shipmentProduct._id)
                            }
                          >
                            Deactivate
                          </Button>
                        </div>
                      ),
                    },
                  ]}
                  pagination={true}
                  rowHeight={40}
                  paginationPageSize={5}
                  domLayout="autoHeight"
                />
              </div>

              {/* Shipment-level actions */}
              <div className="flex justify-end gap-2 mt-4">
                <Button
                  variant="outlined"
                  color="error"
                  onClick={() => handleDeleteShipment(item.shipment._id)}
                >
                  Xóa lô hàng
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => handleEditShipment(item.shipment._id)}
                >
                  Sửa lô hàng
                </Button>
              </div>
            </AccordionDetails>
          </Accordion>
        ))
      )}
      {showShipmentProductEditPopup && selectedShipmentProduct && (
        <ShipmentProductEditPopup
          open={showShipmentProductEditPopup}
          shipmentProduct={selectedShipmentProduct}
          onClose={onCloseShipmentProductEditPopup}
          onSubmit={onSubmitShipmentProductEdit}
        />
      )}

      {showShipmentEditPopup && selectedShipment && (
        <Dialog open={showShipmentEditPopup} onClose={onCloseShipmentEditPopup}>
          <DialogTitle>Chỉnh sửa lô hàng</DialogTitle>
          <DialogContent>
            <div className="w-full p-4 flex flex-col gap-2">
              <p>Ngày nhập lô hàng</p>
              <TextField
                type="date"
                value={newShipmentDate}
                onChange={(e) => setNewShipmentDate(e.target.value)}
              />
            </div>
          </DialogContent>
          <DialogActions>
            <Button onClick={onCloseShipmentEditPopup}>Hủy</Button>
            <Button variant="contained" onClick={handleSubmitEditShipment}>
              Lưu
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </div>
  );
};

export default Shipment;
