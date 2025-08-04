"use client";
import { apiRequest, loginRequiredApi } from "@/lib/axiosInstance";
import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

type GameEventRewardResult = {
  gameEventRewardResult: {
    _id: string;
    gameEventId: string;
    accountId: string;
    points: number;
    createdAt: string;
    updatedAt: string;
  };
  gameEvent: {
    _id: string;
    eventName: string;
    description: string;
    gameName: string;
    gameTypeId: number;
    configJson: any;
    startDate: string;
    endDate: string;
    balancePoints: number;
    isDeactivated: boolean;
    createdAt: string;
    updatedAt: string;
    imageUrl: string;
  };
};

export default function GameHistoryPage() {
  const [results, setResults] = useState<GameEventRewardResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const resultsPerPage = 5;

  // HOOKS
  useEffect(() => {
    // Fetch game history when component mounts
    fetchGameHistory();
  }, []);

  // FUNCTIONS
  const fetchGameHistory = async () => {
    setLoading(true);
    try {
      const response = await apiRequest({
        instance: loginRequiredApi,
        method: "GET",
        url: "Game/gameEventsRewards/me",
      });
      if (response) {
        console.log("Game history response:", response.gameEventRewardResults);
        // Sort by createdAt (newest first)
        const sortedResults = response.gameEventRewardResults.sort(
          (a: GameEventRewardResult, b: GameEventRewardResult) => {
            return (
              new Date(b.gameEventRewardResult.createdAt).getTime() -
              new Date(a.gameEventRewardResult.createdAt).getTime()
            );
          }
        );
        setResults(sortedResults);
      }
    } catch (error) {
      console.error("Error fetching game history:", error);
    } finally {
      setLoading(false);
    }
  };

  // Helper functions
  const getGameName = (gameTypeId: number): string => {
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

  const formatDateTime = (dateString: string): string => {
    const date = new Date(dateString);
    const time = date.toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
    });
    const dateFormat = date.toLocaleDateString("en-GB");
    return `${time} - ${dateFormat}`;
  };

  const GameHistorySkeleton = () => (
    <div className="space-y-4">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="space-y-3">
          <Skeleton className="h-12 w-full" />
        </div>
      ))}
    </div>
  );

  // Pagination calculations
  const totalPages = Math.ceil(results.length / resultsPerPage);
  const startIndex = (currentPage - 1) * resultsPerPage;
  const endIndex = startIndex + resultsPerPage;
  const currentResults = results.slice(startIndex, endIndex);

  const goToPage = (page: number) => {
    setCurrentPage(page);
  };

  const goToPreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const goToNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Game History</h1>
        <p className="text-gray-600 mt-1">Track your game rewards and points</p>
      </div>

      {/* Total Results */}
      <div className="bg-white p-4 rounded-lg border">
        <div className="text-sm text-gray-600">Total Games Played</div>
        {loading ? (
          <Skeleton className="h-8 w-16 mt-1" />
        ) : (
          <div className="text-2xl font-bold text-gray-900">
            {results.length}
          </div>
        )}
      </div>

      {/* Game History Table */}
      <div className="bg-white rounded-lg border">
        {loading ? (
          <div className="p-6">
            <GameHistorySkeleton />
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Game Name</TableHead>
                <TableHead>Event Name</TableHead>
                <TableHead>Rewarded Points</TableHead>
                <TableHead>Reward At</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentResults.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="text-center py-8 text-gray-500"
                  >
                    No game history found
                  </TableCell>
                </TableRow>
              ) : (
                currentResults.map((result) => (
                  <TableRow key={result.gameEventRewardResult._id}>
                    <TableCell className="font-medium">
                      {getGameName(result.gameEvent.gameTypeId)}
                    </TableCell>
                    <TableCell>{result.gameEvent.eventName}</TableCell>
                    <TableCell className="font-semibold text-green-600">
                      +
                      {result.gameEventRewardResult.points.toLocaleString("vn")}
                    </TableCell>
                    <TableCell>
                      {formatDateTime(result.gameEventRewardResult.createdAt)}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        )}

        {/* Pagination */}
        {!loading && results.length > 0 && (
          <div className="flex items-center justify-between px-6 py-4 border-t">
            <div className="text-sm text-gray-600">
              Showing {startIndex + 1} to {Math.min(endIndex, results.length)}{" "}
              of {results.length} results
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={goToPreviousPage}
                disabled={currentPage === 1}
              >
                Previous
              </Button>

              <div className="flex space-x-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <Button
                      key={page}
                      variant={currentPage === page ? "default" : "outline"}
                      size="sm"
                      onClick={() => goToPage(page)}
                      className="w-8 h-8 p-0"
                    >
                      {page}
                    </Button>
                  )
                )}
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={goToNextPage}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
