"use client";

import { apiRequest, publicApi } from "@/lib/axiosInstance";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  CalendarIcon,
  EyeIcon,
  EyeOffIcon,
  UploadIcon,
  UserIcon,
} from "lucide-react";

interface FormData {
  email: string;
  fullName: string;
  phoneNumber: string;
  gender: string;
  dob: string;
  password: string;
  confirmPassword: string;
  avatar: File | null;
}

interface FormErrors {
  email?: string;
  fullName?: string;
  phoneNumber?: string;
  gender?: string;
  dob?: string;
  password?: string;
  confirmPassword?: string;
  avatar?: string;
}

const RegisterPage = () => {
  const [formData, setFormData] = useState<FormData>({
    email: "",
    fullName: "",
    phoneNumber: "",
    gender: "",
    dob: "",
    password: "",
    confirmPassword: "",
    avatar: null,
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhoneNumber = (phone: string): boolean => {
    const phoneRegex = /^[0-9]{10,11}$/;
    return phoneRegex.test(phone);
  };

  const validatePassword = (password: string): boolean => {
    return password.length >= 8;
  };

  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const result = reader.result as string;
        resolve(result.split(",")[1]); // Remove the data:image/jpeg;base64, prefix
      };
      reader.onerror = (error) => reject(error);
    });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif"];
      if (!validTypes.includes(file.type)) {
        setErrors((prev) => ({
          ...prev,
          avatar: "Please select a valid image file (JPEG, PNG, GIF)",
        }));
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors((prev) => ({
          ...prev,
          avatar: "File size must be less than 5MB",
        }));
        return;
      }

      // Clear avatar error
      setErrors((prev) => ({ ...prev, avatar: "" }));

      // Set file and preview
      setFormData((prev) => ({ ...prev, avatar: file }));
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Email validation
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    // Full Name validation
    if (!formData.fullName) {
      newErrors.fullName = "Full name is required";
    } else if (formData.fullName.length < 2) {
      newErrors.fullName = "Full name must be at least 2 characters";
    }

    // Phone Number validation
    if (!formData.phoneNumber) {
      newErrors.phoneNumber = "Phone number is required";
    } else if (!validatePhoneNumber(formData.phoneNumber)) {
      newErrors.phoneNumber =
        "Please enter a valid phone number (10-11 digits)";
    }

    // Gender validation
    if (!formData.gender) {
      newErrors.gender = "Please select your gender";
    }

    // Date of Birth validation
    if (!formData.dob) {
      newErrors.dob = "Date of birth is required";
    } else {
      const selectedDate = new Date(formData.dob);
      const today = new Date();

      // Calculate age more accurately
      let age = today.getFullYear() - selectedDate.getFullYear();
      const monthDiff = today.getMonth() - selectedDate.getMonth();

      if (
        monthDiff < 0 ||
        (monthDiff === 0 && today.getDate() < selectedDate.getDate())
      ) {
        age--;
      }

      if (age < 5) {
        newErrors.dob = "You must be at least 5 years old";
      }
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (!validatePassword(formData.password)) {
      newErrors.password = "Password must be at least 8 characters long";
    }

    // Confirm Password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      // Convert avatar to base64 if exists
      let avatarBase64 = "";
      if (formData.avatar) {
        avatarBase64 = await convertFileToBase64(formData.avatar);
      }

      const response = await apiRequest({
        instance: publicApi,
        method: "POST",
        url: "Account/register",
        data: {
          account: {
            email: formData.email,
            password: formData.password,
            fullName: formData.fullName,
            phoneNumber: formData.phoneNumber,
            gender: formData.gender === "male" ? "Nam" : "Nữ",
            dob: formData.dob,
            roleId: 3,
            imageBase64: avatarBase64,
          },
        },
      });
      if (response && response.message) {
        toast.success(response.message);
        // Reset form
        setFormData({
          email: "",
          fullName: "",
          phoneNumber: "",
          gender: "",
          dob: "",
          password: "",
          confirmPassword: "",
          avatar: null,
        });
        setAvatarPreview(null);
        // Redirect to login after success
        window.location.href = "/login";
      }
    } catch (error: any) {
      console.error("Registration error:", error);
      toast.error(
        error.response?.data?.message ||
          "Registration failed. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full grid grid-cols-2 font-instrument min-h-screen">
      <div className="w-full h-screen flex flex-col items-center justify-center bg-gray-100">
        <Image
          src="/images/decoration/register/sideImageRegister.png"
          alt="Description"
          width={500}
          height={500}
          className="w-full h-screen object-cover"
        />
      </div>

      <div className="w-full h-screen flex flex-col items-center justify-center bg-white p-8 relative overflow-y-auto">
        <div className="absolute top-8 right-8">
          <Link href="/home" className="font-instrument text-2xl font-bold">
            desiki
          </Link>
        </div>

        {/* Registration Form */}
        <div className="w-full max-w-md mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome To Desiki
            </h1>
            <p className="text-gray-600">
              Nice to meet you, please give us your informations to create an
              Account
            </p>
          </div>

          <form onSubmit={handleRegister} className="space-y-6">
            {/* Email Field */}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email..."
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                className={
                  errors.email
                    ? "border-red-500 focus-visible:ring-red-500/20"
                    : ""
                }
              />
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email}</p>
              )}
            </div>

            {/* Full Name Field */}
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                type="text"
                placeholder="Enter your full name..."
                value={formData.fullName}
                onChange={(e) => handleInputChange("fullName", e.target.value)}
                className={
                  errors.fullName
                    ? "border-red-500 focus-visible:ring-red-500/20"
                    : ""
                }
              />
              {errors.fullName && (
                <p className="text-red-500 text-sm">{errors.fullName}</p>
              )}
            </div>

            {/* Phone Number Field */}
            <div className="space-y-2">
              <Label htmlFor="phoneNumber">Phone Number</Label>
              <Input
                id="phoneNumber"
                type="tel"
                placeholder="Enter your phone number..."
                value={formData.phoneNumber}
                onChange={(e) =>
                  handleInputChange("phoneNumber", e.target.value)
                }
                className={
                  errors.phoneNumber
                    ? "border-red-500 focus-visible:ring-red-500/20"
                    : ""
                }
              />
              {errors.phoneNumber && (
                <p className="text-red-500 text-sm">{errors.phoneNumber}</p>
              )}
            </div>

            {/* Gender and Avatar Fields */}
            <div className="grid grid-cols-2 gap-4">
              {/* Gender Field */}
              <div className="space-y-2">
                <Label htmlFor="gender">Gender</Label>
                <Select
                  value={formData.gender}
                  onValueChange={(value) => handleInputChange("gender", value)}
                >
                  <SelectTrigger
                    className={
                      errors.gender
                        ? "border-red-500 focus-visible:ring-red-500/20"
                        : ""
                    }
                  >
                    <SelectValue placeholder="You are ?" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                  </SelectContent>
                </Select>
                {errors.gender && (
                  <p className="text-red-500 text-sm">{errors.gender}</p>
                )}
              </div>

              {/* Avatar Upload Field */}
              <div className="space-y-2">
                <Label htmlFor="avatar">Avatar</Label>
                <div className="flex items-center gap-3">
                  <div className="relative w-16 h-16 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden bg-gray-50">
                    {avatarPreview ? (
                      <img
                        src={avatarPreview}
                        alt="Avatar preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <UserIcon className="w-6 h-6 text-gray-400" />
                    )}
                  </div>
                  <div className="flex-1">
                    <input
                      id="avatar"
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => document.getElementById("avatar")?.click()}
                      className="w-full"
                    >
                      <UploadIcon className="w-4 h-4 mr-2" />
                      Upload
                    </Button>
                  </div>
                </div>
                {errors.avatar && (
                  <p className="text-red-500 text-sm">{errors.avatar}</p>
                )}
              </div>
            </div>

            {/* Date of Birth Field */}
            <div className="space-y-2">
              <Label htmlFor="dob">Date of Birth</Label>
              <div className="relative">
                <Input
                  id="dob"
                  type="date"
                  placeholder="When were you born ?"
                  value={formData.dob}
                  onChange={(e) => handleInputChange("dob", e.target.value)}
                  className={
                    errors.dob
                      ? "border-red-500 focus-visible:ring-red-500/20"
                      : ""
                  }
                />
                {/* <CalendarIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" /> */}
              </div>
              {errors.dob && (
                <p className="text-red-500 text-sm">{errors.dob}</p>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password..."
                  value={formData.password}
                  onChange={(e) =>
                    handleInputChange("password", e.target.value)
                  }
                  className={
                    errors.password
                      ? "border-red-500 focus-visible:ring-red-500/20 pr-10"
                      : "pr-10"
                  }
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? (
                    <EyeOffIcon className="h-4 w-4" />
                  ) : (
                    <EyeIcon className="h-4 w-4" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm">{errors.password}</p>
              )}
            </div>

            {/* Confirm Password Field */}
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Re-enter Password</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Enter your password..."
                  value={formData.confirmPassword}
                  onChange={(e) =>
                    handleInputChange("confirmPassword", e.target.value)
                  }
                  className={
                    errors.confirmPassword
                      ? "border-red-500 focus-visible:ring-red-500/20 pr-10"
                      : "pr-10"
                  }
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? (
                    <EyeOffIcon className="h-4 w-4" />
                  ) : (
                    <EyeIcon className="h-4 w-4" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm">{errors.confirmPassword}</p>
              )}
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full bg-black text-white hover:bg-gray-800 h-12 text-base font-medium"
              disabled={isLoading}
            >
              {isLoading ? "Signing Up..." : "Sign Up"}
            </Button>

            {/* Sign In Link */}
            <div className="text-center text-sm text-gray-600">
              Already have account ?{" "}
              <Link
                href="/login"
                className="text-black font-medium hover:underline"
              >
                Sign In
              </Link>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="text-gray-500 text-sm absolute bottom-4 right-4">
          © Desiki 2025
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
