import React, { useEffect, useMemo, useState } from "react";
import { Box, Button, Switch, Typography } from "@mui/material";
import KeyboardDoubleArrowUpIcon from '@mui/icons-material/KeyboardDoubleArrowUp';
import KeyboardDoubleArrowDownIcon from '@mui/icons-material/KeyboardDoubleArrowDown';
import StopIcon from '@mui/icons-material/Stop';
import WarningIcon from '@mui/icons-material/Warning';
import { sendCommand } from "../services/commandService";

const playSynthSound = (type) => {
  /* Mevcut ses fonksiyonun */
};

function ControlPanel({ darkMode = true }) {
  const [brake, setBrake] = useState(false);
  const [frontBrake, setFrontBrake] = useState(false);
  const [rearBrake, setRearBrake] = useState(false);
  const [forward, setForward] = useState(false);
  const [backward, setBackward] = useState(false);
  const [emergency, setEmergency] = useState(false);
  const [autonomous, setAutonomous] = useState(false);
  const [time, setTime] = useState(new Date());
  const [weather, setWeather] = useState("--");
  const panelWidth = 160;

  const colors = {
    forward: darkMode ? "#7dcfff" : "#0277bd",
    brake: darkMode ? "#e0af68" : "#b45309",
    emergency: darkMode ? "#f7768e" : "#be123c",
    ready: darkMode ? "#73daca" : "#0f766e",
    textMain: darkMode ? "#c0caf5" : "#43382c",
    textMuted: darkMode ? "#565f89" : "#827566",
    panelBg: darkMode ? "rgba(36, 40, 59, 0.4)" : "#efe7d3",
    border: darkMode ? "rgba(255, 255, 255, 0.05)" : "rgba(67, 56, 44, 0.12)"
  };

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    fetch("https://api.open-meteo.com/v1/forecast?latitude=41.01&longitude=28.97&current_weather=true")
      .then((r) => r.json())
      .then((d) => setWeather(d.current_weather.temperature + "°C"));
    return () => clearInterval(timer);
  }, []);

  const systemStatus = useMemo(() => {
    if (emergency) {
      return { label: "ACİL DURUM", color: colors.emergency, border: colors.emergency };
    }
    if (brake) {
      return { label: "FREN KİLİTLENDİ", color: colors.brake, border: colors.brake };
    }
    if (rearBrake) {
      return { label: "ARKA FREN KİLİTLENDİ", color: colors.brake, border: colors.brake };
    }
    if (frontBrake) {
      return { label: "ÖN FREN KİLİTLENDİ", color: colors.brake, border: colors.brake };
    }
    if (forward) {
      return { label: "İLERİ HAREKET", color: colors.forward, border: colors.forward };
    }
    if (backward) {
      return { label: "GERİ HAREKET", color: colors.forward, border: colors.forward };
    }
    if (autonomous) {
      return { label: "OTONOM MOD", color: colors.forward, border: colors.forward };
    }

    return { label: "HAZIR", color: colors.ready, border: colors.ready };
  }, [autonomous, backward, brake, colors.brake, colors.emergency, colors.forward, colors.ready, emergency, forward, frontBrake, rearBrake]);

  const sciFiStyle = {
    width: "100%", height: 48, fontWeight: "bold", letterSpacing: 1, display: "flex",
    justifyContent: "center", alignItems: "center", gap: 1, transition: "all 0.2s",
    boxSizing: "border-box", borderRadius: 2, textTransform: "none"
  };
  const exitAutonomousMode = () => {
    if (autonomous) {
      setAutonomous(false);
      sendCommand("AUTONOMOUS_OFF");
    }
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5, alignItems: "center", width: panelWidth, mb: 8 }}>

      {/* Saat ve Hava Durumu */}
      <Box sx={{ width: "100%", background: colors.panelBg, color: colors.textMain, py: 0.5, textAlign: "center", border: `1px solid ${colors.border}`, borderRadius: 2 }}>
        <Typography sx={{ fontSize: 18, fontWeight: "500", color: colors.forward, lineHeight: 1.2 }}>{weather}</Typography>
        <Typography sx={{ fontSize: 11, letterSpacing: 1, color: colors.textMuted }}>{time.toLocaleTimeString()}</Typography>
      </Box>

      {/* Sistem Durumu */}
      <Box sx={{ ...sciFiStyle, background: colors.panelBg, border: `1px solid ${systemStatus.border}`, flexDirection: "column", gap: 0, justifyContent: "center" }}>
        <Typography sx={{ fontSize: 9, color: colors.textMuted, letterSpacing: 1 }}>SİSTEM DURUMU</Typography>
        <Typography sx={{ fontSize: 13, fontWeight: "bold", letterSpacing: 1, color: systemStatus.color }}>
          {systemStatus.label}
        </Typography>
      </Box>

      {/* Ana Kontrol Grubu */}
      <Box sx={{ width: "100%", display: "flex", flexDirection: "column", gap: 1.5, alignItems: "center", background: colors.panelBg, padding: 1.5, border: `1px solid ${colors.border}`, borderRadius: 2 }}>

        {/* Ön ve Arka Fren Butonları */}
        <Box sx={{ display: "flex", gap: 1, width: "100%" }}>
          <Button
            variant="contained"
            disableElevation
            onClick={() => {
              exitAutonomousMode();
              const nextFrontBrake = !frontBrake;
              setFrontBrake(nextFrontBrake);
              if (nextFrontBrake) {
                setForward(false);
                setBackward(false);
              }
              sendCommand("FRONT_BRAKE");
            }}
            sx={{
              ...sciFiStyle,
              height: 40,
              fontSize: 10,
              background: frontBrake ? (darkMode ? "rgba(224, 175, 104, 0.25)" : "rgba(180, 83, 9, 0.25)") : "transparent",
              border: `1px solid ${colors.brake}`,
              color: colors.brake,
              flex: 1
            }}
          >
            Ön Fren
          </Button>
          <Button
            variant="contained"
            disableElevation
            onClick={() => {
              exitAutonomousMode();
              const nextRearBrake = !rearBrake;
              setRearBrake(nextRearBrake);
              if (nextRearBrake) {
                setForward(false);
                setBackward(false);
              }
              sendCommand("REAR_BRAKE");
            }}
            sx={{
              ...sciFiStyle,
              height: 40,
              fontSize: 10,
              background: rearBrake ? (darkMode ? "rgba(224, 175, 104, 0.25)" : "rgba(180, 83, 9, 0.25)") : "transparent",
              border: `1px solid ${colors.brake}`,
              color: colors.brake,
              flex: 1
            }}
          >
            Arka Fren
          </Button>
        </Box>

        <Button
          variant="contained"
          disableElevation
          onClick={() => {
            playSynthSound("forward");
            setForward(true);
            setBackward(false);
            sendCommand("FORWARD");
          }}
          sx={{
            ...sciFiStyle,
            background: forward ? (darkMode ? "rgba(125, 207, 255, 0.2)" : "rgba(2, 119, 189, 0.2)") : (darkMode ? "rgba(125, 207, 255, 0.08)" : "rgba(2, 119, 189, 0.08)"),
            border: `1px solid ${darkMode ? "rgba(125, 207, 255, 0.2)" : "rgba(2, 119, 189, 0.2)"}`,
            color: colors.forward,
            "&:hover": { background: darkMode ? "rgba(125, 207, 255, 0.15)" : "rgba(2, 119, 189, 0.15)" }
          }}
        >
          <KeyboardDoubleArrowUpIcon fontSize="small" /> İleri
        </Button>

        <Button
          variant="contained"
          disableElevation
          onClick={() => {
            playSynthSound("brake");
            exitAutonomousMode();
            const nextBrake = !brake;
            setBrake(nextBrake);
            if (nextBrake) {
              setForward(false);
              setBackward(false);
            }
            sendCommand("BRAKE");
          }}
          sx={{ ...sciFiStyle, background: brake ? (darkMode ? "rgba(224, 175, 104, 0.15)" : "rgba(180, 83, 9, 0.15)") : (darkMode ? "rgba(224, 175, 104, 0.08)" : "rgba(180, 83, 9, 0.08)"), border: `1px solid ${darkMode ? "rgba(224, 175, 104, 0.2)" : "rgba(180, 83, 9, 0.2)"}`, color: colors.brake, "&:hover": { background: darkMode ? "rgba(224, 175, 104, 0.15)" : "rgba(180, 83, 9, 0.15)" } }}
        >
          <StopIcon fontSize="small" /> Fren
        </Button>

        <Button
          variant="contained"
          disableElevation
          onClick={() => {
            playSynthSound("backward");
            setBackward(true);
            setForward(false);
            sendCommand("BACKWARD");
          }}
          sx={{
            ...sciFiStyle,
            background: backward ? (darkMode ? "rgba(125, 207, 255, 0.2)" : "rgba(2, 119, 189, 0.2)") : (darkMode ? "rgba(125, 207, 255, 0.08)" : "rgba(2, 119, 189, 0.08)"),
            border: `1px solid ${darkMode ? "rgba(125, 207, 255, 0.2)" : "rgba(2, 119, 189, 0.2)"}`,
            color: colors.forward,
            "&:hover": { background: darkMode ? "rgba(125, 207, 255, 0.15)" : "rgba(2, 119, 189, 0.15)" }
          }}
        >
          <KeyboardDoubleArrowDownIcon fontSize="small" /> Geri
        </Button>

        <Button
          variant="contained"
          disableElevation
          onClick={() => {
            playSynthSound("emergency");
            exitAutonomousMode();
            const nextEmergency = !emergency;
            setEmergency(nextEmergency);
            if (nextEmergency) {
              setForward(false);
              setBackward(false);
            }
            sendCommand("EMERGENCY");
          }}
          sx={{ ...sciFiStyle, mt: 0.5, background: emergency ? colors.emergency : (darkMode ? "rgba(247, 118, 142, 0.15)" : "rgba(190, 18, 60, 0.1)"), color: emergency ? (darkMode ? "#1a1b26" : "#ffffff") : colors.emergency, border: `1px solid ${emergency ? "transparent" : (darkMode ? "rgba(247, 118, 142, 0.3)" : "rgba(190, 18, 60, 0.3)")}`, "&:hover": { background: colors.emergency, color: darkMode ? "#1a1b26" : "#ffffff" } }}
        >
          <WarningIcon fontSize="small" /> Acil
        </Button>

        <Box sx={{ width: "100%", mt: 0.5, py: 0.5, background: "rgba(0,0,0,0.04)", borderRadius: 2, textAlign: "center", border: `1px solid ${colors.border}` }}>
          <Typography color={colors.textMuted} sx={{ fontSize: 10, mb: 0.5 }}>OTONOM MOD</Typography>
          <Switch size="small" checked={autonomous} onChange={(e) => { const val = e.target.checked; setAutonomous(val); sendCommand(val ? "AUTONOMOUS_ON" : "AUTONOMOUS_OFF"); }} sx={{ '& .MuiSwitch-switchBase.Mui-checked': { color: colors.forward }, '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { backgroundColor: colors.forward } }} />
        </Box>
      </Box>
    </Box>
  );
}

export default ControlPanel;
