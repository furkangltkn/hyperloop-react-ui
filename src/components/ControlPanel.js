import React, { useState } from "react";
import { Box, Button, Switch, Typography } from "@mui/material";

import KeyboardDoubleArrowUpIcon from '@mui/icons-material/KeyboardDoubleArrowUp';
import KeyboardDoubleArrowDownIcon from '@mui/icons-material/KeyboardDoubleArrowDown';
import StopIcon from '@mui/icons-material/Stop';
import WarningIcon from '@mui/icons-material/Warning';

import logo from "../assets/logo.jpeg";
import { sendCommand } from "../services/commandService";

function ControlPanel() {
  const [brake, setBrake] = useState(false);
  const [emergency, setEmergency] = useState(false);
  const [autonomous, setAutonomous] = useState(false);

  // Butonların ve logonun hizalanacağı ortak genişlik
  const btnWidth = 220; 

  const commonBtnStyle = {
    width: "100%", // Artık kapsayıcı kutu 220px olduğu için bu %100 kalabilir
    py: 0.6, 
    fontSize: 12, 
    fontWeight: "bold",
    letterSpacing: 1,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: 1,
    borderRadius: 2,
    transition: "all 0.2s"
  };

  return (
    <Box 
      sx={{ 
        display: "flex", 
        flexDirection: "column", 
        height: "100%", 
        alignItems: "center" // Tüm içeriği merkeze hizalar
      }}
    >
      
      {/* İNCE GÖSTERGE VE BUTONLAR KUTUSU (Genişliği 220px ile sınırlandı) */}
      <Box 
        sx={{ 
          display: "flex", 
          flexDirection: "column", 
          gap: 0.8, 
          width: btnWidth // Genişliği buraya verdik ki altındaki logo da bu hizayı baz alsın
        }}
      > 
        
        {/* SİSTEM DURUMU */}
        <Box
          sx={{
            ...commonBtnStyle,
            background: "linear-gradient(145deg,#140b0b,#05070d)",
            border: "1px solid rgba(255,255,255,0.1)",
            flexDirection: "row", 
            justifyContent: "space-between",
            px: 2,
            py: 0.8,
            boxSizing: "border-box" 
          }}
        >
          <Typography sx={{ fontSize: 10, color: "#94a3b8", letterSpacing: 1 }}>SİSTEM:</Typography>
          <Typography
            sx={{
              fontSize: 12,
              fontWeight: "bold",
              letterSpacing: 1.5,
              color: emergency ? "#ff4d4d" : brake ? "#ffb84d" : "#4dff88",
              textShadow: emergency ? "0 0 8px rgba(255,0,0,0.8)" : brake ? "0 0 8px rgba(255,180,0,0.7)" : "0 0 8px rgba(0,255,150,0.5)"
            }}
          >
            {emergency ? "ACİL DURUM" : brake ? "FREN AKTİF" : "HAZIR"}
          </Typography>
        </Box>

        {/* İLERİ */}
        <Button
          variant="outlined"
          onClick={() => sendCommand("FORWARD")}
          sx={{
            ...commonBtnStyle,
            borderColor: "#00e5ff",
            color: "#00e5ff",
            background: "rgba(0, 229, 255, 0.05)",
            "&:hover": { background: "rgba(0, 229, 255, 0.2)", borderColor: "#00e5ff", boxShadow: "0 0 10px rgba(0, 229, 255, 0.5)" }
          }}
        >
          <KeyboardDoubleArrowUpIcon fontSize="small" /> İLERİ
        </Button>

        {/* FREN */}
        <Button
          variant="outlined"
          onClick={() => {
            setBrake(!brake);
            sendCommand("BRAKE");
          }}
          sx={{
            ...commonBtnStyle,
            borderColor: brake ? "#ff9100" : "rgba(255, 145, 0, 0.5)",
            color: brake ? "#ff9100" : "rgba(255, 145, 0, 0.8)",
            background: brake ? "rgba(255, 145, 0, 0.2)" : "rgba(255, 145, 0, 0.05)",
            "&:hover": { background: "rgba(255, 145, 0, 0.2)", borderColor: "#ff9100", boxShadow: "0 0 10px rgba(255, 145, 0, 0.4)" }
          }}
        >
          <StopIcon fontSize="small" /> FREN
        </Button>

        {/* GERİ */}
        <Button
          variant="outlined"
          onClick={() => sendCommand("BACKWARD")}
          sx={{
            ...commonBtnStyle,
            borderColor: "#00e5ff",
            color: "#00e5ff",
            background: "rgba(0, 229, 255, 0.05)",
            "&:hover": { background: "rgba(0, 229, 255, 0.2)", borderColor: "#00e5ff", boxShadow: "0 0 10px rgba(0, 229, 255, 0.5)" }
          }}
        >
          <KeyboardDoubleArrowDownIcon fontSize="small" /> GERİ
        </Button>

        {/* ACİL DURUM */}
        <Button
          variant="contained"
          onClick={() => {
            setEmergency(!emergency);
            sendCommand("EMERGENCY");
          }}
          sx={{
            ...commonBtnStyle,
            background: emergency ? "#ff1744" : "#b71c1c",
            color: "#fff",
            border: "1px solid #ff5252",
            animation: emergency ? "pulse 1s infinite alternate" : "none",
            "&:hover": { background: "#ff1744", boxShadow: "0 0 15px rgba(255, 23, 68, 0.8)" },
            "@keyframes pulse": {
              "0%": { transform: "scale(1)", boxShadow: "0 0 10px rgba(255, 23, 68, 0.5)" },
              "100%": { transform: "scale(1.02)", boxShadow: "0 0 20px rgba(255, 23, 68, 1)" }
            }
          }}
        >
          <WarningIcon fontSize="small" /> ACİL DURUM
        </Button>

        {/* OTONOM MOD */}
        <Box 
          sx={{ 
            ...commonBtnStyle, 
            py: 0.5, 
            px: 2, 
            background: "rgba(0,0,0,0.3)", 
            justifyContent: "space-between", 
            border: "1px solid rgba(100,150,255,0.1)",
            boxSizing: "border-box" 
          }}
        >
          <Typography color="#0ff" fontFamily="monospace" sx={{ fontSize: 11, letterSpacing: 1 }}>
            OTONOM MOD
          </Typography>
          <Switch
            size="small"
            color="info"
            checked={autonomous}
            onChange={(e) => {
              const val = e.target.checked;
              setAutonomous(val);
              sendCommand(val ? "AUTONOMOUS_ON" : "AUTONOMOUS_OFF");
            }}
          />
        </Box>
      </Box>

      {/* ALT KISIM: PARTECH LOGOSU */}
      <Box 
        sx={{ 
          width: btnWidth, // Butonlarla aynı genişlikte bir çerçeve
          display: "flex", 
          justifyContent: "flex-end", // Logoyu o çerçevenin sağına yaslar (butonların tam bittiği yer)
          mt: "auto", // Yukarıdaki elemanları iter, logoyu en alta yapıştırır
          pb: 1,
          pt: 2
        }}
      >
        <img
          src={logo}
          alt="Partech Logo"
          style={{
            width: 220, 
            objectFit: "contain",
            filter: "drop-shadow(0 0 8px rgba(100,150,255,0.4))",
            opacity: 0.95 
          }}
        />
      </Box>

    </Box>
  );
}

export default ControlPanel;