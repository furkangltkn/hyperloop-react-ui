import React, { useState, useEffect } from "react";
import { LineChart, Line, ResponsiveContainer } from "recharts";
import { Box } from "@mui/material";

export default function Sparkline({ value, color }) {
  const [data, setData] = useState([]);

  useEffect(() => {
    if (value !== undefined && value !== null) {
      setData((prev) => {
        const newData = [...prev, { val: value }];
        if (newData.length > 15) newData.shift(); // Son 15 veriyi tut
        return newData;
      });
    }
  }, [value]);

  return (
    <Box sx={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "40%", opacity: 0.3, zIndex: 0 }}>
      <ResponsiveContainer width="100%" height="100%">S
        <LineChart data={data}>
          <Line type="monotone" dataKey="val" stroke={color} strokeWidth={2} dot={false} isAnimationActive={false} />
        </LineChart>
      </ResponsiveContainer>
    </Box>
  );
}