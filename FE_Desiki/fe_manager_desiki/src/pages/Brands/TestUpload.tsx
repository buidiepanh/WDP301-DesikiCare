import { useState, useRef } from "react";
import { CircularProgress } from "@mui/material";
import { callAPIManager } from "../../api/axiosInstace";
import { uploadImageToCloudinary } from "../../lib/uploadBrandImageToCloudinary";
import Swal from "sweetalert2";

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

const TestUpload = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [isUploadingCloudinary, setIsUploadingCloudinary] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploadResult, setUploadResult] = useState<string | null>(null);
  const [cloudinaryResult, setCloudinaryResult] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const testBrandId = "688afeaba5f29af8ca8d6913";

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);

      // Create preview URL
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);

      console.log("Selected file:", {
        name: file.name,
        size: file.size,
        type: file.type,
      });
    }
  };

  const handleUploadToCloudinary = async () => {
    if (!selectedFile) {
      Swal.fire("Lỗi", "Vui lòng chọn file ảnh trước!", "error");
      return;
    }

    setIsUploadingCloudinary(true);
    setCloudinaryResult(null);

    try {
      console.log("🌤️ === STARTING CLOUDINARY UPLOAD ===");
      console.log("Brand ID:", testBrandId);
      console.log("File:", selectedFile.name);
      console.log(
        "Cloudinary URL: https://api.cloudinary.com/v1_1/dyc4e8jnb/image/upload"
      );

      const imageUrl = await uploadImageToCloudinary(selectedFile, testBrandId);

      console.log("📥 Cloudinary Response:", imageUrl);

      if (imageUrl) {
        setCloudinaryResult(imageUrl);
        Swal.fire("Thành công", "Upload lên Cloudinary thành công!", "success");
      } else {
        throw new Error("Cloudinary upload failed");
      }
    } catch (error: any) {
      console.error("❌ Cloudinary Upload Error:", error);
      setCloudinaryResult(
        `Error: ${error?.message || "Cloudinary upload failed"}`
      );
      Swal.fire("Lỗi", "Upload lên Cloudinary thất bại!", "error");
    } finally {
      setIsUploadingCloudinary(false);
    }
  };

  const handleUploadImage = async () => {
    if (!selectedFile) {
      Swal.fire("Lỗi", "Vui lòng chọn file ảnh trước!", "error");
      return;
    }

    setIsUploading(true);
    setUploadResult(null);

    try {
      // Create FormData for file upload
      const formData = new FormData();
      formData.append("image", selectedFile);

      console.log("🚀 === STARTING IMAGE UPLOAD ===");
      console.log("Brand ID:", testBrandId);
      console.log("File:", selectedFile.name);
      console.log("API URL:", `/api/Brand/brands/${testBrandId}/image`);

      const response = await callAPIManager({
        method: "PUT",
        url: `/api/Brand/brands/${testBrandId}/image`,
        data: formData,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("📥 Upload Response:", response);

      if (response && response.status === 200) {
        setUploadResult(response.data?.imageUrl || "Upload successful!");
        Swal.fire("Thành công", "Upload ảnh thành công!", "success");

        // Clear selections
        setSelectedFile(null);
        setPreviewUrl(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      } else {
        throw new Error("Upload failed");
      }
    } catch (error: any) {
      console.error("❌ Upload Error:", error);
      setUploadResult(`Error: ${error?.message || "Upload failed"}`);
      Swal.fire("Lỗi", "Upload ảnh thất bại!", "error");
    } finally {
      setIsUploading(false);
    }
  };

  const clearSelection = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setUploadResult(null);
    setCloudinaryResult(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="w-full flex flex-col p-6">
      {/* Header Section */}
      <GlassCard className="mb-8 p-6">
        <h1 className="text-white text-3xl font-bold mb-2">
          🧪 Test Upload Image
        </h1>
        <p className="text-white/70 text-lg">
          Test upload ảnh với Backend API và Cloudinary.
        </p>
      </GlassCard>

      {/* Image Upload Test Section */}
      <GlassCard className="p-6">
        <h2 className="text-white text-xl font-semibold mb-4">
          Upload Test Functions
        </h2>

        <div className="mb-4 p-4 bg-blue-500/10 border border-blue-400/30 rounded-lg">
          <p className="text-blue-200 text-sm">
            <strong>Test Brand ID:</strong> {testBrandId}
          </p>
          <p className="text-blue-200 text-sm">
            <strong>Backend API:</strong> PUT /api/Brand/brands/{testBrandId}
            /image
          </p>
          <p className="text-blue-200 text-sm">
            <strong>Cloudinary API:</strong> POST
            https://api.cloudinary.com/v1_1/dyc4e8jnb/image/upload
          </p>
        </div>

        {/* File Input */}
        <div className="mb-6">
          <label className="block text-white/80 text-sm font-medium mb-2">
            Chọn file ảnh:
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
          />
        </div>

        {/* Preview Section */}
        {previewUrl && (
          <div className="mb-6">
            <label className="block text-white/80 text-sm font-medium mb-2">
              Preview:
            </label>
            <div className="flex items-center gap-4">
              <img
                src={previewUrl}
                alt="Preview"
                className="w-32 h-32 object-cover rounded-lg border border-white/20"
              />
              <div className="text-white/70">
                <p>
                  <strong>Tên file:</strong> {selectedFile?.name}
                </p>
                <p>
                  <strong>Kích thước:</strong>{" "}
                  {(selectedFile?.size || 0 / 1024).toFixed(2)} KB
                </p>
                <p>
                  <strong>Loại:</strong> {selectedFile?.type}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-4 mb-6 flex-wrap">
          <button
            onClick={handleUploadImage}
            disabled={!selectedFile || isUploading}
            className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 backdrop-blur-sm shadow-lg
              ${
                !selectedFile || isUploading
                  ? "bg-gray-500/20 border border-gray-400/40 text-gray-400 cursor-not-allowed"
                  : "bg-green-500/20 border border-green-400/40 text-green-200 hover:bg-green-500/30"
              }`}
          >
            {isUploading ? (
              <div className="flex items-center gap-2">
                <CircularProgress
                  size={16}
                  sx={{ color: "rgba(255, 255, 255, 0.6)" }}
                />
                Uploading to API...
              </div>
            ) : (
              "🚀 Upload to Backend API"
            )}
          </button>

          <button
            onClick={handleUploadToCloudinary}
            disabled={!selectedFile || isUploadingCloudinary}
            className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 backdrop-blur-sm shadow-lg
              ${
                !selectedFile || isUploadingCloudinary
                  ? "bg-gray-500/20 border border-gray-400/40 text-gray-400 cursor-not-allowed"
                  : "bg-blue-500/20 border border-blue-400/40 text-blue-200 hover:bg-blue-500/30"
              }`}
          >
            {isUploadingCloudinary ? (
              <div className="flex items-center gap-2">
                <CircularProgress
                  size={16}
                  sx={{ color: "rgba(255, 255, 255, 0.6)" }}
                />
                Uploading to Cloudinary...
              </div>
            ) : (
              "🌤️ Upload to Cloudinary"
            )}
          </button>

          <button
            onClick={clearSelection}
            disabled={isUploading || isUploadingCloudinary}
            className="px-6 py-3 bg-red-500/20 border border-red-400/40 text-red-200 hover:bg-red-500/30 transition-all duration-200 backdrop-blur-sm rounded-lg font-medium shadow-lg"
          >
            🗑️ Clear
          </button>
        </div>

        {/* Result Section */}
        {uploadResult && (
          <div className="mb-4">
            <label className="block text-white/80 text-sm font-medium mb-2">
              Backend API Result:
            </label>
            <div className="p-4 bg-green-500/10 border border-green-400/30 rounded-lg">
              <p className="text-green-200 text-sm break-all">{uploadResult}</p>
            </div>
          </div>
        )}

        {/* Cloudinary Result Section */}
        {cloudinaryResult && (
          <div className="mb-4">
            <label className="block text-white/80 text-sm font-medium mb-2">
              Cloudinary Result:
            </label>
            <div className="p-4 bg-blue-500/10 border border-blue-400/30 rounded-lg">
              <p className="text-blue-200 text-sm break-all mb-2">
                {cloudinaryResult}
              </p>
              {cloudinaryResult.startsWith("http") && (
                <div className="mt-2">
                  <img
                    src={cloudinaryResult}
                    alt="Uploaded to Cloudinary"
                    className="w-32 h-32 object-cover rounded-lg border border-white/20"
                  />
                </div>
              )}
            </div>
          </div>
        )}
      </GlassCard>
    </div>
  );
};

export default TestUpload;
