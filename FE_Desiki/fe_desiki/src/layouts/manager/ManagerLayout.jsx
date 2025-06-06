import React from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
} from "@mui/material";
import Divider from "@mui/material/Divider";

import InventoryIcon from "@mui/icons-material/Inventory";
import StorefrontIcon from "@mui/icons-material/Storefront";
import AssignmentIcon from "@mui/icons-material/Assignment";
import BarChartIcon from "@mui/icons-material/BarChart";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import toast from "react-hot-toast";

const drawerWidth = 240;

const menuItems = [
  {
    text: "Quản lý sản phẩm",
    icon: <StorefrontIcon />,
    path: "/manager/products",
  },
  { text: "Quản lý kho", icon: <InventoryIcon />, path: "/manager/inventory" },
  {
    text: "Quản lý đơn hàng",
    icon: <AssignmentIcon />,
    path: "/manager/orders",
  },
  { text: "Thống kê", icon: <BarChartIcon />, path: "/manager/statistics" },
  { text: "Khách hàng", icon: <PeopleAltIcon />, path: "/manager/customers" },
];

const ManagerLayout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/login");
    toast.success("Đăng xuất thành công!");
  };
  return (
    <Box sx={{ display: "flex", backgroundColor: "#f4f6f8" }}>
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: "border-box",
            background: "linear-gradient(135deg, #ec407a, #d81b60)",
            color: "#fff",
          },
        }}
      >
        <Toolbar>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ fontWeight: "bold", mx: "auto" }}
          >
            Quản lý
          </Typography>
        </Toolbar>
        <List>
          {menuItems.map((item) => (
            <NavLink
              key={item.text}
              to={item.path}
              style={({ isActive }) => ({
                textDecoration: "none",
              })}
            >
              {({ isActive }) => (
                <ListItem disablePadding>
                  <ListItemButton
                    sx={{
                      backgroundColor: isActive ? "#fff" : "transparent",
                      color: isActive ? "#ec407a" : "#fff",
                      borderRadius: "8px",
                      mx: 1,
                      my: 0.5,
                      "&:hover": {
                        backgroundColor: isActive
                          ? "#fff"
                          : "rgba(255,255,255,0.1)",
                      },
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        color: isActive ? "#ec407a" : "#fff",
                        minWidth: 32,
                      }}
                    >
                      {item.icon}
                    </ListItemIcon>
                    <ListItemText
                      primary={item.text}
                      primaryTypographyProps={{
                        fontWeight: isActive ? 600 : 400,
                      }}
                    />
                  </ListItemButton>
                </ListItem>
              )}
            </NavLink>
          ))}

          <Divider
            sx={{ backgroundColor: "rgba(255,255,255,0.3)", mx: 2, my: 1 }}
          />

          <ListItem disablePadding>
            <ListItemButton
              onClick={handleLogout}
              sx={{
                backgroundColor: "transparent",
                color: "#fff",
                borderRadius: "8px",
                mx: 1,
                my: 0.5,
                "&:hover": {
                  backgroundColor: "rgba(255,255,255,0.1)",
                },
              }}
            >
              <ListItemIcon sx={{ color: "#fff", minWidth: 32 }}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="24"
                  viewBox="0 0 24 24"
                  width="24"
                  fill="currentColor"
                >
                  <path d="M0 0h24v24H0z" fill="none" />
                  <path d="M13 3c-4.97 0-9 4.03-9 9s4.03 9 9 9c4.97 0 9-4.03 9-9h-2a7 7 0 11-7-7V3zm1 5v4h4v2h-6V8h2z" />
                </svg>
              </ListItemIcon>
              <ListItemText
                primary="Logout"
                primaryTypographyProps={{
                  fontWeight: 400,
                }}
              />
            </ListItemButton>
          </ListItem>
        </List>
      </Drawer>

      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
};

export default ManagerLayout;
