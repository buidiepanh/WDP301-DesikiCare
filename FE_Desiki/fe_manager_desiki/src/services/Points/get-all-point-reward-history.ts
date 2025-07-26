import { callAPIAdmin } from "@/api/axiosInstace";
import { handleApiResponse } from "../handleApiResponses";

type gameEventRewardResult = {
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
    endDate: string | null;
    balancePoints: number;
    isDeactivated: boolean;
    createdAt: string;
    updatedAt: string;
    imageUrl: string;
  };
};

type PointChangingHistory = {
  userId: string;
  amount: number;
  changingType: number;
  reason: string;
  changeAt: string;
};

const callAPIRaw = async () => {
  return await handleApiResponse<{
    gameEventRewardResults: gameEventRewardResult[];
  }>(
    () =>
      callAPIAdmin({
        method: "GET",
        url: "/api/Game/gameEventsRewards",
      }),
    {
      success: "Lấy danh sách games thành công!",
      forbidden: "Bạn không đủ quyền hạn để truy cập dữ liệu này!",
      notFound: "Không tìm thấy game nào!",
      serverError: "Lỗi máy chủ!",
    }
  );
};

export const GetAllPointRewardHistory = async (): Promise<
  PointChangingHistory[]
> => {
  try {
    const res = await callAPIRaw();
    if (res && res.isSuccess && res.data) {
      const gameEventRewardResults = res.data.gameEventRewardResults;
      const pointChangingHistory: PointChangingHistory[] =
        gameEventRewardResults.map((result) => ({
          userId: result.gameEventRewardResult.accountId,
          amount: result.gameEventRewardResult.points, // Dương vì đây là nhận điểm thưởng
          changingType: 1, // Giả định 1 là loại nhận điểm thưởng
          reason: `Nhận điểm từ trò chơi ${result.gameEvent.gameName}`,
          changeAt: result.gameEventRewardResult.createdAt,
        }));

      return pointChangingHistory;
    } else {
      return [];
    }
  } catch (error) {
    console.log("Error while getting all reward points history: ", error);
    return [];
  }
};
