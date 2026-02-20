import React, { useEffect, useState } from "react";
import { Box, Fab, Switch, Typography } from "@mui/material";
import forwardImg from "../assets/forward.jpeg";
import backImg from "../assets/backward.jpeg";
import stopImg from "../assets/stop.jpg";
import emergencyImg from "../assets/emergency.jpg";
import logo from "../assets/logo.jpeg";
import { sendCommand } from "../services/commandService";

function ControlPanel() {
  const [brake, setBrake] = useState(false);
  const [emergency, setEmergency] = useState(false);
  const [autonomous, setAutonomous] = useState(false);

  const [time, setTime] = useState(new Date());
  const [weather, setWeather] = useState("--");

  const panelWidth = 120; // Tüm paneller aynı genişlikte

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);

    fetch(
      "https://api.open-meteo.com/v1/forecast?latitude=41.01&longitude=28.97&current_weather=true"
    )
      .then((r) => r.json())
      .then((d) => setWeather(d.current_weather.temperature + "°C"));

    return () => clearInterval(timer);
  }, []);

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
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 1,
        alignItems: "center"
      }}
    >
      
      {/* LOGO */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          mb: 1
        }}
      >
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
        <Typography variant="body2">ISTANBUL</Typography>
        <Typography
          sx={{
            fontSize: 22,
            fontWeight: "bold",
            color: "#6fa8ff",
            textShadow: "0 0 6px rgba(120,180,255,0.6)"
          }}
        >
          {weather}
        </Typography>

        <Typography
          sx={{
            fontSize: 14,
            letterSpacing: 1,
            color: "#9ecbff"
          }}
        >
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
        <Typography variant="body2">SYSTEM</Typography>

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
          {emergency ? "EMERGENCY" : brake ? "BRAKE" : "READY"}
        </Typography>
      </Box>

      {/* BUTTON PANEL */}
      <Box
        sx={{
          width: panelWidth,
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