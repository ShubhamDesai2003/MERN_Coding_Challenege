import React from 'react';
import {
  ResponsiveContainer,
  BarChart as ReBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';

const BarChart = ({ barChartData, month }) => {
  const allRanges = [
    "0-100", "101-200", "201-300", "301-400", "401-500",
    "501-600", "601-700", "701-800", "801-900", "901-above"
  ];

  // Ensure all range labels are present even with 0 count
  const filledData = allRanges.map(range => {
    const item = barChartData.find(entry => entry.range === range);
    return item || { range, count: 0 };
  });

  return (
    <div className="chart-wrapper" >
      <h2>Bar Chart – {month}</h2>
      <ResponsiveContainer width="100%" height="100%">
        <ReBarChart
          data={filledData}
          margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="range"
            label={{ value: 'Price Range', position: 'insideBottom', offset: -5 }}
          />
          <YAxis
            allowDecimals={false}
            label={{ value: 'No. of Items', angle: -90, position: 'insideLeft' }}
          />
          <Tooltip />
          <Legend verticalAlign="top" height={36} payload={[
            { value: 'Range → Number of No. of Items', type: 'square', color: '#1d3557' }
          ]} />
          <Bar dataKey="count" fill="#1d3557" radius={[4, 4, 0, 0]} name="No. of Items"/>
        </ReBarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BarChart;
