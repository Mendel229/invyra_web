"use client";

import { Bar, BarChart, Cell, ResponsiveContainer, Tooltip, XAxis } from "recharts";
import type { MonthlyCount } from "@/lib/admin-queries";

export default function EventsChart({ data }: { data: MonthlyCount[] }) {
  const lastIndex = data.length - 1;

  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data} margin={{ top: 16, right: 8, left: 8, bottom: 0 }}>
        <XAxis
          dataKey="month"
          axisLine={false}
          tickLine={false}
          tick={{ fill: "#1f1f1f99", fontSize: 12 }}
        />
        <Tooltip
          cursor={{ fill: "#420f7510" }}
          contentStyle={{
            borderRadius: 12,
            border: "1px solid rgba(0,0,0,0.06)",
            boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
          }}
          labelStyle={{ color: "#1f1f1f", fontWeight: 600 }}
          formatter={(value) => [`${value} événement(s)`, ""]}
        />
        <Bar dataKey="count" radius={[10, 10, 10, 10]} maxBarSize={44}>
          {data.map((_, index) => (
            <Cell key={index} fill={index === lastIndex ? "#420f75" : "#420f7533"} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
