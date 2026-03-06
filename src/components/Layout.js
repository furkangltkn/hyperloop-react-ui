import { Link } from "react-router-dom";
import { Box, List, ListItemButton, IconButton, Typography } from "@mui/material";

import DashboardIcon from "@mui/icons-material/Dashboard";
import ViewListIcon from "@mui/icons-material/ViewList";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";

import ControlPanel from "./ControlPanel";
import StatusBar from "./StatusBar";
import logo from "../assets/logo.jpeg";

export default function Layout({ children, lastUpdate, darkMode, setDarkMode }) {
  
  // SARI IŞIK FİLTRESİ / SEPYA OKUMA MODU (Mavi ışık bloklayıcı)
  const themeColors = {
    bgLayout: darkMode ? "linear-gradient(180deg,#0b0f1a,#05070d)" : "#fdf6e3", // Sıcak, mat kağıt kremi (Göz yormaz)
    bgSidebar: darkMode ? "linear-gradient(180deg,#0d1220,#05070d)" : "#eee8d5", // Panel için bir ton koyu sıcak bej
    bgCardArea: darkMode ? "radial-gradient(circle at top,#10182a,#05070d)" : "#fdf6e3", // Orta alan sıcak krem
    bgRightPanel: darkMode ? "#02040a" : "#eee8d5", // Sağ konsol sıcak bej
    borderColor: darkMode ? "rgba(255,255,255,0.08)" : "rgba(180, 170, 150, 0.4)", // Çerçeveler için yumuşak kahve/kum rengi
    iconColor: darkMode ? "#9ecbff" : "#655b53", // İkonlar için koyu sıcak füme/kahve
    iconHoverBg: darkMode ? "rgba(100,150,255,0.15)" : "rgba(150, 130, 110, 0.15)", // Yumuşak vurgu
    textColor: darkMode ? "#9ecbff" : "#4a4036"
  };

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: "60px 1fr 340px",
        gridTemplateRows: "34px 1fr",
        height: "100vh",
        overflow: "hidden",
        background: themeColors.bgLayout,
        transition: "all 0.4s ease", // Geçişi gözü yormaması için biraz daha yumuşattık
        fontFamily: "'Rajdhani', sans-serif"
      }}
    >
      <Box sx={{ gridColumn: "1 / -1" }}>
        <StatusBar lastUpdate={lastUpdate} darkMode={darkMode} /> 
      </Box>

      {/* SIDEBAR */}
      <Box sx={{ background: themeColors.bgSidebar, borderRight: `1px solid ${themeColors.borderColor}`, display: "flex", flexDirection: "column", alignItems: "center", py: 2, transition: "background 0.4s" }}>
        <Box sx={{ mb: 4 }}><img src={logo} alt="logo" style={{ width: 36, borderRadius: "8px" }} /></Box>
        <List dense sx={{ width: "100%", p: 0 }}>
          <ListItemButton component={Link} to="/" sx={{ justifyContent: "center", py: 2, color: themeColors.iconColor, "&:hover": { background: themeColors.iconHoverBg } }}><DashboardIcon /></ListItemButton>
          <ListItemButton component={Link} to="/all" sx={{ justifyContent: "center", py: 2, color: themeColors.iconColor, "&:hover": { background: themeColors.iconHoverBg } }}><ViewListIcon /></ListItemButton>
        </List>
        <Box sx={{ flexGrow: 1 }} />
        
        <IconButton onClick={() => setDarkMode(!darkMode)} sx={{ color: themeColors.iconColor, mb: 1 }}>
          {darkMode ? <LightModeIcon /> : <DarkModeIcon />}
        </IconButton>
      </Box>

      {/* ORTA KART ALANI */}
      <Box sx={{ padding: 2, overflowY: "auto", background: themeColors.bgCardArea, transition: "background 0.4s" }}>
        {children}
      </Box>

      {/* SAĞ KONSOL */}
      <Box sx={{ display: "flex", flexDirection: "column", borderLeft: `1px solid ${themeColors.borderColor}`, background: themeColors.bgRightPanel, overflow: "hidden", transition: "background 0.4s" }}>
        
        {/* KAMERA */}
        <Box sx={{ p: 2, display: "flex", justifyContent: "center", borderBottom: `1px solid ${themeColors.borderColor}` }}>
          {/* Aydınlık modda kamera kutusu daha koyu, çamur/kahvemsi bir renge çekildi ki parlamasın */}
          <Box sx={{ width: "100%", height: 260, background: darkMode ? "linear-gradient(145deg,#0d1426,#05070d)" : "#d8d1c0", borderRadius: 3, border: `1px solid ${themeColors.borderColor}`, boxShadow: darkMode ? "0 0 20px rgba(0,150,255,0.15)" : "inset 0 4px 10px rgba(0,0,0,0.05)", position: "relative", display: "flex", alignItems: "center", justifyContent: "center", color: darkMode ? "#6fa8ff" : "#8a7e71", fontFamily: "'Orbitron', sans-serif", letterSpacing: 2, transition: "all 0.4s" }}>
            <Typography sx={{ position: "absolute", top: 8, left: 10, fontSize: 11, color: darkMode ? "red" : "#d32f2f", fontWeight: "bold" }}>● LIVE</Typography>
            KAMERA
            <Typography sx={{ position: "absolute", bottom: 8, right: 10, fontSize: 11, color: darkMode ? "#7dd3fc" : "#8a7e71" }}>30 FPS</Typography>
          </Box>
        </Box>

        {/* KONTROL PANELİ */}
        <Box sx={{ flexGrow: 1, p: 2, overflow: "hidden" }}>
          <ControlPanel darkMode={darkMode} />
        </Box>
        
      </Box>
    </Box>
  );
}