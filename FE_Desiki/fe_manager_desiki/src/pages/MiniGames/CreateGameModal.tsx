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
  CircularProgress,
} from "@mui/material";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import GameConfigLoader from "./GameConfigLoader";
import type { CreateGame } from "../../data/types";
import { callAPIAdmin } from "../../api/axiosInstace";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

interface CreateGameProps {
  isOpen: boolean;
  onClose: () => void;
}

const style = {
  position: "absolute" as const,
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: "rgba(255, 255, 255, 1)",
  borderRadius: 3,
  boxShadow: 24,
  p: 4,
  width: "90%",
  maxWidth: 700,
  maxHeight: "90vh",
  overflowY: "auto",
};

const gameTypesData = [
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
  const [gameTypes, setGameTypes] = useState(gameTypesData);
  const navigate = useNavigate();
  useEffect(() => {
    if (isOpen) reset();
  }, [isOpen]);

  const reset = () => {
    setIsLoading(false);
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

  const handleChangeGameType = (event: any) => {
    const gameTypeId = Number(event.target.value);
    setIsLoading(true);
    setTimeout(() => {
      handleChangeField("gameTypeId", gameTypeId);
      handleChangeField("configJson", {});
      setIsLoading(false);
    }, 600);
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
      if (response?.status === 201) {
        toast.success(
          "Tạo game thành công! Vui lòng Kích hoạt game để bật sự kiện"
        );
        onClose();
        navigate(0);
      } else {
        Swal.fire("Lỗi", "Lỗi trong quá trình tạo game", "error");
      }
    } catch (error) {
      Swal.fire("Lỗi", "Lỗi không xác định.", "error");
    }
  };

  return (
    <Modal open={isOpen} onClose={handleCloseModal} closeAfterTransition>
      <Box sx={style} className="text-black  shadow-xl">
        {/* HEADER */}
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={3}
        >
          <Typography variant="h6" fontWeight="bold" color="primary">
            Tạo Mini Game mới
          </Typography>
          <IconButton onClick={onClose}>
            <HighlightOffIcon />
          </IconButton>
        </Box>

        {/* BASIC INFORMATION */}
        <Typography
          variant="subtitle1"
          fontWeight="bold"
          color="info.main"
          gutterBottom
        >
          1. Điền các thông tin cơ bản của sự kiện
        </Typography>

        <Box display="flex" flexDirection="column" gap={2}>
          <TextField
            label="Tên sự kiện"
            value={newGame.gameEvent.eventName}
            onChange={(e) => handleChangeField("eventName", e.target.value)}
            fullWidth
          />
          <TextField
            label="Mô tả sự kiện"
            multiline
            rows={3}
            value={newGame.gameEvent.description}
            onChange={(e) => handleChangeField("description", e.target.value)}
            fullWidth
          />
          <TextField
            label="Tên trò chơi"
            value={newGame.gameEvent.gameName}
            onChange={(e) => handleChangeField("gameName", e.target.value)}
            fullWidth
          />
          <TextField
            label="Ngày bắt đầu"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={newGame.gameEvent.startDate}
            onChange={(e) => handleChangeField("startDate", e.target.value)}
            fullWidth
          />
          <TextField
            label="Ngày kết thúc"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={newGame.gameEvent.endDate}
            onChange={(e) => handleChangeField("endDate", e.target.value)}
            fullWidth
          />
          <TextField
            label="Điểm dự trù"
            type="number"
            value={newGame.gameEvent.balancePoints}
            onChange={(e) =>
              handleChangeField("balancePoints", Number(e.target.value))
            }
            fullWidth
          />
        </Box>

        {/* GAME TYPE + CONFIG */}
        <Box mt={5}>
          <Typography
            variant="subtitle1"
            fontWeight="bold"
            color="info.main"
            gutterBottom
          >
            2. Chọn loại game và config chi tiết
          </Typography>

          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Game Type</InputLabel>
            <Select
              value={newGame.gameEvent.gameTypeId}
              label="Game Type"
              onChange={handleChangeGameType}
            >
              {gameTypes.map((type) => (
                <MenuItem key={type.id} value={type.id}>
                  {type.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {isLoading ? (
            <Box display="flex" justifyContent="center" mt={4}>
              <CircularProgress />
            </Box>
          ) : (
            <Box
              sx={{ width: "100%" }}
              mt={4}
              p={3}
              bgcolor="#f5f5f5"
              borderRadius={2}
            >
              <GameConfigLoader
                gameTypeId={newGame.gameEvent.gameTypeId}
                configJson={newGame.gameEvent.configJson}
                gameTypeImageBase64s={newGame.gameTypeImageBase64s}
                handleUploadImages={handleUploadImage}
                setConfigJson={(json) => handleChangeField("configJson", json)}
              />
            </Box>
          )}

          <Button
            fullWidth
            color="primary"
            variant="contained"
            sx={{
              mt: 4,
              borderRadius: 3,
              py: 1.5,
              fontWeight: "bold",
              backgroundColor: "#1c79eb",
              ":hover": { backgroundColor: "#0b50a3" },
            }}
            onClick={handleCreateGame}
          >
            Tạo game
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};
