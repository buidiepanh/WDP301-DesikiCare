import { callAPIAdmin } from "@/api/axiosInstace";
import { handleApiResponse } from "../handleApiResponses";

export const ToggleActivateGame = async (id: string, isDeactivate: boolean) => {
  return await handleApiResponse<any>(
    () =>
      callAPIAdmin({
        method: "PUT",
        url: `/api/Game/gameEvents/${id}/deactivate/${!isDeactivate}`,
      }),
    {
      success: isDeactivate
        ? "Đã kích hoạt trò chơi thành công!"
        : "Đã vô hiệu hóa trò chơi thành công!",
      forbidden: "Bạn không đủ quyền hạn để thực hiện hành động này!",
      notFound: "Không tìm thấy vai trò!",
      serverError: "Lỗi máy chủ!",
    }
  );
};
