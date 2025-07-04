import React from 'react';
import {
  ResponsiveContainer,
  PieChart as RePieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from 'recharts';

const COLORS = ['#1d3557', '#e63946', '#a8dadc', '#457b9d', '#f1faee'];

const PieChart = ({ pieChartData, month }) => (
  <div className="chart-wrapper">
    <h2>Pie Chart – {month}</h2>
    <ResponsiveContainer width="100%" height="100%">
      <RePieChart>
        <Pie
          data={pieChartData}
          dataKey="count"
          nameKey="category"
          cx="50%"
          cy="50%"
          outerRadius="70%"
          label
        >
          {pieChartData.map((entry, idx) => (
            <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend verticalAlign="bottom" height={36} />
      </RePieChart>
    </ResponsiveContainer>
  </div>
);

export default PieChart;
