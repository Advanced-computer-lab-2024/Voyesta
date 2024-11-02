// DateRangeFilter.jsx
import React from 'react';

const DateRangeFilter = ({ setStartDate, setEndDate }) => {
  return (
    <div className="mb-4">
      <label className="block mb-2">Start Date</label>
      <input
        type="date"
        onChange={(e) => setStartDate(e.target.value)}
        className="w-full p-2 border"
      />
      <label className="block mb-2">End Date</label>
      <input
        type="date"
        onChange={(e) => setEndDate(e.target.value)}
        className="w-full p-2 border"
      />
    </div>
  );
};

export default DateRangeFilter;
