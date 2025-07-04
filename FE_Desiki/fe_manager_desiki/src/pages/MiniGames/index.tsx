import type React from "react";

import { useEffect, useState } from "react";
import { CircularProgress } from "@mui/material";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-theme-alpine.css";
import "@/styles/ag-grid-glassmophorism.css";
import { Plus, Eye, Edit, Ban, Gamepad2, Play, Square } from "lucide-react";
import type { GameEvent, GameType } from "../../data/types";
import { CreateGameModal } from "./CreateGameModal";
import { callAPIAdmin } from "../../api/axiosInstace";
import { ca } from "zod/v4/locales";
import toast from "react-hot-toast";

// Custom Glassmorphism Components
const GlassButton = ({
  children,
  onClick,
  variant = "primary",
  size = "md",
}: {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "success" | "warning" | "error";
  size?: "sm" | "md" | "lg";
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case "primary":
        return "bg-blue-500/20 border-blue-400/40 text-blue-100 hover:bg-blue-500/30";
      case "secondary":
        return "bg-slate-500/20 border-slate-400/40 text-slate-100 hover:bg-slate-500/30";
      case "success":
        return "bg-emerald-500/20 border-emerald-400/40 text-emerald-100 hover:bg-emerald-500/30";
      case "warning":
        return "bg-amber-500/20 border-amber-400/40 text-amber-100 hover:bg-amber-500/30";
      case "error":
        return "bg-red-500/20 border-red-400/40 text-red-100 hover:bg-red-500/30";
      default:
        return "bg-blue-500/20 border-blue-400/40 text-blue-100 hover:bg-blue-500/30";
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case "sm":
        return "px-3 py-1.5 text-sm";
      case "lg":
        return "px-6 py-4 text-lg";
      default:
        return "px-4 py-3 text-base";
    }
  };

  return (
    <button
      onClick={onClick}
      className={`${getVariantStyles()} ${getSizeStyles()} border rounded-lg font-medium backdrop-blur-sm transition-all duration-200 shadow-lg flex items-center justify-center gap-2`}
      style={{ backdropFilter: "blur(8px)" }}
    >
      {children}
    </button>
  );
};

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
      style={{ backdropFilter: "blur(8px)" }}
    >
      {label}
    </span>
  );
};

