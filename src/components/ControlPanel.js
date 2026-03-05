import React, { useEffect, useState } from "react";
import { Box, Button, Switch, Typography } from "@mui/material";

// Material UI İkonları (Resimlerin yerine)
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

  const [time, setTime] = useState(new Date());
  const [weather, setWeather] = useState("--");

  // Yazıların sığması için panel genişliğini biraz artırdık
  const panelWidth = 150; 

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);

    fetch(
      "https://api.open-meteo.com/v1/forecast?latitude=41.01&longitude=28.97&current_weather=true"
    )
      .then((r) => r.json())
      .then((d) => setWeather(d.current_weather.temperature + "°C"));

    return () => clearInterval(timer);
  }, []);

  // Butonlar için ortak stil şablonu
  const commonBtnStyle = {
    width: "100%",
    py: 1.5,
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
        gap: 1,
        alignItems: "center"
      }}
    >
      
      {/* LOGO */}
      <Box sx={{ display: "flex", justifyContent: "center", mb: 1 }}>
        <img
          src={logo}
          alt="logo"
          style={{
            width: 140,
            height: 140,
            objectFit: "contain",
            filter: "drop-shadow(0 0 8px rgba(120,180,255,0.6))"
          }}
        />
      </Box>
      
      {/* WEATHER */}
      <Box
        sx={{
          width: panelWidth,
          background: "linear-gradient(145deg,#0d1426,#05070d)",
          color: "#9ecbff",
          p: 1,
          borderRadius: 2,
          textAlign: "center",
          border: "1px solid rgba(100,150,255,0.3)"
        }}
      >
        <Typography variant="body2">İSTANBUL</Typography>
        <Typography sx={{ fontSize: 22, fontWeight: "bold", color: "#6fa8ff", textShadow: "0 0 6px rgba(120,180,255,0.6)" }}>
          {weather}
        </Typography>
        <Typography sx={{ fontSize: 14, letterSpacing: 1, color: "#9ecbff" }}>
          {time.toLocaleTimeString()}
        </Typography>
      </Box>

      {/* STATE */}
      <Box
        sx={{
          width: panelWidth,
          background: "linear-gradient(145deg,#140b0b,#05070d)",
          color: "white",
          p: 1,
          borderRadius: 2,
          textAlign: "center",
          border: "1px solid rgba(255,80,80,0.4)",
          boxShadow: "0 0 8px rgba(255,80,80,0.25)"
        }}
      >
        <Typography variant="body2" sx={{ color: "#94a3b8" }}>SİSTEM DURUMU</Typography>
        <Typography
          sx={{
            fontWeight: "bold",
            letterSpacing: 1,
            color: emergency ? "#ff4d4d" : brake ? "#ffb84d" : "#4dff88",
            textShadow: emergency
              ? "0 0 8px rgba(255,0,0,0.8)"
              : brake
              ? "0 0 8px rgba(255,180,0,0.7)"
              : "0 0 8px rgba(0,255,150,0.7)"
          }}
        >
          {emergency ? "ACİL DURUM" : brake ? "FREN AKTİF" : "HAZIR"}
        </Typography>
      </Box>

      {/* BUTTON PANEL (KONTROL İKONLARI VE YAZILAR) */}
      <Box
        sx={{
          width: panelWidth,
          display: "flex",
          flexDirection: "column",
          gap: 1.5,
          alignItems: "center",
          background: "linear-gradient(180deg,#050d18,#020b14)",
          padding: 2,
          borderRadius: 3,
          border: "1px solid #1e3a5f"
        }}
      >
        {/* İLERİ BUTONU (YEŞİL) */}
        <Button
          variant="contained"
          onClick={() => sendCommand("FORWARD")}
          sx={{
            ...commonBtnStyle,
            background: "rgba(0, 229, 255, 0.1)", // İçi hafif şeffaf turkuaz
            border: "1px solid #00e5ff", // Turkuaz çerçeve
            color: "#00e5ff", // Turkuaz ikon ve yazı
            "&:hover": { background: "rgba(0, 229, 255, 0.3)", boxShadow: "0 0 15px rgba(0, 229, 255, 0.5)" }
          }}
        >
          <KeyboardDoubleArrowUpIcon /> İLERİ
        </Button>

        {/* FREN BUTONU (KIRMIZI) */}
        <Button
          variant="contained"
          onClick={() => {
            setBrake(!brake);
            sendCommand("BRAKE");
          }}
          sx={{
            ...commonBtnStyle,
            background: brake ? "rgba(255, 145, 0, 0.3)" : "rgba(255, 145, 0, 0.1)",
            border: "1px solid #ff9100",
            color: "#ff9100",
            "&:hover": { background: "rgba(255, 145, 0, 0.3)", boxShadow: "0 0 15px rgba(255, 145, 0, 0.5)" }
          }}
        >
          <StopIcon /> FREN
        </Button>

        {/* GERİ BUTONU (YEŞİL) */}
        <Button
          variant="contained"
          onClick={() => sendCommand("BACKWARD")}
          sx={{
            ...commonBtnStyle,
            background: "rgba(0, 229, 255, 0.1)", // İçi hafif şeffaf turkuaz
            border: "1px solid #00e5ff", // Turkuaz çerçeve
            color: "#00e5ff", // Turkuaz ikon ve yazı
            "&:hover": { background: "rgba(0, 229, 255, 0.3)", boxShadow: "0 0 15px rgba(0, 229, 255, 0.5)" }
          }}
        >
          <KeyboardDoubleArrowDownIcon /> GERİ
        </Button>

        {/* ACİL DURUM BUTONU (KIRMIZI VE PARLAK) */}
        <Button
          variant="contained"
          onClick={() => {
            setEmergency(!emergency);
            sendCommand("EMERGENCY");
          }}
          sx={{
            ...commonBtnStyle,
            mt: 1, // Acil durum butonunu diğerlerinden biraz ayırmak için üstten boşluk
            background: emergency ? "#ff1744" : "#b71c1c", 
            color: "#fff",
            border: "1px solid #ff5252",
            boxShadow: emergency ? "0 0 20px rgba(255, 23, 68, 0.8)" : "none",
            animation: emergency ? "pulse 1s infinite alternate" : "none",
            "&:hover": { background: "#ff1744" },
            "@keyframes pulse": {
              "0%": { transform: "scale(1)" },
              "100%": { transform: "scale(1.05)", boxShadow: "0 0 25px rgba(255, 23, 68, 1)" }
            }
          }}
        >
          <WarningIcon /> ACİL
        </Button>

        {/* OTONOM MOD */}
        <Box sx={{ width: "100%", mt: 1, p: 1, background: "rgba(0,0,0,0.3)", borderRadius: 2, textAlign: "center", border: "1px solid rgba(100,150,255,0.2)" }}>
          <Typography color="#0ff" fontFamily="monospace" variant="body2" sx={{ mb: 0.5 }}>
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
    </Box>
  );
}

export default ControlPanel;