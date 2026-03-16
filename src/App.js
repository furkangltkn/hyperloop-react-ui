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
  
  // TEMA KONTROLÜ ARTIK BURADA! (Varsayılan: Karanlık)
  const [darkMode, setDarkMode] = useState(true); 

  useEffect(() => {
    telemetryService.start(
      (data) => {
        setTelemetry(data);
        setLastUpdate(new Date());
      },
      (status) => {
        setConnectionStatus(status);
      }
    );
    return () => telemetryService.stop();
  }, []);

  return (
    <BrowserRouter>
      <Layout 
        connectionStatus={connectionStatus} 
        lastUpdate={lastUpdate} 
        telemetry={telemetry}
        darkMode={darkMode}           // Layout'a temayı gönderdik
        setDarkMode={setDarkMode}     // Butonun çalışması için fonksiyonu gönderdik
      >
        <Routes>
          <Route
            path="/"
            element={<PriorityView telemetry={telemetry} lastUpdate={lastUpdate} darkMode={darkMode} />}
          />
          <Route
            path="/all"
            element={<AllView telemetry={telemetry} lastUpdate={lastUpdate} darkMode={darkMode} />}
          />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;