// services/handleApiResponse.ts

interface ApiResponse<T> {
  data: T | null;
  message: string;
  isSuccess: boolean;
}

export const handleApiResponse = async <T>(
  apiCall: () => Promise<any>,
  messages?: {
    success?: string;
    forbidden?: string;
    notFound?: string;
    serverError?: string;
    defaultError?: string;
  }
): Promise<ApiResponse<T>> => {
  try {
    const response = await apiCall();

    if (response && response.status === 200 || response && response.status === 201) {
      return {
        data: response.data,
        message: messages?.success || "Thao tác thành công!",
        isSuccess: true,
      };
    }

    switch (response?.status) {
      case 403:
        return {
          data: null,
          message: messages?.forbidden || "Bạn không đủ quyền truy cập!",
          isSuccess: false,
        };
      case 404:
        return {
          data: null,
          message: messages?.notFound || "Không tìm thấy dữ liệu!",
          isSuccess: false,
        };
      case 500:
        return {
          data: null,
          message: messages?.serverError || "Lỗi hệ thống!",
          isSuccess: false,
        };
      default:
        return {
          data: null,
          message:
            messages?.defaultError || "Đã có lỗi xảy ra, vui lòng thử lại sau!",
          isSuccess: false,
        };
    }
  } catch (error: any) {
    return {
      data: null,
      message:
        messages?.defaultError ||
        error?.response?.data?.message ||
        "Đã có lỗi xảy ra!",
      isSuccess: false,
    };
  }
};
