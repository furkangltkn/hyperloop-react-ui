import React from "react";
import { Box, Typography } from "@mui/material";

export default function NeonHorizontalBar({ value, max = 100, label = "GÜÇ", unit = "kW", color = "#b388ff", compact = false }) {
  const numericValue = Number(value);
  const hasValue = value !== null && value !== undefined && value !== "" && Number.isFinite(numericValue);
  const resolvedValue = hasValue ? numericValue : 0;
  const safeValue = Math.min(Math.max(resolvedValue, 0), max);
  const percentage = (safeValue / max) * 100;
  const isDanger = percentage > 90; 
  const activeColor = isDanger ? "#ff4d4d" : color;
  const glow = isDanger ? `0 0 15px rgba(255, 77, 77, 0.8)` : `0 0 10px ${color}44`;

  return (
    <Box
      sx={{
        width: "100%", // Genişliği tam yayar
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        background: "linear-gradient(145deg,#0b1324,#05070d)",
        borderRadius: 2,
        border: `1px solid ${activeColor}44`,
        boxShadow: glow,
        p: compact ? 1 : 1.5,
        boxSizing: "border-box" // Padding'in genişliği bozmasını engeller
      }}
    >
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: compact ? 0.5 : 1 }}>
        <Typography sx={{ color: "#94a3b8", fontSize: compact ? 9 : 11, letterSpacing: 1 }}>
          {label}
        </Typography>
        <Typography sx={{ color: activeColor, fontSize: compact ? 11 : 14, fontWeight: "bold", textShadow: `0 0 8px ${activeColor}` }}>
          {hasValue ? `${resolvedValue.toFixed(2)} ${unit}` : "--"}
        </Typography>
      </Box>

      <Box sx={{ width: "100%", height: compact ? 6 : 8, background: "#0f172a", borderRadius: 4, overflow: "hidden" }}>
        <Box
          sx={{
            width: `${percentage}%`,
            height: "100%",
            background: activeColor,
            boxShadow: `0 0 10px ${activeColor}`,
            transition: "width 0.3s ease-out, background 0.3s"
          }}
        />
      </Box>
    </Box>
  );
}
