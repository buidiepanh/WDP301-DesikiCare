"use client";
import React, { useState } from "react";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";
import { apiRequest, loginRequiredApi, publicApi } from "@/lib/axiosInstance";
import { useAppDispatch } from "@/app/hooks";
import { setToken, setUserInfo } from "@/slices/userSlice";
import { setCart } from "@/slices/cartSlice";

const LoginPage = () => {
  // STATES
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  // REDUX

  // HOOKS
  const dispatch = useAppDispatch();
  const router = useRouter();

  // FUNCTIONS
  const handleSuccessfulLogin = () => {
    // Check if there's a previousPath in localStorage
    if (typeof window !== "undefined") {
      const previousPath = localStorage.getItem("previousPath");

      if (previousPath) {
        // Remove previousPath from localStorage
        localStorage.removeItem("previousPath");

        // Navigate to the previous path
        console.log("Redirecting to previous path:", previousPath);
        router.push(previousPath);
      } else {
        // Default redirect to home
        console.log("No previous path found, redirecting to home...");
        router.push("/home");
      }
    } else {
      // Fallback for SSR
      router.push("/home");
    }
  };
  // Validation functions
  const validateEmail = (email: string) => {
    if (!email.trim()) {
      return "Email is required";
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return "Please enter a valid email address";
    }
    return "";
  };

  const validatePassword = (password: string) => {
    if (!password.trim()) {
      return "Password is required";
    }
    return "";
  };

  // Handle input changes with real-time validation
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);

    // Clear error when user starts typing
    if (errors.email) {
      setErrors((prev) => ({ ...prev, email: "" }));
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPassword(value);

    // Clear error when user starts typing
    if (errors.password) {
      setErrors((prev) => ({ ...prev, password: "" }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate all fields
    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);

    // Set errors
    setErrors({
      email: emailError,
      password: passwordError,
    });

    // If there are errors, don't submit
    if (emailError || passwordError) {
      return;
    }

    // Start loading
    setIsLoading(true);

    // API Call To Login
    try {
      const response = await apiRequest({
        instance: publicApi,
        method: "POST",
        url: "Account/login",
        data: {
          loginInfo: {
            email: email,
            password: password,
          },
        },
      });

      // Debug: Log response để xem cấu trúc
      console.log("Login API Response:", response);

      // apiRequest trả về response.data, không phải full response
      // Kiểm tra có token trong response không
      if (response && response.token) {
        const token = response.token;

        console.log("Token received:", token);

        // Set token to Redux store
        dispatch(setToken(token));

        // Create temporary loginRequiredApi instance with the new token
        const tempLoginRequiredApi = axios.create({
          baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
          timeout: 10000,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        try {
          // Call API to get user info using the temporary instance
          const userInfoResponse = await tempLoginRequiredApi.get("Account/me");

          console.log("User Info Response:", userInfoResponse);

          if (
            userInfoResponse &&
            userInfoResponse.status === 200 &&
            userInfoResponse.data
          ) {
            // Dispatch user info to Redux store
            dispatch(
              setUserInfo(
                userInfoResponse.data.account || userInfoResponse.data
              )
            );

            try {
              // Call API to get Cart Info using the temporary instance
              const cartInfoResponse = await tempLoginRequiredApi.get(
                "Order/carts/me"
              );

              console.log("Cart Info Response:", cartInfoResponse);

              if (
                cartInfoResponse &&
                cartInfoResponse.status === 200 &&
                cartInfoResponse.data
              ) {
                // Handle cart info - Transform API response to match Redux store structure
                const cartData = cartInfoResponse.data;
                console.log("Raw Cart API Response:", cartData);

                const transformedCartData = {
                  cartId: cartData.cart?._id || null,
                  items: cartData.cartItems || [],
                };

                console.log(
                  "Transformed Cart Data for Redux:",
                  transformedCartData
                );
                dispatch(setCart(transformedCartData));

                // All data loaded successfully, redirect using new function
                console.log("Login successful! Checking for previous path...");
                handleSuccessfulLogin();
              } else {
                console.error("Failed to fetch cart info:", cartInfoResponse);
                // Even if cart fails, we can still proceed
                handleSuccessfulLogin();
              }
            } catch (cartError) {
              console.error("Cart API error:", cartError);
              // Proceed anyway, user can still use the app
              handleSuccessfulLogin();
            }
          } else {
            console.error("Failed to fetch user info:", userInfoResponse);
            setErrors({
              email: "",
              password: "Failed to load user information",
            });
          }
        } catch (userError) {
          console.error("User info API error:", userError);
          setErrors({
            email: "",
            password: "Failed to load user information",
          });
        }
      } else {
        // Handle login failure - Debug response structure
        console.log("Login failed - Response structure:", response);
        console.log("Response.data:", response?.data);
        console.log("Response.token:", response?.token);

        const errorMessage =
          response?.message ||
          response?.data?.message ||
          "Login failed. Please check your credentials.";
        setErrors({
          email: "",
          password: errorMessage,
        });
      }
    } catch (error: any) {
      console.error("Login failed:", error);

      // Handle different types of errors
      let errorMessage = "An unexpected error occurred. Please try again.";

      if (error.message.includes("Network error")) {
        errorMessage = "Network error. Please check your connection.";
      } else if (error.message.includes("API Error: 401")) {
        errorMessage = "Invalid email or password.";
      } else if (error.message.includes("API Error: 400")) {
        errorMessage = "Please check your email and password.";
      }

      setErrors({
        email: "",
        password: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen w-full">
      {/* Left side - Login Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center  bg-white">
        <div className="w-full flex-1 flex flex-col justify-center items-center relative">
          {/* Logo */}
          <div className="absolute top-8 left-8">
            <Link href="/home" className="font-instrument text-2xl font-bold">
              desiki
            </Link>
          </div>
          {/* Login Form */}
          <div className="max-w-md mx-auto mt-16">
            <h2 className="font-instrument text-4xl font-bold mb-2">
              Welcome Back
            </h2>
            <p className="text-gray-500 mb-8">
              Welcome back, please enter your informations to login.
            </p>
            <form onSubmit={handleSubmit}>
              <div className="mb-6">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={handleEmailChange}
                  className={`w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 transition-colors ${
                    errors.email
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:ring-black"
                  }`}
                  placeholder="Enter your email..."
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                )}
              </div>
              <div className="mb-8">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    value={password}
                    onChange={handlePasswordChange}
                    className={`w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 transition-colors pr-10 ${
                      errors.password
                        ? "border-red-500 focus:ring-red-500"
                        : "border-gray-300 focus:ring-black"
                    }`}
                    placeholder="Enter your password..."
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOffIcon size={20} />
                    ) : (
                      <EyeIcon size={20} />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                )}
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-3 rounded-md font-medium transition-colors ${
                  isLoading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-black hover:bg-gray-800"
                } text-white`}
              >
                {isLoading ? "Signing In..." : "Sign In"}
              </button>
            </form>
            <div className="text-center mt-6">
              <p className="text-gray-600">
                Don't have account ?{" "}
                <Link
                  href="/register"
                  className="text-black font-medium hover:underline"
                >
                  Sign Up
                </Link>
              </p>
            </div>
          </div>
          {/* Footer */}
          <div className=" text-gray-500 text-sm absolute bottom-4 left-4">
            © Desiki 2025
          </div>
        </div>
      </div>
      {/* Right side - Image */}
      <div
        className="hidden lg:block lg:w-1/2 bg-black relative"
        style={{
          backgroundImage: "url('/images/decoration/login/sideImageLogin.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="absolute inset-0 bg-black opacity-10"></div>
      </div>
    </div>
  );
};
export default LoginPage;
