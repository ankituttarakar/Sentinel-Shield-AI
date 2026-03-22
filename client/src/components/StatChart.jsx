import React from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

const COLORS = {
  CRITICAL: "#ef4444",
  HIGH: "#f97316",
  MEDIUM: "#eab308",
  LOW: "#22c55e",
};

const StatChart = ({ vulnerabilities = [] }) => {
  const dataMap = (vulnerabilities || []).reduce((acc, curr) => {
    const sev = (curr.severity || "LOW").toUpperCase();
    acc[sev] = (acc[sev] || 0) + 1;
    return acc;
  }, {});

  const chartData = Object.keys(dataMap).map((key) => ({
    name: key,
    value: dataMap[key],
    fill: COLORS[key] || "#64748b",
  }));

  if (chartData.length === 0) return <div className="text-center text-slate-500 text-xs">No Data</div>;

  return (
    /* FIX: The container MUST have a height for ResponsiveContainer to work.
       We use h-full and a min-height.
    */
    <div className="w-full h-full min-h-[200px] flex items-center justify-center">
      <ResponsiveContainer width="99%" height={250}> 
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={5}
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fill} />
            ))}
          </Pie>
          <Tooltip 
            contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px' }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default StatChart;