import * as signalR from "@microsoft/signalr";

const HUB_URL = "http://localhost:5120/telemetry";

const normalizeConnectionStatus = (status) => {
  if (typeof status === "boolean") {
    return {
      raspberryConnected: status,
      reason: status ? "connected" : "disconnected"
    };
  }

  if (typeof status === "string") {
    const normalized = status.trim().toLowerCase();
    const connected = ["connected", "online", "true", "1", "bagli", "bağlı"].includes(normalized);
    const disconnected = ["disconnected", "offline", "false", "0", "bagli_degil", "bağlı_değil"].includes(normalized);

    if (connected || disconnected) {
      return {
        raspberryConnected: connected,
        reason: normalized
      };
    }

    return null;
  }

  if (!status || typeof status !== "object") return null;

  const connectedValue =
    status.raspberryConnected ??
    status.RaspberryConnected ??
    status.connected ??
    status.Connected ??
    status.isConnected ??
    status.IsConnected;

  if (connectedValue === undefined || connectedValue === null) return null;

  const normalizedValue = typeof connectedValue === "string"
    ? ["connected", "online", "true", "1", "bagli", "bağlı"].includes(connectedValue.trim().toLowerCase())
    : Boolean(connectedValue);

  return {
    ...status,
    raspberryConnected: normalizedValue,
    reason: status.reason ?? status.Reason ?? (normalizedValue ? "connected" : "disconnected")
  };
};

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

  async start(onTelemetryReceived, onStatusChange, onRaspberryStatusChange) {
    console.log("SignalR start çağrıldı. State:", this.connection.state);

    this.connection.off("telemetry");
    this.connection.off("connectionStatus");

    const mergeTelemetry = (target, source) => {
      if (!source || typeof source !== "object") return target;
      Object.entries(source).forEach(([groupKey, groupValue]) => {
        if (groupValue && typeof groupValue === "object" && !Array.isArray(groupValue)) {
          if (!target[groupKey]) target[groupKey] = {};
          Object.assign(target[groupKey], groupValue);
        } else {
          target[groupKey] = groupValue;
        }
      });
      return target;
    };

    const parseCompactTelemetry = (raw) => {
      if (typeof raw !== "string") return null;

      const obj = {};
      const payload = raw.includes("|") ? raw.split("|").slice(1).join("|") : raw;
      const kvPairs = payload.split(",");

      kvPairs.forEach((pair) => {
        const [rawKey, rawValue] = pair.split(":");
        if (!rawKey || rawValue === undefined) return;

        const key = rawKey.trim();
        const value = parseFloat(rawValue);
        if (Number.isNaN(value)) return;

        if (key.toUpperCase() === "ACIL_DURUM") {
          if (!obj.emergency) obj.emergency = {};
          obj.emergency.acil_durum = value;
          return;
        }

        const match = key.match(/^([a-zA-Z]+)(\d+)$/i);
        if (!match) return;

        const prefix = match[1].toLowerCase();
        const index = match[2];

        if (prefix === "bt") {
          if (!obj.temperature) obj.temperature = {};
          obj.temperature[`bt${index}`] = value;
        } else if (prefix === "i") {
          if (!obj.current) obj.current = {};
          obj.current[`i${index}`] = value;
        } else if (prefix === "v") {
          if (!obj.voltage) obj.voltage = {};
          obj.voltage[`v${index}`] = value;
        } else if (prefix === "p") {
          if (!obj.pressure) obj.pressure = {};
          obj.pressure[`p${index}`] = value;
        }
      });

      return Object.keys(obj).length ? obj : null;
    };

    const normalizeObjectTelemetry = (payload) => {
      if (!payload || typeof payload !== "object") return null;

      const normalized = {};
      mergeTelemetry(normalized, payload);

      // Nested obje anahtarlarını normalize et (ör. BT1 -> bt1, P2 -> p2)
      ["temperature", "pressure", "current", "voltage", "motion", "power", "emergency"].forEach((groupName) => {
        const groupEntry = Object.entries(payload).find(([key]) => key.toLowerCase() === groupName);
        if (!groupEntry) return;

        const group = groupEntry[1];
        if (!group || typeof group !== "object" || Array.isArray(group)) return;

        if (!normalized[groupName]) normalized[groupName] = {};
        Object.entries(group).forEach(([k, v]) => {
          const normalizedKey = String(k).toLowerCase();
          normalized[groupName][normalizedKey] = v;
        });
      });

      // Üst seviyede gelen "P1", "BT2" gibi alanları da normalize et
      Object.entries(payload).forEach(([rawKey, rawValue]) => {
        const key = String(rawKey);
        const value = Number(rawValue);
        if (Number.isNaN(value)) return;

        const match = key.match(/^([a-zA-Z]+)(\d+)$/i);
        if (!match) return;

        const compact = parseCompactTelemetry(`${key}:${value}`);
        if (compact) mergeTelemetry(normalized, compact);
      });

      // Obje içindeki olası raw string alanlarını da parse et
      Object.values(payload).forEach((val) => {
        if (typeof val !== "string") return;
        const compact = parseCompactTelemetry(val);
        if (compact) mergeTelemetry(normalized, compact);
      });

      return Object.keys(normalized).length ? normalized : null;
    };

    this.connection.on("telemetry", (data) => {
      let parsedData = null;

      if (typeof data === "object" && data !== null) {
        parsedData = normalizeObjectTelemetry(data);
      } else if (typeof data === "string") {
        try {
          parsedData = normalizeObjectTelemetry(JSON.parse(data));
        } catch (e) {
          parsedData = parseCompactTelemetry(data);
        }
      }

      if (parsedData) onTelemetryReceived(parsedData);
    });

    this.connection.on("connectionStatus", (status) => {
      const normalizedStatus = normalizeConnectionStatus(status);

      if (normalizedStatus) {
        onRaspberryStatusChange?.(normalizedStatus);
      } else {
        console.warn("Bilinmeyen Raspberry bağlantı durumu:", status);
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
