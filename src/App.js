import React, { useEffect, useState } from "react";
import * as signalR from "@microsoft/signalr";
import TelemetryPanel from "./components/TelemetryPanel";
import ControlPanel from "./components/ControlPanel";
import { Box } from "@mui/material";

const HUB_URL = "http://localhost:5120/telemetry"; // backend portunu gerekirse değiştir

function App() {
  const [telemetry, setTelemetry] = useState({});
  const [lastUpdate, setLastUpdate] = useState(null);

  useEffect(() => {
    const connection = new signalR.HubConnectionBuilder()
      .withUrl(HUB_URL)
      .withAutomaticReconnect()
      .build();

    connection.start()
      .then(() => console.log("SignalR connected"))
      .catch(err => console.error("SignalR error:", err));

    connection.on("telemetry", data => {
      setTelemetry(data);
      setLastUpdate(new Date());
    });

    return () => {
      connection.stop();
    };
  }, []);

  return (
    <Box sx={{ width: "100vw", height: "100vh", overflow: "hidden", p: 2 }}>
      <TelemetryPanel telemetry={telemetry} lastUpdate={lastUpdate} />
      <ControlPanel />
    </Box>
  );
}

export default App;