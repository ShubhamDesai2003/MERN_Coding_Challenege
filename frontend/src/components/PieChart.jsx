import React from 'react';

const PieChart = ({ pieChartData, month }) => {
  return (
    <div>
      <h2>Pie Chart - {month}</h2>
      <ul className="chart-data">
        {pieChartData.map((data) => (
          <li key={data.category}>{data.category}: {data.count} items</li>
        ))}
      </ul>
    </div>
  );
};

export default PieChart;