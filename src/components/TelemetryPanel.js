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

function TelemetryPanel({ telemetry, lastUpdate, mode }) {
  const flatData = flattenTelemetry(telemetry);

  const allKeysTemplate = [
    "temperature.bt1","temperature.bt2","temperature.bt3",
    "current.i1","current.i2","current.i3",
    "voltage.v1","voltage.v2","voltage.v3",
    "motion.mt1","motion.mt2","motion.mt3",
    "motion.sx","motion.sy","motion.sz",
    "motion.lx","motion.ly","motion.lz",
    "motion.ax","motion.ay","motion.az"
  ];

  const priorityKeys = [
    "temperature.bt1",
    "temperature.bt2",
    "temperature.bt3",
    "motion.sx",
    "motion.sy",
    "motion.sz"
  ];

  const keysToShow =
    mode === "all"
      ? allKeysTemplate
      : allKeysTemplate.filter(k => priorityKeys.includes(k));

  const timeStr = lastUpdate
    ? lastUpdate.toLocaleTimeString()
    : "--:--:--";

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
      {keysToShow.map(key => (
        <Card
          key={key}
          sx={{
            background: "rgba(0,0,0,0.75)",
            color: "white",
            borderRadius: 1,
            border: "1px solid rgba(255,255,255,0.1)",

            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          <CardContent sx={{ textAlign: "center", p: 0.5 }}>
            <Typography variant="caption" sx={{ opacity: 0.7 }}>
              {key.toUpperCase()}
            </Typography>

            <Typography variant="body1">
              {flatData[key] ?? "--"}
            </Typography>

            <Typography variant="caption">
              {timeStr}
            </Typography>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
}

export default TelemetryPanel;