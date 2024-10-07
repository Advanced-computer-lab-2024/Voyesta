import React, { useState } from "react";
import { assets } from "../../assets/assets";
import axios from "axios";

function ActivityCard({ activity, getAuthHeaders, fetchActivities}) {
  // State to toggle between view and edit mode
  const [isEditing, setIsEditing] = useState(false);
  
  // State to hold editable activity values
  console.log(activity);
  const [editableActivity, setEditableActivity] = useState(activity);
  // console.log(editableActivity);
  // Handle input changes in edit mode
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditableActivity((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle submission of edited activity
  const handleSubmit = () => {
    // Submit or update the activity (this could involve calling a function or API)
    console.log("Updated activity:", editableActivity);

    // Call the onClick function with the updated activity, or handle save logic here
    // onClick(editableActivity);
    const url = "http://localhost:3000/api/advertiser/updateActivity/"+editableActivity._id;
    axios.patch(url, editableActivity, getAuthHeaders())
    .then(res => {
        console.log(res);
        setIsEditing(false);
        fetchActivities();
    })
    .catch(e => console.log(e))
    // Switch back to view mode
    


  };

  return (
    <div>
      {/* If not in editing mode, show the normal view */}
      {!isEditing ? (
        <>
          <p>
            <strong>Name:</strong> {activity.name}
          </p>
          <p>
            <strong>Description:</strong> {activity.description}
          </p>
          <p>
            <strong>Date:</strong> {new Date(activity.date).toLocaleDateString()}
          </p>
          <p>
            <strong>Time:</strong> {activity.time}
          </p>
          {/* <p>
            <strong>Location:</strong> {activity.location}
          </p> */}
          <p>
            <strong>Price:</strong> ${activity.price}
          </p>
          {/* <p>
            <strong>Category:</strong> {activity.category"unknown category"}
          </p> */}
          <p>
            <strong>Tags:</strong> {activity.tags.join(", ")}
          </p>
          <p>
            <strong>Special Discounts:</strong> {activity.specialDiscounts}
          </p>
          <p>
            <strong>Booking Open:</strong> {activity.bookingOpen ? "Yes" : "No"}
          </p>
          <img
            src={assets.editIcon}
            className="w-6 h-6 cursor-pointer"
            onClick={() => setIsEditing(true)} // Switch to edit mode on click
          />
        </>
      ) : (
        // Show editable form when in edit mode
        <div>
          <input
            type="text"
            name="name"
            value={editableActivity.name}
            onChange={handleInputChange}
            placeholder="Activity Name"
          />
          <input
            type="text"
            name="description"
            value={editableActivity.description}
            onChange={handleInputChange}
            placeholder="Description"
          />
          <input
            type="date"
            name="date"
            value={new Date(editableActivity.date).toISOString().substr(0, 10)}
            onChange={handleInputChange}
          />
          <input
            type="text"
            name="time"
            value={editableActivity.time}
            onChange={handleInputChange}
            placeholder="Time"
          />
          {/* <input
            type="text"
            name="location"
            value={editableActivity.location}
            onChange={handleInputChange}
            placeholder="Location"
          /> */}
          <input
            type="number"
            name="price"
            value={editableActivity.price}
            onChange={handleInputChange}
            placeholder="Price"
          />
          <input
            type="text"
            name="category"
            value={editableActivity.category}
            onChange={handleInputChange}
            placeholder="Category"
          />
          <input
            type="text"
            name="tags"
            value={editableActivity.tags.join(", ")}
            onChange={(e) => setEditableActivity({...editableActivity, tags: e.target.value.split(", ")})}
            placeholder="Tags (comma separated)"
          />
          <input
            type="text"
            name="specialDiscounts"
            value={editableActivity.specialDiscount}
            onChange={handleInputChange}
            placeholder="Special Discounts"
          />
          <br />
          <label>
            <strong>Booking Open:</strong>
            <input
              type="checkbox"
              name="bookingOpen"
              checked={editableActivity.bookingOpen}
              onChange={() =>
                setEditableActivity((prev) => ({
                  ...prev,
                  bookingOpen: !prev.bookingOpen,
                }))
              }
            />
          </label>
          <br />
          {/* Button to submit the changes */}
          <button onClick={handleSubmit}>Save</button>
          <button onClick={() => setIsEditing(false)}>Cancel</button>
        </div>
      )}
    </div>
  );
}

export default ActivityCard;
