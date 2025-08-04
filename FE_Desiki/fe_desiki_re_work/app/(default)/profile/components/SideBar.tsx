"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { LogOut } from "lucide-react";
import { clearUser } from "@/slices/userSlice";

const sideBarRoutes = [
  { title: "User Profile", path: "/profile/info" },
  { title: "My Orders", path: "/profile/my-orders" },
  { title: "Game Reward Histories", path: "/profile/game-history" },
  { title: "My Delivery Address", path: "/profile/my-delivery-addresses" },
  // { title: "Change Password", path: "/profile/change-password" },
];

export const SideBar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useDispatch();

  const handleSignOut = () => {
    // Clear Redux user state
    dispatch(clearUser());

    // Redirect to login page
    router.push("/login");
  };

  return (
    <div className="w-64 bg-[#F5F7F9] rounded-md">
      <div className="p-6">
        <nav className="space-y-2">
          {sideBarRoutes.map((route) => {
            const isActive = pathname === route.path;

            return (
              <Link
                key={route.path}
                href={route.path}
                className={`block px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  isActive ? "text-[#1679A7]" : "hover:text-[#1679A7]"
                }`}
              >
                {route.title}
              </Link>
            );
          })}
        </nav>

        {/* Sign Out Button */}
        <div className="mt-8 pt-6 border-t border-gray-300">
          <button
            onClick={handleSignOut}
            className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-sm font-medium transition-colors hover:bg-red-50"
            style={{ color: "#EC3921" }}
          >
            <LogOut size={18} />
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
};
