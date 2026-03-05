import { Link } from "react-router-dom";
import { Box, List, ListItemButton, IconButton, Typography } from "@mui/material";

import DashboardIcon from "@mui/icons-material/Dashboard";
import ViewListIcon from "@mui/icons-material/ViewList";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";

import ControlPanel from "./ControlPanel";
import StatusBar from "./StatusBar";
import logo from "../assets/logo.jpeg";
import { useState } from "react";

export default function Layout({ children, lastUpdate }) {
  const [darkMode, setDarkMode] = useState(true);

  const themeColors = {
    bgLayout: darkMode ? "linear-gradient(180deg,#0b0f1a,#05070d)" : "#e2e8f0",
    bgSidebar: darkMode ? "linear-gradient(180deg,#0d1220,#05070d)" : "#ffffff",
    bgCardArea: darkMode ? "radial-gradient(circle at top,#10182a,#05070d)" : "#f8fafc",
    bgRightPanel: darkMode ? "#02040a" : "#f1f5f9",
    borderColor: darkMode ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.1)",
    iconColor: darkMode ? "#9ecbff" : "#475569",
    iconHoverBg: darkMode ? "rgba(100,150,255,0.15)" : "rgba(0,0,0,0.05)"
  };

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: "60px 1fr 340px",
        gridTemplateRows: "34px 1fr",
        height: "100vh",
        overflow: "hidden", // Tüm sayfa için scroll kapalı
        background: themeColors.bgLayout,
        transition: "all 0.3s ease",
        fontFamily: "'Rajdhani', sans-serif"
      }}
    >
      <Box sx={{ gridColumn: "1 / -1" }}>
        <StatusBar lastUpdate={lastUpdate} />
      </Box>

      {/* SIDEBAR */}
      <Box sx={{ background: themeColors.bgSidebar, borderRight: `1px solid ${themeColors.borderColor}`, display: "flex", flexDirection: "column", alignItems: "center", py: 2 }}>
        <Box sx={{ mb: 4 }}><img src={logo} alt="logo" style={{ width: 36, borderRadius: "8px" }} /></Box>
        <List dense sx={{ width: "100%", p: 0 }}>
          <ListItemButton component={Link} to="/" sx={{ justifyContent: "center", py: 2, color: themeColors.iconColor, "&:hover": { background: themeColors.iconHoverBg } }}><DashboardIcon /></ListItemButton>
          <ListItemButton component={Link} to="/all" sx={{ justifyContent: "center", py: 2, color: themeColors.iconColor, "&:hover": { background: themeColors.iconHoverBg } }}><ViewListIcon /></ListItemButton>
        </List>
        <Box sx={{ flexGrow: 1 }} />
        <IconButton onClick={() => setDarkMode(!darkMode)} sx={{ color: themeColors.iconColor, mb: 1 }}>{darkMode ? <LightModeIcon /> : <DarkModeIcon />}</IconButton>
      </Box>

      {/* ORTA KART ALANI */}
      <Box sx={{ padding: 2, overflowY: "auto", background: themeColors.bgCardArea }}>
        {children}
      </Box>

      {/* SAĞ KONSOL (KAMERA + KONTROL PANELİ) */}
      <Box sx={{ display: "flex", flexDirection: "column", borderLeft: `1px solid ${themeColors.borderColor}`, background: themeColors.bgRightPanel, overflow: "hidden" }}>
        
        {/* KAMERA */}
        <Box sx={{ p: 2, display: "flex", justifyContent: "center", borderBottom: `1px solid ${themeColors.borderColor}` }}>
          <Box sx={{ width: "100%", height: 260, background: darkMode ? "linear-gradient(145deg,#0d1426,#05070d)" : "#ffffff", borderRadius: 3, border: `1px solid ${themeColors.borderColor}`, boxShadow: darkMode ? "0 0 20px rgba(0,150,255,0.15)" : "0 4px 12px rgba(0,0,0,0.1)", position: "relative", display: "flex", alignItems: "center", justifyContent: "center", color: darkMode ? "#6fa8ff" : "#64748b", fontFamily: "'Orbitron', sans-serif", letterSpacing: 2 }}>
            <Typography sx={{ position: "absolute", top: 8, left: 10, fontSize: 11, color: "red" }}>● LIVE</Typography>
            KAMERA
            <Typography sx={{ position: "absolute", bottom: 8, right: 10, fontSize: 11, color: darkMode ? "#7dd3fc" : "#94a3b8" }}>30 FPS</Typography>
          </Box>
        </Box>

        {/* KONTROL PANELİ ALANI */}
        <Box sx={{ flexGrow: 1, p: 2, overflow: "hidden" }}>
          <ControlPanel />
        </Box>
        
      </Box>
    </Box>
  );
}