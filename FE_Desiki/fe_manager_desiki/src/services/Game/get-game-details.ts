import { callAPIAdmin } from "@/api/axiosInstace";
import { handleApiResponse } from "../handleApiResponses";
import type { GameEvent } from "@/data/types";

export const GetAllGames = async (gameId: string) => {
  return await handleApiResponse<GameEvent>(
    () =>
      callAPIAdmin({
        method: "GET",
        url: `/api/Game/gameEvents/${gameId}`,
      }),
    {
      success: "Lấy chi tiết game thành công!",
      forbidden: "Bạn không đủ quyền hạn để truy cập dữ liệu này!",
      notFound: "Không tìm thấy game!",
      serverError: "Lỗi máy chủ!",
    }
  );
};
