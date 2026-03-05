import { Box, Typography } from "@mui/material";

export default function ConnectionStatus({ status }) {

  const colors = {
    connected: "#22c55e",
    reconnecting: "#facc15",
    disconnected: "#ef4444"
  };

  const labels = {
    connected: "CONNECTED",
    reconnecting: "RECONNECTING",
    disconnected: "DISCONNECTED"
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1
      }}
    >

      <Box
        sx={{
          width: 10,
          height: 10,
          borderRadius: "50%",
          background: colors[status],
          boxShadow: `0 0 10px ${colors[status]}`
        }}
      />

      <Typography
        sx={{
          color: colors[status],
          fontSize: 12,
          fontWeight: "bold",
          letterSpacing: 1
        }}
      >
        {labels[status]}
      </Typography>

    </Box>
  );
}