const MiniGameManagement = () => {
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

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      await fetch();
    };
    fetchData();
  }, []);

  const fetch = async () => {
    try {
      const response = await callAPIAdmin({
        method: "GET",
        url: `/api/Game/gameEvents`,
      });
      if (response?.status === 200) {
        const responseGameType = await callAPIAdmin({
          method: "GET",
          url: `/api/Game/gameTypes`,
        });
        if (responseGameType?.status === 200) {
          const events = response.data.gameEvents;
          setGameEvents(events);
          setGameTypes(responseGameType.data.gameTypes);
          setGameEventRunnings(
            events.filter((game: any) => !game.gameEvent.isDeactivated)
          );
          setGameEventClosings(
            events.filter((game: any) => game.gameEvent.isDeactivated)
          );
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
  const handleDeactivate = async (id: string) => {
    const game = gameEvents?.filter((g) => g.gameEvent._id === id)[0];
    const mode = game?.gameEvent.isDeactivated;

    try {
      const response = await callAPIAdmin({
        method: "PUT",
        url: `/api/Game/gameEvents/${id}/deactivate/${!mode}`,
      });
      if (response && response.status === 200) {
        toast.success("Vô hiệu hóa game thành công!");
        await fetch();
      } else {
        toast.error("Lỗi, vui lòng thử lại sau!");
      }
    } catch (error) {
      console.log("Lỗi khi deactivate game: ", error);
    }
  };

  const defaultColDef = {
    sortable: true,
    resizable: true,
    filter: true,
    flex: 1,
    minWidth: 140,
  };

  const columnDefs = [
    {
      headerName: "Mã sự kiện",
      field: "gameEvent._id",
      cellStyle: {
        color: "rgba(255, 255, 255, 0.9)",
        background: "transparent !important",
        fontFamily: "monospace",
      },
      minWidth: 120,
    },
    {
      headerName: "Tên sự kiện",
      field: "gameEvent.eventName",
      cellStyle: {
        color: "rgba(255, 255, 255, 0.95)",
        background: "transparent !important",
        fontWeight: "500",
      },
    },
    {
      headerName: "Tên trò chơi",
      field: "gameEvent.gameName",
      cellStyle: {
        color: "rgba(255, 255, 255, 0.9)",
        background: "transparent !important",
      },
    },
    {
      headerName: "Loại trò chơi",
      field: "gameEvent.gameTypeId",
      cellRenderer: (params: any) => {
        const gameTypeMap: {
          [key: number]: {
            name: string;
            variant: "primary" | "success" | "warning" | "error";
          };
        } = {
          1: { name: "Vòng quay", variant: "primary" },
          2: { name: "Ghép cặp", variant: "success" },
          3: { name: "Cào thẻ", variant: "warning" },
          4: { name: "Điền từ", variant: "error" },
        };
        const gameType = gameTypeMap[params.value] || {
          name: "Không rõ",
          variant: "primary" as const,
        };
        return (
          <div className="flex items-center h-full">
            <GlassChip label={gameType.name} variant={gameType.variant} />
          </div>
        );
      },
      cellStyle: {
        background: "transparent !important",
        display: "flex",
        alignItems: "center",
      },
    },
    {
      headerName: "Điểm còn lại",
      field: "gameEvent.balancePoints",
      valueFormatter: (params: any) => params.value.toLocaleString("vi-VN"),
      cellStyle: {
        color: "rgba(255, 255, 255, 0.9)",
        background: "transparent !important",
        fontWeight: "600",
      },
    },
    {
      headerName: "Người tham gia",
      valueGetter: (params: any) =>
        params.data?.gameEventRewardResults?.length || 0,
      valueFormatter: (params: any) => `${params.value} người`,
      cellStyle: {
        color: "rgba(255, 255, 255, 0.9)",
        background: "transparent !important",
      },
    },
    {
      headerName: "Ngày bắt đầu",
      field: "gameEvent.startDate",
      valueFormatter: (params: any) =>
        new Date(params.value).toLocaleDateString("vi-VN"),
      cellStyle: {
        color: "rgba(255, 255, 255, 0.8)",
        background: "transparent !important",
      },
    },
    {
      headerName: "Ngày kết thúc",
      field: "gameEvent.endDate",
      valueFormatter: (params: any) =>
        new Date(params.value).toLocaleDateString("vi-VN"),
      cellStyle: {
        color: "rgba(255, 255, 255, 0.8)",
        background: "transparent !important",
      },
    },
    {
      headerName: "Thao tác",
      cellRenderer: (params: any) => {
        const id = params.data.gameEvent._id;
        return (
          <div className="flex gap-2 justify-center items-center h-full">
            <button
              onClick={() => handleViewDetails(id)}
              className="p-2 bg-blue-500/20 border border-blue-400/40 text-blue-200 hover:bg-blue-500/30 transition-all duration-200 backdrop-blur-sm rounded-lg"
              title="Xem chi tiết"
            >
              <Eye className="h-4 w-4" />
            </button>
            <button
              onClick={() => handleEdit(id)}
              className="p-2 bg-amber-500/20 border border-amber-400/40 text-amber-200 hover:bg-amber-500/30 transition-all duration-200 backdrop-blur-sm rounded-lg"
              title="Chỉnh sửa"
            >
              <Edit className="h-4 w-4" />
            </button>
            <button
              onClick={() => handleDeactivate(id)}
              className="p-2 bg-red-500/20 border border-red-400/40 text-red-200 hover:bg-red-500/30 transition-all duration-200 backdrop-blur-sm rounded-lg"
              title="Vô hiệu hóa"
            >
              <Ban className="h-4 w-4" />
            </button>
          </div>
        );
      },
      cellStyle: {
        background: "transparent !important",
      },
      minWidth: 180,
    },
  ];

  return (
    <div className="w-full flex flex-col p-6">
      {/* Header */}
      <div className="mb-8 backdrop-blur-xl bg-black/20 border border-white/10 rounded-2xl p-6 shadow-2xl">
        <h1 className="text-white text-3xl font-bold mb-2 flex items-center gap-3">
          <Gamepad2 className="h-8 w-8" />
          Mini Game Management
        </h1>
        <p className="text-white/70 text-lg">
          Quản lý các mini game và sự kiện trong hệ thống.
        </p>
      </div>

      {/* Create Button */}
      <div className="mb-6 flex justify-end">
        <GlassButton onClick={handleOpenCreateModal} variant="success">
          <Plus className="h-4 w-4" />
          Tạo Mini Games
        </GlassButton>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="w-full flex justify-center py-20">
          <div className="backdrop-blur-xl bg-black/20 border border-white/20 rounded-2xl p-8">
            <CircularProgress sx={{ color: "rgba(255, 255, 255, 0.8)" }} />
            <p className="text-white/80 mt-4 text-center">
              Đang tải dữ liệu...
            </p>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-8">
          {/* Running Games */}
          <div>
            <div className="backdrop-blur-xl bg-black/20 border border-white/10 rounded-2xl p-6 shadow-2xl mb-4">
              <h2 className="text-white text-xl font-semibold mb-2 flex items-center gap-2">
                <Play className="h-5 w-5 text-emerald-400" />
                Danh sách game đang chạy
              </h2>
              <p className="text-white/70">
                Các mini game hiện đang hoạt động.
              </p>
            </div>

            <div className="backdrop-blur-xl bg-black/20 border border-white/10 rounded-2xl p-4 shadow-2xl">
              <div
                className="ag-theme-alpine w-full"
                style={
                  {
                    height: "350px",
                    "--ag-background-color": "transparent",
                    "--ag-foreground-color": "rgba(255, 255, 255, 0.9)",
                    "--ag-border-color": "rgba(255, 255, 255, 0.1)",
                  } as any
                }
              >
                <AgGridReact
                  rowData={gameEventRunnings || []}
                  columnDefs={columnDefs}
                  defaultColDef={defaultColDef}
                  pagination={true}
                  paginationPageSize={5}
                  rowHeight={60}
                  animateRows={true}
                />
              </div>
            </div>
          </div>

          {/* Closed Games */}
          <div>
            <div className="backdrop-blur-xl bg-black/20 border border-white/10 rounded-2xl p-6 shadow-2xl mb-4">
              <h2 className="text-white text-xl font-semibold mb-2 flex items-center gap-2">
                <Square className="h-5 w-5 text-red-400" />
                Danh sách game đã đóng
              </h2>
              <p className="text-white/70">
                Các mini game đã kết thúc hoặc bị vô hiệu hóa.
              </p>
            </div>

            <div className="backdrop-blur-xl bg-black/20 border border-white/10 rounded-2xl p-4 shadow-2xl">
              <div
                className="ag-theme-alpine w-full"
                style={
                  {
                    height: "350px",
                    "--ag-background-color": "transparent",
                    "--ag-foreground-color": "rgba(255, 255, 255, 0.9)",
                    "--ag-border-color": "rgba(255, 255, 255, 0.1)",
                  } as any
                }
              >
                <AgGridReact
                  rowData={gameEventClosings || []}
                  columnDefs={columnDefs}
                  defaultColDef={defaultColDef}
                  pagination={true}
                  paginationPageSize={5}
                  rowHeight={60}
                  animateRows={true}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal */}
      <CreateGameModal
        isOpen={isCreateModalOpen}
        onClose={onCloseCreateModal}
      />
    </div>
  );
};

export default MiniGameManagement;
