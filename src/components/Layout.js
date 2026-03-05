import { Link } from "react-router-dom";
import {
  Box, List, ListItemButton, IconButton, Typography
} from "@mui/material";

// İkonlar
import DashboardIcon from "@mui/icons-material/Dashboard";
import ViewListIcon from "@mui/icons-material/ViewList";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";

import ControlPanel from "./ControlPanel";
import StatusBar from "./StatusBar";
import logo from "../assets/logo.jpeg";
import { useState } from "react";

export default function Layout({ children, lastUpdate }) {
  // Tema state'i (Varsayılan olarak karanlık tema aktif)
  const [darkMode, setDarkMode] = useState(true);

  // Temaya göre değişecek dinamik renk değişkenleri
  const themeColors = {
    bgLayout: darkMode ? "linear-gradient(180deg,#0b0f1a,#05070d)" : "#e2e8f0",
    bgSidebar: darkMode ? "linear-gradient(180deg,#0d1220,#05070d)" : "#ffffff",
    bgCardArea: darkMode ? "radial-gradient(circle at top,#10182a,#05070d)" : "#f8fafc",
    bgPanel: darkMode ? "linear-gradient(180deg,#060a14,#02040a)" : "#ffffff",
    bgCamera: darkMode ? "#02040a" : "#f1f5f9",
    borderColor: darkMode ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.1)",
    iconColor: darkMode ? "#9ecbff" : "#475569",
    iconHoverBg: darkMode ? "rgba(100,150,255,0.15)" : "rgba(0,0,0,0.05)"
  };

  return (
    <Box
      sx={{
        display: "grid",
        // Sidebar artık sabit 60px genişliğinde
        gridTemplateColumns: "60px 1fr 340px 240px",
        gridTemplateRows: "34px 1fr",
        height: "100vh",
        overflow: "hidden",
        background: themeColors.bgLayout,
        transition: "all 0.3s ease",
        fontFamily: "'Rajdhani', sans-serif"
      }}
    >
      {/* ÜST DURUM ÇUBUĞU */}
      <Box sx={{ gridColumn: "1 / -1" }}>
        <StatusBar lastUpdate={lastUpdate} />
      </Box>

      {/* SIDEBAR (Sabit ve İnce) */}
      <Box
        sx={{
          background: themeColors.bgSidebar,
          borderRight: `1px solid ${themeColors.borderColor}`,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          py: 2
        }}
      >
        {/* Logo */}
        <Box sx={{ mb: 4 }}>
          <img src={logo} alt="logo" style={{ width: 36, borderRadius: "8px" }} />
        </Box>

        {/* Menü İkonları */}
        <List dense sx={{ width: "100%", p: 0 }}>
          <ListItemButton
            component={Link}
            to="/"
            sx={{
              justifyContent: "center",
              py: 2,
              color: themeColors.iconColor,
              "&:hover": { background: themeColors.iconHoverBg }
            }}
          >
            <DashboardIcon />
          </ListItemButton>

          <ListItemButton
            component={Link}
            to="/all"
            sx={{
              justifyContent: "center",
              py: 2,
              color: themeColors.iconColor,
              "&:hover": { background: themeColors.iconHoverBg }
            }}
          >
            <ViewListIcon />
          </ListItemButton>
        </List>

        {/* Boşluk bırakarak tema butonunu en alta itiyoruz */}
        <Box sx={{ flexGrow: 1 }} />

        {/* DARK MODE AÇ-KAPA BUTONU */}
        <IconButton 
          onClick={() => setDarkMode(!darkMode)} 
          sx={{ color: themeColors.iconColor, mb: 1 }}
        >
          {darkMode ? <LightModeIcon /> : <DarkModeIcon />}
        </IconButton>
      </Box>

      {/* ORTA KART ALANI */}
      <Box
        sx={{
          padding: 2,
          overflow: "hidden",
          background: themeColors.bgCardArea,
          transition: "background 0.3s ease"
        }}
      >
        {children}
      </Box>

      {/* CAMERA ALANI */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderLeft: `1px solid ${themeColors.borderColor}`,
          background: themeColors.bgCamera,
          transition: "background 0.3s ease"
        }}
      >
        <Box
          sx={{
            width: 320,
            height: 320,
            background: darkMode ? "linear-gradient(145deg,#0d1426,#05070d)" : "#ffffff",
            borderRadius: 3,
            border: `1px solid ${themeColors.borderColor}`,
            boxShadow: darkMode ? "0 0 20px rgba(0,150,255,0.15)" : "0 4px 12px rgba(0,0,0,0.1)",
            position: "relative",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: darkMode ? "#6fa8ff" : "#64748b",
            fontFamily: "'Orbitron', sans-serif",
            letterSpacing: 2
          }}
        >
          <Typography sx={{ position: "absolute", top: 8, left: 10, fontSize: 11, color: "red" }}>● LIVE</Typography>
          CAMERA
          <Typography sx={{ position: "absolute", bottom: 8, right: 10, fontSize: 11, color: darkMode ? "#7dd3fc" : "#94a3b8" }}>30 FPS</Typography>
        </Box>
      </Box>

      {/* CONTROL PANEL ALANI */}
      <Box
        sx={{
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "center",
          paddingBottom: 3,
          borderLeft: `1px solid ${themeColors.borderColor}`,
          background: themeColors.bgPanel,
          transition: "background 0.3s ease"
        }}
      >
        <ControlPanel />
      </Box>
    </Box>
  );
}