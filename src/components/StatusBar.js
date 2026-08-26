import { useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import { keyframes } from "@emotion/react";
import ConnectionStatus from "./ConnectionStatus"; 
import { sendCommand } from "../services/commandService";

const resetPulse = keyframes`
  0% { transform: scale(0.94); box-shadow: 0 0 0 rgba(125, 211, 252, 0); }
  45% { transform: scale(1.04); box-shadow: 0 0 14px rgba(125, 211, 252, 0.65); }
  100% { transform: scale(1); box-shadow: 0 0 5px rgba(125, 211, 252, 0.25); }
`;

const resetSpin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

export default function StatusBar({ lastUpdate, connectionStatus, raspberryStatus, telemetryStale, autonomous, onResetCompleted }) {
  const [resetState, setResetState] = useState("idle");
  const isBackendConnected = connectionStatus === "connected";
  const isRaspberryConnected = Boolean(raspberryStatus?.raspberryConnected);
  const raspberryConnectionStatus = isBackendConnected
    ? isRaspberryConnected ? "connected" : "disconnected"
    : connectionStatus;

  const handleReset = async () => {
    if (resetState === "sending") return;

    if (!isBackendConnected || !isRaspberryConnected) {
      setResetState("offline");
      window.setTimeout(() => setResetState("idle"), 1800);
      return;
    }

    setResetState("sending");
    try {
      const result = await sendCommand("RESET");
      onResetCompleted?.(result.controlState);
      setResetState("success");
    } catch (error) {
      console.error("Reset komutu gönderilemedi:", error);
      setResetState("error");
    } finally {
      window.setTimeout(() => setResetState("idle"), 1800);
    }
  };

  const resetLabel = resetState === "sending"
    ? "RESETLENİYOR"
    : resetState === "success"
      ? "RESET TAMAMLANDI"
      : resetState === "offline"
        ? "BAĞLANTI YOK"
      : resetState === "error"
        ? "RESET HATASI"
        : "RESET";

  return (
    <Box
      sx={{
        height: 34,
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        position: "relative",
        pl: 2,
        pr: "220px",
        boxSizing: "border-box",
        background: "rgba(0,0,0,0.35)",
        backdropFilter: "blur(6px)",
        borderBottom: "1px solid rgba(255,255,255,0.08)",
        color: "#7dd3fc",
        fontSize: 12,
        letterSpacing: 1
      }}
    >

      <Typography fontSize={12}>
        SİSTEM AKTİF
      </Typography>

      {/* DİNAMİK BAĞLANTI GÖSTERGESİ */}
      <ConnectionStatus
        status={connectionStatus || "disconnected"}
        label={isBackendConnected ? "BACKEND BAĞLI" : "BACKEND ×"}
      />

      <ConnectionStatus
        status={raspberryConnectionStatus || "disconnected"}
        label={isRaspberryConnected ? "RPI BAĞLI" : "RPI ×"}
      />

      <ConnectionStatus
        status={telemetryStale ? "reconnecting" : "connected"}
        label={telemetryStale ? "VERİ BEKLEMEDE" : "VERİ CANLI"}
      />

      <Typography fontSize={12}>
        GECİKME 08ms
      </Typography>

      <Typography fontSize={12}>
        MOD {autonomous ? "OTONOM" : "MANUEL"}
      </Typography>

      <Button
        onClick={handleReset}
        disabled={resetState === "sending"}
        startIcon={<RestartAltIcon sx={{ fontSize: "16px !important" }} />}
        aria-label="Sistemi resetle"
        sx={{
          position: "absolute",
          right: 20,
          width: 160,
          minWidth: 160,
          height: 26,
          boxSizing: "border-box",
          px: 1.5,
          color: resetState === "error" || resetState === "offline"
            ? "#f7768e"
            : resetState === "success"
              ? "#73daca"
              : "#7dd3fc",
          border: "1px solid currentColor",
          borderRadius: 1,
          fontSize: 10,
          fontWeight: 700,
          letterSpacing: 1,
          lineHeight: 1,
          transition: "color 0.2s, background 0.2s, transform 0.12s, box-shadow 0.2s",
          animation: resetState === "sending" ? `${resetPulse} 0.65s ease-in-out infinite` : "none",
          background: resetState === "success" ? "rgba(115, 218, 202, 0.16)" : "transparent",
          "&:active": {
            transform: "scale(0.9)",
            background: "rgba(125, 211, 252, 0.24)"
          },
          "& .MuiButton-startIcon": {
            animation: resetState === "sending" ? `${resetSpin} 0.7s linear infinite` : "none"
          },
          "&:hover": {
            background: "rgba(125, 211, 252, 0.12)",
            border: "1px solid currentColor"
          },
          "&.Mui-disabled": {
            color: "rgba(125, 211, 252, 0.35)",
            borderColor: "rgba(125, 211, 252, 0.2)"
          }
        }}
      >
        {resetLabel}
      </Button>

    </Box>
  );
}
