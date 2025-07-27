import { useState, useEffect } from "react";

import {
  Modal,
  Box,
  Tabs,
  Tab,
  Typography,
  Button,
  IconButton,
  Chip,
  List,
  ListItem,
  ListItemText,
  Divider,
  Paper,
} from "@mui/material";

import {
  Close as CloseIcon,
  PlayArrow as PlayArrowIcon,
} from "@mui/icons-material";

import MemoryCatching from "./games/MemoryCatching";

import "./styles.css";
import SpinWheelUI from "./games/SpinWheel";
import ScratchCardUI from "./games/ScratchCard";
import ErrorBoundary from "./games/ErrorBoundary";

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "90%",
  maxWidth: "1000px",
  height: "90%",
  maxHeight: "800px",
  backgroundColor: "white",
  borderRadius: "16px",
  boxShadow: 24,
  overflow: "hidden",
  display: "flex",
  flexDirection: "column",
};

const gameTypeNames = {
  1: "Vòng Quay May Mắn",
  2: "Ghép Cặp Thẻ Bài",
  3: "Cào Thẻ Trúng Thưởng",
};

const gameTypeIcons = {
  1: "🎡",
  2: "🃏",
  3: "🎫",
};

export const GamesModal = ({ games, onClose, isOpen, onUpdatePoints }) => {
  const [selectedTab, setSelectedTab] = useState(0);
  const [selectedGame, setSelectedGame] = useState(null);
  const [gameTypes, setGameTypes] = useState([]);

  useEffect(() => {
    console.log("Thông tin game: ", games);
    if (games && games.gameEvents && games.gameEvents.length > 0) {
      // Phân loại games theo gameTypeId
      const types = {};
      games.gameEvents.forEach((gameData) => {
        const typeId = gameData.gameEvent.gameTypeId;
        if (!types[typeId]) {
          types[typeId] = [];
        }
        types[typeId].push(gameData);
      });

      const sortedTypes = Object.keys(types)
        .sort()
        .map((typeId) => ({
          id: Number.parseInt(typeId),
          name: gameTypeNames[typeId] || `Game Type ${typeId}`,
          icon: gameTypeIcons[typeId] || "🎮",
          games: types[typeId],
        }));

      setGameTypes(sortedTypes);
    } else {
      console.log("Không nhận được game: ", games);
    }
  }, [games]);

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
    setSelectedGame(null);
  };

  const handlePlayGame = (gameData) => {
    setSelectedGame(gameData);
  };

  const handleBackToList = () => {
    setSelectedGame(null);
  };

  const handleGameComplete = async (gameEventId, points) => {
    try {
      // Gọi API cập nhật điểm
      await onUpdatePoints(gameEventId, points);
      // Quay lại danh sách và refresh games
      setSelectedGame(null);
      // Có thể gọi callback để refresh danh sách games
      if (typeof onClose === "function") {
        onClose(true); // true để báo hiệu cần refresh
      }
    } catch (error) {
      console.error("Error updating points:", error);
    }
  };

  const renderGameComponent = (gameData) => {
    const { gameEvent } = gameData;

    console.log(
      "Rendering game component for type:",
      gameEvent.gameTypeId,
      "with data:",
      gameData
    );

    try {
      switch (gameEvent.gameTypeId) {
        case 1:
          return (
            <ErrorBoundary onBack={handleBackToList}>
              <SpinWheelUI
                gameName={gameEvent.gameName}
                sectors={gameEvent.configJson.sectors}
                isDuplicate={gameEvent.configJson.isDuplicate}
                maxSpin={gameEvent.configJson.maxSpin}
                gameEventId={gameEvent._id}
                onComplete={handleGameComplete}
                onBack={handleBackToList}
              />
            </ErrorBoundary>
          );
        case 2:
          return (
            <ErrorBoundary onBack={handleBackToList}>
              <MemoryCatching
                gameData={gameData}
                onComplete={handleGameComplete}
                onBack={handleBackToList}
              />
            </ErrorBoundary>
          );
        case 3:
          // Add extra validation for ScratchCard
          if (
            !gameData.gameEvent.configJson ||
            !gameData.gameEvent.configJson.cards
          ) {
            console.error(
              "ScratchCard missing required config:",
              gameData.gameEvent.configJson
            );
            return (
              <div style={{ padding: 20, textAlign: "center" }}>
                <Typography variant="h6" color="error">
                  Cấu hình game cào thẻ không hợp lệ
                </Typography>
                <Button onClick={handleBackToList}>Quay lại</Button>
              </div>
            );
          }
          return (
            <ErrorBoundary onBack={handleBackToList}>
              <ScratchCardUI
                gameData={gameData}
                onComplete={handleGameComplete}
                onBack={handleBackToList}
              />
            </ErrorBoundary>
          );
        default:
          return (
            <div style={{ padding: 20, textAlign: "center" }}>
              <Typography variant="h6">
                Game type not supported: {gameEvent.gameTypeId}
              </Typography>
              <Button onClick={handleBackToList}>Quay lại</Button>
            </div>
          );
      }
    } catch (error) {
      console.error("Error in renderGameComponent:", error);
      return (
        <div style={{ padding: 20, textAlign: "center" }}>
          <Typography variant="h6" color="error">
            Lỗi khi tải game
          </Typography>
          <Button onClick={handleBackToList}>Quay lại</Button>
        </div>
      );
    }
  };

  const renderGameList = () => {
    if (gameTypes.length === 0) {
      return (
        <Box sx={{ textAlign: "center", py: 4 }}>
          <Typography variant="h6" color="text.secondary">
            Không có game nào khả dụng
          </Typography>
        </Box>
      );
    }

    const currentGames = gameTypes[selectedTab]?.games || [];

    return (
      <Box sx={{ p: 3 }}>
        <Paper
          elevation={1}
          sx={{
            borderRadius: 2,
            overflow: "hidden",
          }}
        >
          <List sx={{ width: "100%" }}>
            {currentGames.map((gameData, index) => (
              <Box key={index}>
                <ListItem
                  sx={{
                    py: 2,
                    px: 3,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    "&:hover": {
                      backgroundColor: "#f8f9fa",
                    },
                    transition: "background-color 0.2s ease",
                  }}
                >
                  {/* Game Info */}
                  <Box sx={{ flex: 1, mr: 2 }}>
                    <ListItemText
                      primary={
                        <Typography
                          variant="h6"
                          sx={{
                            fontWeight: "bold",
                            color: "#333",
                            mb: 0.5,
                          }}
                        >
                          {gameData.gameEvent.eventName}
                        </Typography>
                      }
                      secondary={
                        <Typography
                          variant="body2"
                          sx={{
                            color: "#666",
                            lineHeight: 1.4,
                          }}
                        >
                          {gameData.gameEvent.description}
                        </Typography>
                      }
                    />
                  </Box>

                  {/* Points Badge */}
                  {/* <Box sx={{ mr: 2 }}>
                    <Chip
                      label={`${gameData.gameEvent.balancePoints} điểm`}
                      sx={{
                        backgroundColor: "#ec407a",
                        color: "white",
                        fontWeight: "bold",
                        fontSize: "0.875rem",
                      }}
                    />
                  </Box> */}

                  {/* Play Button */}
                  <Button
                    variant="contained"
                    startIcon={<PlayArrowIcon />}
                    onClick={() => handlePlayGame(gameData)}
                    sx={{
                      backgroundColor: "#ec407a",
                      color: "white",
                      fontWeight: "bold",
                      borderRadius: "20px",
                      px: 3,
                      py: 1,
                      textTransform: "none",
                      boxShadow: "0 2px 8px rgba(236, 64, 122, 0.3)",
                      "&:hover": {
                        backgroundColor: "#d81b60",
                        boxShadow: "0 4px 12px rgba(236, 64, 122, 0.4)",
                        transform: "translateY(-1px)",
                      },
                      transition: "all 0.2s ease",
                    }}
                  >
                    Chơi
                  </Button>
                </ListItem>

                {/* Divider between items (except last item) */}
                {index < currentGames.length - 1 && <Divider sx={{ mx: 3 }} />}
              </Box>
            ))}
          </List>
        </Paper>

        {/* Empty state for current tab */}
        {currentGames.length === 0 && (
          <Box sx={{ textAlign: "center", py: 6 }}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              {gameTypeIcons[gameTypes[selectedTab]?.id]} Chưa có game nào
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Hiện tại chưa có game {gameTypes[selectedTab]?.name.toLowerCase()}{" "}
              nào khả dụng
            </Typography>
          </Box>
        )}
      </Box>
    );
  };

  return (
    <Modal open={isOpen} onClose={() => onClose(false)}>
      <Box sx={modalStyle}>
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            p: 2,
            borderBottom: "1px solid #e0e0e0",
            backgroundColor: "#ec407a",
          }}
        >
          <Typography
            variant="h5"
            component="h2"
            sx={{ color: "white", fontWeight: "bold" }}
          >
            🎮 Mini Games - Tích Điểm Thưởng
          </Typography>
          <IconButton onClick={() => onClose(false)} sx={{ color: "white" }}>
            <CloseIcon />
          </IconButton>
        </Box>

        {selectedGame ? (
          // Render game component
          <Box sx={{ flexGrow: 1, overflow: "auto" }}>
            {renderGameComponent(selectedGame)}
          </Box>
        ) : (
          // Render game list with tabs
          <>
            {gameTypes.length > 0 && (
              <Tabs
                value={selectedTab}
                onChange={handleTabChange}
                variant="fullWidth"
                sx={{
                  borderBottom: "1px solid #e0e0e0",
                  "& .MuiTab-root": {
                    minHeight: 60,
                    fontSize: "1rem",
                  },
                  "& .Mui-selected": {
                    color: "#ec407a !important",
                  },
                  "& .MuiTabs-indicator": {
                    backgroundColor: "#ec407a",
                  },
                }}
              >
                {gameTypes.map((type, index) => (
                  <Tab
                    key={type.id}
                    label={
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <span style={{ fontSize: "1.5rem" }}>{type.icon}</span>
                        <span>{type.name}</span>
                        <Chip
                          label={type.games.length}
                          size="small"
                          color="primary"
                          sx={{
                            backgroundColor:
                              selectedTab === index ? "#ec407a" : "#e0e0e0",
                            color: selectedTab === index ? "white" : "black",
                          }}
                        />
                      </Box>
                    }
                  />
                ))}
              </Tabs>
            )}

            <Box sx={{ flexGrow: 1, overflow: "auto" }}>{renderGameList()}</Box>
          </>
        )}
      </Box>
    </Modal>
  );
};
