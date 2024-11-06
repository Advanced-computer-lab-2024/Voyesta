// CategoryFilter.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const CategoryFilter = ({ baseUrl, selectedCategory, setSelectedCategory }) => {
  const [categories, setCategories] = useState([]);

  const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${baseUrl}/getCategory`, getAuthHeaders());
        setCategories(response.data);
        console.log(response.data);
        
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    fetchCategories();
  }, [baseUrl]);

  return (
    <div className="mb-4">
      <label className="block mb-2">Category</label>
      <select
        className="w-full p-2 border"
        value={selectedCategory}
        onChange={(e) => setSelectedCategory(e.target.value)}
      >
        <option value="">All Categories</option>
        {categories.map((category) => (
          <option key={category._id} value={category.Name} className="text-black-800 bg-white">
            {category.Name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default CategoryFilter;
