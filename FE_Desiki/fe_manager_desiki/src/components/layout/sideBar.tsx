import React from "react";
import {
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Drawer,
  Button,
  Box,
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
  { label: "Revenue Dashboard", path: "/RevenueDashboard", icon: <DashboardIcon /> },
  { label: "Account Management", path: "/AccountManagement/RoleAccountManagement", icon: <AccountCircleIcon /> },
  { label: "Point Management", path: "/Points", icon: <StarIcon /> },
  { label: "Mini Game Management", path: "/MiniGames", icon: <SportsEsportsIcon /> },
  { label: "Chatbot Config", path: "/Chatbot", icon: <ChatIcon /> },
];

const managerNavItems: NavItem[] = [
  { label: "Revenue Dashboard", path: "/RevenueDashboard", icon: <DashboardIcon /> },
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
        "& .MuiDrawer-paper": {
          width: drawerWidth,
          boxSizing: "border-box",
          background: "linear-gradient(to bottom, #fff0f6, #fce4ec)",
          borderRight: "1px solid #f8bbd0",
          boxShadow: "2px 0 10px rgba(0,0,0,0.05)",
        },
      }}
    >
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="space-between"
        height="100%"
      >
        <List>
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <ListItemButton
                key={item.path}
                onClick={() => navigate(item.path)}
                selected={isActive}
                sx={{
                  my: 0.5,
                  mx: 1,
                  borderRadius: 2,
                  backgroundColor: isActive ? "#ec407a" : "transparent",
                  color: isActive ? "#ffffff" : "#880e4f",
                  transition: "all 0.2s",
                  "&:hover": {
                    backgroundColor: isActive ? "#d81b60" : "#f8bbd0",
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    color: isActive ? "#ffffff" : "#ad1457",
                    minWidth: 36,
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{
                    fontWeight: isActive ? "bold" : "normal",
                    fontSize: 14,
                    color: isActive ? "#ec407a" : undefined,
                  }}
                />
              </ListItemButton>
            );
          })}
        </List>

        <Box p={2}>
          <Button
            fullWidth
            variant="contained"
            onClick={handleLogOut}
            sx={{
              backgroundColor: "#ec407a",
              color: "#fff",
              borderRadius: "999px",
              fontWeight: "bold",
              ":hover": {
                backgroundColor: "#d81b60",
              },
            }}
          >
            ĐĂNG XUẤT
          </Button>
        </Box>
      </Box>
    </Drawer>
  );
};

export default SideBar;
