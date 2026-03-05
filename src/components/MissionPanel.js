import React from "react";
import { Box, Typography} from "@mui/material";

export default function MissionPanel({ 
  departureTime = "14:30:00", 
  eta = "14:32:45", 
  distanceLeft = 1250, 
  progress = 45, // 0 ile 100 arası yüzde
  status = "HIZLANMA" // READY, ACCELERATING, COASTING, BRAKING
}) {
  return (
    <Box
      sx={{
        width: "100%",
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        background: "linear-gradient(90deg, #05070d 0%, #0b1324 50%, #05070d 100%)",
        borderBottom: "1px solid rgba(79, 195, 247, 0.3)",
        boxShadow: "0 4px 15px rgba(0,0,0,0.5)",
        px: 3,
        py: 1.5,
        mb: 2,
        borderRadius: 2
      }}
    >
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
        
        {/* SOL: KALKIŞ */}
        <Box sx={{ textAlign: "left" }}>
          <Typography sx={{ color: "#94a3b8", fontSize: 10, letterSpacing: 2 }}>KALKIŞ ZAMANI</Typography>
          <Typography sx={{ color: "#fff", fontSize: 18, fontFamily: "monospace", textShadow: "0 0 5px #fff" }}>
            {departureTime}
          </Typography>
        </Box>

        {/* ORTA: DURUM VE MESAFE */}
        <Box sx={{ textAlign: "center" }}>
          <Typography 
            sx={{ 
              color: status === "BRAKING" ? "#ff4d4d" : "#4fc3f7", 
              fontSize: 14, 
              fontWeight: "bold", 
              letterSpacing: 3,
              textShadow: status === "BRAKING" ? "0 0 8px red" : "0 0 8px #4fc3f7"
            }}
          >
            {status}
          </Typography>
          <Typography sx={{ color: "#facc15", fontSize: 12, mt: 0.5 }}>
            KALAN MESAFE: {distanceLeft}m
          </Typography>
        </Box>

        {/* SAĞ: VARIŞ (ETA) */}
        <Box sx={{ textAlign: "right" }}>
          <Typography sx={{ color: "#94a3b8", fontSize: 10, letterSpacing: 2 }}>TAHMİNİ VARIŞ ZAMANI</Typography>
          <Typography sx={{ color: "#4dff88", fontSize: 18, fontFamily: "monospace", textShadow: "0 0 8px #4dff88" }}>
            {eta}
          </Typography>
        </Box>

      </Box>

      {/* İLERLEME ÇUBUĞU (PROGRESS BAR) */}
      <Box sx={{ position: "relative", width: "100%", height: 6, background: "#1e293b", borderRadius: 3, overflow: "hidden" }}>
        <Box 
          sx={{ 
            position: "absolute", 
            top: 0, left: 0, bottom: 0, 
            width: `${progress}%`, 
            background: "linear-gradient(90deg, transparent, #4fc3f7)",
            boxShadow: "0 0 10px #4fc3f7",
            transition: "width 0.5s ease-out"
          }} 
        />
      </Box>
    </Box>
  );
}