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

// useState'i kaldırdık, propları App.js'ten alıyoruz
export default function Layout({ children, lastUpdate, connectionStatus, telemetry, darkMode, setDarkMode }) {

  // GÖZ RAHATLIĞI KALKANI (SEPYA / KAHVE / LATTE TONLARI)
  const themeColors = {
    bgLayout: darkMode ? "#16161e" : "#e6dec8", // Sıcak mat kum rengi
    bgSidebar: darkMode ? "#1a1b26" : "#efe7d3", // Hafif açık latte
    bgCardArea: darkMode ? "#16161e" : "#e6dec8",
    bgPanel: darkMode ? "#1a1b26" : "#efe7d3",
    bgCamera: darkMode ? "rgba(36, 40, 59, 0.4)" : "rgba(230, 222, 200, 0.6)",
    borderColor: darkMode ? "rgba(255, 255, 255, 0.04)" : "rgba(67, 56, 44, 0.12)", // Koyu kahve transparan çizgi
    iconColor: darkMode ? "#565f89" : "#827566", // Mat sütlü kahve
    iconHoverBg: darkMode ? "rgba(255, 255, 255, 0.05)" : "rgba(67, 56, 44, 0.08)",
    textMain: darkMode ? "#c0caf5" : "#43382c", // Koyu Espresso Kahvesi (siyah yerine)
    textMuted: darkMode ? "#565f89" : "#827566"
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100vh", overflow: "hidden", background: themeColors.bgLayout, fontFamily: "'Rajdhani', sans-serif", color: themeColors.textMain }}>
      <Box sx={{ height: 34, flexShrink: 0, borderBottom: `1px solid ${themeColors.borderColor}`, background: themeColors.bgSidebar }}>
        <StatusBar lastUpdate={lastUpdate} connectionStatus={connectionStatus} />
      </Box>

      <Box sx={{ display: "flex", flexGrow: 1, overflow: "hidden", position: "relative" }}>
        <Box sx={{ width: 60, flexShrink: 0, background: themeColors.bgSidebar, borderRight: `1px solid ${themeColors.borderColor}`, display: "flex", flexDirection: "column", alignItems: "center", py: 2 }}>
          <Box sx={{ mb: 4 }}><img src={logo} alt="logo-icon" style={{ width: 36, borderRadius: "8px", opacity: darkMode ? 0.8 : 0.85 }} /></Box>
          <List dense sx={{ width: "100%", p: 0 }}>
            <ListItemButton component={Link} to="/" sx={{ justifyContent: "center", py: 2, color: themeColors.iconColor, "&:hover": { background: themeColors.iconHoverBg } }}><DashboardIcon /></ListItemButton>
            <ListItemButton component={Link} to="/all" sx={{ justifyContent: "center", py: 2, color: themeColors.iconColor, "&:hover": { background: themeColors.iconHoverBg } }}><ViewListIcon /></ListItemButton>
          </List>
          <Box sx={{ flexGrow: 1 }} />
          <IconButton onClick={() => setDarkMode(!darkMode)} sx={{ color: themeColors.iconColor, mb: 1 }}>{darkMode ? <LightModeIcon /> : <DarkModeIcon />}</IconButton>
        </Box>

        <Box sx={{ flexGrow: 1, overflowY: "auto", p: 2, background: themeColors.bgCardArea }}>
          {children}
        </Box>

        <Box sx={{ width: 340, flexShrink: 0, borderLeft: `1px solid ${themeColors.borderColor}`, background: themeColors.bgCamera, display: "flex", flexDirection: "column" }}>
          <Box sx={{ flex: 1, position: "relative", borderBottom: `1px solid ${themeColors.borderColor}` }}>
            <Box sx={{ position: "absolute", top: 16, left: 16, bottom: 16, right: 16, background: darkMode ? "rgba(36, 40, 59, 0.4)" : "rgba(239, 231, 211, 0.6)", border: `1px solid ${themeColors.borderColor}`, borderRadius: 2, display: "flex", alignItems: "center", justifyContent: "center", color: themeColors.textMuted, fontFamily: "'Orbitron', sans-serif", letterSpacing: 2 }}>
              <Typography sx={{ position: "absolute", top: 8, left: 10, fontSize: 11, color: darkMode ? "#f7768e" : "#be123c", display: "flex", alignItems: "center", gap: 0.5 }}>
                <Box sx={{ width: 6, height: 6, borderRadius: "50%", background: darkMode ? "#f7768e" : "#be123c", opacity: 0.8 }} />
                LIVE
              </Typography>
              <Typography>CAMERA FEED</Typography>
              <Typography sx={{ position: "absolute", bottom: 8, right: 10, fontSize: 11, color: themeColors.textMuted }}>1080p 60FPS</Typography>
            </Box>
          </Box>

          <Box sx={{ flex: 1, position: "relative" }}>
            <Box sx={{ position: "absolute", top: 16, left: 16, bottom: 16, right: 16, border: `1px solid ${themeColors.borderColor}`, borderRadius: 2, overflow: "hidden", background: darkMode ? "rgba(36, 40, 59, 0.2)" : "transparent" }}>
              <Box sx={{ position: "absolute", top: 8, left: 8, zIndex: 10, display: "flex", alignItems: "center", gap: 1 }}>
                <Box sx={{ width: 6, height: 6, borderRadius: "50%", background: darkMode ? "#7dcfff" : "#0277bd" }} />
                <Typography sx={{ fontSize: 11, color: darkMode ? "#7dcfff" : "#0277bd", fontWeight: "bold", letterSpacing: 1 }}>DIGITAL TWIN</Typography>
              </Box>
              <DigitalTwin telemetry={telemetry} darkMode={darkMode} />
            </Box>
          </Box>
        </Box>

        <Box sx={{ width: 240, flexShrink: 0, borderLeft: `1px solid ${themeColors.borderColor}`, background: themeColors.bgPanel, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <ControlPanel darkMode={darkMode} />
        </Box>
      </Box>

      <img src={logo} alt="Partech Logo" style={{ position: "absolute", bottom: 16, right: 25, width: 190, height: "auto", objectFit: "contain", filter: darkMode ? "opacity(0.4) grayscale(100%) brightness(150%)" : "opacity(0.15) sepia(100%) hue-rotate(330deg) saturate(50%)", zIndex: 100, pointerEvents: "none" }} />
    </Box>
  );
}