import React, { useEffect, useState } from "react";
import { useLocation, useSearchParams, useNavigate } from "react-router-dom";
import { Button, Spin, Card, Typography, Alert } from "antd";
import {
  finishGameEvent,
  getGameEventDetails,
  getMe,
  joinTheGameEvent,
} from "../../../../services/apiServices";
import SpinWheelUI from "./components/SpinWheel";
import MemoryCatchingUI from "./components/MemoryCatching";
import toast from "react-hot-toast";

const { Title, Text } = Typography;

const GamePlayPage = () => {
  const [searchParams] = useSearchParams();
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const [gameTypeId, setGameTypeId] = useState(null);
  const [gameId, setGameId] = useState(null);
  const [isJoining, setIsJoining] = useState(false);
  const [isJoined, setIsJoined] = useState(false);
  const [gameDetails, setGameDetails] = useState(null);
  const [finalPoints, setFinalPoints] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    const typeId = searchParams.get("gameTypeId");
    const id = searchParams.get("gameId");
    if (!typeId || !id) {
      navigate("/mini-games");
      return;
    }
    setGameTypeId(parseInt(typeId));
    setGameId(id);
    getUserInfo();
  }, [searchParams, navigate]);

  const getUserInfo = async () => {
    try {
      const userData = await getMe();
      if (!userData) {
        navigate("/login");
        return;
      }
      setUser(userData);
    } catch (err) {
      console.error("Error getting user info:", err);
      toast.error("Không thể tải thông tin người dùng");
      navigate("/mini-games");
    }
  };

  const handleJoinGame = async () => {
    if (!user?.account?.gameTicketCount || user.account.gameTicketCount <= 0) {
      toast.error(
        "Bạn không có vé chơi game. Vui lòng tích lũy vé để tham gia!"
      );
      return;
    }

    setIsJoining(true);
    try {
      if (!gameTypeId || !gameId) throw new Error("Missing game parameters");

      const result = await joinTheGameEvent(gameId);
      if (result) {
        await getGameDetails();
      } else {
        throw new Error("Failed to join the game event");
      }
    } catch (error) {
      console.error("Error joining game:", error);
      toast.error("Không thể tham gia trò chơi");
    } finally {
      setIsJoining(false);
    }
  };

  const getGameDetails = async () => {
    if (!gameId) return;
    try {
      const details = await getGameEventDetails(gameId);
      if (details) {
        setGameDetails(details);
        setIsJoined(true);
        setIsPlaying(true);
      } else {
        throw new Error("No game details received");
      }
    } catch (error) {
      console.error("Error fetching game details:", error);
      toast.error("Không thể tải chi tiết trò chơi");
    }
  };

  const handleFinishGame = async (gameEventId, points) => {
    try {
      setFinalPoints(points);
      const result = await finishGameEvent(gameEventId, points);
      if (result) {
        setIsFinished(true);
        setIsPlaying(false);
        toast.success(`Chúc mừng! Bạn đã nhận được ${points} điểm!`);
      } else {
        throw new Error("Failed to finish the game event");
      }
    } catch (error) {
      console.error("Error finishing game event:", error);
      toast.error("Có lỗi xảy ra khi hoàn thành game");
    }
  };

  const handleBackToGames = () => {
    navigate("/mini-games");
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        padding: "80px 20px 20px 20px",
        backgroundColor: "#f5f5f5",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div style={{ maxWidth: "800px", width: "100%" }}>
        {/* Màn hình xác nhận tham gia */}
        {!isJoined && !isJoining && user && (
          <Card
            style={{
              textAlign: "center",
              padding: "40px",
              borderRadius: "12px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            }}
          >
            <Title level={2} style={{ color: "#ec407a", marginBottom: "20px" }}>
              🎮 Tham Gia Trò Chơi
            </Title>
            <div style={{ marginBottom: "30px" }}>
              <Text
                style={{
                  fontSize: "16px",
                  display: "block",
                  marginBottom: "10px",
                }}
              >
                Bạn hiện có:{" "}
                <strong style={{ color: "#1890ff" }}>
                  {user?.account?.gameTicketCount || 0} vé chơi game
                </strong>
              </Text>
              <Alert
                message="Lưu ý quan trọng"
                description="Chơi trò chơi sẽ mất 1 vé dù có hoàn thành hay không. Bạn có chắc chắn muốn tiếp tục?"
                type="warning"
                showIcon
                style={{ marginBottom: "20px" }}
              />
            </div>
            <div
              style={{ display: "flex", gap: "16px", justifyContent: "center" }}
            >
              <Button
                size="large"
                onClick={handleBackToGames}
                style={{ minWidth: "120px" }}
              >
                Hủy bỏ
              </Button>
              <Button
                type="primary"
                size="large"
                onClick={handleJoinGame}
                disabled={
                  !user?.account?.gameTicketCount ||
                  user.account.gameTicketCount <= 0
                }
                style={{
                  backgroundColor: "#ec407a",
                  borderColor: "#ec407a",
                  minWidth: "120px",
                }}
              >
                Xác nhận chơi
              </Button>
            </div>
          </Card>
        )}

        {/* Màn hình đang tải */}
        {isJoining && (
          <Card
            style={{
              textAlign: "center",
              padding: "60px",
              borderRadius: "12px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            }}
          >
            <Spin size="large" />
            <Title level={3} style={{ marginTop: "20px", color: "#666" }}>
              Đang tải trò chơi...
            </Title>
            <Text>Vui lòng đợi trong giây lát</Text>
          </Card>
        )}

        {/* Màn hình chơi game */}
        {isPlaying && gameDetails && (
          <div>
            {gameTypeId === 1 && (
              <SpinWheelUI
                gameName={gameDetails.gameEvent.eventName}
                sectors={gameDetails.gameEvent.configJson?.sectors || []}
                isDuplicate={
                  gameDetails.gameEvent.configJson?.isDuplicate || false
                }
                maxSpin={gameDetails.gameEvent.configJson?.maxSpin || 1}
                gameEventId={gameId}
                onComplete={handleFinishGame}
              />
            )}
            {gameTypeId === 2 && (
              <MemoryCatchingUI
                numOfPairs={gameDetails.gameEvent.configJson?.numOfPairs || 4}
                pairs={gameDetails.gameEvent.configJson?.pairs || []}
                backCoverImg={
                  gameDetails.gameEvent.configJson?.backCoverImg || ""
                }
                originalPoint={
                  gameDetails.gameEvent.configJson?.originalPoint || 100
                }
                minusPoint={gameDetails.gameEvent.configJson?.minusPoint || 10}
                gameEventId={gameId}
                onComplete={handleFinishGame}
              />
            )}
          </div>
        )}

        {/* Màn hình hoàn thành */}
        {isFinished && (
          <Card
            style={{
              textAlign: "center",
              padding: "40px",
              borderRadius: "12px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            }}
          >
            <Title level={2} style={{ color: "#52c41a", marginBottom: "20px" }}>
              🎉 Chúc mừng!
            </Title>
            <div style={{ marginBottom: "30px" }}>
              <Text
                style={{
                  fontSize: "18px",
                  display: "block",
                  marginBottom: "10px",
                }}
              >
                Bạn đã hoàn thành trò chơi thành công!
              </Text>
              <Text
                style={{
                  fontSize: "20px",
                  fontWeight: "bold",
                  color: "#ec407a",
                }}
              >
                Điểm nhận được: {finalPoints} điểm
              </Text>
            </div>
            <Button
              type="primary"
              size="large"
              onClick={handleBackToGames}
              style={{
                backgroundColor: "#ec407a",
                borderColor: "#ec407a",
                minWidth: "200px",
              }}
            >
              Quay lại danh sách game
            </Button>
          </Card>
        )}

        {/* Loading user data */}
        {!user && (
          <Card
            style={{
              textAlign: "center",
              padding: "60px",
              borderRadius: "12px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            }}
          >
            <Spin size="large" />
            <Title level={3} style={{ marginTop: "20px", color: "#666" }}>
              Đang tải thông tin...
            </Title>
          </Card>
        )}
      </div>
    </div>
  );
};

export default GamePlayPage;
