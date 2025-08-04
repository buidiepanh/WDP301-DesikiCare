"use client";
import { apiRequest, loginRequiredApi } from "@/lib/axiosInstance";
import React, { useEffect, useState } from "react";
import { useMiniGamesContext } from "./layout";
import { useSelector } from "react-redux";
import { RootState } from "@/app/store";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";

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
const MiniGamesPage = () => {
  const [miniGames, setMiniGames] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { refetchUserInfo, isRefetching } = useMiniGamesContext();
  const user = useSelector((state: RootState) => state.user);

  // HOOK
  useEffect(() => {
    // Fetch mini games when the component mounts
    fetchMiniGames();
  }, []);

  // FUNCTIONS
  const fetchMiniGames = async () => {
    setIsLoading(true);
    try {
      const response = await apiRequest({
        instance: loginRequiredApi,
        method: "GET",
        url: "Game/gameEvents",
      });
      if (response) {
        console.log(">>>>>>>>Mini Games:", response.gameEvents);
        setMiniGames(response.gameEvents);
      }
    } catch (error) {
      console.error("Error fetching mini games:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefetchUserInfo = async () => {
    await refetchUserInfo();
    // Có thể fetch lại mini games nếu cần thiết
    // await fetchMiniGames();
  };

  // Helper functions
  const getGameTypeName = (gameTypeId: number) => {
    switch (gameTypeId) {
      case 1:
        return "Spin Wheel";
      case 2:
        return "Memory Catching";
      case 3:
        return "Scratch Card";
      default:
        return "Unknown Game";
    }
  };

  const truncateDescription = (
    description: string,
    maxLength: number = 100
  ) => {
    if (description.length <= maxLength) return description;
    return description.substring(0, maxLength) + "...";
  };

  const groupGamesByType = () => {
    const grouped: { [key: number]: any[] } = {};
    miniGames.forEach((game: any) => {
      const typeId = game.gameEvent?.gameTypeId;
      if (typeId) {
        if (!grouped[typeId]) {
          grouped[typeId] = [];
        }
        grouped[typeId].push(game);
      }
    });
    return grouped;
  };

  const groupedGames = groupGamesByType();

  // Skeleton Card Component
  const SkeletonGameCard = () => (
    <div className="flex-shrink-0 w-80 p-4 border rounded-lg bg-gray-50">
      <div className="space-y-3">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="h-10 w-full" />
      </div>
    </div>
  );

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Mini Games</h1>

        {/* User Info Display */}
        {/* <div className="flex items-center gap-4">
          {user.info && (
            <div className="text-sm">
              <p className="text-gray-600">Points: {user.info.points}</p>
              <p className="text-gray-600">
                Tickets: {user.info.gameTicketCount}
              </p>
            </div>
          )}

          <Button
            onClick={handleRefetchUserInfo}
            disabled={isRefetching}
            variant="outline"
            size="sm"
          >
            {isRefetching ? "Refreshing..." : "Refresh User Info"}
          </Button>
        </div> */}
      </div>

      {/* Mini Games Content */}
      <div className="space-y-8">
        {isLoading
          ? // Loading Skeletons
            [1, 2, 3].map((gameTypeId) => {
              const gameTypeName = getGameTypeName(gameTypeId);

              return (
                <div
                  key={gameTypeId}
                  className="bg-white rounded-lg p-6 shadow-sm"
                >
                  {/* Game Type Header */}
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold text-gray-900">
                      {gameTypeName}
                    </h2>
                    <Skeleton className="h-5 w-16" />
                  </div>

                  {/* Skeleton Games Horizontal Scroll */}
                  <div className="overflow-x-auto">
                    <div
                      className="flex gap-4 pb-2"
                      style={{ minWidth: "max-content" }}
                    >
                      {[...Array(4)].map((_, index) => (
                        <SkeletonGameCard key={index} />
                      ))}
                    </div>
                  </div>
                </div>
              );
            })
          : // Actual Games Content
            // Nhớ thêm 3 vào sau này, hiện giờ để đó chưa làm
            [1, 2].map((gameTypeId) => {
              const gamesOfType = groupedGames[gameTypeId] || [];
              const gameTypeName = getGameTypeName(gameTypeId);

              return (
                <div
                  key={gameTypeId}
                  className="bg-white rounded-lg p-6 shadow-sm"
                >
                  {/* Game Type Header */}
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold text-gray-900">
                      {gameTypeName}
                    </h2>
                    <span className="text-sm text-gray-500">
                      {gamesOfType.length}{" "}
                      {gamesOfType.length === 1 ? "game" : "games"}
                    </span>
                  </div>

                  {/* Games Horizontal Scroll */}
                  {gamesOfType.length > 0 ? (
                    <div className="overflow-x-auto">
                      <div
                        className="flex gap-4 pb-2"
                        style={{ minWidth: "max-content" }}
                      >
                        {gamesOfType.map((game: any, index) => (
                          <div
                            key={`${gameTypeId}-${index}`}
                            className="flex-shrink-0 w-80 p-4 border rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                          >
                            {/* Game Info */}
                            <div className="space-y-2">
                              <h3 className="font-semibold text-lg text-gray-900 truncate">
                                {game.gameEvent?.eventName || "Unnamed Game"}
                              </h3>

                              <p className="text-sm text-gray-600 h-10 overflow-hidden">
                                {truncateDescription(
                                  game.gameEvent?.description ||
                                    "No description available"
                                )}
                              </p>

                              {/* Play Button */}
                              <Link
                                href={`/mini-games/play/${game.gameEvent?.gameTypeId}/${game.gameEvent._id}`}
                                className="block"
                              >
                                <Button
                                  className="w-full mt-3"
                                  disabled={game.gameEvent?.isDeactivated}
                                >
                                  {game.gameEvent?.isDeactivated
                                    ? "Game Inactive"
                                    : "Tham gia trò chơi"}
                                </Button>
                              </Link>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <p>No {gameTypeName.toLowerCase()} games available</p>
                    </div>
                  )}
                </div>
              );
            })}

        {/* No games at all */}
        {!isLoading && miniGames.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <p className="text-lg">No mini games available.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MiniGamesPage;
