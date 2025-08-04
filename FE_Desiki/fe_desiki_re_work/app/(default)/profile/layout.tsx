"use client";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux"; // nếu dùng Redux
import { useRouter, usePathname } from "next/navigation";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { SideBar } from "./components/SideBar";
import { useAppSelector } from "@/app/hooks";

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const token = useAppSelector((state) => state.user.token); // Giả sử bạn lưu token trong Redux

  const [isDialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    if (!token) {
      setDialogOpen(true);
    }
  }, [token]);

  return (
    <>
      {/* Alert nếu chưa login */}
      <AlertDialog open={isDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            Bạn cần đăng nhập để truy cập trang hồ sơ.
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => router.push("/")}>
              Huỷ
            </AlertDialogCancel>
            <AlertDialogAction onClick={() => router.push("/login")}>
              Đăng nhập
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Layout chính nếu đã login */}
      {token && (
        <div className="flex-1 flex p-10 gap-10">
          <SideBar />
          <main className="flex-1 p-6 w-full bg-[#f5f7f9]">{children}</main>
        </div>
      )}
    </>
  );
}
