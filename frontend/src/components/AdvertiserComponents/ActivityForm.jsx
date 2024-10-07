// components/ActivityForm.js
import React, { useState } from 'react';
import axios from 'axios';

const ActivityForm = ({ setActivities }) => {
  const [activity, setActivity] = useState({
    date: '',
    time: '',
    location: '',
    price: '',
    category: '',
    tags: '',
    specialDiscounts: '',
    bookingOpen: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setActivity({
      ...activity,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:000/advertiser/addActivity', activity);
      setActivities(prev => [...prev, response.data]);
      alert('Activity created successfully!');
      setActivity({
        date: '',
        time: '',
        location: '',
        price: '',
        category: '',
        tags: '',
        specialDiscounts: '',
        bookingOpen: false,
      });
    } catch (error) {
      console.error('Error creating activity:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Date:
        <input
          type="date"
          name="date"
          value={activity.date}
          onChange={handleChange}
        />
      </label>
      <br />
      <label>
        Time:
        <input
          type="time"
          name="time"
          value={activity.time}
          onChange={handleChange}
        />
      </label>
      <br />
      <label>
        Location:
        <input
          type="text"
          name="location"
          value={activity.location}
          onChange={handleChange}
        />
      </label>
      <br />
      <label>
        Price:
        <input
          type="number"
          name="price"
          value={activity.price}
          onChange={handleChange}
        />
      </label>
      <br />
      <label>
        Category:
        <input
          type="text"
          name="category"
          value={activity.category}
          onChange={handleChange}
        />
      </label>
      <br />
      <label>
        Tags:
        <input
          type="text"
          name="tags"
          value={activity.tags}
          onChange={handleChange}
        />
      </label>
      <br />
      <label>
        Special Discounts:
        <input
          type="text"
          name="specialDiscounts"
          value={activity.specialDiscounts}
          onChange={handleChange}
        />
      </label>
      <br />
      <label>
        Booking Open:
        <input
          type="checkbox"
          name="bookingOpen"
          checked={activity.bookingOpen}
          onChange={handleChange}
        />
      </label>
      <br />
      <button type="submit">Add Activity</button>
    </form>
  );
};

export default ActivityForm;
