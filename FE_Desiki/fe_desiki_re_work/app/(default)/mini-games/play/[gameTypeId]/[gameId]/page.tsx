"use client";
import { useMiniGamesContext } from "../../../layout";
import { Button } from "@/components/ui/button";
import { apiRequest, loginRequiredApi } from "@/lib/axiosInstance";
import { useState } from "react";
import { useParams } from "next/navigation";
import { useAppSelector } from "@/app/hooks";
import { SpinWheelGame } from "./components/SpinWheel/SpinWheel";
import { MemoryCatchingGame } from "./components/MemoryCatching/MemoryCatching";

type GameType1ConfigJson = {
  isDuplicate: boolean;
  maxSpin: number;
  numOfSectors: number;
  sectors: {
    color: string; //Sector Background Color
    label: string; //Label Text
    value: number; //Points Value
    text: string; //Sector Label Color
  }[];
};

type GameType2ConfigJson = {
  backCoverImg: string; //Image URL for the back of Card
  originalPoint: number; //Points at the begin
  minusPoint: number; //Số điểm sẽ trừ sau khi chơi hết số lượt chơi an toàn
  numOfPairs: number; //Số cặp thẻ, cũng là số lần chơi an toàn
  pairs: {
    id: number; //index 1-2-3-4-...
    imageBase64: string; //Base64 image data for the card front
  }[];
};

type GameType3ConfigJson = {
  backCoverImg: string; //Image URL for the back of Card
  maxScratch: number; //Số lần cào tối đa
  cards: {
    id: number; //index 1-2-3-4-...
    imgBase64: string; //Base64 image data for the card front
    label: string; //Label text for the card
    point: number; //Points value for the card
    text: string; //Text color for the card label
  }[];
};

type GameEvent = {
  gameEvent: {
    _id: string;
    balancePoints: number;
    configJson: GameType3ConfigJson | GameType2ConfigJson | GameType1ConfigJson;
    eventName: string;
    gameName: string;
    gameTypeId: number;
    imageUrl: string;
    description: string;
    isDeactivated: boolean;
    endDate: string; //Format: "2023-10-31T23:59:59.999Z"
    startDate: string; //Format: "2023-10-01T00:00:00.000Z"
    createdAt: string; //Format: "2023-10-01T00:00:00.000Z"
    updatedAt: string; //Format: "2023-10-01T00:00:00.000Z"
  };
  gameEventRewardResults: any;
  gameTypeImageUrls: {
    id: string; //index 1-2-3-4-...
    imageUrl: string;
  }[];
};

