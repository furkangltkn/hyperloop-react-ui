import React, { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";

export default function LiveChart({ value, dataKey, color, title }) {
  const [data, setData] = useState([]);

  useEffect(() => {
    // Değer null veya undefined değilse grafiğe ekle
    if (value !== undefined && value !== null) {
      setData((prevData) => {
        const newData = [...prevData, { time: new Date().toLocaleTimeString(), [dataKey]: value }];
        // Sadece son 20 veriyi ekranda tut (akıcılık için)
        if (newData.length > 20) newData.shift();
        return newData;
      });
    }
  }, [value, dataKey]);

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        background: "linear-gradient(145deg,#0b1324,#05070d)",
        borderRadius: 2,
        border: `1px solid ${color}55`,
        boxShadow: `0 0 15px ${color}33`,
        p: 2,
        display: "flex",
        flexDirection: "column"
      }}
    >
      <Typography sx={{ color: "#94a3b8", fontSize: 14, mb: 2, letterSpacing: 1, fontWeight: "bold" }}>
        {title.toUpperCase()}
      </Typography>
      
      <Box sx={{ flexGrow: 1, width: "100%" }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis dataKey="time" hide /> {/* Ekseni gizliyoruz, sadece akış hissi verecek */}
            <YAxis stroke="#94a3b8" fontSize={12} domain={['auto', 'auto']} />
            <Tooltip 
              contentStyle={{ backgroundColor: "#0f172a", border: "none", borderRadius: "8px", color: "#fff" }}
              itemStyle={{ color: color, fontWeight: "bold" }}
            />
            <Line 
              type="monotone" 
              dataKey={dataKey} 
              stroke={color} 
              strokeWidth={3} 
              dot={false} // Çizgiyi kesintisiz yapmak için noktaları kaldırıyoruz
              isAnimationActive={false} // Kendi akışımızı yaptığımız için default animasyonu kapattık
            />
          </LineChart>
        </ResponsiveContainer>
      </Box>
    </Box>
  );
}