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
  CircularProgress,
} from "@mui/material";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import GameConfigLoader from "./GameConfigLoader";
import type { CreateGame, GameTypeImgUrl } from "../../data/types";
import { callAPIAdmin } from "../../api/axiosInstace";
import Swal from "sweetalert2";

// INTERFACES
interface CreateGameProps {
  isOpen: boolean;
  onClose: () => void;
}

const style = {
  position: "absolute" as const,
  top: "50px",
  left: "50px",
  right: "50px",
  bottom: "50px",
  bgcolor: "background.paper",
  borderRadius: 2,
  boxShadow: 24,
  p: 4,
  overflow: "auto",
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
  const today = new Date().toISOString().slice(0, 10);

  const [newGame, setNewGame] = useState<CreateGame>({
    gameEvent: {
      eventName: "",
      description: "",
      gameName: "",
      gameTypeId: 0,
      configJson: {},
      balancePoints: 0,
      startDate: today,
      endDate: today,
      imageBase64: "",
    },
    gameTypeImageBase64s: [],
  });

  const [isLoading, setIsLoading] = useState(true);
  const [gameTypes, setGameTypes] = useState<GameType[]>([]);

  useEffect(() => {
    reset();
    setGameTypes(gameTypesData);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (isOpen) {
      reset();
    }
  }, [isOpen]);

  const reset = () => {
    setIsLoading(true);
    setNewGame({
      gameEvent: {
        eventName: "",
        description: "",
        gameName: "",
        gameTypeId: 0,
        configJson: {},
        balancePoints: 0,
        startDate: today,
        endDate: today,
        imageBase64: "",
      },
      gameTypeImageBase64s: [],
    });
  };

  const handleCloseModal = () => {
    reset();
    onClose();
  };

  const handleChangeField = (
    key: keyof CreateGame["gameEvent"],
    value: any
  ) => {
    setNewGame((prev) => ({
      ...prev,
      gameEvent: {
        ...prev.gameEvent,
        [key]: value,
      },
    }));
  };

  const handleUploadImage = (value: { id: number; imageBase64: string }[]) => {
    setNewGame((prev) => ({
      ...prev,
      gameTypeImageBase64s: value,
    }));
  };

  const handleChangeGameType = (event: SelectChangeEvent<string>) => {
    const gameTypeId = Number(event.target.value);
    setIsLoading(true);
    setTimeout(() => {
      handleChangeField("gameTypeId", gameTypeId);
      handleChangeField("configJson", {});
      setIsLoading(false);
    }, 1000);
  };

  const handleCreateGame = async () => {
    if (newGame.gameEvent.configJson.backCoverImg) {
      handleChangeField(
        "imageBase64",
        newGame.gameEvent.configJson.backCoverImg
      );
    }
    try {
      const response = await callAPIAdmin({
        method: "POST",
        url: `/api/Game/gameEvents`,
        data: newGame,
      });
      if (response && response.status === 201) {
        Swal.fire("Thành công", "Tạo Game Events Thành công", "success");
        onClose();
      } else {
        Swal.fire("Lỗi", "Lỗi trong quá trình tạo game", "error");
      }
    } catch (error) {}
    // console.log(">>> Game Created Successfully!");
    // console.log(">>> Payload gửi đi:", updatedGame);
  };

  return (
    <Modal
      open={isOpen}
      onClose={handleCloseModal}
      aria-labelledby="create-game-modal-title"
      aria-describedby="create-game-modal-description"
      closeAfterTransition
      BackdropProps={{ style: { backgroundColor: "rgba(0, 0, 0, 0.5)" } }}
    >
      <Box sx={style} className="text-black">
        {/* HEADER */}
        <div className="h-[30px] grid grid-cols-2 mb-4">
          <Typography className="pl-5 text-xl font-bold">
            Create New Game
          </Typography>
          <div className="flex justify-end">
            <IconButton onClick={onClose}>
              <HighlightOffIcon color="action" />
            </IconButton>
          </div>
        </div>

        {/* BASIC INFORMATION */}
        <div className="flex flex-col gap-4">
          <Typography fontWeight="bold" className="text-cyan-700">
            1. Điền các thông tin cơ bản của sự kiện
          </Typography>

          <TextField
            label="Tên sự kiện"
            value={newGame.gameEvent.eventName}
            onChange={(e) => handleChangeField("eventName", e.target.value)}
          />
          <TextField
            label="Mô tả sự kiện"
            multiline
            rows={3}
            value={newGame.gameEvent.description}
            onChange={(e) => handleChangeField("description", e.target.value)}
          />
          <TextField
            label="Tên trò chơi"
            value={newGame.gameEvent.gameName}
            onChange={(e) => handleChangeField("gameName", e.target.value)}
          />
          <TextField
            label="Ngày bắt đầu"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={newGame.gameEvent.startDate}
            onChange={(e) => handleChangeField("startDate", e.target.value)}
          />
          <TextField
            label="Ngày kết thúc"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={newGame.gameEvent.endDate}
            onChange={(e) => handleChangeField("endDate", e.target.value)}
          />
          <TextField
            label="Điểm dự trù"
            type="number"
            value={newGame.gameEvent.balancePoints}
            onChange={(e) =>
              handleChangeField("balancePoints", Number(e.target.value))
            }
          />
        </div>

        {/* GAME TYPE + CONFIG */}
        <div className="flex flex-col mt-8">
          <Typography fontWeight="bold" className="text-cyan-700">
            2. Chọn loại game và config chi tiết
          </Typography>

          <FormControl fullWidth className="mt-3">
            <InputLabel id="game-select-label">Game Type</InputLabel>
            <Select
              labelId="game-select-label"
              id="game-select"
              value={newGame.gameEvent.gameTypeId}
              label="Game Type"
              onChange={(e) => handleChangeGameType(e)}
            >
              {gameTypes.map((item) => (
                <MenuItem key={item.id} value={item.id}>
                  {item.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {isLoading ? (
            <CircularProgress />
          ) : (
            <div className="mt-6 p-5 bg-gray-100 rounded-xl shadow-md">
              <GameConfigLoader
                gameTypeId={newGame.gameEvent.gameTypeId}
                configJson={newGame.gameEvent.configJson}
                gameTypeImageBase64s={newGame.gameTypeImageBase64s}
                handleUploadImages={(
                  gameTypeImageBase64: { id: number; imageBase64: string }[]
                ) => handleUploadImage(gameTypeImageBase64)}
                setConfigJson={(json) => handleChangeField("configJson", json)}
              />
            </div>
          )}

          <Button
            fullWidth
            color="info"
            variant="contained"
            className="mt-5"
            onClick={handleCreateGame}
          >
            Tạo game
          </Button>
        </div>
      </Box>
    </Modal>
  );
};
