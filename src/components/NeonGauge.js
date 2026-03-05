import React from "react";
import { Box, Typography } from "@mui/material";

export default function NeonGauge({ value = 0, max = 200, label = "SPEED X", unit = "KM/H", color = "#4fc3f7" }) {
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  // Değerin 0 ile max arasında kalmasını garanti edelim
  const safeValue = Math.min(Math.max(value, 0), max);
  const strokeDashoffset = circumference - (safeValue / max) * circumference;

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(145deg,#0b1324,#05070d)",
        borderRadius: 2,
        border: `1px solid ${color}33`,
        boxShadow: `0 0 10px ${color}15`,
        p: 1
      }}
    >
      <Box sx={{ position: "relative", width: 100, height: 100 }}>
        {/* Arka Plan Halkası */}
        <svg width="100" height="100" style={{ transform: "rotate(-90deg)" }}>
          <circle
            cx="50" cy="50" r={radius}
            stroke="#1e293b" strokeWidth="8" fill="none"
          />
          {/* Neon Doldurma Halkası */}
          <circle
            cx="50" cy="50" r={radius}
            stroke={color} strokeWidth="8" fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            style={{
              transition: "stroke-dashoffset 0.2s ease-out",
              filter: `drop-shadow(0 0 6px ${color})`
            }}
          />
        </svg>

        {/* Merkezdeki Rakamlar */}
        <Box
          sx={{
            position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
            display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center"
          }}
        >
          <Typography sx={{ color: "#fff", fontSize: 20, fontWeight: "bold", textShadow: `0 0 8px ${color}` }}>
            {Math.round(safeValue)}
          </Typography>
          <Typography sx={{ color: color, fontSize: 9, letterSpacing: 1 }}>
            {unit}
          </Typography>
        </Box>
      </Box>

      <Typography sx={{ color: "#94a3b8", fontSize: 11, mt: 1, letterSpacing: 1 }}>
        {label}
      </Typography>
    </Box>
  );
}