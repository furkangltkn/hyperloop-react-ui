import React from "react";
import { Grid, Card, CardContent, Typography } from "@mui/material";

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

function TelemetryPanel({ telemetry, lastUpdate }) {
  const flatData = flattenTelemetry(telemetry);

  const timeStr = lastUpdate
    ? lastUpdate.toLocaleTimeString()
    : "--:--:--";

  return (
    <Grid container spacing={2}>
      {Object.keys(flatData).map(key => (
        <Grid item xs={2} key={key}>
          <Card sx={{ height: 100, textAlign: "center" }}>
            <CardContent>
              <Typography variant="subtitle2">{key}</Typography>
              <Typography variant="h6">{flatData[key]}</Typography>
              <Typography variant="caption">{timeStr}</Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}

export default TelemetryPanel;