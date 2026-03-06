import { Link } from "react-router-dom";
import { Box, List, ListItemButton, IconButton, Typography } from "@mui/material";

import DashboardIcon from "@mui/icons-material/Dashboard";
import ViewListIcon from "@mui/icons-material/ViewList";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";

import ControlPanel from "./ControlPanel";
import StatusBar from "./StatusBar";
import DigitalTwin from "./DigitalTwin";
import logo from "../assets/logo.jpeg";
import { useState } from "react";

export default function Layout({ children, lastUpdate, connectionStatus, telemetry }) {
  const [darkMode, setDarkMode] = useState(true);

  // GÖZ RAHATLIĞI (EYE CARE) RENK PALETİ
  const themeColors = {
    bgLayout: darkMode ? "#16161e" : "#e2e8f0", // Tam siyah değil, yumuşak mat gece mavisi
    bgSidebar: darkMode ? "#1a1b26" : "#ffffff", 
    bgCardArea: darkMode ? "#16161e" : "#f8fafc",
    bgPanel: darkMode ? "#1a1b26" : "#ffffff",
    bgCamera: darkMode ? "#1a1b26" : "#f1f5f9",
    borderColor: darkMode ? "rgba(255, 255, 255, 0.04)" : "rgba(0,0,0,0.1)", // Çok hafif silik çizgiler
    iconColor: darkMode ? "#565f89" : "#475569", // Yumuşak gri-mavi
    iconHoverBg: darkMode ? "rgba(255, 255, 255, 0.05)" : "rgba(0,0,0,0.05)",
    textMain: darkMode ? "#c0caf5" : "#1e293b", // Tam beyaz yerine kırık buz beyazı
    textMuted: darkMode ? "#565f89" : "#64748b"
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100vh", overflow: "hidden", background: themeColors.bgLayout, fontFamily: "'Rajdhani', sans-serif", color: themeColors.textMain }}>

      {/* ÜST DURUM ÇUBUĞU */}
      <Box sx={{ height: 34, flexShrink: 0, borderBottom: `1px solid ${themeColors.borderColor}`, background: themeColors.bgSidebar }}>
        <StatusBar lastUpdate={lastUpdate} connectionStatus={connectionStatus} />
      </Box>

      {/* ANA GÖVDE */}
      <Box sx={{ display: "flex", flexGrow: 1, overflow: "hidden", position: "relative" }}>

        {/* 1. SIDEBAR */}
        <Box sx={{ width: 60, flexShrink: 0, background: themeColors.bgSidebar, borderRight: `1px solid ${themeColors.borderColor}`, display: "flex", flexDirection: "column", alignItems: "center", py: 2 }}>
          <Box sx={{ mb: 4 }}><img src={logo} alt="logo-icon" style={{ width: 36, borderRadius: "8px", opacity: 0.8 }} /></Box>
          <List dense sx={{ width: "100%", p: 0 }}>
            <ListItemButton component={Link} to="/" sx={{ justifyContent: "center", py: 2, color: themeColors.iconColor, "&:hover": { background: themeColors.iconHoverBg } }}><DashboardIcon /></ListItemButton>
            <ListItemButton component={Link} to="/all" sx={{ justifyContent: "center", py: 2, color: themeColors.iconColor, "&:hover": { background: themeColors.iconHoverBg } }}><ViewListIcon /></ListItemButton>
          </List>
          <Box sx={{ flexGrow: 1 }} />
          <IconButton onClick={() => setDarkMode(!darkMode)} sx={{ color: themeColors.iconColor, mb: 1 }}>{darkMode ? <LightModeIcon /> : <DarkModeIcon />}</IconButton>
        </Box>

        {/* 2. ORTA KART ALANI */}
        <Box sx={{ flexGrow: 1, overflowY: "auto", p: 2, background: themeColors.bgCardArea }}>
          {children}
        </Box>

        {/* 3. KAMERA VE DIGITAL TWIN ALANI */}
        <Box sx={{ width: 340, flexShrink: 0, borderLeft: `1px solid ${themeColors.borderColor}`, background: themeColors.bgCamera, display: "flex", flexDirection: "column" }}>

          {/* ÜST %50: CANLI KAMERA */}
          <Box sx={{ flex: 1, position: "relative", borderBottom: `1px solid ${themeColors.borderColor}` }}>
            <Box sx={{ position: "absolute", top: 16, left: 16, bottom: 16, right: 16, background: darkMode ? "rgba(36, 40, 59, 0.4)" : "#ffffff", border: `1px solid ${themeColors.borderColor}`, borderRadius: 2, display: "flex", alignItems: "center", justifyContent: "center", color: themeColors.textMuted, fontFamily: "'Orbitron', sans-serif", letterSpacing: 2 }}>
              <Typography sx={{ position: "absolute", top: 8, left: 10, fontSize: 11, color: "#f7768e", display: "flex", alignItems: "center", gap: 0.5 }}>
                <Box sx={{ width: 6, height: 6, borderRadius: "50%", background: "#f7768e", opacity: 0.8 }} />
                LIVE
              </Typography>
              <Typography>CAMERA FEED</Typography>
              <Typography sx={{ position: "absolute", bottom: 8, right: 10, fontSize: 11, color: themeColors.textMuted }}>1080p 60FPS</Typography>
            </Box>
          </Box>

          {/* ALT %50: 3D DIGITAL TWIN */}
          <Box sx={{ flex: 1, position: "relative" }}>
            <Box sx={{ position: "absolute", top: 16, left: 16, bottom: 16, right: 16, border: `1px solid ${themeColors.borderColor}`, borderRadius: 2, overflow: "hidden", background: darkMode ? "rgba(36, 40, 59, 0.2)" : "transparent" }}>
              <Box sx={{ position: "absolute", top: 8, left: 8, zIndex: 10, display: "flex", alignItems: "center", gap: 1 }}>
                <Box sx={{ width: 6, height: 6, borderRadius: "50%", background: "#7dcfff" }} />
                <Typography sx={{ fontSize: 11, color: "#7dcfff", fontWeight: "bold", letterSpacing: 1 }}>DIGITAL TWIN</Typography>
              </Box>
              <DigitalTwin telemetry={telemetry} />
            </Box>
          </Box>
        </Box>

        {/* 4. CONTROL PANEL ALANI */}
        <Box sx={{ width: 240, flexShrink: 0, borderLeft: `1px solid ${themeColors.borderColor}`, background: themeColors.bgPanel, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <ControlPanel />
        </Box>
      </Box>

      {/* PARTECH LOGOSU (Sağ Altta Sabit) */}
      <img src={logo} alt="Partech Logo" style={{ position: "absolute", bottom: 16, right: 25, width: 190, height: "auto", objectFit: "contain", filter: darkMode ? "opacity(0.4) grayscale(100%) brightness(150%)" : "none", zIndex: 100, pointerEvents: "none" }} />
    </Box>
  );
}