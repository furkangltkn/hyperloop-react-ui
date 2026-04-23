import React from "react";
import { Box, Typography } from "@mui/material";
import NeonGauge from "./NeonGauge";
import NeonHorizontalBar from "./NeonHorizontalBar";

const getVal = (obj, path, fallback = 0) => {
  const val = path.split('.').reduce((acc, part) => acc && acc[part], obj);
  return val !== undefined ? val : fallback;
};

export default function TelemetryPanel({ telemetry, mode, darkMode = true }) {
  
  // Stil: Matris Kutusu
  const MatrixBox = ({ value, unit = "" }) => (
    <Box sx={{ 
      flex: 1, background: "rgba(15, 23, 42, 0.4)", border: "1px solid rgba(255,255,255,0.03)", 
      borderRadius: 1, display: "flex", justifyContent: "center", alignItems: "center", height: 38 
    }}>
      <Typography sx={{ fontSize: 14, color: "#fff", fontWeight: "bold", fontFamily: "monospace" }}>
        {typeof value === 'number' ? value.toFixed(2) : value}{unit}
      </Typography>
    </Box>
  );

  // Stil: Küçük Veri Kutusu
  const SmallDataBox = ({ label, value, color = "#fff" }) => (
    <Box sx={{ 
      flex: 1, background: "rgba(30, 41, 59, 0.5)", border: "1px solid rgba(255,255,255,0.05)", 
      borderRadius: 1, display: "flex", flexDirection: "column", alignItems: "center", py: 0.8, minWidth: 42
    }}>
      {label && <Typography sx={{ fontSize: 7, color: "#64748b", fontWeight: "bold" }}>{label}</Typography>}
      <Typography sx={{ fontSize: 11, color: color, fontWeight: "bold", fontFamily: "monospace" }}>{value}</Typography>
    </Box>
  );

  // Grup Başlığı
  const GroupHeader = ({ title }) => (
    <Box sx={{ background: "rgba(255,255,255,0.05)", py: 0.5, px: 2, borderRadius: 1, mb: 1.5, width: "fit-content" }}>
      <Typography sx={{ fontSize: 10, color: "#bb9af7", fontWeight: "bold", letterSpacing: 1 }}>{title}</Typography>
    </Box>
  );

  if (mode === "priority") return null;

  return (
    <Box sx={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", p: 1, gap: 1.5, boxSizing: "border-box" }}>
      
      <Box sx={{ display: "grid", gridTemplateColumns: "1fr 320px", flexGrow: 1, gap: 2, minHeight: 0 }}>
        
        {/* SOL KOLON: NAVİGASYON + KAYDIRILABİLİR BATARYA DETAYLARI */}
        <Box sx={{ 
          height: "100%", display: "flex", flexDirection: "column", gap: 2, 
          overflowY: "auto", pr: 1,
          "&::-webkit-scrollbar": { width: "4px" },
          "&::-webkit-scrollbar-thumb": { background: "rgba(255,255,255,0.1)", borderRadius: 4 }
        }}>
          
          {/* 1. NAVİGASYON SİSTEMİ */}
          <Box sx={{ background: "rgba(26, 27, 38, 0.4)", p: 2.5, borderRadius: 2, border: "1px solid rgba(255,255,255,0.05)" }}>
            <Typography sx={{ fontSize: 11, color: "#7dcfff", fontWeight: "bold", letterSpacing: 2, mb: 2 }}>NAVİGASYON SİSTEMİ</Typography>
            <Box sx={{ display: "flex", mb: 1, ml: "100px" }}>
              {["X", "Y", "Z"].map(axis => <Typography key={axis} sx={{ flex: 1, textAlign: "center", color: "#565f89", fontSize: 12, fontWeight: "bold" }}>{axis}</Typography>)}
            </Box>
            {[
              { label: "HIZ (m/s)", vals: ["motion.sx", "motion.sy", "motion.sz"] },
              { label: "KONUM (m)", vals: ["motion.lx", "motion.ly", "motion.lz"] },
              { label: "İVME (g)", vals: ["motion.ax", "motion.ay", "motion.az"] }
            ].map((row, idx) => (
              <Box key={idx} sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: idx === 2 ? 0 : 1.5 }}>
                <Typography sx={{ width: 100, color: "#94a3b8", fontSize: 11, fontWeight: "bold" }}>{row.label}</Typography>
                {row.vals.map((path, i) => <MatrixBox key={i} value={getVal(telemetry, path)} />)}
              </Box>
            ))}
          </Box>

          {/* 2. BATARYA SICAKLIK GRUBU */}
          <Box sx={{ background: "rgba(26, 27, 38, 0.4)", p: 2, borderRadius: 2, border: "1px solid rgba(255,255,255,0.05)" }}>
            <GroupHeader title="BATARYA SICAKLIK" />
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
              <Typography sx={{ width: 80, fontSize: 10, color: "#565f89", fontWeight: "bold" }}>HV1:</Typography>
              {[1,2,3,4,5,6,7].map(i => <SmallDataBox key={i} value={getVal(telemetry, `temperature.bt${i}`, "--")} />)}
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
              <Typography sx={{ width: 80, fontSize: 10, color: "#565f89", fontWeight: "bold" }}>HV2:</Typography>
              {[8,9,10,11,12,13,14].map(i => <SmallDataBox key={i} value={getVal(telemetry, `temperature.bt${i}`, "--")} color="#4fc3f7" />)}
            </Box>
            {/* Alt Sistem & Acil Durum Satırı */}
            <Box sx={{ display: "flex", gap: 4, ml: 1, mt: 1 }}>
              <Typography sx={{ fontSize: 10, color: "#565f89", fontWeight: "bold" }}>Alt Sistem: <span style={{color: "#00e676"}}>{getVal(telemetry, "temperature.bt15", "--")}</span></Typography>
              <Typography sx={{ fontSize: 10, color: "#565f89", fontWeight: "bold" }}>Acil Durum: <span style={{color: "#7dcfff"}}>{getVal(telemetry, "temperature.bt16", "--")}</span></Typography>
            </Box>
          </Box>

          {/* 3. BATARYA VOLTAJ GRUBU */}
          <Box sx={{ background: "rgba(26, 27, 38, 0.4)", p: 2, borderRadius: 2, border: "1px solid rgba(255,255,255,0.05)" }}>
            <GroupHeader title="BATARYA VOLTAJ" />
            {[1, 2].map(rowIdx => (
              <Box key={rowIdx} sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                <Typography sx={{ width: 80, fontSize: 10, color: "#565f89", fontWeight: "bold" }}>HV{rowIdx}:</Typography>
                {[...Array(7)].map((_, i) => <SmallDataBox key={i} value="--" />)}
              </Box>
            ))}
            {/* Alt Sistem & Acil Durum Satırı */}
            <Box sx={{ display: "flex", gap: 4, ml: 1, mt: 1 }}>
              <Typography sx={{ fontSize: 10, color: "#565f89", fontWeight: "bold" }}>Alt Sistem: <span style={{color: "#00e676"}}>--</span></Typography>
              <Typography sx={{ fontSize: 10, color: "#565f89", fontWeight: "bold" }}>Acil Durum: <span style={{color: "#7dcfff"}}>--</span></Typography>
            </Box>
          </Box>

          {/* 4. BATARYA AKIM GRUBU */}
          <Box sx={{ background: "rgba(26, 27, 38, 0.4)", p: 2, borderRadius: 2, border: "1px solid rgba(255,255,255,0.05)" }}>
            <GroupHeader title="BATARYA AKIM" />
            <Box sx={{ display: "flex", gap: 4, ml: 2 }}>
              <Typography sx={{ fontSize: 10, color: "#565f89", fontWeight: "bold" }}>HV: <span style={{color: "#fff"}}>--</span></Typography>
              <Typography sx={{ fontSize: 10, color: "#565f89", fontWeight: "bold" }}>Alt Sistem: <span style={{color: "#00e676"}}>--</span></Typography>
              <Typography sx={{ fontSize: 10, color: "#565f89", fontWeight: "bold" }}>Acil Durum: <span style={{color: "#7dcfff"}}>--</span></Typography>
            </Box>
          </Box>
        </Box>

        {/* SAĞ PANEL: PRİORİTY TASARIMI */}
        <Box sx={{ display: "flex", flexDirection: "column", height: "100%", overflow: "hidden" }}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5, px: 1 }}>
             <Box sx={{ display: "flex", flexDirection: "column", gap: 1.2 }}>
                <NeonHorizontalBar value={getVal(telemetry, "power.pw1")} max={150} label="GÜÇ TÜKETİMİ" unit="kW" color="#b388ff" />
                <NeonHorizontalBar value={getVal(telemetry, "pressure.p1")} max={120} label="FREN BASINCI" unit="kPa" color="#29b6f6" />
             </Box>
             <Box>
                <Typography sx={{ fontSize: 9, color: "#94a3b8", mb: 0.5, textAlign: "center" }}>KAPSÜL İÇ SICAKLIKLARI</Typography>
                <Box sx={{ display: "flex", gap: 0.5 }}>
                   <SmallDataBox label="B1" value={getVal(telemetry, "temperature.ct1", "--")} />
                   <SmallDataBox label="B2" value={getVal(telemetry, "temperature.ct2", "--")} />
                   <SmallDataBox label="B3" value={getVal(telemetry, "temperature.ct3", "--")} />
                </Box>
             </Box>
             <Box>
                <Typography sx={{ fontSize: 9, color: "#94a3b8", mb: 0.5, textAlign: "center" }}>BATARYA SICAKLIKLARI</Typography>
                <Box sx={{ display: "flex", gap: 0.5 }}>
                   <SmallDataBox label="YV-1" value={getVal(telemetry, "temperature.bt1", "--")} color="#4fc3f7" />
                   <SmallDataBox label="YV-2" value={getVal(telemetry, "temperature.bt2", "--")} color="#4fc3f7" />
                   <SmallDataBox label="Acil Durum" value={getVal(telemetry, "temperature.bt3", "--")} color="#4fc3f7" />
                   <SmallDataBox label="Alt Sistem " value={getVal(telemetry, "temperature.bt4", "--")} color="#4fc3f7" />
                </Box>
             </Box>
          </Box>
          
          {/* REFLEKTÖR SAYACI KUTUSU */}
          <Box sx={{ px: 1, mt: 2 }}>
            <Box sx={{ background: "rgba(15, 23, 42, 0.6)", border: "1px solid rgba(125, 207, 255, 0.2)", borderRadius: 1, py: 1, display: "flex", flexDirection: "column", alignItems: "center" }}>
                <Typography sx={{ fontSize: 8, color: "#7dcfff", fontWeight: "bold", letterSpacing: 1 }}>REFLEKTÖR SAYACI</Typography>
                <Typography sx={{ fontSize: 18, color: "#fff", fontWeight: "bold", fontFamily: "monospace" }}>
                  {getVal(telemetry, "navigation.reflectorCount", 0)}
                </Typography>
            </Box>
          </Box>
          
          {/* KONUM KUTUSU */}
          <Box sx={{ px: 1, mt: 2 }}>
             <Box sx={{ background: "rgba(15, 23, 42, 0.6)", border: "1px solid rgba(125, 207, 255, 0.2)", borderRadius: 1, py: 1, display: "flex", flexDirection: "column", alignItems: "center" }}>
                <Typography sx={{ fontSize: 8, color: "#7dcfff", fontWeight: "bold", letterSpacing: 1 }}>KONUM (m)</Typography>
                <Typography sx={{ fontSize: 18, color: "#fff", fontWeight: "bold", fontFamily: "monospace" }}>{getVal(telemetry, "motion.lx").toFixed(2)}</Typography>
             </Box>
          </Box>


          <Box sx={{ flexGrow: 1, minHeight: "20px" }} />

          {/* HIZ KUTULARI */}
          <Box sx={{ display: "flex", gap: 1.2, px: 1, pb: 9.5, height: 125, alignItems: "center", justifyContent: "space-between" }}>
            <Box sx={{ 
              flex: 1, maxWidth: "148px", height: "100%", background: "rgba(30, 41, 59, 0.3)", 
              border: "1px solid rgba(255,255,255,0.1)", borderRadius: 2, display: "flex", 
              alignItems: "center", justifyContent: "center", boxSizing: "border-box" 
            }}>
              <NeonGauge value={getVal(telemetry, "motion.sx")} max={300} label="ANLIK HIZ" color="#00e676" />
            </Box>
            <Box sx={{ 
              flex: 1, maxWidth: "148px", height: "100%", background: "rgba(30, 41, 59, 0.3)", 
              border: "1px solid rgba(255,255,255,0.1)", borderRadius: 2, display: "flex", 
              alignItems: "center", justifyContent: "center", boxSizing: "border-box" 
            }}>
              <NeonGauge value={getVal(telemetry, "motion.avgSpeed")} max={300} label="ORT. HIZ" color="#29b6f6" />
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}