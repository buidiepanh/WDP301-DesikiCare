import { callAPIAdmin } from "@/api/axiosInstace";
import { handleApiResponse } from "../handleApiResponses";

export const ToggleActivateAccount = async (
  id: string,
  isActivate: boolean
) => {
  return await handleApiResponse<any>(
    () =>
      callAPIAdmin({
        method: "PUT",
        url: `/api/Account/accounts/${id}/deactivate/${!isActivate}`,
      }),
    {
      success: isActivate
        ? "Đã kích hoạt tài khoản thành công!"
        : "Đã vô hiệu hóa tài khoản thành công!",
      forbidden: "Bạn không đủ quyền hạn để thực hiện hành động này!",
      notFound: "Không tìm thấy vai trò!",
      serverError: "Lỗi máy chủ!",
    }
  );
};
