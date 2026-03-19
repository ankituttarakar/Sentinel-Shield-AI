import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer
} from "recharts";

const COLORS = ["#ef4444", "#f59e0b"];

const StatChart = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-slate-500 text-sm">
        No data available
      </div>
    );
  }

  return (
    // Fixed: Ensure the outer div has a clear height for the container to inherit
    <div className="w-full h-full min-h-[200px]">
      <ResponsiveContainer width="100%" height="100%" debounce={1}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={70}
            innerRadius={40}
            paddingAngle={5}
            stroke="none"
          >
            {data.map((entry, index) => (
              <Cell key={index} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip 
            contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px' }}
            itemStyle={{ color: '#f8fafc' }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default StatChart;