const PlayGamePage = () => {
  // REDUX
  const userInfo = useAppSelector((state) => state.user.info);

  // STATES
  const { refetchUserInfo, isRefetching, user } = useMiniGamesContext();
  const [isJoining, setIsJoining] = useState(false); // Kiểm soát trạng thái trừ vé (đang xác nhận tham gia)
  const [isJoined, setIsJoined] = useState(false); // Kiểm soát trạng thái lấy game (đang tạo game)
  const [isLoadingGameDetails, setIsLoadingGameDetails] = useState(false); // Trạng thái đang lấy chi tiết game
  const [cantJoinReason, setCantJoinReason] = useState("");
  const [game, setGame] = useState<GameEvent | null>(null);
  const [isFinished, setIsFinished] = useState(false); // Trạng thái đã hoàn thành game
  const [isPlaying, setIsPlaying] = useState(false); // Trạng thái đang chơi game

  // PARAMS
  const params = useParams();

  const gameTypeId = params.gameTypeId as string;
  const gameId = params.gameId as string;

  // Helper function để xác định loại game
  const getGameTypeName = (typeId: string) => {
    switch (typeId) {
      case "1":
        return "Spin Wheel";
      case "2":
        return "Memory Catching";
      case "3":
        return "Scratch Card";
      default:
        return "Unknown Game";
    }
  };

  // Helper function để xác định configJson type dựa trên gameTypeId
  const getExpectedConfigType = (typeId: string) => {
    switch (typeId) {
      case "1":
        return "GameType1ConfigJson (Spin Wheel)";
      case "2":
        return "GameType2ConfigJson (Memory Catching)";
      case "3":
        return "GameType3ConfigJson (Scratch Card)";
      default:
        return "Unknown Config Type";
    }
  };

  const handleJoinGame = async () => {
    // Bước 1: Kiểm tra vé chơi game
    if (!userInfo || userInfo?.gameTicketCount <= 0) {
      alert("You do not have enough game tickets to join this game.");
      setCantJoinReason(
        "You do not have enough game tickets to join this game."
      );
      return;
    }

    // Bước 2: Trừ vé chơi game (isJoining = true)
    setIsJoining(true);
    setCantJoinReason("");

    try {
      // Gọi API để join game (trừ 1 vé chơi game)
      const joinResponse = await apiRequest({
        instance: loginRequiredApi,
        method: "POST",
        url: `Game/gameEvents/${gameId}/join`,
      });

      if (joinResponse) {
        // Bước 3: Join thành công, bắt đầu lấy chi tiết game (isJoined = true)
        setIsJoined(true);
        setIsLoadingGameDetails(true);

        // Refresh user info để sync points/tickets sau khi trừ vé
        await refetchUserInfo();

        // Bước 4: Lấy thông tin chi tiết của trò chơi
        try {
          const gameDetailsResponse = await apiRequest({
            instance: loginRequiredApi,
            method: "GET",
            url: `Game/gameEvents/${gameId}`,
          });

          if (gameDetailsResponse) {
            setGame(gameDetailsResponse);
            console.log("Game details loaded:", gameDetailsResponse);
          } else {
            setCantJoinReason("Failed to fetch game details.");
            setIsJoined(false);
          }
        } catch (error) {
          console.error("Error fetching game details:", error);
          setCantJoinReason("Error loading game details.");
          setIsJoined(false);
        } finally {
          setIsLoadingGameDetails(false);
        }
      } else {
        setCantJoinReason("Failed to join the game.");
        setIsJoined(false);
      }
    } catch (error) {
      console.error("Error joining game:", error);
      setCantJoinReason("Error joining the game.");
      setIsJoined(false);
    } finally {
      setIsJoining(false);
    }
  };

  const handleFinishGame = async (finalPoints: number) => {
    try {
      const response = await apiRequest({
        instance: loginRequiredApi,
        method: "POST",
        url: `Game/gameEventsRewards`,
        data: {
          gameEventReward: {
            gameEventId: gameId,
            points: finalPoints,
          },
        },
      });
      if (response) {
        setIsFinished(true);
        setIsPlaying(false);
        // Refresh user info to update points after finishing game
        await refetchUserInfo();
      } else {
        console.error("Failed to finish game:", response);
        alert("Failed to finish the game. Please try again.");
      }
    } catch (error) {
      console.error("Error finishing game:", error);
      alert("Error finishing the game. Please try again.");
    }
  };

  const handleStartGame = () => {
    setIsPlaying(true);
  };

  // Render SpinWheel game if playing and gameTypeId is 1
  if (isPlaying && game && gameTypeId === "1") {
    // Type guard for SpinWheel game
    const spinWheelGame = {
      ...game,
      gameEvent: {
        ...game.gameEvent,
        configJson: game.gameEvent.configJson as GameType1ConfigJson,
      },
    };
    return (
      <SpinWheelGame gameEvent={spinWheelGame} onFinish={handleFinishGame} />
    );
  }

  // Render Memory Catching game if playing and gameTypeId is 2
  if (isPlaying && game && gameTypeId === "2") {
    // Type guard for Memory Catching game
    const memoryCatchingGame = {
      ...game,
      gameEvent: {
        ...game.gameEvent,
        configJson: game.gameEvent.configJson as GameType2ConfigJson,
      },
    };
    return (
      <MemoryCatchingGame
        gameEvent={memoryCatchingGame}
        onFinish={handleFinishGame}
        autoStart={true}
      />
    );
  }
  return (
    <div className="flex flex-col items-center justify-center h-screen p-6">
      <div className="max-w-md w-full bg-white rounded-lg shadow-sm p-6 text-center">
        {!isFinished && (
          <>
            <h1 className="text-2xl font-bold mb-4">Play Game</h1>
            <div className="space-y-4 mb-6">
              <p className="text-lg">Are You Sure You Want to Play?</p>
              <p className="text-sm text-gray-500">
                It will cost you 1 game ticket to play this game.
              </p>

              {user && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">
                    Your Available Tickets: {user.gameTicketCount}
                  </p>
                </div>
              )}
            </div>
          </>
        )}

        <div className="space-y-3">
          {/* Hiển thị trạng thái join game */}
          {!isJoined && (
            <Button
              onClick={handleJoinGame}
              disabled={isJoining || isRefetching}
              className="w-full"
            >
              {isJoining ? "Đang xác nhận tham gia..." : "Tham gia trò chơi"}
            </Button>
          )}

          {/* Hiển thị trạng thái loading game details */}
          {isJoined && isLoadingGameDetails && (
            <div className="w-full p-3 bg-blue-50 rounded-lg text-center">
              <p className="text-blue-700">Đang tạo game...</p>
            </div>
          )}

          {/* Hiển thị lỗi nếu có */}
          {cantJoinReason && (
            <div className="w-full p-3 bg-red-50 rounded-lg text-center">
              <p className="text-red-700 text-sm">{cantJoinReason}</p>
            </div>
          )}

          {/* Hiển thị thông tin game khi đã load xong */}
          {isJoined &&
            game &&
            !isLoadingGameDetails &&
            !isFinished &&
            !isPlaying && (
              <div className="w-full p-4 bg-green-50 rounded-lg">
                <h3 className="font-semibold text-green-800 mb-2">
                  Joined Game Successfully! 🎉
                </h3>
                {/* Button để bắt đầu chơi game */}
                <Button
                  className="w-full mt-3"
                  variant="default"
                  onClick={handleStartGame}
                >
                  Bắt đầu chơi {getGameTypeName(gameTypeId)}
                </Button>
              </div>
            )}

          {/* Hiển thị kết quả khi game hoàn thành */}
          {isFinished && (
            <div className="w-full p-4 bg-blue-50 rounded-lg">
              <h3 className="font-semibold text-blue-800 mb-2">
                Game Completed! 🎉
              </h3>
              <p className="text-blue-700">
                Thank you for playing! Your points have been updated.
              </p>
              <Button
                className="w-full mt-3"
                variant="outline"
                onClick={() => (window.location.href = "/mini-games")}
              >
                Back to Games
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlayGamePage;
