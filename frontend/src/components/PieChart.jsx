import React from 'react';
import {
  PieChart as RePieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const COLORS = [
  '#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A28CF7',
  '#F35F5F', '#8DD1E1', '#FF6666', '#A1E8AF', '#FFD3B6'
];

const PieChart = ({ pieChartData, month }) => {
  return (
    <div>
      <h2>Pie Chart - {month}</h2>
      <ResponsiveContainer width="100%" height={300}>
        <RePieChart>
          <Pie
            data={pieChartData}
            dataKey="count"
            nameKey="category"
            cx="50%"
            cy="50%"
            outerRadius={100}
            label
          >
            {pieChartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </RePieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PieChart;
