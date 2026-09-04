import React from "react";
import { Box, Typography } from "@mui/material";
import NeonGauge from "../components/NeonGauge";
import MissionPanel from "../components/MissionPanel";
import NeonHorizontalBar from "../components/NeonHorizontalBar";

const powerConsumptionItems = [
  { label: "HV", key: "pw1", color: "#b388ff" },
  { label: "AS", key: "pw2", color: "#00e676" },
  { label: "AD", key: "pw3", color: "#29b6f6" },
  { label: "T", key: "pw4", color: "#ffb74d" }
];

export default function PriorityView({ telemetry, lastUpdate, darkMode }) {
  const momentarySpeed = telemetry?.motion?.sx;
  const avgSpeed = telemetry?.motion?.as;
  const posX = telemetry?.motion?.lx;
  const reflectorCount1 = telemetry?.motion?.rc1 ?? "--";
  const reflectorCount2 = telemetry?.motion?.rc2 ?? "--";
  const reflectorCount3 = telemetry?.motion?.rc3 ?? "--";

  // Stil: Matris Kutusu (Sol Panel)
  const MatrixBox = ({ value }) => (
    <Box sx={{
      flex: 1, background: "rgba(15, 23, 42, 0.4)", border: "1px solid rgba(255,255,255,0.03)",
      borderRadius: 1, display: "flex", justifyContent: "center", alignItems: "center", height: 38
    }}>
      <Typography sx={{ fontSize: 14, color: "#fff", fontWeight: "bold", fontFamily: "monospace" }}>
        {typeof value === 'number' ? value.toFixed(2) : value}
      </Typography>
    </Box>
  );

  // Stil: Küçük Veri Kutusu (Sağ Panel)
  const SmallDataBox = ({ label, value, color = "#fff" }) => (
    <Box sx={{
      flex: 1, background: "rgba(30, 41, 59, 0.5)", border: "1px solid rgba(255,255,255,0.05)",
      borderRadius: 1, display: "flex", flexDirection: "column", alignItems: "center", py: 1
    }}>
      <Typography sx={{ fontSize: 7, color: "#64748b", fontWeight: "bold", mb: 0.2, textTransform: "uppercase" }}>
        {label}
      </Typography>
      <Typography sx={{ fontSize: 12, color: color, fontWeight: "bold" }}>
        {value}{value !== "--" ? "°" : ""}
      </Typography>
    </Box>
  );

  return (
    <Box sx={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", gap: 1.5, overflow: "hidden" }}>

      {/* 1. ÜST GÖREV PANELİ */}
      <MissionPanel
        progress={telemetry?.mission?.progress}
        distanceLeft={telemetry?.mission?.distanceLeft}
        departureTime={telemetry?.mission?.departureTime}
        estimatedArrivalTime={telemetry?.mission?.estimatedArrivalTime}
        status={telemetry?.mission?.status}
      />

      {/* 2. ANA PANEL (IZGARA YAPISI) */}
      <Box sx={{ display: "grid", gridTemplateColumns: "1fr 320px", flexGrow: 1, gap: 2, minHeight: 0 }}>

        {/* SOL KOLON: NAVİGASYON */}
        <Box sx={{ display: "flex", flexDirection: "column" }}>
          <Box sx={{
            background: "rgba(26, 27, 38, 0.4)",
            p: 2.5,
            borderRadius: 2,
            border: "1px solid rgba(255,255,255,0.05)"
          }}>
            <Typography sx={{ fontSize: 11, color: "#7dcfff", fontWeight: "bold", letterSpacing: 2, mb: 2 }}>NAVİGASYON SİSTEMİ</Typography>

            <Box sx={{ display: "flex", mb: 1, ml: "100px" }}>
              {["X", "Y", "Z"].map(axis => (
                <Typography key={axis} sx={{ flex: 1, textAlign: "center", color: "#565f89", fontSize: 12, fontWeight: "bold" }}>{axis}</Typography>
              ))}
            </Box>

            {[
              { label: "HIZ (m/s)", vals: [telemetry?.motion?.sx ?? "--", telemetry?.motion?.sy ?? "--", telemetry?.motion?.sz ?? "--"] },
              { label: "KONUM (m)", vals: [posX ?? "--", telemetry?.motion?.ly ?? "--", telemetry?.motion?.lz ?? "--"] },
              { label: "İVME (a)", vals: [telemetry?.motion?.ax ?? "--", telemetry?.motion?.ay ?? "--", telemetry?.motion?.az ?? "--"] }
            ].map((row, idx) => (
              <Box key={idx} sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: idx === 2 ? 0 : 1.5 }}>
                <Typography sx={{ width: 100, color: "#94a3b8", fontSize: 11, fontWeight: "bold" }}>{row.label}</Typography>
                {row.vals.map((v, i) => <MatrixBox key={i} value={v} />)}
              </Box>
            ))}
          </Box>

          <Box sx={{ flexGrow: 1 }} />
        </Box>

        {/* SAĞ KOLON: DİKEY YERLEŞİM */}
        <Box sx={{ display: "flex", flexDirection: "column", height: "100%", minHeight: 0 }}>

          {/* Üst Grup: Barlar ve Sıcaklıklar */}
          <Box sx={{ display: "flex", flexDirection: "column", gap: 0.8, px: 1, mt: -0.5 }}>
            <Box>
              <Typography sx={{ fontSize: 9, color: "#94a3b8", mb: 0.5, textAlign: "center" }}>GÜÇ TÜKETİMİ</Typography>
              <Box sx={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 0.75 }}>
                {powerConsumptionItems.map((item) => (
                  <NeonHorizontalBar
                    key={item.key}
                    value={telemetry?.power?.[item.key]}
                    max={150}
                    label={item.label}
                    unit="kW"
                    color={item.color}
                    compact
                  />
                ))}
              </Box>
            </Box>
            <Box sx={{ display: "flex", gap: 1 }}>
              <Box sx={{ flex: 1 }}>
                <NeonHorizontalBar value={telemetry?.pressure?.p1} max={120} label="FREN BASINCI" unit="kPa" color="#29b6f6" />
              </Box>
              <Box sx={{ flex: 1 }}>
                <NeonHorizontalBar value={telemetry?.pressure?.p2} max={120} label="FREN BASINCI" unit="kPa" color="#29b6f6" />
              </Box>
            </Box>

            <Box sx={{ mt: 0.5 }}>
              <Typography sx={{ fontSize: 9, color: "#94a3b8", mb: 0.5, textAlign: "center" }}>KAPSÜL İÇ SICAKLIKLARI</Typography>
              <Box sx={{ display: "flex", gap: 0.5 }}>
                <SmallDataBox label="B1" value={telemetry?.motion?.mt1 ?? "--"} />
                <SmallDataBox label="B2" value={telemetry?.motion?.mt2 ?? "--"} />
                <SmallDataBox label="B3" value={telemetry?.motion?.mt3 ?? "--"} />
              </Box>
            </Box>

            <Box sx={{ mt: 0.5 }}>
              <Typography sx={{ fontSize: 9, color: "#94a3b8", mb: 0.5, textAlign: "center" }}>BATARYA SICAKLIKLARI</Typography>
              <Box sx={{ display: "flex", gap: 0.5 }}>
                <SmallDataBox label="YV-1" value={telemetry?.temperature?.bt3 ?? "--"} color="#4fc3f7" />
                <SmallDataBox label="YV-2" value={telemetry?.temperature?.bt10 ?? "--"} color="#4fc3f7" />
                <SmallDataBox label="Acil Durum" value={telemetry?.temperature?.bt2 ?? "--"} color="#4fc3f7" />
                <SmallDataBox label="Alt Sistem" value={telemetry?.temperature?.bt1 ?? "--"} color="#4fc3f7" />
              </Box>
            </Box>
          </Box>

          {/* Reflektör Sayacı Kutuları */}
          <Box sx={{ px: 1, mt: 1.25 }}>
            <Box sx={{ display: "flex", gap: 0.8 }}>
              {[
                { label: "REFLEKTÖR 1", value: reflectorCount1 },
                { label: "REFLEKTÖR 2", value: reflectorCount2 },
                { label: "REFLEKTÖR 3", value: reflectorCount3 }
              ].map((item) => (
                <Box
                  key={item.label}
                  sx={{
                    flex: 1,
                    background: "rgba(15, 23, 42, 0.6)",
                    border: "1px solid rgba(125, 207, 255, 0.2)",
                    borderRadius: 1,
                    py: 1,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center"
                  }}
                >
                  <Typography sx={{ fontSize: 8, color: "#7dcfff", fontWeight: "bold" }}>{item.label}</Typography>
                  <Typography sx={{ fontSize: 18, color: "#fff", fontWeight: "bold", fontFamily: "monospace" }}>{item.value}</Typography>
                </Box>
              ))}
            </Box>
          </Box>

          {/* Konum Kutusu */}
          <Box sx={{ px: 1, mt: 1.25 }}>
            <Box sx={{ background: "rgba(15, 23, 42, 0.6)", border: "1px solid rgba(125, 207, 255, 0.2)", borderRadius: 1, py: 1, display: "flex", flexDirection: "column", alignItems: "center" }}>
              <Typography sx={{ fontSize: 8, color: "#7dcfff", fontWeight: "bold" }}>KONUM (m)</Typography>
              <Typography sx={{ fontSize: 18, color: "#fff", fontWeight: "bold", fontFamily: "monospace" }}>{typeof posX === "number" ? posX.toFixed(2) : "--"}</Typography>
            </Box>
          </Box>

          {/* Esnek Boşluk */}
          <Box sx={{ flexGrow: 1, minHeight: 12 }} />

          {/* EN ALTA SABİTLENEN HIZ İBRELERİ */}
          <Box sx={{ display: "flex", gap: 1.2, px: 1, mb: 4, height: 125, flexShrink: 0 }}>
            <Box sx={{ flex: 1, background: "rgba(30, 41, 59, 0.3)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 2 }}>
              <NeonGauge value={momentarySpeed} max={300} label="ANLIK HIZ" color="#00e676" />
            </Box>
            <Box sx={{ flex: 1, background: "rgba(30, 41, 59, 0.3)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 2 }}>
              <NeonGauge value={avgSpeed} max={300} label="ORT. HIZ" color="#29b6f6" />
            </Box>
          </Box>

        </Box>
      </Box>
    </Box>
  );
}
