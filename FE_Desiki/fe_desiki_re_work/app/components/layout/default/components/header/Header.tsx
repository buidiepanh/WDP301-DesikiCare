import { useAppSelector, useAppDispatch } from "@/app/hooks";
import {
  Menu,
  ShoppingBag,
  User,
  LogOut,
  RefreshCw,
  Ticket,
} from "lucide-react";
import Link from "next/link";
import { clearUser } from "@/slices/userSlice";
import { clearCart } from "@/slices/cartSlice";
import React, { useState, useEffect, useRef } from "react";

interface HeaderProps {
  onRefreshData?: () => void;
  isLoading?: boolean;
}

const unLoginNav = [
  {
    name: "Home",
    href: "/",
  },
  {
    name: "Products",
    href: "/products",
  },
  {
    name: "About Us",
    href: "/about",
  },
];

const loginNav = [
  {
    name: "Home",
    href: "/",
  },
  {
    name: "Products",
    href: "/products",
  },

  {
    name: "Mini Games",
    href: "/mini-games",
  },
  {
    name: "Take Quiz",
    href: "/quiz",
  },
  {
    name: "About Us",
    href: "/about",
  },
];

const Header = ({ onRefreshData, isLoading = false }: HeaderProps) => {
  // REDUX
  const dispatch = useAppDispatch();
  const token = useAppSelector((state) => state.user.token);
  const userInfo = useAppSelector((state) => state.user.info);
  const cartInfo = useAppSelector((state) => state.cart);
  const cartCount = cartInfo?.items?.length || 0;

  // HOOKS
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const navItems = token && userInfo ? loginNav : unLoginNav;

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowUserMenu(false);
      }
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target as Node)
      ) {
        setShowMobileMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // FUNCTIONS
  const handleLogout = () => {
    dispatch(clearUser());
    dispatch(clearCart());
    window.location.href = "/login";
  };

  const handleRefresh = () => {
    if (onRefreshData && !isLoading) {
      onRefreshData();
    }
  };
  return (
    <header className="w-full font-instrument bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-3 h-16">
          {/* Left Section - Menu Button */}
          <div className="w-full flex items-center justify-start">
            <div className="relative" ref={mobileMenuRef}>
              <button
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className="p-2 bg-black hover:bg-gray-700 rounded-full transition-colors"
              >
                <Menu className="h-6 w-6 text-white" />
              </button>

              {/* Navigation Dropdown */}
              {showMobileMenu && (
                <div className="absolute left-0 mt-2 w-56 bg-white rounded-md shadow-lg border border-gray-100 py-1 z-10">
                  {navItems.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setShowMobileMenu(false)}
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Center Section - Logo */}
          <div className="w-full flex items-center justify-center">
            <Link href="/" className="flex items-center">
              <h1 className="text-4xl font-semibold text-black">desiki</h1>
            </Link>
          </div>

          {/* Right Section - Cart & User */}
          <div className="w-full flex items-center gap-5 justify-end">
            {/* Refresh Button (only when logged in) */}
            {token && (
              <button
                onClick={handleRefresh}
                disabled={isLoading}
                className={`p-2 rounded-md transition-colors ${
                  isLoading
                    ? "text-gray-400 cursor-not-allowed"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
                title="Refresh data"
              >
                <RefreshCw
                  className={`h-5 w-5 ${isLoading ? "animate-spin" : ""}`}
                />
              </button>
            )}

            {/* Game Ticket */}
            {token && userInfo && userInfo.gameTicketCount > 0 && (
              <Link
                href="/game-ticket"
                className="p-2 hover:bg-gray-100 rounded-md transition-colors"
              >
                <div className="flex items-center space-x-2">
                  <Ticket />
                  <span className="text-md font-semibold text-gray-700">
                    {userInfo.gameTicketCount}
                  </span>
                </div>
              </Link>
            )}

            {/* Shopping Cart */}
            {token && (
              <Link
                href="/cart"
                className="relative p-2 hover:bg-gray-100 rounded-md transition-colors"
              >
                <ShoppingBag className="h-6 w-6 text-gray-700" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-black text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                    {cartCount > 99 ? "99+" : cartCount}
                  </span>
                )}
              </Link>
            )}

            {/* User Section */}
            {token && userInfo ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-3 p-2 hover:bg-gray-100 rounded-md transition-colors"
                >
                  <div className="flex items-center space-x-2">
                    {userInfo.imageUrl ? (
                      <img
                        src={userInfo.imageUrl}
                        alt={userInfo.fullName}
                        className="h-8 w-8 rounded-full object-cover"
                      />
                    ) : (
                      <div className="h-8 w-8 bg-gray-300 rounded-full flex items-center justify-center">
                        <User className="h-4 w-4 text-gray-600" />
                      </div>
                    )}
                    <div className="hidden sm:block text-left">
                      <p className="text-sm font-bold text-gray-900">
                        {userInfo.fullName}
                      </p>
                      <p className="text-xs font-semibold text-gray-500">
                        {userInfo.points.toLocaleString("vi-VN")} Points
                      </p>
                    </div>
                  </div>
                </button>

                {/* User Dropdown Menu */}
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg border border-gray-100 py-1 z-10">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900">
                        {userInfo.fullName}
                      </p>
                      <p className="text-xs text-gray-500">{userInfo.email}</p>
                      <p className="text-xs text-green-600 font-medium">
                        {userInfo.points} Points
                      </p>
                    </div>
                    <Link
                      href="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setShowUserMenu(false)}
                    >
                      Profile Settings
                    </Link>
                    <Link
                      href="/orders"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setShowUserMenu(false)}
                    >
                      My Orders
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  href="/login"
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-black transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-2 bg-black text-white text-sm font-medium rounded-md hover:bg-gray-800 transition-colors"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
