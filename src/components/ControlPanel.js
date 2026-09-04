import React, { useEffect, useMemo, useState } from "react";
import { Box, Button, Switch, Typography } from "@mui/material";
import KeyboardDoubleArrowUpIcon from '@mui/icons-material/KeyboardDoubleArrowUp';
import KeyboardDoubleArrowDownIcon from '@mui/icons-material/KeyboardDoubleArrowDown';
import StopIcon from '@mui/icons-material/Stop';
import WarningIcon from '@mui/icons-material/Warning';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { sendCommand } from "../services/commandService";

const playSynthSound = (type) => {
  /* Mevcut ses fonksiyonun */
};

function ControlPanel({ darkMode = true, controlState = {}, hardwareEmergencyActive = false, autonomousDrive, onControlStateChange, raspberryConnected = false }) {
  const controlStateSynced = controlState != null;
  const currentState = controlState ?? {};
  const brake = Boolean(currentState.brake);
  const frontBrake = Boolean(currentState.frontBrake);
  const rearBrake = Boolean(currentState.rearBrake);
  const forward = Boolean(currentState.forward);
  const backward = Boolean(currentState.backward);
  const emergency = Boolean(currentState.emergency);
  const autonomous = Boolean(currentState.autonomous);
  const vfdHz = Number.isFinite(Number(currentState.vfdHz)) ? Number(currentState.vfdHz) : 0;
  const [time, setTime] = useState(new Date());
  const [commandPending, setCommandPending] = useState(false);
  const panelWidth = 160;
  const commandDisabled = !raspberryConnected || !controlStateSynced || commandPending;

  const colors = {
    forward: darkMode ? "#7dcfff" : "#0277bd",
    brake: darkMode ? "#e0af68" : "#b45309",
    emergency: darkMode ? "#f7768e" : "#be123c",
    ready: darkMode ? "#73daca" : "#0f766e",
    textMain: darkMode ? "#c0caf5" : "#43382c",
    textMuted: darkMode ? "#565f89" : "#827566",
    panelBg: darkMode ? "rgba(36, 40, 59, 0.4)" : "#efe7d3",
    border: darkMode ? "rgba(255, 255, 255, 0.05)" : "rgba(67, 56, 44, 0.12)"
  };

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const systemStatus = useMemo(() => {
    if (!controlStateSynced) {
      return { label: "DURUM SENKRONİZE EDİLİYOR", color: colors.textMuted, border: colors.textMuted };
    }
    /*
    // Otomatik acil durum backend'de aktif edilince bu blok açılacak.
    // Backend controlState.autoEmergencyActive:true gönderdiğinde sistem durumu
    // manuel/donanım acilden ayrı olarak "A. ACİL DURUM" gösterecek.
    if (Boolean(currentState.autoEmergencyActive)) {
      return { label: "A. ACİL DURUM", color: colors.emergency, border: colors.emergency };
    }
    */
    if (hardwareEmergencyActive) {
      return { label: "D. ACİL DURUM", color: colors.emergency, border: colors.emergency };
    }
    if (emergency) {
      return { label: "ACİL DURUM", color: colors.emergency, border: colors.emergency };
    }
    if (autonomous) {
      const feedback = [
        { active: Number(autonomousDrive?.f) === 1, label: "OTONOM MOD İLERİ", color: colors.forward },
        { active: Number(autonomousDrive?.b) === 1, label: "OTONOM MOD GERİ", color: colors.forward },
        { active: Number(autonomousDrive?.br) === 1, label: "OTONOM MOD FREN", color: colors.brake },
        { active: Number(autonomousDrive?.e) === 1, label: "OTONOM BOŞTA", color: colors.ready }
      ];
      const activeFeedback = feedback.filter(({ active }) => active);
      const hasCompleteFeedback = ["f", "b", "br", "e"].every(
        (key) => Number(autonomousDrive?.[key]) === 0 || Number(autonomousDrive?.[key]) === 1
      );

      if (!hasCompleteFeedback) {
        return { label: "OTONOM DURUM BEKLENİYOR", color: colors.forward, border: colors.forward };
      }
      if (activeFeedback.length !== 1) {
        return { label: "OTONOM DURUM HATASI", color: colors.emergency, border: colors.emergency };
      }

      return { ...activeFeedback[0], border: activeFeedback[0].color };
    }
    if (brake) {
      return { label: "FREN KİLİTLENDİ", color: colors.brake, border: colors.brake };
    }
    if (rearBrake) {
      return { label: "ARKA FREN KİLİTLENDİ", color: colors.brake, border: colors.brake };
    }
    if (frontBrake) {
      return { label: "ÖN FREN KİLİTLENDİ", color: colors.brake, border: colors.brake };
    }
    if (forward) {
      return { label: "İLERİ HAREKET", color: colors.forward, border: colors.forward };
    }
    if (backward) {
      return { label: "GERİ HAREKET", color: colors.forward, border: colors.forward };
    }
    return { label: "HAZIR", color: colors.ready, border: colors.ready };
  }, [autonomous, autonomousDrive, backward, brake, colors.brake, colors.emergency, colors.forward, colors.ready, colors.textMuted, controlStateSynced, emergency, forward, frontBrake, hardwareEmergencyActive, rearBrake]);

  const sciFiStyle = {
    width: "100%", height: 44, fontWeight: "bold", letterSpacing: 1, display: "flex",
    justifyContent: "center", alignItems: "center", gap: 1, transition: "all 0.2s",
    boxSizing: "border-box", borderRadius: 2, textTransform: "none"
  };
  const runCommand = async (command) => {
    if (commandDisabled) return false;

    setCommandPending(true);
    try {
      const result = await sendCommand(command);
      if (result.controlState) onControlStateChange?.(result.controlState);
      return true;
    } catch (error) {
      console.error(`${command} komutu gönderilemedi:`, error);
      return false;
    } finally {
      setCommandPending(false);
    }
  };

  const exitAutonomousMode = async () => {
    if (autonomous) {
      return await runCommand("AUTONOMOUS_OFF");
    }

    return true;
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 1, alignItems: "center", width: panelWidth, mb: 1, flexShrink: 0 }}>

      {/* Yerel tarih ve saat */}
      <Box sx={{ width: "100%", background: colors.panelBg, color: colors.textMain, py: 0.5, textAlign: "center", border: `1px solid ${colors.border}`, borderRadius: 2 }}>
        <Typography sx={{ fontSize: 13, fontWeight: "500", color: colors.forward, lineHeight: 1.4 }}>
          {time.toLocaleDateString("tr-TR", { day: "2-digit", month: "2-digit", year: "numeric" })}
        </Typography>
        <Typography sx={{ fontSize: 11, letterSpacing: 1, color: colors.textMuted }}>{time.toLocaleTimeString()}</Typography>
      </Box>

      {/* Sistem Durumu */}
      <Box sx={{ ...sciFiStyle, background: colors.panelBg, border: `1px solid ${systemStatus.border}`, flexDirection: "column", gap: 0, justifyContent: "center" }}>
        <Typography sx={{ fontSize: 9, color: colors.textMuted, letterSpacing: 1 }}>SİSTEM DURUMU</Typography>
        <Typography sx={{ fontSize: 13, fontWeight: "bold", letterSpacing: 1, color: systemStatus.color }}>
          {systemStatus.label}
        </Typography>
      </Box>

      {/* VFD frekans kontrolü */}
      <Box sx={{ width: "100%", background: colors.panelBg, padding: 1, border: `1px solid ${colors.border}`, borderRadius: 2, boxSizing: "border-box" }}>
        <Typography sx={{ mb: 1, fontSize: 9, color: colors.textMuted, letterSpacing: 1, textAlign: "center" }}>
          VFD FREKANSI
        </Typography>
        <Box sx={{ display: "grid", gridTemplateColumns: "28px minmax(0, 1fr) 28px", gap: 0.75, alignItems: "center" }}>
          <Button
            aria-label="VFD frekansını 5 Hz azalt"
            disabled={commandDisabled || vfdHz <= 0}
            onClick={() => runCommand("VFD_DECREASE")}
            sx={{ minWidth: 28, width: 28, height: 32, padding: 0, border: `1px solid ${colors.forward}`, color: colors.forward }}
          >
            <RemoveIcon fontSize="small" />
          </Button>
          <Box sx={{ minWidth: 0, height: 32, px: 0.5, display: "flex", alignItems: "center", justifyContent: "center", border: `1px solid ${colors.forward}`, borderRadius: 1, background: darkMode ? "rgba(125, 207, 255, 0.08)" : "rgba(2, 119, 189, 0.08)" }}>
            <Typography noWrap sx={{ fontSize: 16, lineHeight: 1, fontWeight: "bold", color: colors.forward }}>
              {controlStateSynced ? `${vfdHz} Hz` : "--"}
            </Typography>
          </Box>
          <Button
            aria-label="VFD frekansını 5 Hz artır"
            disabled={commandDisabled || vfdHz >= 50 || brake || emergency}
            onClick={() => runCommand("VFD_INCREASE")}
            sx={{ minWidth: 28, width: 28, height: 32, padding: 0, border: `1px solid ${colors.forward}`, color: colors.forward }}
          >
            <AddIcon fontSize="small" />
          </Button>
        </Box>
      </Box>

      {/* Ana Kontrol Grubu */}
      <Box sx={{ width: "100%", display: "flex", flexDirection: "column", gap: 1, alignItems: "center", background: colors.panelBg, padding: 1, border: `1px solid ${colors.border}`, borderRadius: 2, boxSizing: "border-box" }}>

        {/* Ön ve Arka Fren Butonları */}
        <Box sx={{ display: "flex", gap: 1, width: "100%" }}>
          <Button
            variant="contained"
            disableElevation
            disabled={commandDisabled}
            onClick={async () => {
              if (!await exitAutonomousMode()) return;
              await runCommand("FRONT_BRAKE");
            }}
            sx={{
              ...sciFiStyle,
              height: 40,
              fontSize: 10,
              background: frontBrake ? (darkMode ? "rgba(224, 175, 104, 0.25)" : "rgba(180, 83, 9, 0.25)") : "transparent",
              border: `1px solid ${colors.brake}`,
              color: colors.brake,
              flex: 1
            }}
          >
            Ön Fren
          </Button>
          <Button
            variant="contained"
            disableElevation
            disabled={commandDisabled}
            onClick={async () => {
              if (!await exitAutonomousMode()) return;
              await runCommand("REAR_BRAKE");
            }}
            sx={{
              ...sciFiStyle,
              height: 40,
              fontSize: 10,
              background: rearBrake ? (darkMode ? "rgba(224, 175, 104, 0.25)" : "rgba(180, 83, 9, 0.25)") : "transparent",
              border: `1px solid ${colors.brake}`,
              color: colors.brake,
              flex: 1
            }}
          >
            Arka Fren
          </Button>
        </Box>

        <Button
          variant="contained"
          disableElevation
          disabled={commandDisabled}
          onClick={async () => {
            playSynthSound("forward");
            await runCommand("FORWARD");
          }}
          sx={{
            ...sciFiStyle,
            background: forward ? (darkMode ? "rgba(125, 207, 255, 0.2)" : "rgba(2, 119, 189, 0.2)") : (darkMode ? "rgba(125, 207, 255, 0.08)" : "rgba(2, 119, 189, 0.08)"),
            border: `1px solid ${darkMode ? "rgba(125, 207, 255, 0.2)" : "rgba(2, 119, 189, 0.2)"}`,
            color: colors.forward,
            "&:hover": { background: darkMode ? "rgba(125, 207, 255, 0.15)" : "rgba(2, 119, 189, 0.15)" }
          }}
        >
          <KeyboardDoubleArrowUpIcon fontSize="small" /> İleri
        </Button>

        <Button
          variant="contained"
          disableElevation
          disabled={commandDisabled}
          onClick={async () => {
            playSynthSound("brake");
            if (!await exitAutonomousMode()) return;
            await runCommand("BRAKE");
          }}
          sx={{ ...sciFiStyle, background: brake ? (darkMode ? "rgba(224, 175, 104, 0.15)" : "rgba(180, 83, 9, 0.15)") : (darkMode ? "rgba(224, 175, 104, 0.08)" : "rgba(180, 83, 9, 0.08)"), border: `1px solid ${darkMode ? "rgba(224, 175, 104, 0.2)" : "rgba(180, 83, 9, 0.2)"}`, color: colors.brake, "&:hover": { background: darkMode ? "rgba(224, 175, 104, 0.15)" : "rgba(180, 83, 9, 0.15)" } }}
        >
          <StopIcon fontSize="small" /> Fren
        </Button>

        <Button
          variant="contained"
          disableElevation
          disabled={commandDisabled}
          onClick={async () => {
            playSynthSound("backward");
            await runCommand("BACKWARD");
          }}
          sx={{
            ...sciFiStyle,
            background: backward ? (darkMode ? "rgba(125, 207, 255, 0.2)" : "rgba(2, 119, 189, 0.2)") : (darkMode ? "rgba(125, 207, 255, 0.08)" : "rgba(2, 119, 189, 0.08)"),
            border: `1px solid ${darkMode ? "rgba(125, 207, 255, 0.2)" : "rgba(2, 119, 189, 0.2)"}`,
            color: colors.forward,
            "&:hover": { background: darkMode ? "rgba(125, 207, 255, 0.15)" : "rgba(2, 119, 189, 0.15)" }
          }}
        >
          <KeyboardDoubleArrowDownIcon fontSize="small" /> Geri
        </Button>

        <Button
          variant="contained"
          disableElevation
          disabled={commandDisabled}
          onClick={async () => {
            playSynthSound("emergency");
            /*
            // Otomatik acil durum latch'i aktifken kullanıcı Acil butonuna bir kere
            // basınca çıkış niyeti gönderilecek. Donanım tarafında EMERGENCY toggle
            // gibi çalışıyorsa bu tek basış otomatik acilden çıkış için yeterli olur.
            if (Boolean(currentState.autoEmergencyActive)) {
              await runCommand("EMERGENCY");
              return;
            }
            */
            if (!await exitAutonomousMode()) return;
            await runCommand("EMERGENCY");
          }}
          sx={{ ...sciFiStyle, mt: 0.5, background: emergency ? colors.emergency : (darkMode ? "rgba(247, 118, 142, 0.15)" : "rgba(190, 18, 60, 0.1)"), color: emergency ? (darkMode ? "#1a1b26" : "#ffffff") : colors.emergency, border: `1px solid ${emergency ? "transparent" : (darkMode ? "rgba(247, 118, 142, 0.3)" : "rgba(190, 18, 60, 0.3)")}`, "&:hover": { background: colors.emergency, color: darkMode ? "#1a1b26" : "#ffffff" } }}
        >
          <WarningIcon fontSize="small" /> Acil
        </Button>

        <Box sx={{ width: "100%", mt: 0.5, py: 0.5, background: "rgba(0,0,0,0.04)", borderRadius: 2, textAlign: "center", border: `1px solid ${colors.border}` }}>
          <Typography color={colors.textMuted} sx={{ fontSize: 10, mb: 0.5 }}>OTONOM MOD</Typography>
          <Switch
            size="small"
            checked={autonomous}
            disabled={commandDisabled}
            onChange={async (e) => {
              const val = e.target.checked;
              await runCommand(val ? "AUTONOMOUS_ON" : "AUTONOMOUS_OFF");
            }}
            sx={{ '& .MuiSwitch-switchBase.Mui-checked': { color: colors.forward }, '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { backgroundColor: colors.forward } }}
          />
        </Box>
      </Box>
    </Box>
  );
}

export default ControlPanel;
