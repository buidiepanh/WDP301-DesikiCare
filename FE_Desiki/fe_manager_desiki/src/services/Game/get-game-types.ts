import { callAPIAdmin } from "@/api/axiosInstace";
import { handleApiResponse } from "../handleApiResponses";

export const GetAllGameTypes = async () => {
  return await handleApiResponse<{ gameTypes: any[] }>(
    () =>
      callAPIAdmin({
        method: "GET",
        url: "/api/Game/gameTypes",
      }),
    {
      success: "Lấy danh sách loại games thành công!",
      forbidden: "Bạn không đủ quyền hạn để truy cập dữ liệu này!",
      notFound: "Không tìm thấy loại game nào!",
      serverError: "Lỗi máy chủ!",
    }
  );
};
