import React from 'react';

const ComplaintFilter = ({ statusFilter, setStatusFilter }) => {
  return (
    <div className="flex justify-center w-full bg-red-300 p-4">
      <div className="w-full max-w-xs">
        <h2 className="text-lg font-bold mb-4 bg-green-200 p-2 text-center">Filter by Status</h2>
        <div className="mb-4 text-center">
          <label>Status:</label>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="w-full p-2 border border-gray-400 rounded">
            <option value="">All</option>
            <option value="pending">Pending</option>
            <option value="resolved">Resolved</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default ComplaintFilter;