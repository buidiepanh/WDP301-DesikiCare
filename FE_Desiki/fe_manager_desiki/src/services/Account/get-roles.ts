import { callAPIAdmin } from "@/api/axiosInstace";
import { handleApiResponse } from "../handleApiResponses";

export const GetAllRoles = async () => {
  return await handleApiResponse<{ roles: any[] }>(
    () =>
      callAPIAdmin({
        method: "GET",
        url: "/api/Account/roles",
      }),
    {
      success: "Lấy danh sách vai trò thành công!",
      forbidden: "Bạn không đủ quyền hạn để truy cập dữ liệu này!",
      notFound: "Không tìm thấy vai trò!",
      serverError: "Lỗi máy chủ!",
    }
  );
};
