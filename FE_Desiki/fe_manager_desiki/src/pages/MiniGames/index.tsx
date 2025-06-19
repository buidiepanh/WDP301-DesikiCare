import { Button, CircularProgress, IconButton, Paper, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { CreateGameModal } from "./CreateGameModal";
import type { GameEvent, GameType } from "../../data/types";
import { AgGridReact } from "ag-grid-react";
import { Visibility, Edit, Block } from "@mui/icons-material";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import "./style.css";
import { callAPIAdmin } from "../../api/axiosInstace";

const MiniGameManagement = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [gameEvents, setGameEvents] = useState<GameEvent[] | null>(null);
  const [gameTypes, setGameTypes] = useState<GameType[] | null>(null);
  const [gameEventRunnings, setGameEventRunnings] = useState<GameEvent[] | null>(null);
  const [gameEventClosings, setGameEventClosings] = useState<GameEvent[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      await fetch();
    };
    fetchData();
  }, []);

  const fetch = async () => {
    try {
      const response = await callAPIAdmin({ method: "GET", url: `/api/Game/gameEvents` });
      if (response?.status === 200) {
        const responseGameType = await callAPIAdmin({ method: "GET", url: `/api/Game/gameTypes` });
        if (responseGameType?.status === 200) {
          const events = response.data.gameEvents;
          setGameEvents(events);
          setGameTypes(responseGameType.data.gameTypes);
          setGameEventRunnings(events.filter((game) => !game.gameEvent.isDeactivated));
          setGameEventClosings(events.filter((game) => game.gameEvent.isDeactivated));
        }
      }
      setIsLoading(false);
    } catch (error) {
      console.error("Error while fetching game events:", error);
      setIsLoading(false);
    }
  };

  const handleOpenCreateModal = () => setIsCreateModalOpen(true);
  const onCloseCreateModal = () => setIsCreateModalOpen(false);

  const handleViewDetails = (id: string) => console.log("View details:", id);
  const handleEdit = (id: string) => console.log("Edit:", id);
  const handleDeactivate = (id: string) => console.log("Deactivate:", id);

  const defaultColDef = {
    sortable: true,
    resizable: true,
    filter: true,
    flex: 1,
    minWidth: 140,
  };

  const columnDefs = [
    { headerName: "Mã sự kiện", field: "gameEvent._id" },
    { headerName: "Tên sự kiện", field: "gameEvent.eventName" },
    { headerName: "Tên trò chơi", field: "gameEvent.gameName" },
    {
      headerName: "Loại trò chơi",
      field: "gameEvent.gameTypeId",
      valueFormatter: (params: any) => {
        const map = { 1: "Vòng quay", 2: "Ghép cặp", 3: "Cào thẻ", 4: "Điền từ" };
        return map[params.value] || "Không rõ";
      },
    },
    { headerName: "Điểm còn lại", field: "gameEvent.balancePoints" },
    {
      headerName: "Người tham gia",
      valueGetter: (params: any) => params.data?.gameEventRewardResults?.length || 0,
      valueFormatter: (params: any) => `${params.value} người`,
    },
    {
      headerName: "Ngày bắt đầu",
      field: "gameEvent.startDate",
      valueFormatter: (params: any) => new Date(params.value).toLocaleDateString("vi-VN"),
    },
    {
      headerName: "Ngày kết thúc",
      field: "gameEvent.endDate",
      valueFormatter: (params: any) => new Date(params.value).toLocaleDateString("vi-VN"),
    },
    {
      headerName: "Thao tác",
      cellRenderer: (params: any) => {
        const id = params.data.gameEvent._id;
        return (
          <div className="flex gap-2 justify-center items-center">
            <IconButton color="info" onClick={() => handleViewDetails(id)}><Visibility fontSize="small" /></IconButton>
            <IconButton color="primary" onClick={() => handleEdit(id)}><Edit fontSize="small" /></IconButton>
            <IconButton color="error" onClick={() => handleDeactivate(id)}><Block fontSize="small" /></IconButton>
          </div>
        );
      },
      minWidth: 180,
    },
  ];

  return (
    <div className="w-full h-full flex flex-col items-center bg-[#fdf2f8] pb-10">
      <Typography variant="h4" fontWeight="bold" color="#212121" mt={4}>
        Mini Game Management
      </Typography>

      <div className="w-11/12 my-5 flex justify-end">
        <Button
          onClick={handleOpenCreateModal}
          variant="contained"
          sx={{
            backgroundColor: "#ec407a",
            ":hover": { backgroundColor: "#d81b60" },
            textTransform: "none",
            fontWeight: "bold",
            borderRadius: "20px",
            px: 3,
          }}
        >
          Tạo Mini Games
        </Button>
      </div>

      {isLoading ? (
        <CircularProgress />
      ) : (
        <div className="w-11/12 flex flex-col gap-10">
          <Paper elevation={3} sx={{ p: 3, borderRadius: 3 }}>
            <Typography variant="h6" color="#ec407a" fontWeight="bold" gutterBottom>
              Danh sách game đang chạy
            </Typography>
            <div className="ag-theme-alpine" style={{ height: 300 }}>
              <AgGridReact
                rowData={gameEventRunnings || []}
                columnDefs={columnDefs}
                defaultColDef={defaultColDef}
                pagination={true}
                paginationPageSize={5}
                rowHeight={60}
              />
            </div>
          </Paper>

          <Paper elevation={2} sx={{ p: 3, borderRadius: 3 }}>
            <Typography variant="h6" color="#666" fontWeight="bold" gutterBottom>
              Danh sách game đã đóng
            </Typography>
            <div className="ag-theme-alpine" style={{ height: 300 }}>
              <AgGridReact
                rowData={gameEventClosings || []}
                columnDefs={columnDefs}
                defaultColDef={defaultColDef}
                pagination={true}
                paginationPageSize={5}
                rowHeight={60}
              />
            </div>
          </Paper>
        </div>
      )}

      <CreateGameModal isOpen={isCreateModalOpen} onClose={onCloseCreateModal} />
    </div>
  );
};

export default MiniGameManagement;
