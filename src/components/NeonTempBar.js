import React from "react";
import { Box, Typography } from "@mui/material";

export default function NeonTempBar({ value = 0, label = "BAT 1" }) {
  const maxTemp = 100;
  const safeValue = Math.min(Math.max(value, 0), maxTemp);
  const percentage = (safeValue / maxTemp) * 100;

  let color = "#4fc3f7"; 
  let glow = "none";
  let isDanger = false;

  if (safeValue >= 60) {
    color = "#ff4d4d";
    glow = "0 0 15px rgba(255, 77, 77, 0.8)";
    isDanger = true;
  } else if (safeValue >= 45) {
    color = "#facc15";
    glow = "0 0 10px rgba(250, 204, 21, 0.6)";
  }

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        background: "linear-gradient(145deg,#0b1324,#05070d)",
        borderRadius: "8px 8px 0 0", // Alt köşeler düz, üstler oval
        border: `1px solid ${color}44`,
        boxShadow: glow,
        p: 1,
        pb: 0, // Alt boşluk sıfır, bar alta yapışır
        overflow: "hidden",
        animation: isDanger ? "pulse 1s infinite alternate" : "none",
        "@keyframes pulse": {
          "0%": { borderColor: `${color}44` },
          "100%": { borderColor: color, boxShadow: `0 0 20px ${color}` }
        }
      }}
    >
      <Typography sx={{ color: "#94a3b8", fontSize: 10, letterSpacing: 1, mb: 1, mt: 0.5 }}>
        {label}
      </Typography>

      <Box sx={{ 
        width: "24px", // Çubuk kalınlığı
        flexGrow: 1, 
        background: "#0f172a", 
        borderRadius: "6px 6px 0 0", 
        position: "relative", 
        overflow: "hidden",
        mx: "auto" // Kutuda ortala
      }}>
        <Box
          sx={{
            position: "absolute", bottom: 0, left: 0, right: 0,
            height: `${percentage}%`,
            background: color,
            transition: "height 0.3s ease-out, background 0.3s",
            boxShadow: `0 0 10px ${color}`
          }}
        />
      </Box>

      <Typography sx={{ 
        color: color, 
        fontSize: 14, 
        fontWeight: "bold", 
        my: 1, // Barın hemen altında veya üstünde şık durur
        textShadow: glow 
      }}>
        {Math.round(safeValue)}°
      </Typography>
    </Box>
  );
}