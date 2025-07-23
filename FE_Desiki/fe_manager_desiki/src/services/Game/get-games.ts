import { callAPIAdmin } from "@/api/axiosInstace";
import { handleApiResponse } from "../handleApiResponses";
import type { GameEvent } from "@/data/types";

export const GetAllGames = async () => {
  return await handleApiResponse<{ gameEvents: GameEvent[] }>(
    () =>
      callAPIAdmin({
        method: "GET",
        url: "/api/Game/gameEvents",
      }),
    {
      success: "Lấy danh sách games thành công!",
      forbidden: "Bạn không đủ quyền hạn để truy cập dữ liệu này!",
      notFound: "Không tìm thấy game nào!",
      serverError: "Lỗi máy chủ!",
    }
  );
};
