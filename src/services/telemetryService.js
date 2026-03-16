import * as signalR from "@microsoft/signalr";

const HUB_URL = "http://localhost:5120/telemetry";

class TelemetryService {
  constructor() {
    this.connection = new signalR.HubConnectionBuilder()
      .withUrl(HUB_URL, {
        withCredentials: true,
      })
      .withAutomaticReconnect()
      .configureLogging(signalR.LogLevel.Trace)
      .build();

    this.lastUpdateTime = 0;
    this.throttleLimit = 100;
  }

  async start(onTelemetryReceived, onStatusChange) {
    console.log("SignalR start çağrıldı. State:", this.connection.state);

    this.connection.off("telemetry");

    this.connection.on("telemetry", (data) => {
      console.log("Telemetry event alındı:", data);

      const now = Date.now();
      if (now - this.lastUpdateTime > this.throttleLimit) {
        onTelemetryReceived(data);
        this.lastUpdateTime = now;
      }
    });

    this.connection.onreconnecting((err) => {
      console.log("SignalR reconnecting:", err);
      onStatusChange("reconnecting");
    });

    this.connection.onreconnected((connectionId) => {
      console.log("SignalR reconnected:", connectionId);
      onStatusChange("connected");
    });

    this.connection.onclose((err) => {
      console.log("SignalR closed:", err);
      onStatusChange("disconnected");
    });

    if (this.connection.state !== signalR.HubConnectionState.Disconnected) {
      console.log("SignalR başlatılmadı çünkü state:", this.connection.state);
      return;
    }

    try {
      await this.connection.start();
      console.log("SignalR connected");
      onStatusChange("connected");
    } catch (err) {
      console.error("SignalR connection error:", err);
      onStatusChange("disconnected");
    }
  }

  async stop() {
    if (
      this.connection &&
      this.connection.state !== signalR.HubConnectionState.Disconnected
    ) {
      await this.connection.stop();
    }
  }
}

const telemetryService = new TelemetryService();
export default telemetryService;