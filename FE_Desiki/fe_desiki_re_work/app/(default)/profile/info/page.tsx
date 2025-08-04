"use client";

import { useAppDispatch } from "@/app/hooks";
import { apiRequest, loginRequiredApi } from "@/lib/axiosInstance";
import { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import { setUserInfo, setToken, clearUser } from "@/slices/userSlice";
import { Edit2, Calendar } from "lucide-react";

type UserInfo = {
  _id: string;
  email: string;
  fullName: string;
  dob: string;
  phoneNumber: string;
  gender: string;
  points: number;
  roleId: number;
  gameTicketCount: number;
  isDeactivated: boolean;
  imageUrl: string;
  createdAt: string;
  updatedAt: string;
};

type UpdateProfileInfo = {
  fullName: string;
  phoneNumber: string;
  gender: string;
  dob: string;
  email: string;
  password: string;
  roleId: number;
};

type UpdateAvatarInfo = {
  imageBase64: string;
};

export default function ProfileInfoPage() {
  // REDUX
  const dispatch = useAppDispatch();

  // REFS
  const fileInputRef = useRef<HTMLInputElement>(null);

  // STATES
  const [isLoading, setIsLoading] = useState(false);
  const [userInfo, setLocalUserInfo] = useState<UserInfo | null>(null);
  const [formData, setFormData] = useState({
    fullName: "",
    phoneNumber: "",
    gender: "",
    dob: "",
  });
  const [originalData, setOriginalData] = useState({
    fullName: "",
    phoneNumber: "",
    gender: "",
    dob: "",
  });
  const [newImageBase64, setNewImageBase64] = useState<string | null>(null);

  // Check if form has changes
  const hasChanges =
    formData.fullName !== originalData.fullName ||
    formData.phoneNumber !== originalData.phoneNumber ||
    formData.gender !== originalData.gender ||
    formData.dob !== originalData.dob ||
    newImageBase64 !== null;

  // Helper function to format date from ISO string to YYYY-MM-DD
  const formatDateForInput = (isoString: string): string => {
    if (!isoString) return "";
    const date = new Date(isoString);
    return date.toISOString().split("T")[0]; // "2004-10-03"
  };

  // Helper function to format date from YYYY-MM-DD to ISO string
  const formatDateForAPI = (dateString: string): string => {
    if (!dateString) return "";
    return `${dateString}T00:00:00.000Z`;
  };

  // FUNCTIONS
  useEffect(() => {
    fetchUserInfo();
  }, []);

  useEffect(() => {
    if (userInfo) {
      const data = {
        fullName: userInfo.fullName || "",
        phoneNumber: userInfo.phoneNumber || "",
        gender: userInfo.gender || "",
        dob: formatDateForInput(userInfo.dob) || "",
      };
      setFormData(data);
      setOriginalData(data);
    }
  }, [userInfo]);

  const fetchUserInfo = async () => {
    try {
      setIsLoading(true);
      const response = await apiRequest({
        instance: loginRequiredApi,
        method: "GET",
        url: "Account/me",
      });
      if (response && response.account) {
        const userData = response.account as UserInfo;
        console.log("userData:", userData);
        setLocalUserInfo(userData);
        dispatch(setUserInfo(userData));
      } else {
        console.error("Failed to fetch user info");
        toast.error("Failed to fetch user info");
      }
    } catch (error) {
      console.error("Failed to fetch user info:", error);
      toast.error("Failed to fetch user info");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        // Validate file type
        if (!file.type.startsWith("image/")) {
          toast.error("Please select an image file");
          return;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
          toast.error("Image size should be less than 5MB");
          return;
        }

        const base64 = await hanldeConvertImageToBase64(file);
        setNewImageBase64(base64);
        toast.success("Image selected successfully");
      } catch (error) {
        toast.error("Failed to process image");
      }
    }
  };

  const handleUpdate = async () => {
    if (!userInfo) return;

    // Validation
    if (!formData.fullName.trim()) {
      toast.error("Full name is required");
      return;
    }
    if (!formData.phoneNumber.trim()) {
      toast.error("Phone number is required");
      return;
    }
    if (!formData.dob) {
      toast.error("Date of birth is required");
      return;
    }

    const updateInfo: UpdateProfileInfo = {
      fullName: formData.fullName,
      phoneNumber: formData.phoneNumber,
      gender: formData.gender,
      dob: formatDateForAPI(formData.dob), // Convert back to ISO format
      email: userInfo.email, // Keep original email
      password: "", // Not updating password here
      roleId: userInfo.roleId, // Keep original role
    };

    await handleUpdateProfile(updateInfo);

    // If there's a new image, update it separately
    if (newImageBase64) {
      await handleUpdateAvatar(newImageBase64);
      setNewImageBase64(null);
    }
  };

  const handleCancel = () => {
    if (userInfo) {
      const data = {
        fullName: userInfo.fullName || "",
        phoneNumber: userInfo.phoneNumber || "",
        gender: userInfo.gender || "",
        dob: formatDateForInput(userInfo.dob) || "",
      };
      setFormData(data);
      setNewImageBase64(null);
    }
  };

  const handleUpdateProfile = async (updateInfo: UpdateProfileInfo) => {
    try {
      setIsLoading(true);
      const response = await apiRequest({
        instance: loginRequiredApi,
        method: "PUT",
        url: `Account/accounts/${userInfo?._id}`,
        data: {
          account: {
            ...updateInfo,
          },
        },
      });
      if (response) {
        toast.success("Profile updated successfully");
        fetchUserInfo();
      } else {
        console.error("Failed to update user info");
      }
    } catch (error) {
      console.error("Failed to update user info:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const hanldeConvertImageToBase64 = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === "string") {
          resolve(reader.result);
        } else {
          reject(new Error("Failed to convert image to base64"));
        }
      };
      reader.onerror = () => {
        reject(new Error("Failed to read file"));
      };
      reader.readAsDataURL(file);
    });
  };

  const handleUpdateAvatar = async (imageBase64: string) => {
    try {
      setIsLoading(true);
      const response = await apiRequest({
        instance: loginRequiredApi,
        method: "PUT",
        url: `Account/accounts/${userInfo?._id}`,
        data: {
          account: {
            ...userInfo,
            imageBase64,
          },
        },
      });
      if (response) {
        toast.success("Avatar updated successfully");
        fetchUserInfo();
      } else {
        console.error("Failed to update avatar");
      }
    } catch (error) {
      console.error("Failed to update avatar:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-[#F5F7F9]">
      <div className="max-w-6xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            User Profile
          </h1>
          <p className="text-gray-600">
            Manage your details and change informations
          </p>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-2xl shadow-sm p-8">
          <div className="flex gap-8">
            {/* Left Side - Avatar */}
            <div className="flex-shrink-0">
              <div className="relative">
                <div className="w-48 h-48 rounded-full overflow-hidden bg-gray-200">
                  {newImageBase64 ? (
                    <img
                      src={newImageBase64}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : userInfo?.imageUrl ? (
                    <img
                      src={userInfo.imageUrl}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 text-4xl font-bold">
                      {userInfo?.fullName?.charAt(0)?.toUpperCase() || "U"}
                    </div>
                  )}
                </div>

                {/* Edit Avatar Button */}
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isLoading}
                  className="absolute bottom-2 right-2 w-8 h-8 bg-gray-800 text-white rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors disabled:opacity-50"
                >
                  <Edit2 size={14} />
                </button>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </div>

              {/* User Info */}
              <div className="text-center mt-4">
                <h2 className="text-xl font-semibold text-gray-900">
                  {userInfo?.fullName || "Loading..."}
                </h2>
                <p className="text-gray-500 text-sm">
                  {userInfo?.email || "Loading..."}
                </p>
              </div>
            </div>

            {/* Right Side - Form */}
            <div className="flex-1 grid grid-cols-2 gap-6">
              {/* Email (Read-only) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={userInfo?.email || ""}
                  disabled
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
                />
              </div>

              {/* Full Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  disabled={isLoading}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
                />
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  disabled={isLoading}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
                />
              </div>

              {/* Date of Birth */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date Of Birth (MM/DD/YYYY)
                </label>
                <div className="relative">
                  <input
                    type="date"
                    name="dob"
                    value={formData.dob}
                    onChange={handleInputChange}
                    disabled={isLoading}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
                  />
                </div>
              </div>

              {/* Gender */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Gender
                </label>
                <div className="relative">
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    disabled={isLoading}
                    className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 appearance-none bg-white"
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
                      backgroundPosition: "right 12px center",
                      backgroundRepeat: "no-repeat",
                      backgroundSize: "16px",
                    }}
                  >
                    <option value="Nam">Male</option>
                    <option value="Nữ">Female</option>
                  </select>
                </div>
              </div>

              {/* Current Points (Read-only) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current Points
                </label>
                <input
                  type="text"
                  value={userInfo?.points?.toLocaleString() || "0"}
                  disabled
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-gray-200">
            <button
              onClick={handleCancel}
              disabled={isLoading || !hasChanges}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              onClick={handleUpdate}
              disabled={isLoading || !hasChanges}
              className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Updating..." : "Update"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
