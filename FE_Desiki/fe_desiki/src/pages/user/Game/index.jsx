import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, Button, Typography, Spin, Empty } from "antd";
import { PlayCircleOutlined } from "@ant-design/icons";
import { getGamesEvent } from "../../../services/apiServices";
const { Title, Text } = Typography;
const gameTypes = [
  { id: 1, name: "Vòng Quay May Mắn" },
  { id: 2, name: "Ghép Thẻ" },
];
const GamePage = () => {
  // STATES
  const [gameEvents, setGameEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  // HOOKS
  const navigate = useNavigate();
  useEffect(() => {
    fetchGames();
  }, []);
  // FUNCTIONS
  const fetchGames = async () => {
    setIsLoading(true);
    try {
      const gameEventData = await getGamesEvent();
      if (gameEventData) {
        setGameEvents(gameEventData);
      }
    } catch (error) {
      console.error("Error fetching games:", error);
    } finally {
      setIsLoading(false);
    }
  };
  // Filter games by type
  const getGamesByType = (gameTypeId) => {
    return gameEvents.filter(
      (item) => item.gameEvent.gameTypeId === gameTypeId
    );
  };
  // Handle play game
  const handlePlayGame = (gameTypeId, gameId) => {
    navigate(`/mini-games/play?gameTypeId=${gameTypeId}&gameId=${gameId}`);
  };
  // Render game cards
  const renderGameCards = (games) => {
    if (games.length === 0) {
      return (
        <div style={{ textAlign: "center", padding: "40px" }}>
          <Empty description="Không có game nào khả dụng" />
        </div>
      );
    }

    return (
      <div
        style={{
          display: "flex",
          gap: "16px",
          overflowX: "auto",
          padding: "16px 0",
          scrollbarWidth: "thin",
        }}
      >
        {games.map((item, index) => (
          <Card
            key={item.gameEvent._id || index}
            style={{
              minWidth: "300px",
              maxWidth: "300px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1",
              borderRadius: "12px",
            }}
          >
            <div style={{ padding: "8px 0" }}>
              <Title
                level={4}
                style={{ marginBottom: "8px", fontSize: "18px" }}
              >
                {item.gameEvent.eventName}
              </Title>
              <Text
                style={{
                  color: "#666",
                  display: "-webkit-box",
                  WebkitLineClamp: 4,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                  marginBottom: "16px",
                  minHeight: "80px",
                }}
              >
                {item.gameEvent.description}
              </Text>
              <Button
                type="primary"
                size="large"
                icon={<PlayCircleOutlined />}
                onClick={() =>
                  handlePlayGame(item.gameEvent.gameTypeId, item.gameEvent._id)
                }
                style={{
                  width: "100%",
                  height: "40px",
                  backgroundColor: "#ec407a",
                  borderColor: "#ec407a",
                  borderRadius: "8px",
                  fontWeight: "bold",
                }}
                disabled={item.gameEvent.isDeactivated}
              >
                {item.gameEvent.isDeactivated ? "Không khả dụng" : "Chơi ngay"}
              </Button>
            </div>
          </Card>
        ))}
      </div>
    );
  };
  return (
    <div
      style={{
        flex: 1,
        padding: "80px 40px 40px 40px",
        backgroundColor: "#f5f5f5",
        minHeight: "100vh",
      }}
    >
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <Title
          level={1}
          style={{
            textAlign: "center",
            marginBottom: "40px",
            color: "#ec407a",
          }}
        >
          {" "}
          🎮 Khu Vực Mini Games
        </Title>
        {isLoading ? (
          <div style={{ textAlign: "center", padding: "100px" }}>
            <Spin size="large" />
            <div style={{ marginTop: "16px" }}>Đang tải danh sách games...</div>
          </div>
        ) : (
          <div
            style={{ display: "flex", flexDirection: "column", gap: "40px" }}
          >
            {/* Vòng Quay May Mắn Section */}
            <div>
              <Title
                level={2}
                style={{
                  marginBottom: "20px",
                  color: "#1890ff",
                  borderLeft: "4px solid #1890ff",
                  paddingLeft: "16px",
                }}
              >
                {" "}
                🎰 Vòng Quay May Mắn
              </Title>
              {renderGameCards(getGamesByType(1))}
            </div>
            {/* Ghép Thẻ Section */}
            <div>
              <Title
                level={2}
                style={{
                  marginBottom: "20px",
                  color: "#52c41a",
                  borderLeft: "4px solid #52c41a",
                  paddingLeft: "16px",
                }}
              >
                {" "}
                🃏 Ghép Thẻ
              </Title>
              {renderGameCards(getGamesByType(2))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
export default GamePage;
