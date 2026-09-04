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
const shouldKeepPreviousValue = (nextValue) => {
  // undefined: alan bu payload'da hiç yok, mevcut değeri koru.
  // null: backend alanı bu yayın turunda alamadı, değeri temizle.
  return nextValue === undefined;
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
        const nextValue = source[key];

        if (!shouldKeepPreviousValue(nextValue)) {
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
  const [raspberryStatus, setRaspberryStatus] = useState({
    raspberryConnected: false,
    reason: "not_connected"
  });
  const [now, setNow] = useState(Date.now());
  // null, Raspberry Pi'den henüz gerçek kontrol durumu alınmadığını belirtir.
  const [controlState, setControlState] = useState(null);
  
  // TEMA KONTROLÜ ARTIK BURADA! (Varsayılan: Karanlık)
  const [darkMode, setDarkMode] = useState(true); 

  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    telemetryService.start(
      (data) => {
        // Gelen veriyi mevcut telemetri durumuyla birleştirerek state'i güncelle
        setTelemetry(prev => mergeDeep({}, prev, data));
        setLastUpdate(new Date());
      },
      (status) => {
        setConnectionStatus(status);
        if (status !== "connected") {
          setControlState(null);
          setRaspberryStatus((current) => ({
            ...current,
            raspberryConnected: false,
            reason: "backend_" + status
          }));
        }
      },
      (status) => {
        setRaspberryStatus(status);
      },
      (state) => {
        setControlState(state ? { ...state } : null);
      }
    );
    return () => telemetryService.stop();
  }, []);

  const telemetryStale =
    connectionStatus !== "connected" ||
    !raspberryStatus?.raspberryConnected ||
    !lastUpdate ||
    now - lastUpdate.getTime() > 3000;

  // Bağlantı yokken veya yeni paket gelmiyorken eski ölçümleri ekranda
  // tutma. Bileşenler eksik alanları "--" olarak gösterecek.
  const displayedTelemetry = telemetryStale ? {} : telemetry;

  return (
    <BrowserRouter>
      <Layout 
        connectionStatus={connectionStatus} 
        raspberryStatus={raspberryStatus}
        telemetryStale={telemetryStale}
        lastUpdate={lastUpdate} 
        telemetry={displayedTelemetry}
        controlState={controlState}
        onControlStateChange={(state) => setControlState(state ? { ...state } : null)}
        darkMode={darkMode}           // Layout'a temayı gönderdik
        setDarkMode={setDarkMode}     // Butonun çalışması için fonksiyonu gönderdik
      >
        <Routes>
          <Route
            path="/"
            element={<PriorityView telemetry={displayedTelemetry} lastUpdate={lastUpdate} darkMode={darkMode} />}
          />
          <Route
            path="/all"
            element={<AllView telemetry={displayedTelemetry} lastUpdate={lastUpdate} darkMode={darkMode} />}
          />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
