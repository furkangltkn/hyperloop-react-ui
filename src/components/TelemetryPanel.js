import React from "react";
import { Box, Card, CardContent, Typography } from "@mui/material";

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

// Performans için statik dizileri bileşenin dışına taşıdık
const allKeysTemplate = [
  "temperature.bt1", "temperature.bt2", "temperature.bt3",
  "current.i1", "current.i2", "current.i3",
  "voltage.v1", "voltage.v2", "voltage.v3",
  "motion.mt1", "motion.mt2", "motion.mt3",
  "motion.sx", "motion.sy", "motion.sz",
  "motion.lx", "motion.ly", "motion.lz",
  "motion.ax", "motion.ay", "motion.az"
];

const priorityKeys = [
  "temperature.bt1",
  "temperature.bt2",
  "temperature.bt3",
  "motion.sx",
  "motion.sy",
  "motion.sz"
];

function TelemetryPanel({ telemetry, lastUpdate, mode }) {
  const flatData = flattenTelemetry(telemetry);

  function getStatusStyle(key, value) {
    if (value == null) return { color: "#888", glow: "none" };

    if (key.includes("temperature") && value > 60)
      return { color: "#ff4d4d", glow: "0 0 15px rgba(255,80,80,0.6)" };

    if (key.includes("temperature") && value > 45)
      return { color: "#facc15", glow: "0 0 12px rgba(250,204,21,0.6)" };

    if (key.includes("voltage") && value < 20)
      return { color: "#ff4d4d", glow: "0 0 15px rgba(255,80,80,0.6)" };

    return { color: "#4fc3f7", glow: "0 0 12px rgba(79,195,247,0.4)" };
  }

  const keysToShow = mode === "all"
    ? allKeysTemplate
    : allKeysTemplate.filter(k => priorityKeys.includes(k));

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gridTemplateRows: "repeat(7, 1fr)",
        gap: 1,
        padding: 1,
        boxSizing: "border-box",
        overflow: "hidden"
      }}
    >
      {keysToShow.map(key => {
        const value = flatData[key];
        const { color, glow } = getStatusStyle(key, value);

        return (
          // map fonksiyonunda her bir eleman için benzersiz bir key atadık
          <Card
            key={key}
            sx={{
              height: 80,
              borderRadius: 2,
              background: "linear-gradient(145deg,#0b1324,#05070d)",
              border: `1px solid ${color}55`,
              boxShadow: glow,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              transition: "0.3s"
            }}
          >
            <CardContent sx={{ p: 1, "&:last-child": { pb: 1 } }}>
              <Typography sx={{ fontSize: 11, color: "#94a3b8", letterSpacing: 1 }}>
                {key.toUpperCase()}
              </Typography>
              <Typography sx={{ fontSize: 22, fontWeight: "bold", color: color }}>
                {value ?? "--"}
              </Typography>
            </CardContent>
          </Card>
        );
      })}
    </Box>
  );
}

export default TelemetryPanel;