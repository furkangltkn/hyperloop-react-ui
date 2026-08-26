import React from "react";
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

// Küçük Oryantasyon Göstergesi Bileşeni
const OrientationIndicator = ({ label, value, color }) => (
  <Box sx={{ 
    flex: 1, 
    display: "flex", 
    flexDirection: "column", 
    alignItems: "center",
    background: "rgba(0, 0, 0, 0.2)",
    borderRadius: "4px",
    border: `1px solid ${color}33`,
    py: 0.5
  }}>
    <Typography sx={{ color: "#94a3b8", fontSize: 9, fontWeight: "bold", letterSpacing: 1 }}>
      {label}
    </Typography>
    <Typography sx={{ color: color, fontSize: 13, fontFamily: "monospace", fontWeight: "bold" }}>
      {typeof value === "number" ? value.toFixed(1) : "0.0"}°
    </Typography>
  </Box>
);

export default function Layout({ children, lastUpdate, connectionStatus, raspberryStatus, telemetryStale, telemetry, controlState, onControlStateChange, darkMode, setDarkMode }) {
  const handleResetCompleted = (state) => {
    if (state) onControlStateChange(state);
  };

  const themeColors = {
    bgLayout: darkMode ? "#16161e" : "#e6dec8",
    bgSidebar: darkMode ? "#1a1b26" : "#efe7d3",
    bgCardArea: darkMode ? "#16161e" : "#e6dec8",
    bgPanel: darkMode ? "#1a1b26" : "#efe7d3",
    bgCamera: darkMode ? "rgba(36, 40, 59, 0.4)" : "rgba(230, 222, 200, 0.6)",
    borderColor: darkMode ? "rgba(255, 255, 255, 0.04)" : "rgba(67, 56, 44, 0.12)",
    iconColor: darkMode ? "#565f89" : "#827566",
    iconHoverBg: darkMode ? "rgba(255, 255, 255, 0.05)" : "rgba(67, 56, 44, 0.08)",
    textMain: darkMode ? "#c0caf5" : "#43382c",
    textMuted: darkMode ? "#565f89" : "#827566",
    accent: darkMode ? "#7dcfff" : "#0277bd"
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        width: "100vw",
        overflow: "hidden",
        background: themeColors.bgLayout,
        fontFamily: "'Rajdhani', sans-serif",
        color: themeColors.textMain,
        position: "relative"
      }}
    >
      <Box sx={{ height: 34, flexShrink: 0, borderBottom: `1px solid ${themeColors.borderColor}`, background: themeColors.bgSidebar }}>
        <StatusBar
          lastUpdate={lastUpdate}
          connectionStatus={connectionStatus}
          raspberryStatus={raspberryStatus}
          telemetryStale={telemetryStale}
          autonomous={Boolean(controlState?.autonomous)}
          onResetCompleted={handleResetCompleted}
        />
      </Box>

      <Box sx={{ display: "flex", flexGrow: 1, overflow: "hidden", position: "relative" }}>
        <Box
          sx={{
            width: 60,
            flexShrink: 0,
            background: themeColors.bgSidebar,
            borderRight: `1px solid ${themeColors.borderColor}`,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            py: 2
          }}
        >
          <Box sx={{ mb: 4 }}>
            <img src={logo} alt="logo-icon" style={{ width: 36, borderRadius: "8px", opacity: 0.9 }} />
          </Box>

          <List dense sx={{ width: "100%", p: 0 }}>
            <ListItemButton
              component={Link}
              to="/"
              sx={{ justifyContent: "center", py: 2, color: themeColors.iconColor, "&:hover": { background: themeColors.iconHoverBg } }}
            >
              <DashboardIcon />
            </ListItemButton>

            <ListItemButton
              component={Link}
              to="/all"
              sx={{ justifyContent: "center", py: 2, color: themeColors.iconColor, "&:hover": { background: themeColors.iconHoverBg } }}
            >
              <ViewListIcon />
            </ListItemButton>
          </List>

          <Box sx={{ flexGrow: 1 }} />

          <IconButton onClick={() => setDarkMode(!darkMode)} sx={{ color: themeColors.iconColor, mb: 1 }}>
            {darkMode ? <LightModeIcon /> : <DarkModeIcon />}
          </IconButton>
        </Box>

        <Box
          sx={{
            flexGrow: 1,
            height: "calc(100vh - 34px)",
            display: "flex",
            flexDirection: "column",
            background: themeColors.bgCardArea,
            p: 2,
            overflow: "hidden",
            position: "relative"
          }}
        >
          <Box sx={{ width: "100%", height: "100%", display: "flex", flexDirection: "column" }}>
            {children}
          </Box>

          <Typography
            aria-label="Telif bilgisi"
            sx={{
              position: "absolute",
              left: "50%",
              bottom: 6,
              transform: "translateX(-50%)",
              color: themeColors.textMuted,
              fontSize: 9,
              fontWeight: 600,
              letterSpacing: 1,
              textAlign: "center",
              whiteSpace: "nowrap",
              pointerEvents: "none",
              opacity: 0.8
            }}
          >
            © DEVELOPED BY PARTECH HYPERLOOP
          </Typography>
        </Box>

        <Box
          sx={{
            width: 340,
            flexShrink: 0,
            borderLeft: `1px solid ${themeColors.borderColor}`,
            background: themeColors.bgCamera,
            display: "flex",
            flexDirection: "column"
          }}
        >
          <Box
            sx={{
              flex: 1,
              position: "relative",
              borderBottom: `1px solid ${themeColors.borderColor}`,
              overflow: "hidden"
            }}
          >
            <Box
              sx={{
                position: "absolute",
                top: 12,
                left: 12,
                bottom: 12,
                right: 12,
                background: "#000",
                border: `1px solid ${themeColors.borderColor}`,
                borderRadius: 2,
                overflow: "hidden"
              }}
            >
              {/* Kamera WebRTC Yayını */}
              <iframe
                src="http://localhost:8889/camera"
                title="Hyperloop Camera"
                allow="autoplay; fullscreen"
                style={{
                  width: "100%",
                  height: "100%",
                  border: "none",
                  display: "block",
                  backgroundColor: "#000"
                }}
              />

              {/* CANLI göstergesi */}
              <Box
                sx={{
                  position: "absolute",
                  top: 8,
                  left: 10,
                  zIndex: 20,
                  display: "flex",
                  alignItems: "center",
                  gap: 0.6,
                  px: 1,
                  py: 0.4,
                  borderRadius: 1,
                  background: "rgba(0, 0, 0, 0.65)",
                  backdropFilter: "blur(3px)",
                  pointerEvents: "none"
                }}
              >
                <Box
                  sx={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: "#f7768e",
                    boxShadow: "0 0 6px #f7768e"
                  }}
                />

                <Typography
                  component="span"
                  sx={{
                    fontSize: 10,
                    color: "#f7768e",
                    fontWeight: "bold",
                    letterSpacing: 1
                  }}
                >
                  CANLI
                </Typography>
              </Box>
            </Box>
          </Box>


          {/* <Box sx={{ flex: 1, position: "relative", borderBottom: `1px solid ${themeColors.borderColor}` }}>
            <Box
              sx={{
                position: "absolute",
                top: 12,
                left: 12,
                bottom: 12,
                right: 12,
                background: "rgba(0,0,0,0.4)",
                border: `1px solid ${themeColors.borderColor}`,
                borderRadius: 2,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: themeColors.textMuted
              }}
            >
              <Box
                sx={{
                  position: "absolute",
                  top: 8,
                  left: 10,
                  display: "flex",
                  alignItems: "center",
                  gap: 0.5,
                  color: "#f7768e"
                }}
              >
                <Box sx={{ width: 6, height: 6, borderRadius: "50%", background: "#f7768e" }} />
                <Typography component="span" sx={{ fontSize: 10, color: "#f7768e" }}>
                  CANLI
                </Typography>
              </Box>

              <Typography variant="caption" sx={{ letterSpacing: 1 }}>
                KAMERA SİSTEMİ ÇEVRİMDIŞI
              </Typography>
            </Box>
          </Box> */}

          <Box sx={{ flex: 1.2, display: "flex", flexDirection: "column", p: 1.5 }}>
            <Box
              sx={{
                flexGrow: 1,
                position: "relative",
                border: `1px solid ${themeColors.borderColor}`,
                borderRadius: 2,
                overflow: "hidden",
                background: "rgba(0,0,0,0.2)"
              }}
            >
              <Box sx={{ position: "absolute", top: 8, left: 8, zIndex: 10, display: "flex", alignItems: "center", gap: 1 }}>
                <Box sx={{ width: 6, height: 6, borderRadius: "50%", background: themeColors.accent }} />
                <Typography component="span" sx={{ fontSize: 10, color: themeColors.accent, fontWeight: "bold", letterSpacing: 1 }}>
                  3D TELEMETRİ
                </Typography>
              </Box>

              <DigitalTwin telemetry={telemetry} darkMode={darkMode} />
            </Box>

            <Box sx={{ display: "flex", gap: 1, mt: 1.5 }}>
              <OrientationIndicator label="ROLL" value={telemetry?.motion?.rx || 0} color={themeColors.accent} />
              <OrientationIndicator label="PITCH" value={telemetry?.motion?.px || 0} color={themeColors.accent} />
              <OrientationIndicator label="YAW" value={telemetry?.motion?.yx || 0} color={themeColors.accent} />
            </Box>
          </Box>
        </Box>

        <Box
          sx={{
            width: 200,
            flexShrink: 0,
            borderLeft: `1px solid ${themeColors.borderColor}`,
            background: themeColors.bgPanel,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            pt: 2,
            overflow: "hidden"
          }}
        >
          <ControlPanel
            darkMode={darkMode}
            controlState={controlState}
            onControlStateChange={onControlStateChange}
            raspberryConnected={Boolean(raspberryStatus?.raspberryConnected)}
          />

          <Box sx={{ mt: "auto", pb: 2, px: 2, display: "flex", flexDirection: "column", alignItems: "center", width: "100%", boxSizing: "border-box", flexShrink: 0 }}>
            <Box
              sx={{
                p: 0.5,
                borderRadius: "12px",
                background: darkMode ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.03)",
                border: `1px solid ${themeColors.borderColor}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              <img
                src={logo}
                alt="Partech Logo"
                style={{
                  width: 112,
                  maxWidth: "100%",
                  maxHeight: 112,
                  objectFit: "contain",
                  height: "auto",
                  borderRadius: "8px",
                  filter: darkMode ? "contrast(1.1) brightness(1.1)" : "none"
                }}
              />
            </Box>

            <Typography
              component="div"
              sx={{ mt: 1, fontSize: 10, lineHeight: 1.45, color: themeColors.textMuted, fontWeight: "bold", letterSpacing: 2, textAlign: "center" }}
            >
              PARTECH HYPERLOOP
              <Box component="span" sx={{ display: "block" }}>TEAM</Box>
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
