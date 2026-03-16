import React from "react";
import { Box, Card, CardContent, Typography } from "@mui/material";

import DeviceThermostatIcon from "@mui/icons-material/DeviceThermostat";
import BoltIcon from "@mui/icons-material/Bolt";
import SpeedIcon from "@mui/icons-material/Speed";
import GpsFixedIcon from "@mui/icons-material/GpsFixed";
import OpenWithIcon from "@mui/icons-material/OpenWith";
import CompressIcon from "@mui/icons-material/Compress";
import ElectricMeterIcon from "@mui/icons-material/ElectricMeter";

import Sparkline from "./Sparkline";

function flattenTelemetry(obj, prefix = "") {
  let result = {};
  for (let key in obj) {
    if (typeof obj[key] === "object" && obj[key] !== null) {
      Object.assign(result, flattenTelemetry(obj[key], key + "."));
    } else {
      result[prefix + key] = obj[key];
    }
  }
  return result;
}

const allKeysTemplate = [
  "temperature.bt1", "temperature.bt2", "temperature.bt3",
  "current.i1", "current.i2", "current.i3",
  "voltage.v1", "voltage.v2", "voltage.v3",
  "motion.mt1", "motion.mt2", "motion.mt3",
  "motion.sx", "motion.sy", "motion.sz",
  "motion.lx", "motion.ly", "motion.lz",
  "motion.ax", "motion.ay", "motion.az",
  "pressure.p1", "power.pw1"
];

const priorityKeys = [
  "temperature.bt1", 
  "temperature.bt2", 
  "temperature.bt3", 
  "motion.sx", 
  "pressure.p1", 
  "power.pw1"
];

const labelMap = {
  "temperature.bt1": "Batarya 1 Sıcaklık",
  "temperature.bt2": "Batarya 2 Sıcaklık",
  "temperature.bt3": "Batarya 3 Sıcaklık",
  "current.i1": "Motor 1 Akım",
  "current.i2": "Motor 2 Akım",
  "current.i3": "Motor 3 Akım",
  "voltage.v1": "Motor 1 Voltaj",
  "voltage.v2": "Motor 2 Voltaj",
  "voltage.v3": "Motor 3 Voltaj",
  "motion.mt1": "Motor 1 Sıcaklık",
  "motion.mt2": "Motor 2 Sıcaklık",
  "motion.mt3": "Motor 3 Sıcaklık",
  "motion.sx": "Hız X Ekseni",
  "motion.sy": "Hız Y Ekseni",
  "motion.sz": "Hız Z Ekseni",
  "motion.lx": "Konum X",
  "motion.ly": "Konum Y",
  "motion.lz": "Konum Z",
  "motion.ax": "İvme X",
  "motion.ay": "İvme Y",
  "motion.az": "İvme Z",
  "pressure.p1": "Kapsül Basıncı",
  "power.pw1": "Genel Güç"
};

const unitMap = {
  temperature: "°C", 
  current: "A", 
  voltage: "V", 
  motion_mt: "°C", 
  motion_s: "m/s", 
  motion_l: "m", 
  motion_a: "G", 
  pressure: "kPa", 
  power: "kW"
};

function getIconComponent(key, color) {
  const style = { color: color, fontSize: 16 };
  if (key.includes("temperature") || key.includes("motion.mt")) return <DeviceThermostatIcon sx={style} />;
  if (key.includes("voltage") || key.includes("power")) return <BoltIcon sx={style} />;
  if (key.includes("current")) return <ElectricMeterIcon sx={style} />;
  if (key.includes("motion.s")) return <SpeedIcon sx={style} />;
  if (key.includes("motion.l")) return <GpsFixedIcon sx={style} />;
  if (key.includes("motion.a")) return <OpenWithIcon sx={style} />;
  if (key.includes("pressure")) return <CompressIcon sx={style} />;
  return null;
}

