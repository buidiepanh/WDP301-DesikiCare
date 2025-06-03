import React from "react";
import { NavLink, Outlet } from "react-router-dom";
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

import InventoryIcon from "@mui/icons-material/Inventory";
import StorefrontIcon from "@mui/icons-material/Storefront";
import AssignmentIcon from "@mui/icons-material/Assignment";
import BarChartIcon from "@mui/icons-material/BarChart";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";

const drawerWidth = 240;

const menuItems = [
  { text: "Quản lý sản phẩm", icon: <StorefrontIcon />, path: "/manager/products" },
  { text: "Quản lý kho", icon: <InventoryIcon />, path: "/manager/inventory" },
  { text: "Quản lý đơn hàng", icon: <AssignmentIcon />, path: "/manager/orders" },
  { text: "Thống kê", icon: <BarChartIcon />, path: "/manager/statistics" },
  { text: "Khách hàng", icon: <PeopleAltIcon />, path: "/manager/customers" },
];

const ManagerLayout = () => {
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
          <Typography variant="h6" noWrap component="div" sx={{ fontWeight: "bold", mx: "auto" }}>
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
                        backgroundColor: isActive ? "#fff" : "rgba(255,255,255,0.1)",
                      },
                    }}
                  >
                    <ListItemIcon
                      sx={{ color: isActive ? "#ec407a" : "#fff", minWidth: 32 }}
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
