import React, { useEffect, useState } from "react";
import * as signalR from "@microsoft/signalr";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import PriorityView from "./views/PriorityView";
import AllView from "./views/AllView";
import ControlPanel from "./components/ControlPanel";

const HUB_URL = "http://localhost:5120/telemetry";

function App() {

  const [telemetry, setTelemetry] = useState({});
  const [lastUpdate, setLastUpdate] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState("disconnected");
  const [autonomous, setAutonomous] = useState(false);

  useEffect(() => {

    const connection = new signalR.HubConnectionBuilder()
      .withUrl(HUB_URL)
      .withAutomaticReconnect()
      .build();

    connection.start()
      .then(() => {
        console.log("SignalR connected");
        setConnectionStatus("connected");
      })
      .catch(() => setConnectionStatus("disconnected"));

    connection.on("telemetry", data => {
      setTelemetry(data);
      setLastUpdate(new Date());
    });

    connection.onreconnecting(() => {
      setConnectionStatus("reconnecting");
    });

    connection.onreconnected(() => {
      setConnectionStatus("connected");
    });

    connection.onclose(() => {
      setConnectionStatus("disconnected");
    });

    return () => connection.stop();

  }, []);

  return (
    <BrowserRouter>
      <Layout connectionStatus={connectionStatus}>
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

        <ControlPanel />

      </Layout>
      
    </BrowserRouter>
  );
}

export default App;