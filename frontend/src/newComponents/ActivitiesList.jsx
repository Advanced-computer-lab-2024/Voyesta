import React from 'react';
import ActivityItem from './ActivityItem';
import '../css/activities.css'; // Import the CSS file for styling
// Import the CSS file for styling

const ActivitiesList = ({ activities, convertedPrices = [], targetCurrency, role, baseUrl, setSuccessMessage }) => {

  console.log(setSuccessMessage);

  return (
    <div className="activities-grid">
      {activities.map((activity, index) => (
        <ActivityItem
          key={activity._id}
          activity={activity}
          convertedPrice={convertedPrices[index] || activity.price} // Use activity.price as fallback
          targetCurrency={targetCurrency}
          role={role}
          baseUrl={baseUrl}
          setSuccessMessage = {setSuccessMessage}
        />
      ))}
    </div>
  );
};

export default ActivitiesList;