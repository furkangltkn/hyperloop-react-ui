import React, { useState } from "react";
import axios from "axios";
import { Box, Fab, Switch, Typography } from "@mui/material";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import StopIcon from "@mui/icons-material/Stop";
import WarningIcon from "@mui/icons-material/Warning";

import { sendCommand } from "../services/commandService";

function ControlPanel() {
  const [brake, setBrake] = useState(false);
  const [emergency, setEmergency] = useState(false);
  const [autonomous, setAutonomous] = useState(false);

  return (
    <Box sx={{
      position: "fixed",
      right: 20,
      bottom: 20,
      display: "flex",
      flexDirection: "column",
      gap: 2,
      alignItems: "center"
    }}>
      <Fab color="success" onClick={() => sendCommand("FORWARD")}>
        <ArrowUpwardIcon />
      </Fab>

      <Fab color="primary" onClick={() => sendCommand("BACKWARD")}>
        <ArrowDownwardIcon />
      </Fab>

      <Fab color={brake ? "error" : "default"} onClick={() => {
        setBrake(!brake);
        sendCommand("BRAKE");
      }}>
        <StopIcon />
      </Fab>

      <Fab color={emergency ? "error" : "warning"} onClick={() => {
        setEmergency(!emergency);
        sendCommand("EMERGENCY");
      }}>
        <WarningIcon />
      </Fab>

      <Typography>Autonomous {autonomous ? "ON" : "OFF"}</Typography>
      <Switch
        checked={autonomous}
        onChange={(e) => {
          const val = e.target.checked;
          setAutonomous(val);
          sendCommand(val ? "AUTONOMOUS_ON" : "AUTONOMOUS_OFF");
        }}
      />
    </Box>
  );
}

export default ControlPanel;