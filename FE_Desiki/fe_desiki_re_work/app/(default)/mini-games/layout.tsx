"use client";
import { useEffect, useState, createContext, useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/app/store";
import { setUserInfo } from "@/slices/userSlice";
import { apiRequest, loginRequiredApi } from "@/lib/axiosInstance";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

type MiniGamesContextType = {
  refetchUserInfo: () => Promise<void>;
  isRefetching: boolean;
  user: any; // Thêm user info vào context
};

const MiniGamesContext = createContext<MiniGamesContextType | undefined>(
  undefined
);

export const useMiniGamesContext = () => {
  const context = useContext(MiniGamesContext);
  if (!context) {
    throw new Error("useMiniGamesContext must be used within MiniGamesLayout");
  }
  return context;
};

export default function MiniGamesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user);
  const [isRefetching, setIsRefetching] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  const refetchUserInfo = async () => {
    if (!user.token) return;

    setIsRefetching(true);
    try {
      const response = await apiRequest({
        instance: loginRequiredApi,
        method: "GET",
        url: "Account/me",
      });

      if (response) {
        dispatch(setUserInfo(response.account));
      }
    } catch (error) {
      console.error("Error refetching user info:", error);
      // If authentication error, redirect to login
      if (error && typeof error === "object" && "response" in error) {
        const status = (error as any).response?.status;
        if (status === 401) {
          toast.error("Session expired. Please login again.");
          router.push("/auth/login");
          return;
        }
      }
    } finally {
      setIsRefetching(false);
    }
  };

  // Check authentication first
  useEffect(() => {
    if (!user.token) {
      console.log(
        "User not authenticated for mini-games, redirecting to login"
      );
      toast.error("Please login to access mini-games");
      router.push("/auth/login");
      return;
    }
    setIsCheckingAuth(false);
  }, [user.token, router]);

  // Initial fetch on mount if user is logged in
  useEffect(() => {
    if (user.token && !user.info && !isCheckingAuth) {
      refetchUserInfo();
    }
  }, [user.token, isCheckingAuth]);

  const contextValue: MiniGamesContextType = {
    refetchUserInfo,
    isRefetching,
    user: user.info,
  };

  // Show loading screen while checking authentication
  if (isCheckingAuth || !user.token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-700">
            {isCheckingAuth
              ? "Checking authentication..."
              : "Redirecting to login..."}
          </h2>
          <p className="text-gray-500 mt-2">
            Please wait while we verify your access to mini-games
          </p>
        </div>
      </div>
    );
  }

  return (
    <MiniGamesContext.Provider value={contextValue}>
      <div className="flex-1 bg-gray-50">{children}</div>
    </MiniGamesContext.Provider>
  );
}
