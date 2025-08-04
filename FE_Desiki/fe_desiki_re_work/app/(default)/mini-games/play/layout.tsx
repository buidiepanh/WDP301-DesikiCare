"use client";
import { useMiniGamesContext } from "../layout";

export default function PlayLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Kiểm tra context có tồn tại không - đảm bảo layout này được wrap bởi MiniGamesLayout
  const { refetchUserInfo, isRefetching, user } = useMiniGamesContext();

  return <div className="flex-1 flex flex-col">{children}</div>;
}
