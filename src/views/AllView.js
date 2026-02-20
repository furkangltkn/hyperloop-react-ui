import TelemetryPanel from "../components/TelemetryPanel";

export default function AllView({ telemetry, lastUpdate }) {
  return (
    <TelemetryPanel
      telemetry={telemetry}
      lastUpdate={lastUpdate}
      mode="all"
    />
  );
}