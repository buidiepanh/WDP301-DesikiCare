// utils/uploadImageToCloudinary.ts

export const uploadImageToCloudinary = async (
  file: File,
  brandId: string
): Promise<string | null> => {
  try {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "brands"); // tên preset đã tạo trên Cloudinary
    formData.append("folder", "desiki/brands");
    formData.append("public_id", brandId); // tên file = brandId, ví dụ: desiki/brands/123.png

    const response = await fetch(
      "https://api.cloudinary.com/v1_1/dyc4e8jnb/image/upload",
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await response.json();

    if (response.ok && data.secure_url) {
      return data.secure_url; // URL công khai để lưu vào DB
    } else {
      console.error("Upload failed:", data);
      return null;
    }
  } catch (error) {
    console.error("Upload error:", error);
    return null;
  }
};
