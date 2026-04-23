import React from "react";
import { Box, Typography } from "@mui/material";

const Indicator = ({ label, value, color }) => (
  <Box sx={{ 
    flex: 1, 
    display: "flex", 
    flexDirection: "column", 
    alignItems: "center",
    background: "rgba(15, 23, 42, 0.6)",
    borderRadius: "4px",
    border: `1px solid ${color}33`,
    p: 0.5
  }}>
    <Typography sx={{ color: "#94a3b8", fontSize: 9, fontWeight: "bold", letterSpacing: 0.5 }}>
      {label}
    </Typography>
    <Typography sx={{ color: color, fontSize: 13, fontWeight: "mono", fontFamily: "monospace" }}>
      {value.toFixed(1)}°
    </Typography>
  </Box>
);

export default function OrientationPanel({ roll = 0, pitch = 0, yaw = 0, darkMode }) {
  const accentColor = darkMode ? "#29b6f6" : "#0284c7";

  return (
    <Box sx={{ 
      display: "flex", 
      gap: 1, 
      width: "100%", 
      mt: 1, // 3D görüntünün hemen altına boşluk
      px: 1 
    }}>
      <Indicator label="ROLL" value={roll} color={accentColor} />
      <Indicator label="PITCH" value={pitch} color={accentColor} />
      <Indicator label="YAW" value={yaw} color={accentColor} />
    </Box>
  );
}