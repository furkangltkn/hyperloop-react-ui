import * as signalR from "@microsoft/signalr";

const HUB_URL = "http://localhost:5120/telemetry";

class TelemetryService {
  constructor() {
    this.connection = new signalR.HubConnectionBuilder()
      .withUrl(HUB_URL)
      .withAutomaticReconnect()
      .build();
  }

  start(onTelemetryReceived) {
    this.connection.on("telemetry", onTelemetryReceived);
    return this.connection.start();
  }

  stop() {
    if (this.connection) {
      this.connection.stop();
    }
  }
}

export default new TelemetryService();