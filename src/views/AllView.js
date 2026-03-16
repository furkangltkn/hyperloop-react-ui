import { Box } from "@mui/material";
import TelemetryPanel from "../components/TelemetryPanel";

// darkMode prop'unu buraya da ekledik
export default function AllView({ telemetry, lastUpdate, darkMode }) {
  return (
    <Box sx={{ width: "100%", height: "100%" }}>
      <TelemetryPanel
        telemetry={telemetry}
        lastUpdate={lastUpdate}
        mode="all"
        darkMode={darkMode} // Temayı panele iletiyoruz
      />
    </Box>
  );
}