// RatingFilter.jsx
import React from 'react';

const RatingFilter = ({ setSelectedRating }) => {
  return (
    <div className="mb-4">
      <label className="block mb-2">Rating</label>
      <select onChange={(e) => setSelectedRating(e.target.value)} className="w-full p-2 border">
        <option value="">All</option>
        <option value="0.0">0 Stars</option>
        <option value="1.0">1 Star</option>
        <option value="2.0">2 Stars</option>
        <option value="3.0">3 Stars</option>
        <option value="4.0">4 Stars</option>
        <option value="5.0">5 Stars</option>
      </select>
    </div>
  );
};

export default RatingFilter;
