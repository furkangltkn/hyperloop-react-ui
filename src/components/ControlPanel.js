import React, { use, useEffect, useState } from "react";
import { Box, Fab, Switch, Typography } from "@mui/material";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import StopIcon from "@mui/icons-material/Stop";
import WarningIcon from "@mui/icons-material/Warning";
import forwardImg from "../assets/forward.jpeg";
import backImg from "../assets/backward.jpeg";
import stopImg from "../assets/stop.jpg";
import emergencyImg from "../assets/emergency.jpg";
import { sendCommand } from "../services/commandService";

function ControlPanel() {
  const [brake, setBrake] = useState(false);
  const [emergency, setEmergency] = useState(false);
  const [autonomous, setAutonomous] = useState(false);

  const [time, setTime] = useState(new Date());

  const [weather, setWeather] = useState("--");

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);

    fetch(
      "https://api.open-meteo.com/v1/forecast?latitude=41.01&longitude=28.97&current_weather=true"
    )
      .then((r) => r.json())
      .then((d) => setWeather(d.current_weather.temperature + "°C"));

    return () => clearInterval(timer);
  }, []);
  
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>

        {/* HAVA + SAAT KUTUSU */}
        <Box
          sx={{
            background: "#111",
            color: "white",
            p: 1,
            borderRadius: 2,
            textAlign: "center"
          }}
        >
          <Typography variant="body2">İstanbul</Typography>
          <Typography variant="h6">{weather}</Typography>
          <Typography variant="caption">{time.toLocaleTimeString()}</Typography>
        </Box>

        {/* STATE KUTUSU (şimdilik frontend state) */}
        <Box
          sx={{
            background: "#222",
            color: "white",
            p: 1,
            borderRadius: 2,
            textAlign: "center"
          }}
        >
          <Typography variant="body2">SYSTEM STATE</Typography>
          <Typography color={emergency ? "red" : brake ? "orange" : "lime"}>
            {emergency ? "EMERGENCY" : brake ? "BRAKE" : "READY"}
          </Typography>
        </Box>

        {/* CONTROL PANEL */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            alignItems: "center",
            background: "rgba(0,0,0,0.7)",
            padding: 2,
            borderRadius: 3,
            height: "fit-content"
          }}
        >
        <Fab size="medium" color="success" onClick={() => sendCommand("FORWARD")}>
          <img
            src={forwardImg}
            alt="forward"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "contain",
              borderRadius: "50%"
            }}
          />
        </Fab>
        
         <Fab
          size="medium"
          color={brake ? "error" : "default"}
          onClick={() => {
            setBrake(!brake);
            sendCommand("BRAKE");
          }}
        >
          <img
            src={stopImg}
            alt="stop"
            style={{
              width: "100",
              height: "100%",
              objectFit: "contain",
              borderRadius: "50%"
            }}
          />
        </Fab>

        <Fab size="medium" color="primary" onClick={() => sendCommand("BACKWARD")}>
          <img
            src={backImg}
            alt="back"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "contain",
              borderRadius: "50%"
            }}
          />
        </Fab>

        <Fab
          size="medium"
          color={emergency ? "error" : "warning"}
          onClick={() => {
            setEmergency(!emergency);
            sendCommand("EMERGENCY");
          }}
          >
          <img
            src={emergencyImg}
            alt="emergency"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "contain",
              borderRadius: "50%"
            }}
          />
        </Fab>

        <Typography color="white" variant="body2">
          Autonomous {autonomous ? "ON" : "OFF"}
        </Typography>

        <Switch
          size="small"
          checked={autonomous}
          onChange={(e) => {
            const val = e.target.checked;
            setAutonomous(val);
            sendCommand(val ? "AUTONOMOUS_ON" : "AUTONOMOUS_OFF");
          }}
        />
      </Box>
    </Box>
  );
}

export default ControlPanel;