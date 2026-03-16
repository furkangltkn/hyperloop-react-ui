import { Box } from "@mui/material";
import TelemetryPanel from "../components/TelemetryPanel";
import NeonGauge from "../components/NeonGauge";
import NeonTempBar from "../components/NeonTempBar";
import MissionPanel from "../components/MissionPanel";
import NeonHorizontalBar from "../components/NeonHorizontalBar"; 

// darkMode eklendi
export default function PriorityView({ telemetry, lastUpdate, darkMode }) {
  const progress = telemetry?.mission?.progress ?? 0;
  const distanceLeft = telemetry?.mission?.distanceLeft ?? 850; 
  
  const speedX = telemetry?.motion?.sx ?? 0;
  const batTemp1 = telemetry?.temperature?.bt1 ?? 0;
  const batTemp2 = telemetry?.temperature?.bt2 ?? 0;
  const batTemp3 = telemetry?.temperature?.bt3 ?? 0;
  
  const pressure = telemetry?.pressure?.p1 ?? 0; 
  const power = telemetry?.power?.pw1 ?? 0;

  return (
    <Box sx={{ width: "100%", height: "100%", display: "flex", flexDirection: "column" }}>
      <MissionPanel progress={progress} distanceLeft={distanceLeft} />

      <Box sx={{ display: "grid", gridTemplateColumns: "1fr 280px", flexGrow: 1, gap: 2, mt: 2, boxSizing: "border-box" }}>
        <Box sx={{ height: "100%" }}>
          {/* darkMode'u panele iletiyoruz */}
          <TelemetryPanel telemetry={telemetry} lastUpdate={lastUpdate} mode="priority" darkMode={darkMode} />
        </Box>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, height: "100%" }}>
          <Box sx={{ height: 160 }}>
            <NeonGauge value={speedX} max={300} label="HIZ" unit="M/S" color={darkMode ? "#00e676" : "#059669"} />
          </Box>

          <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
             <NeonHorizontalBar value={power} max={150} label="GÜÇ TÜKETİMİ" unit="kW" color={darkMode ? "#b388ff" : "#7c3aed"} />
             <NeonHorizontalBar value={pressure} max={120} label="KAPSÜL BASINCI" unit="kPa" color={darkMode ? "#29b6f6" : "#0284c7"} />
          </Box>

          <Box sx={{ flexGrow: 1 }} />

          <Box sx={{ height: 140, display: "flex", justifyContent: "space-between", gap: 1 }}>
            <NeonTempBar value={batTemp1} label="BAT 1" />
            <NeonTempBar value={batTemp2} label="BAT 2" />
            <NeonTempBar value={batTemp3} label="BAT 3" />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}