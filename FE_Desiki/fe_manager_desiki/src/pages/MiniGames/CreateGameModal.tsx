import React, { useEffect, useState } from "react";
import {
  Modal,
  Box,
  Typography,
  Button,
  IconButton,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  type SelectChangeEvent,
} from "@mui/material";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import GameConfigLoader from "./GameConfigLoader";

// INTERFACES
interface CreateGameProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ConfigJson {
  [key: string]: any;
  // ....
}

const style = {
  position: "absolute" as "absolute",
  top: "50px",
  left: "50px",
  right: "50px",
  bottom: "50px",
  bgcolor: "background.paper",
  borderRadius: 2,
  boxShadow: 24,
  p: 4,
  overflow: "auto", // để cuộn nếu nội dung quá dài
};

type GameType = {
  id: number;
  name: string;
};

const gameTypesData: GameType[] = [
  { id: 1, name: "Spinning Wheels" },
  { id: 2, name: "Memory Catching" },
  { id: 3, name: "Scratch Card" },
  { id: 4, name: "Missing Words" },
];

export const CreateGameModal: React.FC<CreateGameProps> = ({
  isOpen,
  onClose,
}) => {
  // VARIABLES
  const today = new Date().toISOString().slice(0, 10);

  // STATES
  const [isLoading, setIsLoading] = useState(true);
  const [eventName, setEventName] = useState("");
  const [eventDescription, setEventDescription] = useState("");
  const [gameName, setGameName] = useState("");
  const [startDate, setStartDate] = React.useState<string>(today);
  const [endDate, setEndDate] = React.useState<string>(today);
  const [gameTypes, setGameTypes] = useState<GameType[]>([]);
  const [gameTypeId, setGameTypeId] = useState(0);
  const [configJson, setConfigJson] = useState<ConfigJson | null>(null);
  // HOOKS
  useEffect(() => {
    reset();
    setGameTypes(gameTypesData);
    setIsLoading(false);
  }, []);

  // FUNCTIONS
  const reset = () => {
    setIsLoading(true);
    setEventName("");
    setEventDescription("");
    setGameName("");
    setStartDate(today);
    setEndDate(today);
    setGameTypes([]);
    setGameTypeId(0);
    setConfigJson(null);
  };

  const handleChangeGameType = (event: SelectChangeEvent<string>) => {
    setGameTypeId(Number(event.target.value));
  };
  const handleCreateGame = () => {
    console.log(">>>Game Created Successfully!");
    console.log(">>>Event Name: ", eventName);
    console.log(">>>Event Description: ", eventDescription);
    console.log(">>>Game Name: ", gameName);
    console.log(">>>Start Date: ", startDate);
    console.log(">>>End Date: ", endDate);
    console.log(">>>Game Type Id: ", gameTypeId);
    console.log(">>>Config Json: ", JSON.stringify(configJson));
  };

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      aria-labelledby="create-game-modal-title"
      aria-describedby="create-game-modal-description"
      closeAfterTransition
      BackdropProps={{ style: { backgroundColor: "rgba(0, 0, 0, 0.5)" } }}
    >
      <div
        className="
         absolute 
         top-[50px] left-[50px] right-[50px] bottom-[50px] 
         bg-white 
         rounded-sm 
         shadow-[24px] 
         p-4 
         overflow-auto"
      >
        {/* HEADER */}
        <div className="h-[30px] grid grid-cols-2">
          <div className="flex items-center justify-start text-black font-bold">
            <p className="pl-5 text-xl">Create New Game</p>
          </div>
          <div className="flex items-center justify-end text-red-200">
            <IconButton onClick={() => onClose()}>
              <HighlightOffIcon color="action" />
            </IconButton>
          </div>
        </div>

        {/* BASIC INFORMATIONS */}
        <div className="flex flex-col text-black p-5">
          <p className="font-bold text-cyan-700">
            1. Điền các thông tin cơ bản của sự kiện
          </p>

          {/* Event's Name */}
          <div className="flex flex-col p-2">
            <p className="mb-2 font-semibold text-gray-700">Tên sự kiện:</p>
            <TextField
              value={eventName}
              placeholder="Ex: Sự kiện chào mừng ngày 08/03!"
              onChange={(e) => setEventName(e.target.value)}
            />
          </div>

          {/* Event's Description */}
          <div className="flex flex-col p-2">
            <p className="mb-2 font-semibold text-gray-700">Mô tả sự kiện:</p>
            <TextField
              value={eventDescription}
              multiline
              rows={3}
              placeholder="Ex: Nhân dịp kỉ niệm Quốc tế Phụ nữ Việt Nam, Desiki tổ chức mini-games để..."
              onChange={(e) => setEventDescription(e.target.value)}
            />
          </div>

          {/* Game's Name */}
          <div className="flex flex-col p-2">
            <p className="mb-2 font-semibold text-gray-700">
              Tên của trò chơi:
            </p>
            <TextField
              value={gameName}
              placeholder="Ex: Vòng quay sắc đẹp"
              onChange={(e) => setGameName(e.target.value)}
            />
          </div>

          {/* Start Date */}
          <div className="flex flex-col p-2">
            <p className="mb-2 font-semibold text-gray-700">Ngày bắt đầu:</p>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="border border-gray-300 rounded px-2 py-1"
            />
          </div>

          {/* End Date */}
          <div className="flex flex-col p-2">
            <p className="mb-2 font-semibold text-gray-700">Ngày kết thúc:</p>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="border border-gray-300 rounded px-2 py-1"
            />
          </div>
        </div>

        {/* GAME DETAILS CONFIG INFORMATIONS */}
        <div className="flex flex-col text-black p-5">
          <p className="font-bold text-cyan-700">
            2. Chọn loại game và config chi tiết
          </p>

          {/* Game's Type */}
          <div className="flex flex-col p-2">
            <p className="mb-2 font-semibold text-gray-700">
              Chọn loại Game cho sự kiện:
            </p>
            {!isLoading ? (
              <FormControl fullWidth>
                <InputLabel id="game-select-label">Game Type</InputLabel>
                <Select
                  labelId="game-select-label"
                  id="game-select"
                  value={gameTypeId}
                  label="Game Type"
                  onChange={handleChangeGameType}
                >
                  {gameTypes.map((item, index) => (
                    <MenuItem key={item.id} value={item.id}>
                      {item.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            ) : (
              <p>Đợi xíu đang load...</p>
            )}

            <div className="mt-10 mb-5 p-5 bg-gray-100 rounded-xl shadow-md ">
              <GameConfigLoader
                gameTypeId={gameTypeId}
                configJson={configJson}
                setConfigJson={setConfigJson}
              />
            </div>

            <Button
              fullWidth
              color="info"
              variant="contained"
              onClick={() => handleCreateGame()}
            >
              Tạo game
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
