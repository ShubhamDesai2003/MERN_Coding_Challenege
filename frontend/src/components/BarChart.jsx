import React from 'react';

const BarChart = ({ barChartData, month }) => {
  return (
    <div>
      <h2>Bar Chart - {month}</h2>
      <ul className="chart-data">
        {barChartData.map((data) => (
          <li key={data.range}>{data.range}: {data.count} items</li>
        ))}
      </ul>
    </div>
  );
};

export default BarChart;