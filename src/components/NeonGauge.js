import React from "react";
import { Box, Typography } from "@mui/material";

export default function NeonGauge({ value, max = 100, label = "HIZ", unit = "M/S", color = "#00e676" }) {
  const numericValue = Number(value);
  const hasValue = value !== null && value !== undefined && value !== "" && Number.isFinite(numericValue);
  // Değeri 0 ile Max arasında sınırla
  const safeValue = hasValue ? Math.min(Math.max(numericValue, 0), max) : 0;
  const percentage = safeValue / max;
  
  // SVG Çizim Parametreleri (Kutuya sığması için optimize edildi)
  const strokeWidth = 6;
  const radius = 38; 
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - percentage * circumference;

  return (
    <Box sx={{ 
      display: "flex", 
      flexDirection: "column", 
      alignItems: "center", 
      justifyContent: "center", 
      width: "100%", 
      height: "100%", // Dışarıdaki 110px'lik kutuya tam oturur
      position: "relative",
      overflow: "hidden"
    }}>
      {/* SVG Gösterge Çemberi */}
      <Box sx={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <svg width="85" height="85" viewBox="0 0 100 100" style={{ transform: "rotate(-90deg)" }}>
          {/* Arka Plan Çemberi (Silik) */}
          <circle 
            cx="50" cy="50" r={radius} 
            fill="transparent" 
            stroke="rgba(255,255,255,0.05)" 
            strokeWidth={strokeWidth} 
          />
          {/* Renkli İlerleme Çemberi (Neon Efektli) */}
          <circle 
            cx="50" cy="50" r={radius} 
            fill="transparent" 
            stroke={color} 
            strokeWidth={strokeWidth} 
            strokeDasharray={circumference} 
            strokeDashoffset={offset} 
            strokeLinecap="round"
            style={{ 
              transition: "stroke-dashoffset 0.8s ease-out", 
              filter: `drop-shadow(0 0 4px ${color})` 
            }}
          />
        </svg>

        {/* Çemberin İçindeki Sayısal Değer */}
        <Box sx={{ position: "absolute", textAlign: "center" }}>
          <Typography sx={{ 
            fontSize: 18, 
            fontWeight: "900", 
            color: "#fff", 
            lineHeight: 1,
            fontFamily: "monospace" 
          }}>
            {hasValue ? Math.round(safeValue) : "--"}
          </Typography>
          <Typography sx={{ 
            fontSize: 8, 
            color: color, 
            fontWeight: "bold", 
            letterSpacing: 0.5 
          }}>
            {unit}
          </Typography>
        </Box>
      </Box>

      {/* İbrenin Altındaki Etiket (Anlık Hız / Ortalama Hız) */}
      <Typography sx={{ 
        fontSize: 9, 
        color: "#94a3b8", 
        mt: 0.5, 
        fontWeight: "bold", 
        letterSpacing: 1,
        textTransform: "uppercase"
      }}>
        {label}
      </Typography>
    </Box>
  );
}
