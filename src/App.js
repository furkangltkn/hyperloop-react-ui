import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import PriorityView from "./views/PriorityView";
import AllView from "./views/AllView";
import telemetryService from "./services/telemetryService";

function App() {
  const [telemetry, setTelemetry] = useState({});
  const [lastUpdate, setLastUpdate] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState("disconnected");

  useEffect(() => {
    // Servisi başlat ve callback'leri ver
    telemetryService.start(
      (data) => {
        setTelemetry(data);
        setLastUpdate(new Date());
      },
      (status) => {
        setConnectionStatus(status);
      }
    );

    // Component unmount olduğunda bağlantıyı temizle
    return () => telemetryService.stop();
  }, []);

  return (
    <BrowserRouter>
      {/* Layout'a gereken verileri prop olarak geçiyoruz */}
      <Layout connectionStatus={connectionStatus} lastUpdate={lastUpdate}>
        <Routes>
          <Route
            path="/"
            element={
              <PriorityView
                telemetry={telemetry}
                lastUpdate={lastUpdate}
              />
            }
          />
          <Route
            path="/all"
            element={
              <AllView
                telemetry={telemetry}
                lastUpdate={lastUpdate}
              />
            }
          />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;