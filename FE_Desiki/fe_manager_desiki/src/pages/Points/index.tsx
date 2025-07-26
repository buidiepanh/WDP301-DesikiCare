import HasikiLoader from "@/components/loader";
import { GetAllPointRewardHistory } from "@/services/Points/get-all-point-reward-history";
import { GetAllPointSpendingHistory } from "@/services/Points/get-all-point-spend";
import { Star } from "lucide-react";
import { useEffect, useState, useCallback } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-theme-alpine.css";
import "@/styles/ag-grid-glassmophorism.css";

type PointChangingHistory = {
  userId: string;
  amount: number;
  changingType: number;
  reason: string;
  changeAt: string;
};

const PointManagement = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [rewards, setRewards] = useState<PointChangingHistory[]>([]);
  const [spendings, setSpendings] = useState<PointChangingHistory[]>([]);

  // FUNCTIONS
  const fetch = async () => {
    try {
      const rewardsFromAPI = await GetAllPointRewardHistory();
      const spedingsFromAPI = await GetAllPointSpendingHistory();
      // console.log("Điểm nhận: ", rewardsFromAPI);
      // console.log("Điểm xài: ", spedingsFromAPI);
      setRewards(rewardsFromAPI);
      setSpendings(spedingsFromAPI);
      setIsLoading(false);
    } catch (error) {
      console.log("Lỗi khi chuẩn bị danh sách điểm: ", error);
      setIsLoading(false); // Ensure loading state is reset even on error
    }
  };

  // HOOKS
  useEffect(() => {
    setIsLoading(true);
    fetch();
  }, []);

  // AG-Grid Column Definitions
  const commonColumnDefs = [
    {
      headerName: "User ID",
      field: "userId",
      filter: true,
      sortable: true,
      cellStyle: {
        color: "rgba(255, 255, 255, 0.9)",
        background: "transparent !important",
        fontFamily: "monospace",
      },
    },
    {
      headerName: "Amount",
      field: "amount",
      sortable: true,
      cellRenderer: (params: any) => (
        <div className="flex items-center h-full">
          <Star
            className={`w-4 h-4 mr-2 ${
              params.value > 0 ? "text-yellow-400" : "text-gray-400"
            }`}
          />
          <span
            className={`${
              params.value > 0 ? "text-emerald-300" : "text-gray-300"
            } font-semibold`}
          >
            {params.value > 0 ? `+ ${params.value}` : params.value} points
          </span>
        </div>
      ),
      cellStyle: {
        background: "transparent !important",
        display: "flex",
        alignItems: "center",
      },
    },
    {
      headerName: "Reason",
      field: "reason",
      filter: true,
      flex: 1, // Take remaining space
      cellStyle: {
        color: "rgba(255, 255, 255, 0.8)",
        background: "transparent !important",
      },
    },
    {
      headerName: "Change At",
      field: "changeAt",
      valueFormatter: (params: any) =>
        params.value ? new Date(params.value).toLocaleString() : "",
      sortable: true,
      cellStyle: {
        color: "rgba(255, 255, 255, 0.7)",
        background: "transparent !important",
      },
    },
  ];

  // Function to auto-size columns
  const autoSizeAllColumns = useCallback((params: any) => {
    const allColumnIds: string[] = [];
    params.columnApi.getAllColumns()?.forEach((col: any) => {
      if (col.getColId()) allColumnIds.push(col.getColId());
    });
    params.columnApi.autoSizeColumns(allColumnIds, false);
  }, []);

  return (
    <div className="w-full flex flex-col gap-5 p-6">
      <div className="mb-8 backdrop-blur-xl bg-black/20 border border-white/10 rounded-2xl p-6 shadow-2xl">
        <h1 className="text-white text-3xl font-bold mb-2 flex items-center gap-3">
          <Star className="w-8 h-8 text-yellow-400" />
          Points Management
        </h1>
        <p className="text-white/70 text-lg">
          Quản lý các luồng nhận - dùng điểm của người dùng.
        </p>
      </div>
      {isLoading ? (
        <div className="w-full flex flex-col items-center justify-center h-96">
          <HasikiLoader />
        </div>
      ) : (
        <div className="flex flex-col gap-8">
          {/* Point Reward History Table */}
          <div className="backdrop-blur-xl bg-black/20 border border-white/10 rounded-2xl p-4 shadow-2xl">
            <h2 className="text-white text-2xl font-bold mb-4">
              Lịch sử nhận điểm của Khách Hàng
            </h2>
            <div
              className="ag-theme-alpine w-full"
              style={
                {
                  width: "100%",
                  height: "100%",
                  "--ag-background-color": "transparent",
                  "--ag-foreground-color": "rgba(255, 255, 255, 0.9)",
                  "--ag-border-color": "rgba(255, 255, 255, 0.1)",
                } as any
              }
            >
              <AgGridReact
                rowData={rewards}
                columnDefs={commonColumnDefs as any}
                domLayout="autoHeight"
                onGridReady={autoSizeAllColumns}
                animateRows={true}
                rowHeight={50}
                pagination={true}
                paginationPageSize={10}
              />
            </div>
          </div>

          {/* Point Spending History Table */}
          <div className="backdrop-blur-xl bg-black/20 border border-white/10 rounded-2xl p-4 shadow-2xl">
            <h2 className="text-white text-2xl font-bold mb-4">
              Lịch sử dùng điểm của Khách Hàng
            </h2>
            <div
              className="ag-theme-alpine w-full"
              style={
                {
                  width: "100%",
                  height: "100%",
                  "--ag-background-color": "transparent",
                  "--ag-foreground-color": "rgba(255, 255, 255, 0.9)",
                  "--ag-border-color": "rgba(255, 255, 255, 0.1)",
                } as any
              }
            >
              <AgGridReact
                rowData={spendings}
                columnDefs={commonColumnDefs as any}
                domLayout="autoHeight"
                onGridReady={autoSizeAllColumns}
                animateRows={true}
                rowHeight={50}
                pagination={true}
                paginationPageSize={10}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PointManagement;
