import React from 'react';

const Statistics = ({ statistics, month }) => {
  return (
    <div>
      <h2>Statistics - {month}</h2>
      <div className="statistics">
        <p>Total Sale Amount: ${statistics.totalSaleAmount?.toFixed(2) || 0}</p>
        <p>Total Sold Items: {statistics.totalSoldItems || 0}</p>
        <p>Total Not Sold Items: {statistics.totalNotSoldItems || 0}</p>
      </div>
    </div>
  );
};

export default Statistics;