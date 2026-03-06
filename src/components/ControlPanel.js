import React, { useEffect, useState } from "react";
import { Box, Button, Switch, Typography } from "@mui/material";

import KeyboardDoubleArrowUpIcon from '@mui/icons-material/KeyboardDoubleArrowUp';
import KeyboardDoubleArrowDownIcon from '@mui/icons-material/KeyboardDoubleArrowDown';
import StopIcon from '@mui/icons-material/Stop';
import WarningIcon from '@mui/icons-material/Warning';

import { sendCommand } from "../services/commandService";

// SOFT RENK PALETİ
const colors = {
  forward: "#7dcfff", // Soft buz mavisi
  brake: "#e0af68",   // Soft kehribar/hardal
  emergency: "#f7768e", // Soft mercan kırmızısı
  ready: "#73daca",   // Soft nane yeşili
  textMain: "#c0caf5", // Kırık beyaz
  textMuted: "#565f89",
  panelBg: "rgba(36, 40, 59, 0.4)",
  border: "rgba(255, 255, 255, 0.05)"
};

const playSynthSound = (type) => { /* ... önceki ses fonksiyonu aynı kalabilir ... */ };

function ControlPanel() {
  const [brake, setBrake] = useState(false);
  const [emergency, setEmergency] = useState(false);
  const [autonomous, setAutonomous] = useState(false);
  const [time, setTime] = useState(new Date());
  const [weather, setWeather] = useState("--");
  const panelWidth = 160; 

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    fetch("https://api.open-meteo.com/v1/forecast?latitude=41.01&longitude=28.97&current_weather=true")
      .then((r) => r.json())
      .then((d) => setWeather(d.current_weather.temperature + "°C"));
    return () => clearInterval(timer);
  }, []);

  const sciFiStyle = {
    width: "100%", height: 48, fontWeight: "bold", letterSpacing: 1, display: "flex", justifyContent: "center", alignItems: "center", gap: 1, transition: "all 0.2s", boxSizing: "border-box", borderRadius: 2,
    textTransform: "none" // Yazıların daha yumuşak görünmesi için
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5, alignItems: "center", width: panelWidth, mb: 8 }}>
      
      {/* HAVA DURUMU */}
      <Box sx={{ width: "100%", background: colors.panelBg, color: colors.textMain, py: 0.5, textAlign: "center", border: `1px solid ${colors.border}`, borderRadius: 2 }}>
        <Typography sx={{ fontSize: 18, fontWeight: "500", color: colors.forward, lineHeight: 1.2 }}>{weather}</Typography>
        <Typography sx={{ fontSize: 11, letterSpacing: 1, color: colors.textMuted }}>{time.toLocaleTimeString()}</Typography>
      </Box>

      {/* SİSTEM DURUMU */}
      <Box sx={{ ...sciFiStyle, background: colors.panelBg, border: `1px solid ${emergency ? colors.emergency : brake ? colors.brake : colors.ready}`, flexDirection: "column", gap: 0, justifyContent: "center" }}>
        <Typography sx={{ fontSize: 9, color: colors.textMuted, letterSpacing: 1 }}>SİSTEM DURUMU</Typography>
        <Typography sx={{ fontSize: 13, fontWeight: "bold", letterSpacing: 1, color: emergency ? colors.emergency : brake ? colors.brake : colors.ready }}>
          {emergency ? "ACİL DURUM" : brake ? "FREN AKTİF" : "HAZIR"}
        </Typography>
      </Box>

      {/* BUTON PANELİ */}
      <Box sx={{ width: "100%", display: "flex", flexDirection: "column", gap: 1.5, alignItems: "center", background: colors.panelBg, padding: 1.5, border: `1px solid ${colors.border}`, borderRadius: 2 }}>
        
        <Button variant="contained" disableElevation onClick={() => { playSynthSound("forward"); sendCommand("FORWARD"); }}
          sx={{ ...sciFiStyle, background: "rgba(125, 207, 255, 0.08)", border: `1px solid rgba(125, 207, 255, 0.2)`, color: colors.forward, "&:hover": { background: "rgba(125, 207, 255, 0.15)" } }}>
          <KeyboardDoubleArrowUpIcon fontSize="small" /> İleri
        </Button>

        <Button variant="contained" disableElevation onClick={() => { playSynthSound("brake"); setBrake(!brake); sendCommand("BRAKE"); }}
          sx={{ ...sciFiStyle, background: brake ? "rgba(224, 175, 104, 0.15)" : "rgba(224, 175, 104, 0.08)", border: `1px solid rgba(224, 175, 104, 0.2)`, color: colors.brake, "&:hover": { background: "rgba(224, 175, 104, 0.15)" } }}>
          <StopIcon fontSize="small" /> Fren
        </Button>

        <Button variant="contained" disableElevation onClick={() => { playSynthSound("backward"); sendCommand("BACKWARD"); }}
          sx={{ ...sciFiStyle, background: "rgba(125, 207, 255, 0.08)", border: `1px solid rgba(125, 207, 255, 0.2)`, color: colors.forward, "&:hover": { background: "rgba(125, 207, 255, 0.15)" } }}>
          <KeyboardDoubleArrowDownIcon fontSize="small" /> Geri
        </Button>

        <Button variant="contained" disableElevation onClick={() => { playSynthSound("emergency"); setEmergency(!emergency); sendCommand("EMERGENCY"); }}
          sx={{ ...sciFiStyle, mt: 0.5, background: emergency ? colors.emergency : "rgba(247, 118, 142, 0.15)", color: emergency ? "#1a1b26" : colors.emergency, border: `1px solid ${emergency ? "transparent" : "rgba(247, 118, 142, 0.3)"}`, "&:hover": { background: colors.emergency, color: "#1a1b26" } }}>
          <WarningIcon fontSize="small" /> Acil
        </Button>

        {/* OTONOM MOD */}
        <Box sx={{ width: "100%", mt: 0.5, py: 0.5, background: "rgba(0,0,0,0.1)", borderRadius: 2, textAlign: "center", border: `1px solid ${colors.border}` }}>
          <Typography color={colors.textMuted} sx={{ fontSize: 10, mb: 0.5 }}>OTONOM MOD</Typography>
          <Switch size="small" checked={autonomous} onChange={(e) => { const val = e.target.checked; setAutonomous(val); sendCommand(val ? "AUTONOMOUS_ON" : "AUTONOMOUS_OFF"); }} sx={{ '& .MuiSwitch-switchBase.Mui-checked': { color: colors.forward }, '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { backgroundColor: colors.forward } }} />
        </Box>

      </Box>
    </Box>
  );
}

export default ControlPanel;