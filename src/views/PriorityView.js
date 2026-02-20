import TelemetryPanel from "../components/TelemetryPanel";

export default function PriorityView({ telemetry, lastUpdate }) {
  return (
    <TelemetryPanel
      telemetry={telemetry}
      lastUpdate={lastUpdate}
      mode="priority"
    />
  );
}