import { Button, CircularProgress, IconButton } from "@mui/material";
import { useEffect, useState } from "react";
import { CreateGameModal } from "./CreateGameModal";
import type { GameEvent, GameType } from "../../data/types";
import { gameEventsData, gameTypesData } from "../../data/mockData";
import { AgGridReact } from "ag-grid-react";
import { Visibility, Edit, Block } from "@mui/icons-material";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import "./style.css";
import { callAPIAdmin, callAPIManager } from "../../api/axiosInstace";

const MiniGameManagement = () => {
  // STATES
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [gameEvents, setGameEvents] = useState<GameEvent[] | null>(null);
  const [gameTypes, setGameTypes] = useState<GameType[] | null>(null);
  const [gameEventRunnings, setGameEventRunnings] = useState<
    GameEvent[] | null
  >(null);
  const [gameEventClosings, setGameEventClosings] = useState<
    GameEvent[] | null
  >(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedGameEvent, setSelectedGameEvent] = useState<GameEvent | null>(
    null
  );

  // HOOKS
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      await fetch();
    };
    fetchData();
  }, []);

  // FUNCTIONS
  const fetch = async () => {
    try {
      const response = await callAPIAdmin({
        method: "GET",
        url: `/api/Game/gameEvents`,
      });
      if (response && response.status === 200) {
        const responseGameType = await callAPIAdmin({
          method: "GET",
          url: `/api/Game/gameTypes`,
        });
        if (responseGameType && responseGameType.status === 200) {
          setGameEvents(response.data.gameEvents);
          setGameTypes(responseGameType.data.gameTypes);
          const running = response.data.gameEvents.filter(
            (game) => !game.gameEvent.isDeactivated
          );
          const closing = response.data.gameEvents.filter(
            (game) => game.gameEvent.isDeactivated
          );
          setGameEventRunnings(running);
          setGameEventClosings(closing);
          setIsLoading(false);
        }
      }
    } catch (error) {
      console.log("Error while fetching game events: ", error);
    }
  };

  const handleOpenCreateModal = () => setIsCreateModalOpen(true);
  const onCloseCreateModal = () => setIsCreateModalOpen(false);

  const handleViewDetails = (id: string) => {
    console.log("View details for Game Event:", id);
  };

  const handleEdit = (id: string) => {
    console.log("Edit Game Event:", id);
  };

  const handleDeactivate = (id: string) => {
    console.log("Deactivate Game Event:", id);
  };

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
        const id = params.value;
        switch (id) {
          case 1:
            return "Vòng quay";
          case 2:
            return "Ghép cặp";
          case 3:
            return "Cào thẻ";
          case 4:
            return "Điền từ";
          default:
            return "Không rõ";
        }
      },
    },
    {
      headerName: "Điểm còn lại",
      field: "gameEvent.balancePoints",
    },
    {
      headerName: "Người tham gia",
      valueGetter: (params: any) =>
        params.data?.gameEventRewardResults?.length || 0,
      valueFormatter: (params: any) => `${params.value} người`,
    },
    {
      headerName: "Ngày bắt đầu",
      field: "gameEvent.startDate",
      valueFormatter: (params: any) =>
        new Date(params.value).toLocaleDateString("vi-VN"),
    },
    {
      headerName: "Ngày kết thúc",
      field: "gameEvent.endDate",
      valueFormatter: (params: any) =>
        new Date(params.value).toLocaleDateString("vi-VN"),
    },
    {
      headerName: "Thao tác",
      cellRenderer: (params: any) => {
        const id = params.data.gameEvent._id;
        return (
          <div className="flex gap-2 justify-center items-center">
            <IconButton color="info" onClick={() => handleViewDetails(id)}>
              <Visibility fontSize="small" />
            </IconButton>
            <IconButton color="primary" onClick={() => handleEdit(id)}>
              <Edit fontSize="small" />
            </IconButton>
            <IconButton color="error" onClick={() => handleDeactivate(id)}>
              <Block fontSize="small" />
            </IconButton>
          </div>
        );
      },
      minWidth: 180,
    },
  ];

  return (
    <div className="w-full h-full flex flex-col items-center">
      <h1 className="text-black md:text-4xl sm:text-xl mt-3 font-bold">
        Mini Game Management
      </h1>
      <div className="w-11/12 my-5 flex md:justify-end sm:justify-center items-center">
        <Button
          onClick={handleOpenCreateModal}
          variant="contained"
          color="primary"
        >
          Tạo Mini Games
        </Button>
      </div>

      {isLoading ? (
        <CircularProgress />
      ) : (
        <div className="my-10 gap-10 text-black w-full p-5">
          {/* RUNNING GAMES */}
          <div className="w-full gap-3 flex flex-col">
            <p className="text-2xl text-cyan-600 font-bold">
              Danh sách game đang chạy
            </p>
            <div className="ag-theme-alpine w-full" style={{ height: 250 }}>
              <AgGridReact
                rowData={gameEventRunnings || []}
                columnDefs={columnDefs}
                defaultColDef={defaultColDef}
                pagination={true}
                paginationPageSize={5}
                rowHeight={60}
              />
            </div>
          </div>

          {/* CLOSED GAMES */}
          <div className="w-full gap-3 flex flex-col mt-10">
            <p className="text-2xl text-gray-400 font-bold">
              Danh sách game đã đóng
            </p>
            <div className="ag-theme-alpine w-full h-[250px]">
              <AgGridReact
                rowData={gameEventClosings || []}
                columnDefs={columnDefs}
                defaultColDef={defaultColDef}
                pagination={true}
                paginationPageSize={5}
                rowHeight={60}
              />
            </div>
          </div>
        </div>
      )}

      <CreateGameModal
        isOpen={isCreateModalOpen}
        onClose={onCloseCreateModal}
      />
    </div>
  );
};

export default MiniGameManagement;