function getUnit(key) {
  if (key.includes("temperature")) return unitMap.temperature;
  if (key.includes("current")) return unitMap.current;
  if (key.includes("voltage")) return unitMap.voltage;
  if (key.includes("motion.mt")) return unitMap.motion_mt;
  if (key.includes("motion.s")) return unitMap.motion_s;
  if (key.includes("motion.l")) return unitMap.motion_l;
  if (key.includes("motion.a")) return unitMap.motion_a;
  if (key.includes("pressure")) return unitMap.pressure;
  if (key.includes("power")) return unitMap.power;
  return "";
}

function TelemetryPanel({ telemetry, lastUpdate, mode, darkMode = true }) {
  const flatData = flattenTelemetry(telemetry || {});

  function getStatusStyle(key, value) {
    if (value == null) return { color: darkMode ? "#565f89" : "#827566" };
    if (key.includes("temperature") && value > 60) return { color: darkMode ? "#f7768e" : "#be123c" }; 
    if (key.includes("temperature") && value > 45) return { color: darkMode ? "#e0af68" : "#b45309" }; 
    if (key.includes("voltage") && value < 20) return { color: darkMode ? "#f7768e" : "#be123c" };
    return { color: darkMode ? "#7dcfff" : "#0277bd" }; 
  }

  const keysToShow = mode === "all" ? allKeysTemplate : allKeysTemplate.filter(k => priorityKeys.includes(k));

  return (
    <Box 
      sx={{ 
        width: "100%", 
        height: "100%", 
        display: "grid", 
        gridTemplateColumns: mode === "all" ? "repeat(3, minmax(110px, 160px))" : "repeat(auto-fit, minmax(110px, 160px))", 
        gridAutoRows: "75px", 
        justifyContent: mode === "all" ? "center" : "flex-start",
        alignContent: "flex-start", 
        maxWidth: "100%", 
        margin: "0", 
        gap: 1.5, 
        padding: 1, 
        boxSizing: "border-box", 
        overflowY: "auto", 
        "&::-webkit-scrollbar": { width: "4px" }, 
        "&::-webkit-scrollbar-thumb": { background: darkMode ? "#363b54" : "#d1c6b4", borderRadius: 4 } 
      }}
    >
      {keysToShow.map(key => {
        const value = flatData[key];
        const { color } = getStatusStyle(key, value);
        const title = labelMap[key] || key.toUpperCase();
        const unit = getUnit(key);

        return (
          <Card 
            key={key} 
            sx={{ 
              position: "relative", 
              height: "100%", 
              background: darkMode ? "#1f1f2e" : "#efe7d3", 
              border: `1px solid ${darkMode ? "rgba(255,255,255,0.03)" : "rgba(67, 56, 44, 0.08)"}`, 
              borderRadius: 2, 
              display: "flex", 
              flexDirection: "column", 
              justifyContent: "center", 
              alignItems: "center", 
              boxShadow: "none" 
            }}
          >
            <Sparkline value={value} color={color} />

            <CardContent sx={{ p: "8px !important", width: "100%", display: "flex", flexDirection: "column", alignItems: "center", position: "relative", zIndex: 1 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mb: 0.5 }}>
                {getIconComponent(key, color)}
                <Typography sx={{ fontSize: 9, color: darkMode ? "#565f89" : "#827566", letterSpacing: 0.5, fontWeight: "500", textAlign: "center", whiteSpace: "nowrap" }}>
                  {title}
                </Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "baseline", gap: 0.5 }}>
                <Typography sx={{ fontSize: 18, fontWeight: "500", color: darkMode ? "#c0caf5" : "#43382c", fontFamily: "monospace" }}>
                  {value !== undefined ? value : "--"}
                </Typography>
                <Typography sx={{ fontSize: 9, color: color, opacity: 0.8 }}>
                  {value !== undefined ? unit : ""}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        );
      })}
    </Box>
  );
}

export default TelemetryPanel;