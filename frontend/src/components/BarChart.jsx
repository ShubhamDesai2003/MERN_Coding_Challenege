import React from 'react';
import {
  BarChart as ReBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const BarChart = ({ barChartData, month }) => {
  return (
    <div>
      <h2>Bar Chart - {month}</h2>
      <ResponsiveContainer width="100%" height={300}>
        <ReBarChart data={barChartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="range" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Bar dataKey="count" fill="#8884d8" />
        </ReBarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BarChart;
