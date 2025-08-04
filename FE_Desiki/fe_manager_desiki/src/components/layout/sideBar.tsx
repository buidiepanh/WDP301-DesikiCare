import type React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  BarChart3,
  ShoppingCart,
  UserCircle,
  Star,
  Gamepad2,
  MessageCircle,
  Package,
  LogOut,
  Tag,
  HelpCircle,
  Settings,
} from "lucide-react";

import { Button } from "@/components/ui/button";

type NavItem = {
  label: string;
  path: string;
  icon: React.ReactNode;
};

const adminNavItems: NavItem[] = [
  {
    label: "Revenue Dashboard",
    path: "/RevenueDashboard",
    icon: <BarChart3 className="h-5 w-5" />,
  },
  {
    label: "Account Management",
    path: "/AccountManagement/RoleAccountManagement",
    icon: <UserCircle className="h-5 w-5" />,
  },
  {
    label: "Point Management",
    path: "/Points",
    icon: <Star className="h-5 w-5" />,
  },
  {
    label: "Mini Game Management",
    path: "/MiniGames",
    icon: <Gamepad2 className="h-5 w-5" />,
  },
  {
    label: "Quiz Management",
    path: "/quiz",
    icon: <HelpCircle className="h-5 w-5" />,
  },
  // {
  //   label: "Chatbot Config",
  //   path: "/Chatbot",
  //   icon: <MessageCircle className="h-5 w-5" />,
  // },
];

const managerNavItems: NavItem[] = [
  {
    label: "Revenue Dashboard",
    path: "/RevenueDashboard",
    icon: <BarChart3 className="h-5 w-5" />,
  },
  {
    label: "Products",
    path: "/Products",
    icon: <ShoppingCart className="h-5 w-5" />,
  },
  {
    label: "Orders",
    path: "/Orders",
    icon: <ShoppingCart className="h-5 w-5" />,
  },
  {
    label: "Shipments",
    path: "/Shipments",
    icon: <Package className="h-5 w-5" />,
  },
  {
    label: "Game Rules",
    path: "/game-rules",
    icon: <Settings className="h-5 w-5" />,
  },
];

type Props = {
  role: 1 | 2;
  drawerWidth?: number;
};

const SideBar: React.FC<Props> = ({ role, drawerWidth = 240 }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const navItems = role === 1 ? managerNavItems : adminNavItems;

  const handleLogOut = () => {
    localStorage.removeItem("accessToken");
    navigate("/Auth/login");
  };

  return (
    <div
      className="fixed left-5 top-5 bottom-5 h-[90vh] z-50 backdrop-blur-xl bg-slate-400/20 border-r border-white/10 shadow-2xl rounded-lg"
      style={{ width: drawerWidth }}
    >
      {/* Glassmorphism overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-900/10 to-slate-900/20 backdrop-blur-xl rounded-lg" />

      <div className="relative z-10 h-full flex flex-col p-4 rounded-lg">
        {/* Header */}
        <div className="mb-8 text-center">
          <h2 className="text-xl font-bold text-white mb-1">Desiki Admin</h2>
          <p className="text-sm text-blue-200/70">
            {role === 1 ? "Manager Panel" : "Admin Panel"}
          </p>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 space-y-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`
                  w-full flex items-center px-4 py-3 rounded-xl transition-all duration-200 text-left
                  ${
                    isActive
                      ? "bg-blue-500/30 text-white border border-blue-400/40 shadow-lg backdrop-blur-sm"
                      : "text-blue-100/80 hover:bg-white/10 hover:text-white hover:backdrop-blur-sm hover:border hover:border-white/20"
                  }
                `}
              >
                <span
                  className={`mr-3 ${
                    isActive ? "text-blue-300" : "text-blue-200/70"
                  }`}
                >
                  {item.icon}
                </span>
                <span className="text-sm font-medium">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Logout Button */}
        <div className="mt-6">
          <Button
            onClick={handleLogOut}
            className="w-full bg-red-500/20 hover:bg-red-500/30 text-white border border-red-400/30 backdrop-blur-sm transition-all duration-200 rounded-xl py-3 font-medium"
            variant="outline"
          >
            <LogOut className="h-4 w-4 mr-2" />
            ĐĂNG XUẤT
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SideBar;
