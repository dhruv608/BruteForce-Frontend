"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

export default function PlatformChart({ data }: any) {
  const total =
    data?.leetcode +
    data?.gfg +
    data?.interviewbit +
    data?.other;

  const items = [
    { name: "LeetCode", value: data?.leetcode, color: "#CCFF00" },
    { name: "GFG", value: data?.gfg, color: "#00F0FF" },
    { name: "Interview", value: data?.interviewbit, color: "#4999e9" },
    { name: "Other", value: data?.other, color: "#EF4444" },
  ];

  return (
    <div className="space-y-5">
      {items.map((item, i) => {
        const percent = total ? (item.value / total) * 100 : 0;

        return (
          <div key={i}>
            <div className="flex justify-between text-sm mb-2">
              <span>{item.name}</span>
              <span className="text-muted-foreground">
                {item.value} • {Math.round(percent)}%
              </span>
            </div>

            <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
              <div
                className="h-2 rounded-full"
                style={{
                  width: `${percent}%`,
                  background: item.color,
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}