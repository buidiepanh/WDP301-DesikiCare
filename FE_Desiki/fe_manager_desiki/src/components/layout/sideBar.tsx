import React from "react";
import {
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Drawer,
  Button,
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import PeopleIcon from "@mui/icons-material/People";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import StarIcon from "@mui/icons-material/Star";
import SportsEsportsIcon from "@mui/icons-material/SportsEsports";
import ChatIcon from "@mui/icons-material/Chat";
import InventoryIcon from "@mui/icons-material/Inventory";

type NavItem = {
  label: string;
  path: string;
  icon: React.ReactNode;
};

const adminNavItems: NavItem[] = [
  {
    label: "Revenue Dashboard",
    path: "/RevenueDashboard",
    icon: <DashboardIcon />,
  },
  // { label: "Products", path: "/Products", icon: <ShoppingCartIcon /> },
  // { label: "Orders", path: "/Orders", icon: <ShoppingCartIcon /> },
  // { label: "Shipments", path: "/Shipments", icon: <InventoryIcon /> },
  {
    label: "Account Management",
    path: "/AccountManagement/AllRoleManagement",
    icon: <AccountCircleIcon />,
  },
  { label: "Point Management", path: "/Points", icon: <StarIcon /> },
  {
    label: "Mini Game Management",
    path: "/MiniGames",
    icon: <SportsEsportsIcon />,
  },
  { label: "Chatbot Config", path: "/Chatbot", icon: <ChatIcon /> },
];

const managerNavItems: NavItem[] = [
  {
    label: "Revenue Dashboard",
    path: "/RevenueDashboard",
    icon: <DashboardIcon />,
  },
  { label: "Products", path: "/Products", icon: <ShoppingCartIcon /> },
  { label: "Orders", path: "/Orders", icon: <ShoppingCartIcon /> },
  { label: "Shipments", path: "/Shipments", icon: <InventoryIcon /> },
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
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        "& .MuiDrawer-paper": { width: drawerWidth, boxSizing: "border-box" },
      }}
      className="relative p-5"
    >
      <List className="h-[850px]">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;

          return (
            <ListItemButton
              key={item.path}
              onClick={() => navigate(item.path)}
              selected={isActive} // MUI sẽ tự highlight background cho selected
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText
                primary={item.label}
                primaryTypographyProps={{
                  fontWeight: isActive ? "bold" : "normal",
                }}
              />
            </ListItemButton>
          );
        })}
      </List>

      <Button
        variant="contained"
        className="absolute bottom-0"
        onClick={() => handleLogOut()}
      >
        Logout
      </Button>
    </Drawer>
  );
};

export default SideBar;
