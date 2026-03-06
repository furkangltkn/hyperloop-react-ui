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
  
  // TEMA BİLGİSİ ARTIK EN TEPEDE
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
      {/* Layout'a tema bilgisini ve değiştirme fonksiyonunu gönderiyoruz */}
      <Layout lastUpdate={lastUpdate} darkMode={darkMode} setDarkMode={setDarkMode}>
        <Routes>
          <Route
            path="/"
            element={
              <PriorityView
                telemetry={telemetry}
                lastUpdate={lastUpdate}
                darkMode={darkMode} // Kartlara gitmesi için PriorityView'a da veriyoruz
              />
            }
          />
          <Route
            path="/all"
            element={
              <AllView
                telemetry={telemetry}
                lastUpdate={lastUpdate}
                darkMode={darkMode}
              />
            }
          />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;