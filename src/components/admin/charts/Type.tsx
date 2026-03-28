"use client";

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

export default function TypeChart({ data }: any) {
  const chartData = [
    {
      name: "Classwork",
      value: data?.classwork || 0,
      color: "#CCFF00",
    },
    {
      name: "Homework",
      value: data?.homework || 0,
      color: "#00F0FF",
    },
  ];

  return (
    <div className="space-y-4">

      {/* CHART */}
      <div className="h-56 w-full flex justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              innerRadius={60}
              outerRadius={85}
              paddingAngle={5}
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={index} fill={entry.color} />
              ))}
            </Pie>

            <Tooltip
              contentStyle={{
                background: "#161821",
                border: "1px solid #1E2230",
                borderRadius: "12px",
                color: "#fff",
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* LEGEND */}
      <div className="flex justify-center gap-4">
        {chartData.map((item, i) => (
          <div
            key={i}
            className="flex items-center gap-2 glass rounded-lg px-3 py-2"
          >
            <div
              className="w-3 h-3 rounded-full"
              style={{ background: item.color }}
            />
            <span className="text-xs text-muted-foreground">
              {item.name}
            </span>
          </div>
        ))}
      </div>

    </div>
  );
}