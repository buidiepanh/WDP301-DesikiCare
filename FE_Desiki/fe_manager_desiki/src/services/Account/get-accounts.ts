import { callAPIAdmin } from "@/api/axiosInstace";
import { handleApiResponse } from "../handleApiResponses";

export const GetAllAccounts = async () => {
  return await handleApiResponse<{ accounts: any[] }>(
    () =>
      callAPIAdmin({
        method: "GET",
        url: "/api/Account/accounts",
      }),
    {
      success: "Lấy danh sách người dùng dưới quyền thành công!",
      forbidden: "Bạn không đủ quyền hạn để truy cập dữ liệu này!",
      notFound: "Không tìm thấy vai trò!",
      serverError: "Lỗi máy chủ!",
    }
  );
};
