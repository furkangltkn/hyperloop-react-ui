import React, { useEffect, useState } from "react";
import { Box, Fab, Switch, Typography } from "@mui/material";
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

    fetch("https://api.open-meteo.com/v1/forecast?latitude=41.01&longitude=28.97&current_weather=true")
      .then(r => r.json())
      .then(d => setWeather(d.current_weather.temperature + "°C"));

    return () => clearInterval(timer);
  }, []);

  const iconStyle = {
    width: "70%",
    height: "70%",
    objectFit: "contain",
    borderRadius: "50%"
  };

  const fabStyle = {
    width: 64,
    height: 64,
    padding: 0,
    overflow: "hidden"
  };

  const imgStyle = {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    borderRadius: "50%"
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>

      {/* WEATHER */}
      <Box
        sx={{
          background: "linear-gradient(180deg,#071626,#020b14)",
          color: "#0ff",
          p: 1,
          borderRadius: 2,
          textAlign: "center",
          border: "1px solid #1e3a5f",
          fontFamily: "monospace"
        }}
      >
        <Typography variant="body2">ISTANBUL</Typography>
        <Typography variant="h6">{weather}</Typography>
        <Typography variant="caption">{time.toLocaleTimeString()}</Typography>
      </Box>

      {/* STATE */}
      <Box
        sx={{
          background: "#020b14",
          color: emergency ? "red" : brake ? "orange" : "#00ff88",
          p: 1,
          borderRadius: 2,
          textAlign: "center",
          border: "1px solid #1e3a5f",
          fontFamily: "monospace"
        }}
      >
        <Typography variant="body2">SYSTEM</Typography>
        <Typography>
          {emergency ? "EMERGENCY" : brake ? "BRAKE" : "READY"}
        </Typography>
      </Box>

      {/* BUTTON PANEL */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          alignItems: "center",
          background: "linear-gradient(180deg,#050d18,#020b14)",
          padding: 2,
          borderRadius: 3,
          border: "1px solid #1e3a5f"
        }}
      >
        <Fab sx={{ ...fabStyle, background: "#0a3" }} onClick={() => sendCommand("FORWARD")}>
          <img src={forwardImg} alt="forward" style={imgStyle} />
        </Fab>
        
        <Fab
          sx={{ ...fabStyle, background: brake ? "#a00" : "#333" }}
          onClick={() => {
            setBrake(!brake);
            sendCommand("BRAKE");
          }}
        >
          <img src={stopImg} alt="stop" style={imgStyle} />
        </Fab>

        <Fab sx={{ ...fabStyle, background: "#035" }} onClick={() => sendCommand("BACKWARD")}>
          <img src={backImg} alt="back" style={imgStyle} />
        </Fab>
        
        <Fab
          sx={{ ...fabStyle, background: emergency ? "#f00" : "#aa0" }}
          onClick={() => {
            setEmergency(!emergency);
            sendCommand("EMERGENCY");
          }}
        >
          <img src={emergencyImg} alt="emergency" style={imgStyle} />
        </Fab>

        <Typography color="#0ff" fontFamily="monospace" variant="body2">
          AUTONOMOUS {autonomous ? "ON" : "OFF"}
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