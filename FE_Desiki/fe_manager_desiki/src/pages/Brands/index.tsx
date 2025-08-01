import { useState, useEffect, useRef } from "react";
import { CircularProgress } from "@mui/material";
import { uploadImageToCloudinary } from "../../lib/uploadBrandImageToCloudinary";
import Swal from "sweetalert2";
import axios from "axios";

interface Brand {
  _id: string;
  name: string;
  imageUrl: string;
  createdAt: string;
  updatedAt: string;
}

// Custom Glassmorphism Card Component
const GlassCard = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div
    className={`backdrop-blur-xl bg-black/20 border border-white/10 rounded-2xl shadow-2xl ${className}`}
    style={{ backdropFilter: "blur(16px)" }}
  >
    {children}
  </div>
);

const Brands = () => {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newBrandName, setNewBrandName] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [createdBrandId, setCreatedBrandId] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch brands from API
  const fetchBrands = async () => {
    setIsLoading(true);
    try {
      console.log(
        "🔍 Fetching brands from /api/brands (proxied to localhost:3000)"
      );

      const response = await axios.get("/api/brands");

      console.log("📥 Brands response:", response);

      if (response && response.data && response.data.brands) {
        setBrands(response.data.brands);
        console.log("✅ Brands loaded:", response.data.brands.length);
      } else {
        setBrands([]);
        console.log("⚠️ No brands found in response");
      }
    } catch (error: any) {
      console.error("❌ Error fetching brands:", error);
      setBrands([]);
      Swal.fire("Lỗi", "Không thể tải danh sách brands!", "error");
    } finally {
      setIsLoading(false);
    }
  };

  // Create new brand
  const handleCreateBrand = async () => {
    if (!newBrandName.trim()) {
      Swal.fire("Lỗi", "Vui lòng nhập tên brand!", "error");
      return;
    }

    setIsCreating(true);
    try {
      console.log("🚀 Creating new brand:", newBrandName);

      const response = await axios.post("/api/brands", {
        name: newBrandName.trim(),
      });

      console.log("📥 Create brand response:", response);

      if (response && response.data && response.data.brandId) {
        setCreatedBrandId(response.data.brandId);
        console.log("✅ Brand created with ID:", response.data.brandId);

        Swal.fire(
          "Thành công",
          "Tạo brand thành công! Bây giờ có thể upload ảnh.",
          "success"
        );

        // Don't close modal yet, wait for image upload
        setNewBrandName("");
      } else {
        throw new Error("Invalid response from server");
      }
    } catch (error: any) {
      console.error("❌ Error creating brand:", error);
      Swal.fire("Lỗi", "Không thể tạo brand mới!", "error");
    } finally {
      setIsCreating(false);
    }
  };

  // Handle file selection
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  // Upload image to Cloudinary
  const handleUploadImage = async () => {
    if (!selectedFile || !createdBrandId) {
      Swal.fire("Lỗi", "Vui lòng chọn file ảnh và tạo brand trước!", "error");
      return;
    }

    setIsUploadingImage(true);
    try {
      console.log(
        "🌤️ Uploading image to Cloudinary for brand:",
        createdBrandId
      );

      const imageUrl = await uploadImageToCloudinary(
        selectedFile,
        createdBrandId
      );

      if (imageUrl) {
        const responseUpload = await axios.patch(
          `/api/brands/${createdBrandId}`,
          {
            imageUrl,
          }
        );
        if (
          responseUpload &&
          responseUpload.data &&
          responseUpload.data.success
        ) {
          console.log("✅ Image uploaded successfully:", imageUrl);
          Swal.fire("Thành công", "Upload ảnh thành công!", "success");

          // Close modal and refresh brands list
          setIsCreateModalOpen(false);
          setCreatedBrandId(null);
          setSelectedFile(null);
          setPreviewUrl(null);
        }
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }

        // Refresh brands list
        fetchBrands();
      } else {
        throw new Error("Upload failed");
      }
    } catch (error: any) {
      console.error("❌ Error uploading image:", error);
      Swal.fire("Lỗi", "Upload ảnh thất bại!", "error");
    } finally {
      setIsUploadingImage(false);
    }
  };

  // Close modal and reset state
  const closeModal = () => {
    setIsCreateModalOpen(false);
    setNewBrandName("");
    setCreatedBrandId(null);
    setSelectedFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Load brands on component mount
  useEffect(() => {
    fetchBrands();
  }, []);

  return (
    <div className="w-full flex flex-col p-6">
      {/* Header Section */}
      <GlassCard className="mb-8 p-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-white text-3xl font-bold mb-2">
              Brands Management
            </h1>
            <p className="text-white/70 text-lg">
              Quản lý thương hiệu và danh sách brands.
            </p>
          </div>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="px-6 py-3 bg-blue-500/20 border border-blue-400/40 text-blue-200 hover:bg-blue-500/30 transition-all duration-200 backdrop-blur-sm rounded-lg font-medium shadow-lg"
          >
            ➕ Tạo Brand Mới
          </button>
        </div>
      </GlassCard>

      {/* Brands List */}
      <GlassCard className="p-6">
        <h2 className="text-white text-xl font-semibold mb-4">
          📋 Danh Sách Brands
        </h2>

        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <CircularProgress sx={{ color: "rgba(255, 255, 255, 0.8)" }} />
            <span className="text-white/70 ml-3">Đang tải...</span>
          </div>
        ) : brands.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-white/70 text-lg">Chưa có brand nào.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {brands.map((brand) => (
              <div
                key={brand._id}
                className="bg-white/5 border border-white/10 rounded-xl p-4 hover:bg-white/10 transition-all duration-200"
              >
                {/* Brand Image */}
                <div className="w-full h-48 mb-4 rounded-lg overflow-hidden bg-gray-700/50">
                  {brand.imageUrl ? (
                    <img
                      src={brand.imageUrl}
                      alt={brand.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-white/50 text-4xl">🏷️</span>
                    </div>
                  )}
                </div>

                {/* Brand Info */}
                <div>
                  <h3 className="text-white font-semibold text-lg mb-2 truncate">
                    {brand.name}
                  </h3>
                  <div className="text-white/60 text-sm space-y-1">
                    <p>
                      <strong>ID:</strong> {brand._id}
                    </p>
                    <p>
                      <strong>Tạo:</strong> {formatDate(brand.createdAt)}
                    </p>
                    <p>
                      <strong>Cập nhật:</strong> {formatDate(brand.updatedAt)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </GlassCard>

      {/* Create Brand Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <GlassCard className="w-full max-w-md mx-4 p-6">
            <h3 className="text-white text-xl font-semibold mb-4">
              ✨ Tạo Brand Mới
            </h3>

            {/* Step 1: Brand Name */}
            {!createdBrandId && (
              <div className="space-y-4">
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">
                    Tên Brand:
                  </label>
                  <input
                    type="text"
                    value={newBrandName}
                    onChange={(e) => setNewBrandName(e.target.value)}
                    placeholder="Nhập tên brand..."
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-blue-400/50"
                    disabled={isCreating}
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={handleCreateBrand}
                    disabled={isCreating || !newBrandName.trim()}
                    className={`flex-1 px-4 py-3 rounded-lg font-medium transition-all duration-200 backdrop-blur-sm
                      ${
                        isCreating || !newBrandName.trim()
                          ? "bg-gray-500/20 border border-gray-400/40 text-gray-400 cursor-not-allowed"
                          : "bg-green-500/20 border border-green-400/40 text-green-200 hover:bg-green-500/30"
                      }`}
                  >
                    {isCreating ? (
                      <div className="flex items-center justify-center gap-2">
                        <CircularProgress
                          size={16}
                          sx={{ color: "rgba(255, 255, 255, 0.6)" }}
                        />
                        Đang tạo...
                      </div>
                    ) : (
                      "🚀 Tạo Brand"
                    )}
                  </button>

                  <button
                    onClick={closeModal}
                    disabled={isCreating}
                    className="px-4 py-3 bg-red-500/20 border border-red-400/40 text-red-200 hover:bg-red-500/30 transition-all duration-200 backdrop-blur-sm rounded-lg font-medium"
                  >
                    ✖️ Hủy
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Upload Image */}
            {createdBrandId && (
              <div className="space-y-4">
                <div className="p-3 bg-green-500/10 border border-green-400/30 rounded-lg">
                  <p className="text-green-200 text-sm">
                    ✅ Brand đã được tạo với ID:{" "}
                    <strong>{createdBrandId}</strong>
                  </p>
                </div>

                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">
                    Chọn ảnh brand:
                  </label>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="block w-full text-sm text-white/70
                             file:mr-4 file:py-2 file:px-4
                             file:rounded-lg file:border-0
                             file:text-sm file:font-semibold
                             file:bg-blue-500/20 file:text-blue-200
                             hover:file:bg-blue-500/30
                             file:backdrop-blur-sm"
                    disabled={isUploadingImage}
                  />
                </div>

                {/* Image Preview */}
                {previewUrl && (
                  <div>
                    <label className="block text-white/80 text-sm font-medium mb-2">
                      Preview:
                    </label>
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="w-full h-48 object-cover rounded-lg border border-white/20"
                    />
                  </div>
                )}

                <div className="flex gap-3">
                  <button
                    onClick={handleUploadImage}
                    disabled={!selectedFile || isUploadingImage}
                    className={`flex-1 px-4 py-3 rounded-lg font-medium transition-all duration-200 backdrop-blur-sm
                      ${
                        !selectedFile || isUploadingImage
                          ? "bg-gray-500/20 border border-gray-400/40 text-gray-400 cursor-not-allowed"
                          : "bg-blue-500/20 border border-blue-400/40 text-blue-200 hover:bg-blue-500/30"
                      }`}
                  >
                    {isUploadingImage ? (
                      <div className="flex items-center justify-center gap-2">
                        <CircularProgress
                          size={16}
                          sx={{ color: "rgba(255, 255, 255, 0.6)" }}
                        />
                        Đang upload...
                      </div>
                    ) : (
                      "🌤️ Upload Ảnh"
                    )}
                  </button>

                  <button
                    onClick={closeModal}
                    disabled={isUploadingImage}
                    className="px-4 py-3 bg-red-500/20 border border-red-400/40 text-red-200 hover:bg-red-500/30 transition-all duration-200 backdrop-blur-sm rounded-lg font-medium"
                  >
                    ✖️ Đóng
                  </button>
                </div>
              </div>
            )}
          </GlassCard>
        </div>
      )}
    </div>
  );
};

export default Brands;
