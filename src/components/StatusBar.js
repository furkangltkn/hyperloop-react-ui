import { Box, Typography } from "@mui/material";

export default function StatusBar({ lastUpdate }) {

  const time = lastUpdate
    ? lastUpdate.toLocaleTimeString()
    : "--:--:--";

  return (
    <Box
      sx={{
        height: 34,
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",

        px: 2,

        background: "rgba(0,0,0,0.35)",
        backdropFilter: "blur(6px)",

        borderBottom: "1px solid rgba(255,255,255,0.08)",

        color: "#7dd3fc",
        fontSize: 12,
        letterSpacing: 1
      }}
    >

      <Typography fontSize={12}>
        SYSTEM ONLINE
      </Typography>

      <Typography fontSize={12}>
        SIGNALR CONNECTED
      </Typography>

      <Typography fontSize={12}>
        LATENCY 18ms
      </Typography>

      <Typography fontSize={12}>
        MODE MANUAL
      </Typography>

      <Typography fontSize={12}>
        {time}
      </Typography>

    </Box>
  );
}