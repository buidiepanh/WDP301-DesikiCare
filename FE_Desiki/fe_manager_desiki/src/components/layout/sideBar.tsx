import React from "react";
import {
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Drawer,
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import PeopleIcon from "@mui/icons-material/People";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import StarIcon from "@mui/icons-material/Star";
import SportsEsportsIcon from "@mui/icons-material/SportsEsports";
import ChatIcon from "@mui/icons-material/Chat";

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
  { label: "Products", path: "/Products", icon: <ShoppingCartIcon /> },
  { label: "Orders", path: "/Orders", icon: <ShoppingCartIcon /> },
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
  {
    label: "Customer Management",
    path: "/AccountManagement/CustomerManagement",
    icon: <PeopleIcon />,
  },
];

type Props = {
  role: "admin" | "manager";
  drawerWidth?: number;
};

const SideBar: React.FC<Props> = ({ role, drawerWidth = 240 }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = role === "admin" ? adminNavItems : managerNavItems;

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        "& .MuiDrawer-paper": { width: drawerWidth, boxSizing: "border-box" },
      }}
    >
      <List>
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
    </Drawer>
  );
};

export default SideBar;
