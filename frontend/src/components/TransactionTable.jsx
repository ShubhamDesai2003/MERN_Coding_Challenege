import React from 'react';

const TransactionTable = ({ transactions, page, perPage, totalTransactions, setPage, setPerPage }) => {
  return (
    <div>
      <h2>Transactions</h2>
      <table className="transactions-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Description</th>
            <th>Price</th>
            <th>Category</th>
            <th>Sold</th>
            <th>Image</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((t) => (
            <tr key={t.id}>
              <td>{t.id}</td>
              <td>{t.title}</td>
              <td>{t.description}</td>
              <td>${t.price.toFixed(2)}</td>
              <td>{t.category}</td>
              <td>{t.sold ? 'Yes' : 'No'}</td>
              <td><img src={t.image} alt={t.title} className="transaction-image" /></td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="pagination">
        <button
          onClick={() => setPage((p) => Math.max(p - 1, 1))}
          disabled={page === 1}
        >
          Previous
        </button>
        <span>Page {page}</span>
        <button
          onClick={() => setPage((p) => p + 1)}
          disabled={page * perPage >= totalTransactions}
        >
          Next
        </button>
        <select
          value={perPage}
          onChange={(e) => setPerPage(e.target.value)}
        >
          <option value={10}>10</option>
          <option value={20}>20</option>
          <option value={50}>50</option>
        </select>
      </div>
    </div>
  );
};

export default TransactionTable;