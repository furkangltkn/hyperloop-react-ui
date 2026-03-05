import * as signalR from "@microsoft/signalr";

const HUB_URL = "http://localhost:5120/telemetry";

class TelemetryService {
  constructor() {
    this.connection = new signalR.HubConnectionBuilder()
      .withUrl(HUB_URL)
      .withAutomaticReconnect()
      .build();
      
    this.lastUpdateTime = 0;
    this.throttleLimit = 100; // Saniyede 10 güncelleme limiti (100ms)
  }

  start(onTelemetryReceived, onStatusChange) {
    this.connection.off("telemetry"); // Önceki dinleyicileri temizle (Memory leak önleme)
    
    this.connection.on("telemetry", (data) => {
      const now = Date.now();
      // Throttling: Belirlenen süreden önce gelen verileri yoksay
      if (now - this.lastUpdateTime > this.throttleLimit) {
        onTelemetryReceived(data);
        this.lastUpdateTime = now;
      }
    });

    this.connection.onreconnecting(() => onStatusChange("reconnecting"));
    this.connection.onreconnected(() => onStatusChange("connected"));
    this.connection.onclose(() => onStatusChange("disconnected"));

    return this.connection.start()
      .then(() => {
        console.log("SignalR connected");
        onStatusChange("connected");
      })
      .catch((err) => {
        console.error("SignalR connection error:", err);
        onStatusChange("disconnected");
      });
  }

  stop() {
    if (this.connection) this.connection.stop();
  }
}

export default new TelemetryService();