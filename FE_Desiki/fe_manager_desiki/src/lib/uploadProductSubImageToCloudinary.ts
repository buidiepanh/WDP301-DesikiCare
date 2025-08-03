export const uploadProductSubImageToCloudinary = async (
  file: File,
  productId: string,
  index: number
): Promise<string | null> => {
  try {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "products"); // tên preset đã tạo trên Cloudinary
    formData.append("folder", `desiki/products/${productId}`);
    formData.append("public_id", `${index}`); // tên file = index, ví dụ: desiki/products/123/0.png
    formData.append("resource_type", "image");
    formData.append("overwrite", "true"); // ghi đè nếu đã tồn tại

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
