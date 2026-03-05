import React from "react";
import { Box, Typography } from "@mui/material";

export default function NeonTempBar({ value = 0, label = "BAT 1" }) {
  const maxTemp = 100;
  const safeValue = Math.min(Math.max(value, 0), maxTemp);
  const percentage = (safeValue / maxTemp) * 100;

  // Sıcaklığa göre renk ve parlama belirleme
  let color = "#4fc3f7"; // Normal (Mavi)
  let glow = "none";
  let isDanger = false;

  if (safeValue >= 60) {
    color = "#ff4d4d"; // Kritik (Kırmızı)
    glow = "0 0 15px rgba(255, 77, 77, 0.8)";
    isDanger = true;
  } else if (safeValue >= 45) {
    color = "#facc15"; // Uyarı (Sarı)
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
        borderRadius: 2,
        border: `1px solid ${color}44`,
        boxShadow: glow,
        p: 1,
        // Tehlike anında kutunun kendisi de hafif kırmızı yanıp sönecek
        animation: isDanger ? "pulse 1s infinite alternate" : "none",
        "@keyframes pulse": {
          "0%": { borderColor: `${color}44` },
          "100%": { borderColor: color, boxShadow: `0 0 20px ${color}` }
        }
      }}
    >
      <Typography sx={{ color: "#94a3b8", fontSize: 11, letterSpacing: 1, mb: 1 }}>
        {label}
      </Typography>

      {/* Dikey Bar Konteyneri */}
      <Box sx={{ width: 20, flexGrow: 1, background: "#0f172a", borderRadius: 10, position: "relative", overflow: "hidden" }}>
        {/* Dolum Efekti */}
        <Box
          sx={{
            position: "absolute", bottom: 0, left: 0, right: 0,
            height: `${percentage}%`,
            background: color,
            borderRadius: 10,
            transition: "height 0.3s ease-out, background 0.3s",
            boxShadow: `0 0 10px ${color}`
          }}
        />
      </Box>

      <Typography sx={{ color: color, fontSize: 16, fontWeight: "bold", mt: 1, textShadow: glow }}>
        {Math.round(safeValue)}°C
      </Typography>
    </Box>
  );
}