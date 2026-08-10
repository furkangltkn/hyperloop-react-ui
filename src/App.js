import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import PriorityView from "./views/PriorityView";
import AllView from "./views/AllView";
import telemetryService from "./services/telemetryService";

const isObject = (item) => item && typeof item === "object" && !Array.isArray(item);

/**
 * İki veya daha fazla nesneyi derinlemesine birleştirir.
 */
const shouldKeepPreviousValue = (prevValue, nextValue) => {
  if (nextValue === undefined || nextValue === null) return true;

  // Backend'den kart bazli placeholder 0 geldiginde mevcut degeri koru.
  if (
    typeof prevValue === "number" &&
    typeof nextValue === "number" &&
    prevValue !== 0 &&
    nextValue === 0
  ) {
    return true;
  }

  return false;
};

function mergeDeep(target, ...sources) {
  if (!sources.length) return target;
  const source = sources.shift();

  if (isObject(target) && isObject(source)) {
    for (const key in source) {
      if (isObject(source[key])) {
        if (!target[key]) Object.assign(target, { [key]: {} });
        mergeDeep(target[key], source[key]);
      } else {
        const prevValue = target[key];
        const nextValue = source[key];

        if (!shouldKeepPreviousValue(prevValue, nextValue)) {
          Object.assign(target, { [key]: nextValue });
        }
      }
    }
  }

  return mergeDeep(target, ...sources);
}

function App() {
  const [telemetry, setTelemetry] = useState({});
  const [lastUpdate, setLastUpdate] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState("disconnected");
  
  // TEMA KONTROLÜ ARTIK BURADA! (Varsayılan: Karanlık)
  const [darkMode, setDarkMode] = useState(true); 

  useEffect(() => {
    telemetryService.start(
      (data) => {
        // Gelen veriyi mevcut telemetri durumuyla birleştirerek state'i güncelle
        setTelemetry(prev => mergeDeep({}, prev, data));
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
