import React from "react";
import { Box, Typography } from "@mui/material";

export default function MissionPanel({ 
  departureTime = "--",
  estimatedArrivalTime = "--",
  distanceLeft,
  progress,
  status = "VERİ BEKLENİYOR"
}) {
  const normalizedProgress = Math.min(100, Math.max(0, Number(progress) || 0));
  const displayedDistance = distanceLeft == null ? "--" : distanceLeft;

  const getStatusStyle = (currentStatus) => {
    switch (currentStatus) {
      case "READY": return { color: "#4dff88", glow: "rgba(77, 255, 136, 0.6)" };
      case "HIZLANMA": 
      case "ACCELERATING": return { color: "#4fc3f7", glow: "rgba(79, 195, 247, 0.6)" };
      case "COASTING": return { color: "#facc15", glow: "rgba(250, 204, 21, 0.6)" };
      case "BRAKING": return { color: "#ff4d4d", glow: "rgba(255, 77, 77, 0.8)" };
      default: return { color: "#4fc3f7", glow: "rgba(79, 195, 247, 0.6)" };
    }
  };

  const activeStyle = getStatusStyle(status);

  return (
    <Box
      sx={{
        width: "100%",
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        background: "linear-gradient(145deg, #09101d 0%, #04070d 100%)",
        border: "1px solid rgba(255, 255, 255, 0.05)",
        borderTop: "1px solid rgba(79, 195, 247, 0.15)",
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.4)",
        px: 4,
        py: 1.5,
        mb: 1.5,
        borderRadius: 2,
        position: "relative"
      }}
    >
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1.5 }}>
        
        {/* SOL: KALKIŞ */}
        <Box sx={{ textAlign: "left", flex: 1 }}>
          <Typography sx={{ color: "#64748b", fontSize: 9, fontWeight: 700, letterSpacing: 1.2, mb: 0.2 }}>
            KALKIŞ ZAMANI
          </Typography>
          <Typography sx={{ color: "#e2e8f0", fontSize: 16, fontFamily: "'JetBrains Mono', monospace", fontWeight: 500 }}>
            {departureTime}
          </Typography>
        </Box>

        {/* ORTA: DURUM */}
        <Box sx={{ textAlign: "center", flex: 1 }}>
          <Typography 
            sx={{ 
              color: activeStyle.color, 
              fontSize: 13, 
              fontWeight: 800, 
              letterSpacing: 2,
              textShadow: `0 0 8px ${activeStyle.glow}`,
              textTransform: "uppercase"
            }}
          >
            {status}
          </Typography>
          <Typography sx={{ color: "#94a3b8", fontSize: 10, mt: 0.2, fontWeight: 500 }}>
            KALAN MESAFE: <span style={{ color: "#facc15", fontWeight: "bold" }}>{displayedDistance}{distanceLeft == null ? "" : " m"}</span>
          </Typography>
        </Box>

        {/* SAĞ: VARIŞ */}
        <Box sx={{ textAlign: "right", flex: 1 }}>
          <Typography sx={{ color: "#64748b", fontSize: 9, fontWeight: 700, letterSpacing: 1.2, mb: 0.2 }}>
            TAHMİNİ VARIŞ ZAMANI
          </Typography>
          <Typography sx={{ color: "#4dff88", fontSize: 16, fontFamily: "'JetBrains Mono', monospace", fontWeight: 500 }}>
            {estimatedArrivalTime}
          </Typography>
        </Box>

      </Box>

      {/* İLERLEME ÇUBUĞU */}
      <Box sx={{ position: "relative", width: "100%", height: 4, background: "rgba(255, 255, 255, 0.05)", borderRadius: 2 }}>
        <Box 
          sx={{ 
            position: "absolute", 
            top: 0, left: 0, bottom: 0, 
            width: `${normalizedProgress}%`,
            background: activeStyle.color,
            boxShadow: `0 0 8px ${activeStyle.glow}`,
            borderRadius: 2,
            transition: "width 0.8s ease-in-out"
          }} 
        />
      </Box>
    </Box>
  );
}
